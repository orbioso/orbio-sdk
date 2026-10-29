import { Http, type Fetcher } from './http.js'
import { DEFAULT_BASE_URL, loadManifest, requireAddresses, type Manifest, type ProtocolStatus } from './config.js'
import { Account } from './gateway/account.js'
import { Tools } from './gateway/tools.js'
import { makeSigner, type Signer, type SignerInput } from './chain/signer.js'
import { Credit } from './chain/credit.js'
import { Staking } from './chain/staking.js'
import { Swap } from './chain/swap.js'
import { Agents } from './chain/agents.js'
import { keepFunded, topUp, type TopUpOptions, type TopUpResult } from './topup.js'
import { walletKeyFromSignature, walletKeyMessage } from './gateway/wallet-key.js'
import { Infrastructure } from './infra/client.js'

/**
 * The client.
 *
 * Created with `await createOrbio(...)`, and the await is the point: a client
 * fetches where the protocol is and what the tools cost before it hands itself
 * back, so nothing downstream has to guess and no address is compiled in.
 * A new tool, a repriced tool or a redeployed contract needs no release of
 * this package.
 *
 * Everything works with just an API key. A wallet is needed only for the
 * things that need a signature, and asking for one of those without a wallet
 * raises an error naming the action rather than failing somewhere deeper.
 *
 * Or with just a wallet. Given one and no API key, the client signs the
 * wallet's own key (`walletKey`) and spends whatever CREDIT is activated to
 * that wallet. No account, no sign-in and no dashboard are involved.
 */

/** Where a local account's key lives when it is in this process, so signing with it asks nobody. */
const HELD_SOURCES: ReadonlySet<string> = new Set(['privateKey', 'mnemonic', 'hd'])

export type OrbioOptions = SignerInput & {
  /** The gateway key. Reads work without one; anything that spends needs it. Unset with a wallet given, the wallet's own key is used. */
  apiKey?: string | undefined
  /**
   * The wallet key the client signs when it holds the wallet's key itself (a
   * private key, or a viem account from one, a mnemonic or an HD path) and has
   * no `apiKey`: the epoch to sign it at (0 unless you have rotated), or `false`
   * to sign none and stay read-only until a key is given. A WalletClient, and an
   * account from `toAccount` (a hardware wallet, an HSM or a KMS), is never asked
   * unprompted: pass `apiKey: await walletKey(it)` instead.
   */
  walletKey?: { epoch?: number } | false | undefined
  /** Optional scoped infrastructure credential. Defaults to the existing Orbio API key. */
  infraKey?: string | undefined
  /** Point somewhere other than production, for a preview or a local stack. */
  baseUrl?: string | undefined
  fetch?: Fetcher | undefined
  timeoutMs?: number | undefined
}

export class Orbio {
  readonly account: Account
  readonly tools: Tools
  readonly infra: Infrastructure
  readonly credit: Credit
  readonly staking: Staking
  readonly swap: Swap
  readonly agents: Agents
  /** What this client learned at startup: where the protocol is, and the catalogue. */
  readonly manifest: Manifest

  private constructor(
    private readonly http: Http,
    manifest: Manifest,
    readonly signer: Signer | null,
    private readonly infraHttp: Http,
  ) {
    this.manifest = manifest
    const addresses = manifest.status.addresses
    this.account = new Account(http)
    this.tools = new Tools(http, manifest.tools)
    this.infra = new Infrastructure(infraHttp)
    // The chain classes are built even without addresses so that reaching for
    // one gives a refusal naming what is not deployed, rather than a property
    // that does not exist.
    const resolved = addresses ?? ({} as never)
    this.credit = new Credit(resolved, signer)
    this.staking = new Staking(resolved, signer)
    this.swap = new Swap(http, signer)
    this.agents = new Agents(http, addresses?.agentVault ?? null, signer)
  }

  static async create(options: OrbioOptions = {}): Promise<Orbio> {
    const given = options.apiKey ?? process.env.ORBIO_API_KEY
    const unkeyed = new Http({
      baseUrl: (options.baseUrl ?? process.env.ORBIO_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, ''),
      apiKey: given,
      fetch: options.fetch,
      timeoutMs: options.timeoutMs,
    })

    const manifest = await loadManifest(unkeyed)
    const key = options.account ?? (process.env.ORBIO_PRIVATE_KEY as `0x${string}` | undefined)
    const signer = makeSigner(
      {
        ...(key ? { account: key } : {}),
        ...(options.walletClient ? { walletClient: options.walletClient } : {}),
        ...(options.rpcUrl ? { rpcUrl: options.rpcUrl } : {}),
      },
      manifest.status.chainId,
    )
    // A wallet and no key: the wallet's own signature is the key, for the chain the gateway is on.
    // Only a key this process holds signs it unasked: a private key, a mnemonic or an HD wallet. A
    // WalletClient may be a browser wallet that asks a person, and an account built with `toAccount`
    // is usually a hardware wallet, an HSM or a KMS; those call `walletKey()` themselves.
    const keying = options.walletKey === false ? null : (options.walletKey ?? {})
    const epoch = keying?.epoch ?? 0
    const held = !options.walletClient && signer?.account.type === 'local' && HELD_SOURCES.has(signer.account.source)
    const apiKey = given ?? (signer && keying && held
      ? walletKeyFromSignature(await signer.wallet.signMessage({ account: signer.account, message: walletKeyMessage(epoch, manifest.status.chainId) }), epoch)
      : undefined)
    const http = apiKey === given ? unkeyed : unkeyed.withKey(apiKey)
    const infraHttp = new Http({
      baseUrl: http.baseUrl, apiKey: options.infraKey ?? process.env.ORBIO_INFRA_KEY ?? apiKey,
      fetch: options.fetch, timeoutMs: options.timeoutMs ?? 30_000,
    })
    return new Orbio(http, manifest, signer, infraHttp)
  }

  /** Where the protocol is and how the indexer is doing, as read at startup. */
  get status(): ProtocolStatus {
    return this.manifest.status
  }

  /** The address that signs, or null for a read-only client. */
  get address(): string | null {
    return this.signer?.address ?? null
  }

  /** Re-read the manifest, for a process that outlives a deployment. */
  async refresh(): Promise<Orbio> {
    // Reuse the original transports and signer; environment changes must not
    // replace a running agent's credentials, custom fetch or signing authority.
    return new Orbio(this.http, await loadManifest(this.http), this.signer, this.infraHttp)
  }

  /** Throws unless the protocol is deployed where this client is pointed. */
  requireLive(): void {
    requireAddresses(this.manifest.status)
  }

  /**
   * Buy CREDIT and turn it into inference balance, in one call.
   *
   * Verifies the balance actually moved and says so when it did not, because
   * activating to the wrong beneficiary succeeds on chain and leaves the
   * balance you are watching untouched.
   */
  async topUp(options: TopUpOptions): Promise<TopUpResult> {
    return await topUp({ swap: this.swap, credit: this.credit, account: this.account }, options)
  }

  /** Watch the balance and top it up when it falls below a floor. */
  keepFunded(options: Parameters<typeof keepFunded>[1]) {
    return keepFunded({ swap: this.swap, credit: this.credit, account: this.account }, options)
  }
}

/**
 * Make a client.
 *
 * ```ts
 * const orbio = await createOrbio({ apiKey: process.env.ORBIO_API_KEY })
 * const posts = await orbio.tools.xPosts({ handle: 'orbiodotso', limit: 20 }, { maxCost: '0.01' })
 * ```
 */
export const createOrbio = (options: OrbioOptions = {}): Promise<Orbio> => Orbio.create(options)
