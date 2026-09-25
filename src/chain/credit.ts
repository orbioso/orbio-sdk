import type { Address, Hex } from 'viem'
import { creditAbi } from '../abi.js'
import type { ProtocolAddresses } from '../config.js'
import { OrbioError } from '../errors.js'
import { beneficiaryOf, formatCredit } from '../money.js'
import { requireSigner, type Signer } from './signer.js'

/**
 * CREDIT the token, and turning it into CREDIT the balance.
 *
 * These are two different things and the difference matters. CREDIT is an
 * ERC-20 you can hold, sell or trade. **Activating** burns it and credits an
 * Orbio account with the same face value of inference. Until it is activated
 * it is worth a dollar to somebody; once activated it is a dollar of API
 * balance and cannot come back.
 *
 * Activation names a `beneficiary`, which is where the balance lands. That is
 * the one thing worth getting right: activating to the wrong beneficiary
 * succeeds on chain and puts the balance somewhere you cannot spend it.
 */

export type ActivateResult = {
  hash: Hex
  /** Base units burned. What lands as balance is this less any activation fee. */
  amountMicroUsd: bigint
  beneficiary: Hex
}

export class Credit {
  constructor(
    private readonly addresses: ProtocolAddresses,
    private readonly signer: Signer | null,
  ) {}

  /** CREDIT held as a token by an address, in base units. */
  async balanceOf(address?: Address): Promise<bigint> {
    const signer = requireSigner(this.signer, 'reading a CREDIT balance')
    const target = address ?? signer.address
    return await signer.public.readContract({
      address: this.addresses.credit,
      abi: creditAbi,
      functionName: 'balanceOf',
      args: [target],
    })
  }

  /**
   * Burn CREDIT and credit an Orbio account with the same face value.
   *
   * `beneficiary` defaults to the signing wallet, which is right when that
   * wallet is the Orbio account spending the balance. It is deliberately not
   * inferred from the API key: a key and a wallet can belong to different
   * accounts, and guessing which one you meant with money that cannot come
   * back is not a guess worth making.
   */
  async activate(opts: {
    amountMicroUsd: bigint
    beneficiary?: Address | Hex
  }): Promise<ActivateResult> {
    const signer = requireSigner(this.signer, 'activating CREDIT')
    if (opts.amountMicroUsd <= 0n) {
      throw new OrbioError('activate a positive amount of CREDIT', { code: 'invalid_request' })
    }

    const held = await this.balanceOf(signer.address)
    if (held < opts.amountMicroUsd) {
      throw new OrbioError(
        `this wallet holds ${formatCredit(held)} CREDIT and cannot activate ${formatCredit(opts.amountMicroUsd)}`,
        { code: 'invalid_request' },
      )
    }

    const beneficiary = beneficiaryFrom(opts.beneficiary ?? signer.address)
    const hash = await signer.wallet.writeContract({
      account: signer.account,
      chain: signer.chain,
      address: this.addresses.credit,
      abi: creditAbi,
      functionName: 'activate',
      args: [opts.amountMicroUsd, beneficiary],
    })
    const receipt = await signer.public.waitForTransactionReceipt({ hash })
    if (receipt.status !== 'success') {
      throw new OrbioError('the activation reverted', { code: 'unknown', status: 502 })
    }
    return { hash, amountMicroUsd: opts.amountMicroUsd, beneficiary }
  }

  /** Whether an address pays the activation fee. The agent vault does not. */
  async feeExempt(address: Address): Promise<boolean> {
    const signer = requireSigner(this.signer, 'reading the activation fee exemption')
    return await signer.public.readContract({
      address: this.addresses.credit,
      abi: creditAbi,
      functionName: 'activationFeeExempt',
      args: [address],
    })
  }
}

/** An address or an already-wide beneficiary, as the `bytes32` the contract takes. */
const beneficiaryFrom = (value: Address | Hex): Hex => {
  if (value.length === 66) return value as Hex
  return beneficiaryOf(value as Address)
}
