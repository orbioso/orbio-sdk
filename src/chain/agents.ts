import { decodeEventLog, type Address, type Hex } from 'viem'
import { agentLaunchAbi, agentVaultAbi } from '../abi.js'
import type { Http } from '../http.js'
import { OrbioError } from '../errors.js'
import { beneficiaryOf } from '../money.js'
import { requireSigner, type Signer } from './signer.js'

/**
 * The agent launchpad: launching a token, and everything an agent does with
 * what that token earns.
 *
 * An agent launches a token, the launchpad takes 5% of its creator fees and
 * stakes the rest as ORBIO on the agent's behalf, and the staked position
 * earns CREDIT hourly like any other. The agent claims that CREDIT and either
 * takes the tokens or activates them into inference balance.
 *
 * ## One wallet
 *
 * The contract lets an agent's `owner` and `agentWallet` differ, and this SDK
 * does not model that as two clients. Launch with `agentWallet` left unset and
 * it is the wallet that launched, so one key does everything and the agent
 * owns itself. `capabilities()` reports what the connected wallet may actually
 * do, which is more useful than an API split by a role you may not be using.
 *
 * One consequence, said once: that key can also withdraw principal. It should
 * hold what the agent needs rather than everything its author owns.
 */

export type AgentSummary = {
  agentId: string
  token: Address
  owner: Address
  agentWallet: Address
  beneficiary: Hex
  feeBps: number
  stakeWei: string
  creditOwedAtoms: string
}

export type LaunchParams = {
  name: string
  symbol: string
  description?: string
  logo?: string
  socials?: { twitter?: string; telegram?: string; discord?: string; website?: string; farcaster?: string }
  /** Where the agent's CREDIT goes. Defaults to the launching wallet. */
  beneficiary?: Address | Hex
  /** The agent's hot wallet. Defaults to the launching wallet, which is the self-managed shape. */
  agentWallet?: Address
  /** What Pons charges to launch, in wei. Read it from the launch terms. */
  feeWei: bigint
  expectedEconomics: Hex
  salt?: Hex
}

export type LaunchResult = { hash: Hex; agentId: bigint; token: Address }

export class Agents {
  constructor(
    private readonly http: Http,
    private readonly vault: Address | null,
    private readonly signer: Signer | null,
  ) {}

  private address(): Address {
    if (!this.vault) {
      throw new OrbioError('the agent launchpad is not live on this chain yet', { code: 'not_live', status: 503 })
    }
    return this.vault
  }

  // ------------------------------------------------------------ reading
  // Public and free: every field is on chain, so these need no key and no
  // wallet, and they read through the gateway rather than the RPC so a client
  // with no `rpcUrl` can still browse.

  /** Every agent, newest first, priced. */
  async list(): Promise<{ live: boolean; data: AgentSummary[] }> {
    return await this.http.get('/api/protocol/agents')
  }

  /** One agent, by id or by the token it launched. */
  async get(ref: string | bigint): Promise<AgentSummary | null> {
    try {
      return await this.http.get<AgentSummary>(`/api/protocol/agents/${String(ref)}`)
    } catch (error) {
      if (error instanceof OrbioError && error.status === 404) return null
      throw error
    }
  }

  /** The agents a wallet owns. A filter, not an authorisation: anyone may ask. */
  async ownedBy(wallet: Address): Promise<{ data: AgentSummary[] }> {
    return await this.http.get(`/api/protocol/agents?wallet=${wallet}`)
  }

  /** What it costs to launch right now, and the economics pin to quote against. */
  async launchTerms(): Promise<{
    live: boolean
    launchFeeWei: string
    feeBps: number
    paused: boolean
    economics: Hex | null
    nextAgentId: string | null
  }> {
    return await this.http.get('/api/protocol/agents/terms')
  }

  /** What the connected wallet may do with this agent, read from the chain. */
  async capabilities(agentId: bigint): Promise<{ owner: boolean; agentWallet: boolean; canWithdraw: boolean }> {
    const signer = requireSigner(this.signer, 'reading capabilities')
    const agent = await this.get(agentId)
    if (!agent) throw new OrbioError(`no agent ${agentId}`, { code: 'invalid_request', status: 404 })
    const me = signer.address.toLowerCase()
    const owner = agent.owner.toLowerCase() === me
    return { owner, agentWallet: agent.agentWallet.toLowerCase() === me, canWithdraw: owner }
  }

  // ------------------------------------------------------------ writing

