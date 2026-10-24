import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import { decodeFunctionData, encodeFunctionData, type Abi } from 'viem'
import { stakingAbi } from '../src/abi.js'
import { Staking } from '../src/chain/staking.js'
import type { Signer } from '../src/chain/signer.js'
import type { ProtocolAddresses } from '../src/config.js'

const verified = JSON.parse(readFileSync(new URL('./fixtures/staking-settlement.json', import.meta.url), 'utf8').replace(/^\uFEFF/, '')) as { abi: Abi }
const address = '0x0000000000000000000000000000000000000001'
const stakingAddress = '0x0000000000000000000000000000000000000002'
const hash = `0x${'1'.repeat(64)}` as const
const addresses: ProtocolAddresses = {
  staking: stakingAddress, credit: address, exchange: address, payout: address,
  orbio: null, usdg: null, nvda: null, agentVault: null,
}
const setup = (receiptStatus: 'success' | 'reverted' = 'success') => {
  const readContract = vi.fn(async ({ functionName }: { functionName: string }) => {
    if (functionName === 'MAX_PERIODS_PER_CALL') return 64n
    if (functionName === 'lastRewardId') return 100n
    if (functionName === 'rewardOf') return [25n, false] as const
    throw new Error(`unexpected read: ${functionName}`)
  })
  const writeContract = vi.fn(async () => hash)
  const waitForTransactionReceipt = vi.fn(async () => ({ status: receiptStatus }))
  const signer = {
    address, account: { address, type: 'json-rpc' }, chain: { id: 4663 },
    public: { readContract, waitForTransactionReceipt }, wallet: { writeContract },
  } as unknown as Signer
  return { staking: new Staking(addresses, signer), readContract, writeContract, waitForTransactionReceipt }
}

describe('staking settlement', () => {
  it('matches the verified deployed function inputs and outputs', () => {
    for (const name of ['MAX_PERIODS_PER_CALL', 'lastRewardId', 'rewardOf', 'settle']) {
      const actual = stakingAbi.find(entry => entry.type === 'function' && entry.name === name)
      const expected = verified.abi.find(entry => entry.type === 'function' && entry.name === name)
      expect(actual?.type).toBe('function')
      expect(expected?.type).toBe('function')
      if (actual?.type !== 'function' || expected?.type !== 'function') throw new Error(`missing ${name}`)
      expect(actual.inputs.map(input => input.type)).toEqual(expected.inputs.map(input => input.type))
      expect(actual.outputs.map(output => output.type)).toEqual(expected.outputs.map(output => output.type))
      expect(actual.stateMutability).toBe(expected.stateMutability)
    }
  })

  it('reads finalized periods and an account reward without sending a transaction', async () => {
    const { staking, readContract, writeContract } = setup()
    expect(await staking.lastRewardId()).toBe(100n)
    expect(await staking.rewardOf(10n)).toEqual({ creditAtoms: 25n, settled: false })
    expect(readContract).toHaveBeenLastCalledWith(expect.objectContaining({ functionName: 'rewardOf', args: [address, 10n] }))
    const other = '0x0000000000000000000000000000000000000003'
    await staking.rewardOf(10n, other)
    expect(readContract).toHaveBeenLastCalledWith(expect.objectContaining({ args: [other, 10n] }))
    expect(writeContract).not.toHaveBeenCalled()
  })

  it('settles only the requested batch and waits before a separate claim', async () => {
    const { staking, writeContract, waitForTransactionReceipt } = setup()
    expect(await staking.settle([1n, 3n])).toBe(hash)
    expect(writeContract).toHaveBeenCalledTimes(1)
    expect(writeContract).toHaveBeenCalledWith(expect.objectContaining({ address: stakingAddress, functionName: 'settle', args: [[1n, 3n]] }))
    expect(waitForTransactionReceipt).toHaveBeenCalledWith({ hash })
    const data = encodeFunctionData({ abi: stakingAbi, functionName: 'settle', args: [[1n, 3n]] })
    expect(decodeFunctionData({ abi: verified.abi, data })).toEqual({ functionName: 'settle', args: [[1n, 3n]] })
    await staking.claim()
    expect(writeContract).toHaveBeenCalledTimes(2)
    expect(writeContract).toHaveBeenLastCalledWith(expect.objectContaining({ functionName: 'claim' }))
  })

  it.each([[], [0n], [-1n], [2n, 2n], [2n, 1n]].map(ids => ({ ids })))('rejects empty, non-positive or unordered batches ($#)', async ({ ids }) => {
    const { staking, readContract, writeContract } = setup()
    await expect(staking.settle(ids)).rejects.toMatchObject({ code: 'invalid_request' })
    expect(readContract).not.toHaveBeenCalled()
    expect(writeContract).not.toHaveBeenCalled()
  })

  it('enforces the live batch bound and rejects unfinalized periods', async () => {
    const { staking, writeContract } = setup()
    await expect(staking.settle(Array.from({ length: 65 }, (_, i) => BigInt(i + 1)))).rejects.toMatchObject({ code: 'invalid_request' })
    await expect(staking.settle([101n])).rejects.toMatchObject({ code: 'invalid_request' })
    expect(writeContract).not.toHaveBeenCalled()
    await staking.settle(Array.from({ length: 64 }, (_, i) => BigInt(i + 1)))
    expect(writeContract).toHaveBeenCalledTimes(1)
  })

  it('keeps the selected IDs stable while the preflight reads are pending', async () => {
    const { staking, writeContract } = setup()
    const ids = [1n]
    const pending = staking.settle(ids)
    ids.push(101n)
    await pending
    expect(writeContract).toHaveBeenCalledWith(expect.objectContaining({ args: [[1n]] }))
  })

  it('stops the settle-then-claim sequence when settlement reverts', async () => {
    const { staking, writeContract } = setup('reverted')
    await expect((async () => { await staking.settle([1n]); await staking.claim() })()).rejects.toThrow(/settlement reverted/)
    expect(writeContract).toHaveBeenCalledTimes(1)
  })

  it('requires a signer and rejects invalid reward identifiers', async () => {
    const readonly = new Staking(addresses, null)
    await expect(readonly.settle([1n])).rejects.toMatchObject({ name: 'NoSignerError' })
    await expect(readonly.lastRewardId()).rejects.toMatchObject({ name: 'NoSignerError' })
    await expect(readonly.rewardOf(1n)).rejects.toMatchObject({ name: 'NoSignerError' })
    const { staking, readContract } = setup()
    await expect(staking.rewardOf(0n)).rejects.toMatchObject({ code: 'invalid_request' })
    expect(readContract).not.toHaveBeenCalled()
  })
})
