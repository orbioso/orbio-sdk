import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import { decodeFunctionData, encodeAbiParameters, encodeEventTopics, encodeFunctionData, zeroAddress, type Abi, type Address, type Hex } from 'viem'
import { Agents } from '../src/chain/agents.js'
import type { Signer } from '../src/chain/signer.js'
import type { Http } from '../src/http.js'
import { beneficiaryOf } from '../src/money.js'

// Independent ABI excerpt from the verified implementation, pinned at the
// proxy implementation slot and block recorded in the fixture.
const deployed = JSON.parse(readFileSync(new URL('./fixtures/vault-launch.json', import.meta.url), 'utf8')) as { abi: Abi }
const owner = '0x0000000000000000000000000000000000000001'
const operator = '0x0000000000000000000000000000000000000002'
const vault = '0x0000000000000000000000000000000000000003'
const token = '0x0000000000000000000000000000000000000004'
const hash = `0x${'1'.repeat(64)}` as Hex
const params = { name: 'Scout', symbol: 'SCOUT', feeWei: 100n, expectedEconomics: hash }

const fixture = (agentWallet: Address = owner) => {
  const event = deployed.abi.find(entry => entry.type === 'event' && entry.name === 'AgentLaunched')
  if (!event || event.type !== 'event') throw new Error('missing reference event')
  const log = {
    address: vault,
    topics: encodeEventTopics({ abi: deployed.abi, eventName: 'AgentLaunched', args: { agentId: 42n, token, owner } }),
    data: encodeAbiParameters(event.inputs.filter(input => !input.indexed), [vault, agentWallet, beneficiaryOf(agentWallet), 1000, 1_792_837_200n]),
  }
  const writeContract = vi.fn<(call: { abi: Abi; functionName: string; args: readonly unknown[] }) => Promise<Hex>>()
    .mockResolvedValue(hash)
  const agents = new Agents({} as Http, vault, {
    address: owner,
    wallet: { writeContract },
    public: { waitForTransactionReceipt: async () => ({ status: 'success', logs: [log] }) },
  } as unknown as Signer)
  return { agents, writeContract }
}

describe('launch uses the deployed vault interface', () => {
  it.each([undefined, operator, zeroAddress] as const)('encodes the supported selector with wallet %s and decodes its event', async (agentWallet) => {
    const target = !agentWallet || agentWallet === zeroAddress ? owner : agentWallet
    const f = fixture(target)
    const result = await f.agents.launch({ ...params, ...(agentWallet === undefined ? {} : { agentWallet }) })
    expect(result).toEqual({ hash, agentId: 42n, token })
    const call = f.writeContract.mock.calls[0]?.[0]
    if (!call) throw new Error('missing launch transaction')
    const data = encodeFunctionData(call)
    const decoded = decodeFunctionData({ abi: deployed.abi, data })
    expect(decoded.functionName).toBe('launch')
    expect(decoded.args).toHaveLength(2)
    expect(decoded.args?.[1]).toBe(target)
    expect(call.args).toHaveLength(2)
  })

  it.each([operator, beneficiaryOf(operator)] as const)('accepts a legacy beneficiary only when it matches the operator (%s)', async (beneficiary) => {
    const f = fixture(operator)
    await f.agents.launch({ ...params, agentWallet: operator, beneficiary })
    expect(f.writeContract.mock.calls[0]?.[0].args).toHaveLength(2)
  })

  it.each([owner, beneficiaryOf(owner)] as const)('refuses an independent beneficiary before sending (%s)', async (beneficiary) => {
    const f = fixture(operator)
    await expect(f.agents.launch({ ...params, agentWallet: operator, beneficiary }))
      .rejects.toMatchObject({ code: 'invalid_request' })
    expect(f.writeContract).not.toHaveBeenCalled()
  })

  it('does not send a removed setter or silently change operator permissions', async () => {
    const f = fixture()
    await expect(f.agents.setBeneficiary(42n, operator)).rejects.toMatchObject({ code: 'invalid_request' })
    expect(f.writeContract).not.toHaveBeenCalled()
  })
})
