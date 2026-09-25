import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http as viemHttp,
  type Account,
  type Address,
  type Chain,
  type PublicClient,
  type WalletClient,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { NoSignerError, OrbioError } from '../errors.js'

/**
 * Who signs, and where the transactions go.
 *
 * Three ways to provide a wallet, in the order they should be preferred:
 *
 *   1. a viem `Account` you built yourself, from a keystore, an HSM or a
 *      hardware wallet. Nothing about the key reaches this library;
 *   2. a `WalletClient` you already have, when your process has one;
 *   3. a raw private key, which this supports because people will do it
 *      anyway and a documented path is safer than an undocumented one.
 *
 * **No key ever leaves the process.** Everything is signed locally and only a
 * signed transaction is sent, to an RPC you name. Orbio never sees it, and
 * there is no code path here that could send one.
 *
 * ## You bring the RPC
 *
 * There is no default. Every RPC URL Orbio runs embeds a key, so shipping one
 * in an npm package would publish it, and a public endpoint chosen on your
 * behalf would be a dependency you did not agree to. Pass `rpcUrl`, or set
 * `ORBIO_RPC_URL`.
 */

export type SignerInput = {
  /** A viem Account, or a `0x`-prefixed private key. */
  account?: Account | `0x${string}`
  /** A wallet client you already have. Takes precedence over `account`. */
  walletClient?: WalletClient
  /** Your own RPC endpoint for this chain. Required for anything on chain. */
  rpcUrl?: string
}

export type Signer = {
  account: Account
  address: Address
  wallet: WalletClient
  public: PublicClient
  chain: Chain
}

/** Robinhood Chain, or whatever chain the gateway says it is on. */
export const chainOf = (chainId: number, rpcUrl: string): Chain =>
  defineChain({
    id: chainId,
    name: chainId === 4663 ? 'Robinhood Chain' : `chain ${chainId}`,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: [rpcUrl] } },
  })

const accountFrom = (input: SignerInput): Account | null => {
  if (!input.account) return null
  if (typeof input.account === 'string') {
    if (!/^0x[0-9a-fA-F]{64}$/.test(input.account)) {
      throw new OrbioError('a private key is 0x followed by 64 hex characters', { code: 'invalid_request' })
    }
    return privateKeyToAccount(input.account)
  }
  return input.account
}

/**
 * Build the signer, or explain precisely what is missing.
 *
 * Returns null rather than throwing when there is no wallet at all, because a
 * read-only client is a legitimate thing to have: the error belongs at the
 * moment somebody asks for a signature, naming the action they wanted.
 */
export const makeSigner = (input: SignerInput, chainId: number): Signer | null => {
  const account = accountFrom(input)
  if (!account && !input.walletClient) return null

  const rpcUrl = input.rpcUrl ?? process.env.ORBIO_RPC_URL
  if (!rpcUrl) {
    throw new OrbioError(
      'signing needs an RPC endpoint. Pass `rpcUrl` to createOrbio() or set ORBIO_RPC_URL. '
      + 'There is no default, because a URL shipped in a package is a URL everyone shares.',
      { code: 'invalid_request' },
    )
  }

  const chain = chainOf(chainId, rpcUrl)
  const transport = viemHttp(rpcUrl)
  const publicClient = createPublicClient({ chain, transport })

  if (input.walletClient) {
    const existing = input.walletClient.account
    if (!existing) throw new OrbioError('the wallet client given has no account on it', { code: 'invalid_request' })
    return {
      account: existing,
      address: existing.address,
      wallet: input.walletClient,
      public: publicClient as PublicClient,
      chain,
    }
  }

  const resolved = account as Account
  return {
    account: resolved,
    address: resolved.address,
    // Built with `account` on the client rather than passed per call: viem
    // makes a json-rpc account from a bare address, which sends
    // `eth_sendTransaction` to a node that will not have the key. That bug
    // shipped twice in the protocol before it was understood.
    wallet: createWalletClient({ account: resolved, chain, transport }),
    public: publicClient as PublicClient,
    chain,
  }
}

/** The signer, or a refusal naming the action that wanted one. */
export const requireSigner = (signer: Signer | null, action: string): Signer => {
  if (!signer) throw new NoSignerError(action)
  return signer
}
