import type { Address, Hex } from 'viem'
import type { Http } from '../http.js'
import { OrbioError } from '../errors.js'
import { requireSigner, type Signer } from './signer.js'

/**
 * Buying CREDIT, through Uniswap.
 *
 * Orbio deploys nothing for this. The gateway quotes the best route across v2,
 * v3 and v4 pools and builds a Universal Router transaction; this signs and
 * sends it. Any token the route supports can be spent, which is why the SDK
 * buys here rather than on Orbio's own order book: an agent topping itself up
 * should not have to reason about asks, fills and a venue.
 *
 * Three steps, in this order, because each depends on the last:
 *
 *   1. **quote** the swap, which also says whether an approval or a Permit2
 *      signature is needed;
 *   2. **approve** the token to Permit2, once ever, if the allowance is short;
 *   3. **build** the router transaction and send it.
 *
 * `buy()` does all three. The gateway refuses to hand back an approval to
 * anything but Permit2, a permit for any spender but the router, or a
 * transaction to any address but the router, so a compromised quote cannot
 * become an approval of your tokens to a stranger.
 */

export type SwapToken = 'ORBIO' | 'ETH' | 'USDG'

export type SwapTx = { to: Address; data: Hex; value: string; gasLimit: string | null }

export type PermitData = {
  domain: { name: string; chainId: number; verifyingContract: string; version?: string }
  types: Record<string, { name: string; type: string }[]>
  values: Record<string, unknown>
}

export type SwapQuote = {
  token: SwapToken
  wallet: Address
  amountIn: string
  amountOut: string
  minimumOut: string
  priceImpact: number | null
  route: string
  gasFeeUsd: string | null
  approval: SwapTx | null
  permit: PermitData | null
  quote: Record<string, unknown>
}

export type BuyResult = {
  /** The swap itself. An approval, when one was needed, is listed separately. */
  hash: Hex
  approvalHash: Hex | null
  /** CREDIT expected out, in base units, from the quote that was signed. */
  amountOut: string
  minimumOut: string
  route: string
}

export class Swap {
  constructor(
    private readonly http: Http,
    private readonly signer: Signer | null,
  ) {}

  /** What this swap would give, and what it needs first. Costs nothing and sends nothing. */
  async quote(opts: {
    token: SwapToken
    amount: string
    wallet?: Address
    /** Basis points. Clamped by the gateway to something sane. */
    slippageBps?: number
  }): Promise<SwapQuote> {
    const wallet = opts.wallet ?? this.signer?.address
    if (!wallet) {
      throw new OrbioError('a quote needs the wallet that will sign it', { code: 'invalid_request' })
    }
    return await this.http.post<SwapQuote>('/api/v1/swap', {
      step: 'quote',
      token: opts.token,
      amount: opts.amount,
      wallet,
      ...(opts.slippageBps === undefined ? {} : { slippage: opts.slippageBps }),
    })
  }

  /**
   * Quote, approve if needed, sign and send.
   *
   * Returns once the swap is mined, because the caller almost always wants to
   * do something with the CREDIT next and a hash alone would mean every caller
   * writing the same wait.
   */
  async buy(opts: { token: SwapToken; amount: string; slippageBps?: number }): Promise<BuyResult> {
    const signer = requireSigner(this.signer, 'buying CREDIT')
    const quote = await this.quote({ ...opts, wallet: signer.address })

    // One approval, ever, of this token to Permit2. The gateway has already
    // refused anything that is not exactly that.
    let approvalHash: Hex | null = null
    if (quote.approval) {
      approvalHash = await signer.wallet.sendTransaction({
        account: signer.account,
        chain: signer.chain,
        to: quote.approval.to,
        data: quote.approval.data,
        value: BigInt(quote.approval.value || '0'),
      })
      await signer.public.waitForTransactionReceipt({ hash: approvalHash })
    }

    // Permit2 is a signature, not a transaction: it authorises the router to
    // move the token for this swap only, and costs no gas.
    let signature: Hex | null = null
    if (quote.permit) {
      // The permit's shape comes from Uniswap at runtime, so viem cannot infer
      // `primaryType` from the types map the way it does for a literal. Widened
      // once, here, rather than casting each field at the call site.
      const signTypedData = signer.wallet.signTypedData as unknown as (
        args: Record<string, unknown>,
      ) => Promise<Hex>
      signature = await signTypedData({
        account: signer.account,
        domain: quote.permit.domain,
        types: quote.permit.types,
        primaryType: 'PermitSingle',
        message: quote.permit.values,
      })
    }

    const tx = await this.http.post<SwapTx>('/api/v1/swap', {
      step: 'build',
      wallet: signer.address,
      quote: quote.quote,
      ...(signature ? { signature } : {}),
      ...(quote.permit ? { permit: quote.permit } : {}),
    })

    const hash = await signer.wallet.sendTransaction({
      account: signer.account,
      chain: signer.chain,
      to: tx.to,
      data: tx.data,
      value: BigInt(tx.value || '0'),
      ...(tx.gasLimit ? { gas: BigInt(tx.gasLimit) } : {}),
    })
    const receipt = await signer.public.waitForTransactionReceipt({ hash })
    if (receipt.status !== 'success') {
      throw new OrbioError('the swap reverted', { code: 'swap_failed', status: 502 })
    }

    return {
      hash,
      approvalHash,
      amountOut: quote.amountOut,
      minimumOut: quote.minimumOut,
      route: quote.route,
    }
  }
}
