/**
 * Every way a call can fail, as a type you can branch on.
 *
 * The gateway answers errors as `{ error: { message, code } }` and the codes
 * are stable, so this turns them into classes rather than leaving callers to
 * match on prose. An agent deciding whether to retry, to stop, or to tell its
 * owner something should never have to read a sentence to find out which.
 */

export type OrbioErrorCode =
  | 'missing_api_key'
  | 'invalid_api_key'
  | 'key_rotated'
  | 'invalid_request'
  | 'unknown_tool'
  | 'not_connected'
  | 'connection_revoked'
  | 'unsupported_platform'
  | 'upstream_refused'
  | 'tool_failed'
  | 'rate_limited'
  | 'not_configured'
  | 'not_live'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'human_action_required'
  | 'insufficient_budget'
  | 'insufficient_balance'
  | 'idempotency_conflict'
  | 'resource_busy'
  | 'capacity_exceeded'
  | 'upstream_unavailable'
  | 'outcome_unknown'
  | 'invalid_response'
  | 'aborted'
  | 'wait_timeout'
  | 'swap_refused'
  | 'swap_failed'
  | 'unknown'

export class OrbioError extends Error {
  readonly code: OrbioErrorCode
  readonly status: number
  /** Present when the server asked for a wait, in seconds. */
  readonly retryAfter: number | null
  /** Owner setup URL supplied by the scoped infrastructure API, when needed. */
  readonly setupUrl: string | null

  constructor(message: string, opts: { code?: OrbioErrorCode; status?: number; retryAfter?: number | null; setupUrl?: string | null } = {}) {
    super(message)
    this.name = 'OrbioError'
    this.code = opts.code ?? 'unknown'
    this.status = opts.status ?? 0
    this.retryAfter = opts.retryAfter ?? null
    this.setupUrl = opts.setupUrl ?? null
  }

  /**
   * Whether trying the same call again could plausibly work.
   *
   * Deliberately conservative. A rate limit and a provider failure are worth
   * another go; a bad argument and an empty balance are not, and neither is
   * anything waiting on a person.
   */
  get retryable(): boolean {
    if (this.code === 'outcome_unknown' || this.code === 'human_action_required' || this.code === 'not_configured') return false
    return this.code === 'rate_limited' || this.code === 'tool_failed' || this.status >= 500
  }
}

/** The balance is too low to do this. Nothing was charged. */
export class InsufficientBalanceError extends OrbioError {
  constructor(message = 'not enough CREDIT for this call') {
    super(message, { code: 'invalid_request', status: 402 })
    this.name = 'InsufficientBalanceError'
  }
}

/**
 * Nothing is wrong with the call: somebody has to do something first, and no
 * amount of retrying will change that.
 *
 * Raised when a tool needs a connected social account. `action` is a sentence
 * written to be shown to a person, and `url` is where they go.
 */
export class NotConnectedError extends OrbioError {
  readonly url: string

  constructor(message: string, code: OrbioErrorCode, url = 'https://orbio.so/agents') {
    super(message, { code, status: 409 })
    this.name = 'NotConnectedError'
    this.url = url
  }

  override get retryable(): boolean {
    return false
  }
}

/** A signing action was asked for without a wallet to sign it. */
export class NoSignerError extends OrbioError {
  constructor(action: string) {
    super(
      `${action} has to be signed, and this client has no wallet. `
      + 'Pass `account` to createOrbio(), from a viem Account or a private key.',
      { code: 'invalid_request' },
    )
    this.name = 'NoSignerError'
  }
}

/** The protocol is not deployed on the chain this client is pointed at. */
export class NotLiveError extends OrbioError {
  constructor(what: string) {
    super(`${what} is not live on this chain yet`, { code: 'not_live', status: 503 })
    this.name = 'NotLiveError'
  }
}
