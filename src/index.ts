/**
 * `@orbio/sdk`
 *
 * One key for AI inference, agent tools and the CREDIT protocol.
 *
 * Reads work with an API key alone. Anything that needs a signature needs a
 * wallet, which stays in your process: nothing here sends a key anywhere, and
 * there is no code path that could.
 *
 * Nothing about a deployment is compiled in. Addresses and tool prices are
 * fetched when a client is created, so this package cannot disagree with the
 * chain about where the protocol is or what a call costs.
 */

export { createOrbio, Orbio, type OrbioOptions } from './client.js'

export {
  OrbioError,
  InsufficientBalanceError,
  NotConnectedError,
  NoSignerError,
  NotLiveError,
  type OrbioErrorCode,
} from './errors.js'

export {
  CREDIT_DECIMALS,
  parseCredit,
  formatCredit,
  formatCreditShort,
  beneficiaryOf,
  parseUnits,
} from './money.js'

export {
  DEFAULT_BASE_URL,
  type Manifest,
  type ProtocolAddresses,
  type ProtocolStatus,
  type ToolDescriptor,
  type ToolPrice,
} from './config.js'

export { type Balance, type KeyStatus } from './gateway/account.js'
export { type ToolResult } from './gateway/tools.js'

export { chainOf, type Signer, type SignerInput } from './chain/signer.js'
export { type ActivateResult } from './chain/credit.js'
export { type StakeResult } from './chain/staking.js'
export { type BuyResult, type SwapQuote, type SwapToken } from './chain/swap.js'
export { type AgentSummary, type LaunchParams, type LaunchResult } from './chain/agents.js'

export { topUp, keepFunded, describeFloor, type TopUpOptions, type TopUpResult } from './topup.js'
