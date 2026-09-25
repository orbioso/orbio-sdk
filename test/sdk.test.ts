import { describe, expect, it } from 'vitest'
import {
  beneficiaryOf,
  createOrbio,
  formatCredit,
  formatCreditShort,
  NotConnectedError,
  NoSignerError,
  OrbioError,
  parseCredit,
  parseUnits,
} from '../src/index.js'

/**
 * What is worth testing without a network: the arithmetic on money, the shape
 * of a refusal, and the promise that a client knows nothing until it has asked.
 *
 * Deliberately no mocked chain. A test that stubs viem proves the stub works;
 * the contract calls are covered by the protocol repository against a real
 * fork, which is the only place they mean anything.
 */

const status = {
  live: true,
  chainId: 4663,
  explorer: 'https://robin.etherscan.io',
  addresses: {
    credit: '0x00000000000000000000000000000000000000c1',
    staking: '0x00000000000000000000000000000000000000c2',
    exchange: '0x00000000000000000000000000000000000000c3',
    payout: '0x00000000000000000000000000000000000000c4',
    orbio: '0x00000000000000000000000000000000000000c5',
    usdg: null,
    nvda: null,
    agentVault: null,
  },
  paused: { staking: false, exchange: false },
  indexer: { healthy: true, halted: false, haltReason: null, lagBlocks: 0 },
}

const tools = [
  {
    name: 'social.x.posts',
    title: 'Read posts on X',
    description: 'Search X.',
    provider: 'socialdata',
    input_schema: { type: 'object', properties: {} },
    output_schema: { type: 'object', properties: {} },
    price: {
      basis: 'per_result' as const,
      unit: 'post',
      credit_per_unit: '0.000220',
      bounded_by: 'limit',
      credit_to_start: null,
      typical: '0.0044 CREDIT for a page',
      note: null,
      margin_bps: 1000,
    },
  },
  {
    name: 'social.instagram',
    title: 'Read Instagram',
    description: 'Scrape Instagram.',
    provider: 'apify',
    input_schema: { type: 'object', properties: {} },
    output_schema: { type: 'object', properties: {} },
    price: {
      basis: 'per_result' as const,
      unit: 'result',
      credit_per_unit: '0.002530',
      bounded_by: 'limit',
      credit_to_start: '0.006600',
      typical: '0.253 CREDIT for limit=100',
      note: null,
      margin_bps: 1000,
    },
  },
]

/** A fetch that answers the two startup reads and records what was asked for. */
const stubFetch = (calls: string[] = []) =>
  (async (input: RequestInfo | URL) => {
    const url = String(input)
    calls.push(url)
    if (url.endsWith('/api/protocol/status')) {
      return new Response(JSON.stringify(status), { headers: { 'content-type': 'application/json' } })
    }
    if (url.endsWith('/api/v1/tools')) {
      // The envelope the gateway actually ships: OpenAI's `{ object, data }`.
      // The SDK read `{ tools }` and quietly saw nothing, which looks the same
      // as a deployment with no tools, so nothing failed until a real gateway
      // was in front of it.
      return new Response(JSON.stringify({ object: 'list', data: tools }), { headers: { 'content-type': 'application/json' } })
    }
    return new Response(JSON.stringify({ error: { message: 'not stubbed', code: 'unknown' } }), { status: 404 })
  }) as typeof fetch

describe('money is integers, and formatting truncates', () => {
  it('parses a decimal to exact micro-dollars', () => {
    expect(parseCredit('1')).toBe(1_000_000n)
    expect(parseCredit('1.25')).toBe(1_250_000n)
    expect(parseCredit('0.000001')).toBe(1n)
    expect(parseCredit(5n)).toBe(5n)
  })

  it('refuses anything that is not a plain decimal, rather than guessing', () => {
    for (const bad of ['', '1.2345678', '1e6', '-1', 'one', '1,000']) {
      expect(() => parseCredit(bad)).toThrow(TypeError)
    }
  })

  it('never rounds up, because showing a penny more than somebody has is worse', () => {
    expect(formatCredit(1_999_999n)).toBe('1.999999')
    expect(formatCredit(1n)).toBe('0.000001')
    expect(formatCredit(0n)).toBe('0.000000')
    expect(formatCreditShort(1_250_000n)).toBe('1.25')
    expect(formatCreditShort(2_000_000n)).toBe('2')
  })

  it('round-trips, which is the property that matters', () => {
    for (const text of ['0.000001', '1.25', '9999.999999', '0.1']) {
      expect(formatCreditShort(parseCredit(text))).toBe(text.replace(/0+$/, '').replace(/\.$/, ''))
    }
  })

  it('widens an address into the beneficiary the contracts take', () => {
    const wide = beneficiaryOf('0x00000000000000000000000000000000000000aA')
    expect(wide).toHaveLength(66)
    expect(wide.endsWith('aa')).toBe(true)
    expect(wide.startsWith(`0x${'0'.repeat(24)}`)).toBe(true)
  })

  it('parses token units at the token\'s own decimals', () => {
    expect(parseUnits('1.5', 18)).toBe(1_500_000_000_000_000_000n)
    expect(parseUnits('1.5', 6)).toBe(1_500_000n)
    expect(() => parseUnits('1.5555555', 6)).toThrow(TypeError)
  })
})

