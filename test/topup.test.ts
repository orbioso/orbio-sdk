import { describe, expect, it } from 'vitest'
import { OrbioError, topUp } from '../src/index.js'

/**
 * `topUp` is plain orchestration over three collaborators, so it is tested
 * with stand-ins for them rather than a chain: a wallet that holds some CREDIT,
 * a swap that delivers some more, and a record of what was activated.
 */

const wallet = (heldBefore: bigint, delivered: bigint) => {
  let held = heldBefore
  const activated: bigint[] = []
  const deps = {
    swap: {
      buy: async () => {
        held += delivered
        return { hash: '0x01', approvalHash: null, amountOut: String(delivered), minimumOut: '0', route: 'test' }
      },
    },
    credit: {
      balanceOf: async () => held,
      activate: async ({ amountMicroUsd }: { amountMicroUsd: bigint }) => {
        activated.push(amountMicroUsd)
        held -= amountMicroUsd
        return { hash: '0x02', amountMicroUsd, beneficiary: `0x${'0'.repeat(64)}` }
      },
    },
    account: { balance: async () => ({ availableMicroUsd: 0n }) },
  } as unknown as Parameters<typeof topUp>[0]
  return { deps, activated, held: () => held }
}

describe('topUp activates only the CREDIT it bought', () => {
  it('leaves CREDIT the wallet already held alone', async () => {
    const w = wallet(7_000_000n, 20_000_000n)
    await topUp(w.deps, { token: 'USDG', amount: '20', confirmMs: 0 })
    expect(w.activated).toEqual([20_000_000n])
    expect(w.held()).toBe(7_000_000n)
  })

  it('fails, and burns nothing, when the swap delivered nothing', async () => {
    const w = wallet(7_000_000n, 0n)
    const error = await topUp(w.deps, { token: 'USDG', amount: '20', confirmMs: 0 }).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(OrbioError)
    expect((error as OrbioError).code).toBe('swap_failed')
    expect(w.activated).toEqual([])
    expect(w.held()).toBe(7_000_000n)
  })
})