  /**
   * Launch a token through the vault.
   *
   * Payable, and therefore the one action no relay can ever sponsor: a
   * sponsored operation spends the sender's own ETH. The launching wallet
   * needs ETH for the fee or the launch does not happen.
   */
  async launch(params: LaunchParams): Promise<LaunchResult> {
    const vault = this.address()
    const signer = requireSigner(this.signer, 'launching an agent')
    const socials = params.socials ?? {}
    const hash = await signer.wallet.writeContract({
      account: signer.account,
      chain: signer.chain,
      address: vault,
      abi: agentLaunchAbi,
      functionName: 'launch',
      args: [
        {
          name: params.name,
          symbol: params.symbol,
          logo: params.logo ?? '',
          description: params.description ?? '',
          socials: {
            twitter: socials.twitter ?? '',
            telegram: socials.telegram ?? '',
            discord: socials.discord ?? '',
            website: socials.website ?? '',
            farcaster: socials.farcaster ?? '',
          },
          // The vault is the creator fee recipient; it is what collects and
          // stakes. Naming anything else here would send the fees past it.
          creatorFeeRecipient: '0x0000000000000000000000000000000000000000',
          creatorTaxBps: 0,
          buybackEnabled: false,
          expectedEconomics: params.expectedEconomics,
          salt: params.salt ?? (`0x${'0'.repeat(64)}` as Hex),
        },
        params.agentWallet ?? signer.address,
        params.beneficiary
          ? (params.beneficiary.length === 66 ? params.beneficiary as Hex : beneficiaryOf(params.beneficiary as Address))
          : beneficiaryOf(signer.address),
      ],
      value: params.feeWei,
    })

    const receipt = await signer.public.waitForTransactionReceipt({ hash })
    if (receipt.status !== 'success') throw new OrbioError('the launch reverted', { code: 'unknown', status: 502 })

    for (const log of receipt.logs) {
      if (log.address.toLowerCase() !== vault.toLowerCase()) continue
      try {
        const decoded = decodeEventLog({ abi: agentLaunchAbi, data: log.data, topics: log.topics, strict: true })
        if (decoded.eventName === 'AgentLaunched') {
          const args = decoded.args as unknown as { agentId: bigint; token: Address }
          return { hash, agentId: args.agentId, token: args.token }
        }
      } catch {
        // Not the event we are after. The vault emits several per launch.
      }
    }
    throw new OrbioError('the launch succeeded but no AgentLaunched event was found', { code: 'unknown' })
  }

  /** CREDIT this agent has earned and not yet claimed, in base units. */
  async creditOwed(agentId: bigint): Promise<bigint> {
    const vault = this.address()
    const signer = requireSigner(this.signer, 'reading what an agent is owed')
    return await signer.public.readContract({
      address: vault,
      abi: agentVaultAbi,
      functionName: 'creditOwed',
      args: [agentId],
    })
  }

  /**
   * Claim what an agent earned.
   *
   * `activate: true` burns the CREDIT straight into inference balance for the
   * agent's beneficiary, which is the self-funding path and skips holding the
   * token at all. `false` transfers the tokens to the beneficiary read as an
   * address.
   */
  async claimCredit(agentId: bigint, options: { activate?: boolean } = {}): Promise<Hex> {
    const vault = this.address()
    const signer = requireSigner(this.signer, 'claiming an agent\'s CREDIT')
    const hash = await signer.wallet.writeContract({
      account: signer.account,
      chain: signer.chain,
      address: vault,
      abi: agentVaultAbi,
      functionName: 'claimCredit',
      args: [agentId, options.activate ?? true],
    })
    await signer.public.waitForTransactionReceipt({ hash })
    return hash
  }

  /** Collect creator fees and stake them. The keeper does this hourly; this is for impatience. */
  async harvest(agentIds: bigint[]): Promise<Hex> {
    const vault = this.address()
    const signer = requireSigner(this.signer, 'harvesting')
    const hash = await signer.wallet.writeContract({
      account: signer.account,
      chain: signer.chain,
      address: vault,
      abi: agentVaultAbi,
      functionName: 'harvest',
      args: [agentIds],
    })
    await signer.public.waitForTransactionReceipt({ hash })
    return hash
  }

  /** Take staked ORBIO back, once the ten day cliff has passed. Owner only. */
  async withdrawPrincipal(agentId: bigint, amountWei: bigint): Promise<Hex> {
    const vault = this.address()
    const signer = requireSigner(this.signer, 'withdrawing principal')
    const unlocksAt = await signer.public.readContract({
      address: vault,
      abi: agentVaultAbi,
      functionName: 'unlocksAt',
      args: [agentId],
    })
    const now = BigInt(Math.floor(Date.now() / 1000))
    if (now < unlocksAt) {
      throw new OrbioError(
        `this agent's principal is locked until ${new Date(Number(unlocksAt) * 1000).toISOString()}`,
        { code: 'invalid_request' },
      )
    }
    const hash = await signer.wallet.writeContract({
      account: signer.account,
      chain: signer.chain,
      address: vault,
      abi: agentVaultAbi,
      functionName: 'withdrawPrincipal',
      args: [agentId, amountWei],
    })
    await signer.public.waitForTransactionReceipt({ hash })
    return hash
  }

  /** Point the agent at a different hot wallet. Owner only. */
  async setAgentWallet(agentId: bigint, wallet: Address): Promise<Hex> {
    const vault = this.address()
    const signer = requireSigner(this.signer, 'changing the agent wallet')
    const hash = await signer.wallet.writeContract({
      account: signer.account,
      chain: signer.chain,
      address: vault,
      abi: agentVaultAbi,
      functionName: 'setAgentWallet',
      args: [agentId, wallet],
    })
    await signer.public.waitForTransactionReceipt({ hash })
    return hash
  }

  /** Send this agent's CREDIT somewhere else. Owner only. */
  async setBeneficiary(agentId: bigint, beneficiary: Address | Hex): Promise<Hex> {
    const vault = this.address()
    const signer = requireSigner(this.signer, 'changing the beneficiary')
    const wide = beneficiary.length === 66 ? beneficiary as Hex : beneficiaryOf(beneficiary as Address)
    const hash = await signer.wallet.writeContract({
      account: signer.account,
      chain: signer.chain,
      address: vault,
      abi: agentVaultAbi,
      functionName: 'setBeneficiary',
      args: [agentId, wide],
    })
    await signer.public.waitForTransactionReceipt({ hash })
    return hash
  }
}