describe('a client knows nothing until it has asked', () => {
  it('fetches the addresses and the catalogue, and compiles neither in', async () => {
    const calls: string[] = []
    const orbio = await createOrbio({ fetch: stubFetch(calls), baseUrl: 'https://example.test' })
    expect(calls).toContain('https://example.test/api/protocol/status')
    expect(calls).toContain('https://example.test/api/v1/tools')
    expect(orbio.status.chainId).toBe(4663)
    expect(orbio.tools.list()).toHaveLength(2)
  })

  it('prices a call from the catalogue, including what a job costs to start', async () => {
    const orbio = await createOrbio({ fetch: stubFetch(), baseUrl: 'https://example.test' })
    // A request has nothing to pay before the first result.
    expect(orbio.tools.priceOf('social.x.posts')).not.toContain('to start')
    // A job does, and omitting it understates a small call by most of its bill.
    expect(orbio.tools.priceOf('social.instagram')).toContain('0.006600 to start')
    expect(orbio.tools.priceOf('nope')).toBeUndefined()
  })

  it('refuses an unknown tool locally, naming the ones it has', async () => {
    const orbio = await createOrbio({ fetch: stubFetch(), baseUrl: 'https://example.test' })
    await expect(orbio.tools.call('social.x.pots')).rejects.toThrow(/social\.x\.posts/)
  })

  it('has no address without a wallet, and says which action wanted one', async () => {
    const orbio = await createOrbio({ fetch: stubFetch(), baseUrl: 'https://example.test' })
    expect(orbio.address).toBeNull()
    await expect(orbio.credit.activate({ amountMicroUsd: 1n })).rejects.toBeInstanceOf(NoSignerError)
    await expect(orbio.staking.claim()).rejects.toThrow(/has to be signed/)
  })

  it('refuses the launchpad by name when it is not deployed', async () => {
    const orbio = await createOrbio({ fetch: stubFetch(), baseUrl: 'https://example.test' })
    await expect(orbio.agents.claimCredit(1n)).rejects.toThrow(/launchpad is not live/)
  })
})

describe('errors are something to branch on, not prose to read', () => {
  it('turns a not-connected refusal into its own type, with somewhere to send a person', async () => {
    const fetchImpl = (async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.endsWith('/api/protocol/status')) return new Response(JSON.stringify(status))
      if (url.endsWith('/api/v1/tools')) return new Response(JSON.stringify({ object: 'list', data: tools }))
      return new Response(
        JSON.stringify({
          error: { message: 'no social account is connected yet', code: 'not_connected' },
          connect_url: 'https://orbio.so/agents',
        }),
        { status: 409 },
      )
    }) as typeof fetch

    const orbio = await createOrbio({ fetch: fetchImpl, baseUrl: 'https://example.test', apiKey: 'k' })
    // `social.post` is not in this stub catalogue, so call the one that is.
    await expect(orbio.tools.call('social.x.posts', { handle: 'a' })).rejects.toMatchObject({
      name: 'NotConnectedError',
      url: 'https://orbio.so/agents',
    })
    const caught = await orbio.tools
      .call('social.x.posts', { handle: 'a' })
      .then(() => null, (error: unknown) => error as NotConnectedError)
    // Nothing changes until a person acts, so retrying is never the answer.
    expect(caught).toBeInstanceOf(NotConnectedError)
    expect(caught?.retryable).toBe(false)
  })

  it('knows what is worth another go and what is not', () => {
    expect(new OrbioError('slow down', { code: 'rate_limited', status: 429 }).retryable).toBe(true)
    expect(new OrbioError('provider fell over', { code: 'tool_failed', status: 502 }).retryable).toBe(true)
    expect(new OrbioError('bad limit', { code: 'invalid_request', status: 400 }).retryable).toBe(false)
    expect(new OrbioError('no such tool', { code: 'unknown_tool', status: 404 }).retryable).toBe(false)
  })
})

describe('the catalogue is read from whichever envelope the gateway sends', () => {
  const shapes: [string, unknown][] = [
    ['{ object, data } as shipped', { object: 'list', data: tools }],
    ['{ tools }', { tools }],
    ['a bare array', tools],
  ]

  for (const [name, body] of shapes) {
    it(`reads ${name}`, async () => {
      const fetchImpl = (async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.endsWith('/api/protocol/status')) return new Response(JSON.stringify(status))
        if (url.endsWith('/api/v1/tools')) return new Response(JSON.stringify(body))
        return new Response('{}', { status: 404 })
      }) as typeof fetch
      const orbio = await createOrbio({ fetch: fetchImpl, baseUrl: 'https://example.test' })
      expect(orbio.tools.list()).toHaveLength(2)
      expect(orbio.tools.describe('social.x.posts')).toBeTruthy()
    })
  }

  it('reads an unknown envelope as empty rather than throwing', async () => {
    // A gateway with no catalogue is a real state. What must not happen is an
    // unrecognised shape being indistinguishable from it forever, which is why
    // the three known shapes above are pinned.
    const fetchImpl = (async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.endsWith('/api/protocol/status')) return new Response(JSON.stringify(status))
      return new Response(JSON.stringify({ unexpected: true }))
    }) as typeof fetch
    const orbio = await createOrbio({ fetch: fetchImpl, baseUrl: 'https://example.test' })
    expect(orbio.tools.list()).toEqual([])
    await expect(orbio.tools.call('social.x.posts')).rejects.toThrow(/no tool catalogue/)
  })
})
