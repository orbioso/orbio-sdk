import { afterEach, describe, expect, it, vi } from 'vitest'
import { encodeAbiParameters, encodeEventTopics, type Address, type Hex } from 'viem'
import { creditAbi } from '../src/abi.js'
import { Credit } from '../src/chain/credit.js'
import type { Signer } from '../src/chain/signer.js'
import type { ProtocolAddresses } from '../src/config.js'
import { beneficiaryOf } from '../src/money.js'
import { topUp } from '../src/topup.js'

const contract = '0x0000000000000000000000000000000000000001'
const wallet = '0x0000000000000000000000000000000000000002'
const foreign = '0x0000000000000000000000000000000000000003'
const beneficiary = beneficiaryOf(wallet)
const hash = `0x${'a'.repeat(64)}` as Hex
const amount = 10_000_000n

const activationLog = (id = 7n, address: Address = contract, from: Address = wallet, target = beneficiary) => ({
  address,
  topics: encodeEventTopics({ abi: creditAbi, eventName: 'Activated', args: { activationId: id, from, beneficiary: target } }),
  data: encodeAbiParameters([{ type: 'uint256' }], [amount]),
})
const feeLog = (feeAtoms: bigint, id = 7n, address = contract) => ({
  address,
  topics: encodeEventTopics({ abi: creditAbi, eventName: 'ActivationFeeCharged', args: { activationId: id } }),
  data: encodeAbiParameters([{ type: 'uint256' }], [feeAtoms]),
})

const credit = (logs: unknown[], status = 'success') => new Credit({ credit: contract } as unknown as ProtocolAddresses, {
  address: wallet,
  wallet: { writeContract: async () => hash },
  public: { readContract: async () => amount, waitForTransactionReceipt: async () => ({ status, logs }) },
} as unknown as Signer)

afterEach(() => vi.useRealTimers())

describe('activation amounts come from their own receipts', () => {
  it('subtracts the matching fee and retains the activation id', async () => {
    const result = await credit([activationLog(), feeLog(500_000n)]).activate({ amountMicroUsd: amount })
    expect(result).toMatchObject({ hash, activationId: 7n, amountMicroUsd: amount, creditedMicroUsd: 9_500_000n, feeMicroUsd: 500_000n })
  })

  it('credits the full amount when no fee was charged', async () => {
    expect(await credit([activationLog()]).activate({ amountMicroUsd: amount }))
      .toMatchObject({ creditedMicroUsd: amount, feeMicroUsd: 0n })
  })

  it('ignores other contracts, senders, beneficiaries and activation ids', async () => {
    const logs = [
      activationLog(8n, foreign), feeLog(9_000_000n, 7n, foreign),
      activationLog(9n, contract, foreign), activationLog(10n, contract, wallet, beneficiaryOf(foreign)),
      feeLog(8_000_000n, 9n), feeLog(7_000_000n, 10n), feeLog(500_000n), activationLog(),
    ]
    expect(await credit(logs).activate({ amountMicroUsd: amount }))
      .toMatchObject({ activationId: 7n, creditedMicroUsd: 9_500_000n })
  })

  it.each([
    { logs: [] },
    { logs: [activationLog(7n, foreign)] },
    { logs: [activationLog(), activationLog(8n)] },
    { logs: [activationLog(), feeLog(amount + 1n)] },
    { logs: [activationLog(), feeLog(1n), feeLog(2n)] },
  ])('refuses missing or ambiguous accounting without suggesting a retry (%#)', async ({ logs }) => {
    await expect(credit(logs).activate({ amountMicroUsd: amount })).rejects.toMatchObject({
      code: 'outcome_unknown', retryable: false, message: expect.stringContaining(hash),
    })
  })

  it('still rejects a reverted activation', async () => {
    await expect(credit([], 'reverted').activate({ amountMicroUsd: amount })).rejects.toThrow('activation reverted')
  })
})

describe('topUp separates activation accounting from account movement', () => {
  it.each([
    { after: 99_000_000n, movement: -1_000_000n, warning: true },
    { after: 200_000_000n, movement: 100_000_000n, warning: false },
    { after: 100_000_000n, movement: 0n, warning: true },
  ])('reports receipt credit when the account ends at $after', async ({ after, movement, warning }) => {
    vi.useFakeTimers()
    const balance = vi.fn().mockResolvedValueOnce({ availableMicroUsd: 100_000_000n })
      .mockResolvedValue({ availableMicroUsd: after })
    const deps = {
      account: { balance },
      swap: { buy: async () => ({ hash }) },
      credit: credit([activationLog(), feeLog(500_000n)]),
    } as unknown as Parameters<typeof topUp>[0]
    const pending = topUp(deps, { token: 'USDG', amount: '10', confirmMs: 1 })
    await vi.advanceTimersByTimeAsync(2_000)
    const result = await pending
    expect(result).toMatchObject({
      creditedMicroUsd: 9_500_000n, activationId: 7n,
      balanceChangeMicroUsd: movement, gatewayConfirmed: false,
    })
    if (warning) {
      expect(result.warning).toContain('concurrent spending')
      expect(result.warning).not.toContain('probably')
    } else expect(result.warning).toBeNull()
  })
})
