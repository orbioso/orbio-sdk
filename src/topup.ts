import type { Address, Hex } from 'viem'
import type { Account } from './gateway/account.js'
import type { Credit } from './chain/credit.js'
import type { Swap, SwapToken } from './chain/swap.js'
import { OrbioError } from './errors.js'
import { formatCredit, parseCredit } from './money.js'

/**
 * Paying for itself.
 *
 * This is the point of the SDK. An agent that can call a model but cannot buy
 * more when it runs out is an agent with a deadline; one that can swap a token
 * for CREDIT and activate it has no deadline at all.
 *
 * Two steps, and the second is the one that goes wrong quietly. Buying gets
 * you CREDIT the token. Activating burns it and credits an Orbio account with
 * its face value less any activation fee. The activation receipt identifies
 * that amount. Gateway balance changes can include concurrent usage and other
 * deposits, so they cannot confirm settlement of this particular activation.
 */

export type TopUpResult = {
  /** What the gateway balance was before, and is now. Exact. */
  beforeMicroUsd: bigint
  afterMicroUsd: bigint
  /** Net amount authorized by the activation receipt, not a balance delta. */
  creditedMicroUsd: bigint
  activationId: bigint
  /** Observed account movement, including concurrent usage and deposits. */
  balanceChangeMicroUsd: bigint
  /** Account balance reads cannot identify settlement of a particular receipt. */
  gatewayConfirmed: false
  swapHash: Hex
  activateHash: Hex
  /** An observation warning; null does not confirm gateway settlement. */
  warning: string | null
}

export type TopUpOptions = {
  /** The token to spend, and how much of it, in whole units. */
  token: SwapToken
  amount: string
  /** Where the inference balance lands. Defaults to the signing wallet. */
  beneficiary?: Address | Hex
  slippageBps?: number
  /** How long to observe the gateway balance for an increase. */
  confirmMs?: number
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Swap for CREDIT, read its activation receipt, and observe the gateway balance.
 * Indexing can lag the transaction; these reads do not identify settlement.
 */
export const topUp = async (
  deps: { swap: Swap; credit: Credit; account: Account },
  options: TopUpOptions,
): Promise<TopUpResult> => {
  const before = await deps.account.balance()

  const bought = await deps.swap.buy({
    token: options.token,
    amount: options.amount,
    ...(options.slippageBps === undefined ? {} : { slippageBps: options.slippageBps }),
  })

  // Activate what actually arrived, not what was quoted. A swap can return
  // more than its minimum, and activating the quote would leave the remainder
  // stranded as a token nobody meant to hold.
  const held = await deps.credit.balanceOf()
  if (held <= 0n) {
    throw new OrbioError('the swap finished but no CREDIT arrived in this wallet', { code: 'swap_failed', status: 502 })
  }

  const activated = await deps.credit.activate({
    amountMicroUsd: held,
    ...(options.beneficiary === undefined ? {} : { beneficiary: options.beneficiary }),
  })

  // The gateway sees activations through an indexer, so the balance follows
  // the receipt rather than arriving with it.
  const deadline = Date.now() + (options.confirmMs ?? 30_000)
  let after = before
  while (Date.now() < deadline) {
    await sleep(2_000)
    after = await deps.account.balance()
    if (after.availableMicroUsd > before.availableMicroUsd) break
  }

  const balanceChangeMicroUsd = after.availableMicroUsd - before.availableMicroUsd
  return {
    beforeMicroUsd: before.availableMicroUsd,
    afterMicroUsd: after.availableMicroUsd,
    creditedMicroUsd: activated.creditedMicroUsd,
    activationId: activated.activationId,
    balanceChangeMicroUsd,
    gatewayConfirmed: false,
    swapHash: bought.hash,
    activateHash: activated.hash,
    warning: balanceChangeMicroUsd > 0n ? null
      : 'activation confirmed onchain, but no gateway balance increase was observed. '
        + 'Indexing delay, concurrent spending, or an account mismatch can explain this; '
        + 'reconcile the activation before purchasing again.',
  }
}

/**
 * Keep a balance above a floor, checking on an interval.
 *
 * Deliberately a generator rather than a daemon. It yields every time it does
 * something so the caller can log it, stop it, or decide the warning matters,
 * and it holds no timers of its own that could outlive the process.
 *
 * ```ts
 * for await (const event of keepFunded(orbio, { floor: '5', buy: { token: 'USDG', amount: '20' } })) {
 *   console.log(event)
 * }
 * ```
 */
export async function* keepFunded(
  deps: { swap: Swap; credit: Credit; account: Account },
  options: {
    /** Top up when the balance falls below this, in CREDIT. */
    floor: string | bigint
    buy: TopUpOptions
    /** How often to look. Default five minutes. */
    everyMs?: number
    /** Stop after this many top-ups. Unset, it runs until the caller breaks. */
    limit?: number
  },
): AsyncGenerator<
  | { kind: 'checked'; balanceMicroUsd: bigint }
  | { kind: 'topped-up'; result: TopUpResult }
  | { kind: 'failed'; error: OrbioError },
  void
> {
  const floor = typeof options.floor === 'bigint' ? options.floor : parseCredit(options.floor)
  const every = options.everyMs ?? 300_000
  let done = 0

  for (;;) {
    const balance = await deps.account.balance()
    yield { kind: 'checked', balanceMicroUsd: balance.availableMicroUsd }

    if (balance.availableMicroUsd < floor) {
      try {
        const result = await topUp(deps, options.buy)
        yield { kind: 'topped-up', result }
        done += 1
        if (options.limit !== undefined && done >= options.limit) return
      } catch (error) {
        // A failed top-up is not a reason to stop watching: the next window
        // may succeed, and an agent that gives up on one bad swap is an agent
        // that dies of a transient RPC error.
        yield {
          kind: 'failed',
          error: error instanceof OrbioError
            ? error
            : new OrbioError(error instanceof Error ? error.message : 'the top-up failed', { code: 'unknown' }),
        }
      }
    }
    await sleep(every)
  }
}

/** The floor as a sentence, for a log line. */
export const describeFloor = (floor: bigint): string => `${formatCredit(floor)} CREDIT`
