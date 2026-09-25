import type { Http } from '../http.js'
import { formatCredit } from '../money.js'

/**
 * The balance, and what the key is allowed to do.
 *
 * Every figure is carried twice: as a decimal string for a sentence, and as an
 * exact integer of micro-dollars for arithmetic. Neither is derived from the
 * other on the way out, and anything deciding whether to top up should use the
 * integer.
 */

export type KeyBody = {
  object: 'key'
  key: { kind: string; prefix: string; label: string | null; created_at: string }
  balance: {
    currency: string
    available: string
    used: string
    available_micro_usd: string
    used_micro_usd: string
  }
  rate_limit: { requests_per_minute: number; concurrent: number }
}

export type Balance = {
  /** Micro-dollars. Exact. Use this to decide anything. */
  availableMicroUsd: bigint
  usedMicroUsd: bigint
  /** The same figures for display, truncated and never rounded up. */
  available: string
  used: string
}

export type KeyStatus = Balance & {
  kind: string
  prefix: string
  label: string | null
  createdAt: string
  rateLimit: { requestsPerMinute: number; concurrent: number }
}

export class Account {
  constructor(private readonly http: Http) {}

  /** Everything about the key behind this client. Needs the key. */
  async key(): Promise<KeyStatus> {
    const body = await this.http.get<KeyBody>('/api/v1/key')
    const available = BigInt(body.balance.available_micro_usd)
    const used = BigInt(body.balance.used_micro_usd)
    return {
      kind: body.key.kind,
      prefix: body.key.prefix,
      label: body.key.label,
      createdAt: body.key.created_at,
      availableMicroUsd: available,
      usedMicroUsd: used,
      available: formatCredit(available),
      used: formatCredit(used),
      rateLimit: {
        requestsPerMinute: body.rate_limit.requests_per_minute,
        concurrent: body.rate_limit.concurrent,
      },
    }
  }

  /** Just the balance, for a loop that checks it often. */
  async balance(): Promise<Balance> {
    const { availableMicroUsd, usedMicroUsd, available, used } = await this.key()
    return { availableMicroUsd, usedMicroUsd, available, used }
  }

  /** The models the gateway will route to, in OpenAI's shape. */
  async models(): Promise<{ id: string; name?: string }[]> {
    const body = await this.http.get<{ data?: { id: string; name?: string }[] }>('/api/v1/models')
    return body.data ?? []
  }
}
