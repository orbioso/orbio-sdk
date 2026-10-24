import { afterEach, describe, expect, it, vi } from 'vitest'
import { keepFunded } from '../src/topup.js'

type Dependencies = Parameters<typeof keepFunded>[0]

const fixture = () => {
  let availableMicroUsd = 0n
  const balance = vi.fn(async () => ({ availableMicroUsd }))
  const buy = vi.fn(async () => ({ hash: '0x01' }))
  const activate = vi.fn(async () => {
    availableMicroUsd += 1_000_000n
    return { hash: '0x02' }
  })
  const deps = {
    account: { balance },
    swap: { buy },
    credit: { balanceOf: async () => 1_000_000n, activate },
  } as unknown as Dependencies
  return { deps, balance, buy, activate }
}

const options = { floor: '5', buy: { token: 'USDG' as const, amount: '1', confirmMs: 1 }, everyMs: 0 }

const next = async (loop: ReturnType<typeof keepFunded>) => {
  const result = loop.next()
  await vi.advanceTimersByTimeAsync(2_001)
  return await result
}

afterEach(() => vi.useRealTimers())

describe('keepFunded does not repeat an uncertain purchase', () => {
  it.each([undefined, 1])('stops after buying succeeds but activation fails (limit %s)', async (limit) => {
    vi.useFakeTimers()
    const f = fixture()
    f.activate.mockRejectedValue(new Error('activation unavailable'))
    const loop = keepFunded(f.deps, { ...options, ...(limit === undefined ? {} : { limit }) })
    try {
      expect((await next(loop)).value).toMatchObject({ kind: 'checked' })
      expect((await next(loop)).value).toMatchObject({ kind: 'failed' })
      expect((await next(loop)).done).toBe(true)
      expect(f.buy).toHaveBeenCalledTimes(1)
    } finally { await loop.return() }
  })

  it('stops when the purchase response is lost', async () => {
    vi.useFakeTimers()
    const f = fixture()
    f.buy.mockRejectedValue(new Error('receipt lookup timed out'))
    const loop = keepFunded(f.deps, options)
    try {
      await next(loop)
      expect((await next(loop)).value).toMatchObject({ kind: 'failed' })
      expect((await next(loop)).done).toBe(true)
      expect(f.buy).toHaveBeenCalledTimes(1)
      expect(f.activate).not.toHaveBeenCalled()
    } finally { await loop.return() }
  })

  it('stops when the balance read fails after activation', async () => {
    vi.useFakeTimers()
    const f = fixture()
    f.balance.mockResolvedValueOnce({ availableMicroUsd: 0n }).mockResolvedValueOnce({ availableMicroUsd: 0n })
      .mockRejectedValue(new Error('gateway unavailable'))
    const loop = keepFunded(f.deps, options)
    try {
      await next(loop)
      expect((await next(loop)).value).toMatchObject({ kind: 'failed' })
      expect((await next(loop)).done).toBe(true)
      expect(f.buy).toHaveBeenCalledTimes(1)
      expect(f.activate).toHaveBeenCalledTimes(1)
    } finally { await loop.return() }
  })

  it('stops when the gateway balance has not caught up', async () => {
    vi.useFakeTimers()
    const f = fixture()
    f.balance.mockResolvedValue({ availableMicroUsd: 0n })
    const loop = keepFunded(f.deps, options)
    try {
      await next(loop)
      expect((await next(loop)).value).toMatchObject({ kind: 'topped-up', result: { warning: expect.any(String) } })
      expect((await next(loop)).done).toBe(true)
      expect(f.buy).toHaveBeenCalledTimes(1)
    } finally { await loop.return() }
  })

  it('continues successful top-ups up to the limit', async () => {
    vi.useFakeTimers()
    const f = fixture()
    const loop = keepFunded(f.deps, { ...options, limit: 2 })
    try {
      for (let i = 0; i < 2; i += 1) {
        expect((await next(loop)).value).toMatchObject({ kind: 'checked' })
        expect((await next(loop)).value).toMatchObject({ kind: 'topped-up', result: { warning: null } })
      }
      expect((await next(loop)).done).toBe(true)
      expect(f.buy).toHaveBeenCalledTimes(2)
    } finally { await loop.return() }
  })

  it('does not read or spend when the limit is zero', async () => {
    const f = fixture()
    const loop = keepFunded(f.deps, { ...options, limit: 0 })
    try {
      expect((await loop.next()).done).toBe(true)
      expect(f.balance).not.toHaveBeenCalled()
      expect(f.buy).not.toHaveBeenCalled()
    } finally { await loop.return() }
  })

  it.each([-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])('rejects an invalid limit %s before spending', async (limit) => {
    const f = fixture()
    await expect(keepFunded(f.deps, { ...options, limit }).next()).rejects.toMatchObject({ code: 'invalid_request' })
    expect(f.buy).not.toHaveBeenCalled()
  })
})
