import type { Address } from 'viem'
import type { Http } from './http.js'
import { NotLiveError } from './errors.js'

/**
 * Everything that changes without an SDK release.
 *
 * No address and no price is compiled into this package. Both are read from
 * Orbio when a client is created, so a redeployed contract, a new tool or a
 * repriced one reaches every installed copy immediately, and a version of this
 * library can never disagree with the chain about where the protocol is.
 *
 * What *is* compiled in is the contract interfaces, in `abi.ts`. Those are the
 * shape of a function rather than a fact about a deployment, and a contract
 * whose interface changed is a contract this version genuinely cannot call.
 *
 * The honest cost: types cannot be generated from data fetched at runtime, so
 * `tools.call()` is structurally typed. `orbio codegen` pins strict types to a
 * moment for anyone who wants them; the runtime is never pinned.
 */

export const DEFAULT_BASE_URL = 'https://api.orbio.so'

export type ProtocolAddresses = {
  credit: Address
  staking: Address
  exchange: Address
  payout: Address
  orbio: Address | null
  usdg: Address | null
  nvda: Address | null
  /** The agent launchpad. Null until it is deployed, and every agent action refuses then. */
  agentVault: Address | null
}

export type ProtocolStatus = {
  live: boolean
  chainId: number
  explorer: string
  addresses: ProtocolAddresses | null
  paused: { staking: boolean | null; exchange: boolean | null }
  indexer: {
    healthy: boolean
    halted: boolean
    haltReason: string | null
    lagBlocks: number | null
  }
}

export type ToolPrice = {
  basis: 'per_result' | 'per_call' | 'per_compute_unit'
  unit: string
  credit_per_unit: string
  bounded_by: string | null
  /** What starting a job costs before any results. Null when nothing does. */
  credit_to_start: string | null
  typical: string
  note: string | null
  margin_bps: number
}

export type ToolDescriptor = {
  name: string
  title: string
  description: string
  provider: string
  input_schema: Record<string, unknown>
  output_schema: Record<string, unknown>
  price: ToolPrice
}

/** What a client knows the moment it is ready, and nothing it had to be told. */
export type Manifest = {
  status: ProtocolStatus
  tools: ToolDescriptor[]
}

/**
 * Both reads are public and need no key, which is deliberate: a client can be
 * created, inspected and priced before anyone has an API key, so a first
 * integration can see what a call would cost before committing to one.
 *
 * They are fetched together because a client that half-knows where it is
 * leads to a later failure that reads as unrelated.
 */
export const loadManifest = async (http: Http): Promise<Manifest> => {
  const [status, catalogue] = await Promise.all([
    http.get<ProtocolStatus>('/api/protocol/status'),
    // A gateway may have no tool catalogue: an older deployment, a preview, a
    // local stack. That is not a broken client, and stopping here would deny
    // somebody the protocol reads over a feature they were not using. The
    // refusal belongs at `tools.call`, which names what is missing.
    http
      .get<{ tools?: ToolDescriptor[] } | ToolDescriptor[]>('/api/v1/tools')
      .catch(() => [] as ToolDescriptor[]),
  ])
  const tools = Array.isArray(catalogue) ? catalogue : (catalogue.tools ?? [])
  return { status, tools }
}

/** The addresses, or a refusal that names what is missing rather than an address of zero. */
export const requireAddresses = (status: ProtocolStatus): ProtocolAddresses => {
  if (!status.addresses) throw new NotLiveError('the CREDIT protocol')
  return status.addresses
}

export const requireAgentVault = (status: ProtocolStatus): Address => {
  const vault = requireAddresses(status).agentVault
  if (!vault) throw new NotLiveError('the agent launchpad')
  return vault
}
