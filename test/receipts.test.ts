import { describe, expect, it } from 'vitest'
import type { Account, Address, Hex } from 'viem'
import { Agents } from '../src/chain/agents.js'
import { chainOf, type Signer } from '../src/chain/signer.js'
import { Staking } from '../src/chain/staking.js'
import { Swap } from '../src/chain/swap.js'
import type { ProtocolAddresses } from '../src/config.js'
import type { Http } from '../src/http.js'
import { OrbioError } from '../src/index.js'

/**
 * viem's `waitForTransactionReceipt` resolves for a reverted transaction too;
 * the outcome is `receipt.status`. These check that every write reads it.
 *
 * The signer is a stand-in that answers each receipt wait with the next
 * status from a list, so what is under test is the SDK's reading of the
 * receipt, not the contracts.
 */

const ME = '0x00000000000000000000000000000000000000aa' as Address
const VAULT = '0x00000000000000000000000000000000000000c6' as Address

const addresses = {
  credit: '0x00000000000000000000000000000000000000c1',
  staking: '0x00000000000000000000000000000000000000c2',
  exchange: '0x00000000000000000000000000000000000000c3',
  payout: '0x00000000000000000000000000000000000000c4',
  orbio: '0x00000000000000000000000000000000000000c5',
  usdg: null,
  nvda: null,
  agentVault: VAULT,
} as unknown as ProtocolAddresses

const reads: Record<string, bigint> = {
  balanceOf: 10n ** 21n,
  allowance: 0n,
  MIN_POSITION: 0n,
  positionOf: 0n,
  unlocksAt: 0n,
}

/** A signer whose receipts carry `statuses`, in order. */
const signerWith = (...statuses: ('success' | 'reverted')[]): Signer => {
  let sent = 0
  let waited = 0
  const send = async (): Promise<Hex> => `0x${(++sent).toString(16).padStart(64, '0')}`
  return {
    account: { address: ME, type: 'local' } as unknown as Account,
    address: ME,
    chain: chainOf(4663, 'http://127.0.0.1:1'),
    wallet: { writeContract: send, sendTransaction: send, signTypedData: async () => '0x' },
    public: {
      readContract: async ({ functionName }: { functionName: string }) => reads[functionName],
      waitForTransactionReceipt: async () => ({ status: statuses[waited++] ?? 'success', logs: [] }),
    },
  } as unknown as Signer
}

const reverts = async (call: Promise<unknown>) => {
  const error = await call.catch((e: unknown) => e)
  expect(error).toBeInstanceOf(OrbioError)
  expect((error as OrbioError).message).toMatch(/reverted/)
}

const agents = (signer: Signer) => new Agents({} as Http, VAULT, signer)

describe('a reverted transaction is an error, not a success', () => {
  it('stake: the approval', async () => {
    await reverts(new Staking(addresses, signerWith('reverted')).stake(10n ** 18n))
  })

  it('stake: the stake itself', async () => {
    await reverts(new Staking(addresses, signerWith('success', 'reverted')).stake(10n ** 18n))
  })

  it('unstake', async () => {
    await reverts(new Staking(addresses, signerWith('reverted')).unstake(1n))
  })

  it('claim', async () => {
    await reverts(new Staking(addresses, signerWith('reverted')).claim())
  })

  it('claimCredit', async () => {
    await reverts(agents(signerWith('reverted')).claimCredit(1n))
  })

  it('harvest', async () => {
    await reverts(agents(signerWith('reverted')).harvest([1n]))
  })

  it('withdrawPrincipal', async () => {
    await reverts(agents(signerWith('reverted')).withdrawPrincipal(1n, 1n))
  })

  it('setAgentWallet', async () => {
    await reverts(agents(signerWith('reverted')).setAgentWallet(1n, ME))
  })

  it('setBeneficiary', async () => {
    await reverts(agents(signerWith('reverted')).setBeneficiary(1n, ME))
  })

  it('buy: the Permit2 approval', async () => {
    const builds: unknown[] = []
    const http = {
      post: async (_path: string, body: { step: string }) => {
        if (body.step === 'build') {
          builds.push(body)
          return { to: ME, data: '0x', value: '0', gasLimit: null }
        }
        return {
          token: 'USDG', wallet: ME, amountIn: '20', amountOut: '20000000', minimumOut: '19900000',
          priceImpact: null, route: 'test', gasFeeUsd: null, permit: null, quote: {},
          approval: { to: ME, data: '0x', value: '0', gasLimit: null },
        }
      },
    } as unknown as Http
    await reverts(new Swap(http, signerWith('reverted')).buy({ token: 'USDG', amount: '20' }))
    // A failed approval stops the buy before a swap is built and sent.
    expect(builds).toHaveLength(0)
  })

  it('still returns the hash when the transaction succeeded', async () => {
    await expect(new Staking(addresses, signerWith('success')).claim()).resolves.toMatch(/^0x/)
    const staked = await new Staking(addresses, signerWith('success', 'success')).stake(10n ** 18n)
    expect(staked.approvalHash).not.toBeNull()
  })
})
