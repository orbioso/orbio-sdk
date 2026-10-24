import { describe, expect, expectTypeOf, it } from 'vitest'
import type { AgentDirectoryItem, AgentPage } from '../src/index.js'
import { Agents } from '../src/chain/agents.js'
import { makeSigner, type Signer } from '../src/chain/signer.js'
import { Http } from '../src/http.js'

// Fields observed on the public directory and /agents/2128 on 2026-10-24.
const agent = {
  kind: 'agent', agentId: '2128', token: '0x765bbaf9aa9a053cc7f91128e8b15bb674021d6f',
  name: 'HoodRail', symbol: 'HOODRAIL',
  owner: '0xabb4f5e530fa5454969215873e6922a9ba7f6f81',
  agentWallet: '0xabb4f5e530fa5454969215873e6922a9ba7f6f81', feeBps: 1000,
  stake: { orbioWei: '0' }, credit: { owedAtoms: null },
} as const
const listed = {
  kind: 'listed', token: '0x72190344f83c95d0470405429f375f68774b53bc', name: 'Frank', symbol: 'FRANK',
} as const

const client = (body: unknown, calls: string[] = [], status = 200, signer: Signer | null = null) =>
  new Agents(new Http({ baseUrl: 'https://example.test', fetch: async input => {
    calls.push(String(input))
    return new Response(JSON.stringify(body), { status })
  } }), null, signer)

describe('the public agent directory', () => {
  it('exposes pagination and distinguishes listed tokens from vault agents', async () => {
    const body = { live: true, data: [listed, agent], page: { limit: 2, offset: 0, total: 2129, search: null } }
    const result = await client(body).list()
    expectTypeOf(result).toEqualTypeOf<AgentPage>()
    expect(result).toEqual(body)
    for (const item of result.data) {
      if (item.kind === 'agent') {
        expect(BigInt(item.stake.orbioWei!)).toBe(0n)
        expect(item.credit.owedAtoms).toBeNull()
        expectTypeOf(item.credit.owedAtoms).toEqualTypeOf<string | null>()
        expectTypeOf(item.beneficiary).toEqualTypeOf<`0x${string}` | undefined>()
        // @ts-expect-error Balances are nested in the API response.
        expect(item.stakeWei).toBeUndefined()
      } else {
        // @ts-expect-error A listed token has no vault owner.
        expect(item.owner).toBeUndefined()
      }
    }
  })

  it('requests later pages and encodes search without changing other parameters', async () => {
    const calls: string[] = []
    await client({}, calls).list({ limit: 200, offset: 400, sort: 'newest', search: 'a & b/#' })
    const url = new URL(calls[0]!)
    expect(Object.fromEntries(url.searchParams)).toEqual({ limit: '200', offset: '400', sort: 'newest', q: 'a & b/#' })
  })

  it('keeps gateway defaults when no options are supplied', async () => {
    const calls: string[] = []
    await client({}, calls).list()
    expect(calls).toEqual(['https://example.test/api/protocol/agents'])
  })

  it('refuses invalid page bounds before making a request', async () => {
    const calls: string[] = []
    const agents = client({}, calls)
    for (const limit of [0, -1, 201, 1.5, NaN]) {
      await expect(agents.list({ limit })).rejects.toMatchObject({ code: 'invalid_request' })
    }
    for (const offset of [-1, 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      await expect(agents.list({ offset })).rejects.toMatchObject({ code: 'invalid_request' })
    }
    expect(calls).toHaveLength(0)
  })

  it('returns either kind by token and preserves a missing result', async () => {
    const result = await client(listed).get(listed.token)
    expectTypeOf(result).toEqualTypeOf<AgentDirectoryItem | null>()
    expect(result).toEqual(listed)
    expect(await client({ error: 'missing' }, [], 404).get('999')).toBeNull()
  })

  it('retains nested balances in the owner/operator filter', async () => {
    const calls: string[] = []
    const result = await client({ data: [agent] }, calls).ownedBy(agent.owner)
    expect(result.data[0]?.stake.orbioWei).toBe('0')
    expect(new URL(calls[0]!).searchParams.get('wallet')).toBe(agent.owner)
  })

  it('does not read vault permissions from a listed token', async () => {
    const signer = makeSigner({ account: { address: agent.owner, type: 'json-rpc' }, rpcUrl: 'https://example.test' }, 4663)
    await expect(client(listed, [], 200, signer).capabilities(1n)).rejects.toMatchObject({ code: 'invalid_request', status: 404 })
    await expect(client(agent, [], 200, signer).capabilities(2128n)).resolves.toEqual({ owner: true, agentWallet: true, canWithdraw: true })
  })
})
