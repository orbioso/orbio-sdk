import { afterEach, describe, expect, it, vi } from 'vitest'
import { createInfrastructure, createOrbio, InfrastructureWaitTimeout, OrbioError } from '../src/index.js'
import { Http } from '../src/http.js'
import type { InfrastructureOperation } from '../src/infra/generated.js'
import { readFile } from 'node:fs/promises'
import { privateKeyToAccount } from 'viem/accounts'

const operationId = '18f23a51-2bca-452e-bf5b-2761140bdb8d'
const projectId = '17638561-b515-44e3-9d55-957112347bc2'
const agentId = '1da876c3-8f7d-4ccd-9113-eed697a83154'
const fixture = JSON.parse(await readFile(new URL('../src/infra/contracts.json', import.meta.url), 'utf8')) as { tools: unknown[] }
const catalogue = { version: 1, enabled: true, tools: fixture.tools }
const operation = (state: InfrastructureOperation['state']): InfrastructureOperation => ({
  id: operationId, project_id: projectId, agent_id: agentId, resource_id: null, action: 'workspace.exec', permission: 'workspace.exec',
  state, billing_state: 'held', reserved_micro_usd: 1000, charged_micro_usd: null, upstream_micro_usd: null,
  provider_id: null, error_code: null, created_at: '2026-10-04T12:00:00Z', updated_at: '2026-10-04T12:00:00Z', completed_at: null,
  retry_after_seconds: state === 'succeeded' ? null : 3,
})
const json = (result: unknown) => Response.json({ result })
const error = (code: string, status = 403, retry = null as number | null) => Response.json({ error: { code, message: 'fixture refusal', retryable: code === 'rate_limited' }, retry_after_seconds: retry, setup_url: '/dashboard#infrastructure' }, { status })
const client = (fetcher: typeof fetch) => createInfrastructure({ baseUrl: 'https://fixture.example', apiKey: 'test-infra-grant', fetch: fetcher })
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs() })

describe('infrastructure discovery and shared contracts', () => {
  it('constructs without chain discovery, caches public discovery and explicitly refreshes it', async () => {
    const calls: string[] = []
    const infra = client(async url => { calls.push(String(url)); return Response.json(catalogue) })
    expect(calls).toHaveLength(0)
    const first = await infra.catalogue()
    expect(first.tools.map(tool => tool.name)).toContain('operation.get')
    first.tools.length = 0
    expect((await infra.catalogue()).tools).toHaveLength(5)
    expect(calls).toHaveLength(1)
    await infra.refresh()
    expect(calls).toHaveLength(2)
    expect(calls.every(url => url.endsWith('/api/v1/infra/tools'))).toBe(true)
  })
  it('does not cache failed/unknown discovery as an empty healthy catalogue', async () => {
    let calls = 0
    const infra = client(async () => ++calls === 1 ? error('not_configured', 503) : Response.json(catalogue))
    await expect(infra.catalogue()).rejects.toMatchObject({ code: 'not_configured', retryable: false })
    expect((await infra.catalogue()).tools).toHaveLength(5)
    const malformed = client(async () => Response.json({ version: 2, enabled: true, tools: [] }))
    await expect(malformed.catalogue()).rejects.toMatchObject({ code: 'invalid_response' })
  })
  it('resource and generic calls preserve the shared structural result without legacy tool transformation', async () => {
    const infra = client(async (url, init) => {
      expect(new Headers(init?.headers).get('authorization')).toBe('Bearer test-infra-grant')
      expect(init?.redirect).toBe('error')
      expect(init?.method).toBe('POST')
      expect(String(url)).toBe('https://fixture.example/api/v1/infra/tools/operation.get')
      expect(JSON.parse(String(init?.body))).toEqual({ operation_id: operationId })
      return json({ ...operation('succeeded'), result: { stdout: '42' } })
    })
    expect((await infra.operations.get(operationId)).result).toEqual({ stdout: '42' })
    expect(await infra.call('operation.get', { operation_id: operationId })).toMatchObject({ id: operationId, state: 'succeeded' })
    await expect(infra.resources.get('provider-sandbox-id')).rejects.toMatchObject({ code: 'invalid_request' })
    await expect(infra.call('https://another.example', {})).rejects.toMatchObject({ code: 'invalid_request' })
  })
  it('retains machine errors, setup URLs and retry guidance including 202 ambiguous outcomes', async () => {
    const setup = client(async () => error('human_action_required'))
    await expect(setup.status()).rejects.toMatchObject({ code: 'human_action_required', status: 403, setupUrl: '/dashboard#infrastructure', retryable: false })
    const ambiguous = client(async () => error('outcome_unknown', 202))
    await expect(ambiguous.call('future.create', {})).rejects.toMatchObject({ code: 'outcome_unknown', status: 202, retryable: false })
    const limited = client(async () => error('rate_limited', 429, 90))
    await expect(limited.status()).rejects.toMatchObject({ code: 'rate_limited', retryAfter: 90, retryable: true })
  })
  it('never uses the broad gateway key implicitly for standalone infrastructure', async () => {
    vi.stubEnv('ORBIO_API_KEY', 'test-broad-key')
    vi.stubEnv('ORBIO_INFRA_KEY', '')
    const infra = createInfrastructure({ fetch: async (_url, init) => {
      expect(new Headers(init?.headers).has('authorization')).toBe(false)
      return error('unauthorized', 401)
    } })
    await expect(infra.status()).rejects.toMatchObject({ code: 'unauthorized' })
  })
  it('distinguishes failed transport reads from uncertain mutations without exposing custom fetch errors', async () => {
    let calls = 0
    const infra = client(async () => { calls++; throw new Error('Authorization: Bearer fixture-private-value') })
    await expect(infra.status()).rejects.toMatchObject({ code: 'upstream_unavailable', status: 503, retryable: true })
    const failure = await infra.call('future.create', {}).catch(reason => reason)
    expect(failure).toMatchObject({ code: 'outcome_unknown', retryable: false })
    expect(String(failure)).not.toContain('fixture-private-value')
    expect(calls).toBe(2)
  })
  it('does not let a concurrent catalogue reader mutate the internal cached descriptors', async () => {
    const infra = client(async () => Response.json(catalogue))
    const first = infra.refresh()
    const second = infra.catalogue()
    const results = await Promise.all([first, second])
    results[1].tools[0]!.name = 'changed'
    expect((await infra.catalogue()).tools[0]!.name).toBe('infra.status')
  })
})

describe('durable operation waiting is only local polling', () => {
  it('recovers by operation ID and returns the whole terminal result, including a held bill', async () => {
    vi.useFakeTimers()
    let calls = 0
    const infra = client(async (url, init) => {
      expect(String(url)).toMatch(/\/operation\.get$/)
      expect(JSON.parse(String(init?.body))).toEqual({ operation_id: operationId })
      return json({ ...operation(++calls === 1 ? 'reconciling' : 'succeeded'), result: { stdout: '42' } })
    })
    const waiting = infra.operations.wait(operationId.toUpperCase())
    await vi.advanceTimersByTimeAsync(3000)
    expect(await waiting).toMatchObject({ state: 'succeeded', billing_state: 'held', result: { stdout: '42' } })
    expect(calls).toBe(2)
    expect(vi.getTimerCount()).toBe(0)
  })
  it('honors a long Retry-After without replaying any mutation', async () => {
    vi.useFakeTimers()
    let calls = 0
    const infra = client(async url => {
      expect(String(url)).toMatch(/\/operation\.get$/)
      return ++calls === 1 ? error('rate_limited', 429, 90) : json(operation('succeeded'))
    })
    const waiting = infra.operations.wait(operationId, { timeoutMs: 120_000 })
    await vi.advanceTimersByTimeAsync(89_000)
    expect(calls).toBe(1)
    await vi.advanceTimersByTimeAsync(1000)
    expect((await waiting).state).toBe('succeeded')
    expect(calls).toBe(2)
  })
  it('does not retry grant revocation or unbounded read errors', async () => {
    const refused = client(async () => error('forbidden'))
    await expect(refused.operations.wait(operationId)).rejects.toMatchObject({ code: 'forbidden' })
    vi.useFakeTimers()
    let calls = 0
    const failing = client(async () => { calls++; return error('upstream_unavailable', 503, 1) })
    const waiting = failing.operations.wait(operationId, { maxReadRetries: 1 }).catch(reason => reason)
    await vi.advanceTimersByTimeAsync(1000)
    expect(await waiting).toMatchObject({ code: 'upstream_unavailable' })
    expect(calls).toBe(2)
    expect(vi.getTimerCount()).toBe(0)
  })
  it('aborts waiting without sending a cancel/delete or replay request', async () => {
    vi.useFakeTimers()
    const controller = new AbortController()
    const calls: string[] = []
    const infra = client(async url => { calls.push(String(url)); return json(operation('running')) })
    const waiting = infra.operations.wait(operationId, { signal: controller.signal }).catch(reason => reason)
    await vi.advanceTimersByTimeAsync(0)
    controller.abort()
    expect(await waiting).toMatchObject({ code: 'aborted' })
    expect(calls).toHaveLength(1)
    expect(calls[0]).toMatch(/\/operation\.get$/)
    expect(vi.getTimerCount()).toBe(0)
  })
  it('times out with the persisted ID and last observation available for resuming', async () => {
    vi.useFakeTimers()
    const infra = client(async () => json(operation('running')))
    const waiting = infra.operations.wait(operationId, { timeoutMs: 500 }).catch(reason => reason)
    await vi.advanceTimersByTimeAsync(500)
    const result = await waiting
    expect(result).toBeInstanceOf(InfrastructureWaitTimeout)
    expect(result).toMatchObject({ operationId, lastKnown: { state: 'running' } })
    expect(vi.getTimerCount()).toBe(0)
  })
  it('aborts an in-flight read when the local timeout ends', async () => {
    vi.useFakeTimers()
    const infra = client(async (_url, init) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')), { once: true })
    }))
    const waiting = infra.operations.wait(operationId, { timeoutMs: 500 }).catch(reason => reason)
    await vi.advanceTimersByTimeAsync(500)
    expect(await waiting).toBeInstanceOf(InfrastructureWaitTimeout)
    expect(vi.getTimerCount()).toBe(0)
  })
  it('checks returned operation identity and never loops on a malformed terminal state', async () => {
    const infra = client(async () => json({ ...operation('succeeded'), id: projectId }))
    await expect(infra.operations.wait(operationId)).rejects.toMatchObject({ code: 'invalid_response' })
  })
})

describe('transport and existing-client refresh', () => {
  it('rejects an already aborted call before sending it', async () => {
    let calls = 0
    const infra = client(async () => { calls++; return json(operation('running')) })
    const controller = new AbortController(); controller.abort()
    await expect(infra.call('future.create', {}, { signal: controller.signal })).rejects.toMatchObject({ code: 'aborted' })
    expect(calls).toBe(0)
  })
  it('bounds responses even when Content-Length is missing or deceptive', async () => {
    const http = new Http({ baseUrl: 'https://fixture.example', fetch: async () => new Response('x'.repeat(100), { headers: { 'content-length': '1' } }) })
    await expect(http.request('/test', { maximumBytes: 10 })).rejects.toMatchObject({ code: 'invalid_response' })
  })
  it('keeps custom transports and distinct keys across manifest refresh and discovery refresh', async () => {
    const authorizations: { path: string; key: string | null }[] = []
    const fetcher: typeof fetch = async (url, init) => {
      const path = new URL(String(url)).pathname
      authorizations.push({ path, key: new Headers(init?.headers).get('authorization') })
      if (path === '/api/protocol/status') return Response.json({ live: false, chainId: 4663, addresses: null })
      if (path === '/api/v1/tools') return Response.json({ tools: [] })
      if (path === '/api/v1/infra/tools') return Response.json(catalogue)
      return json({ fixture: true })
    }
    const account = privateKeyToAccount(`0x${'1'.repeat(64)}`)
    const orbio = await createOrbio({ baseUrl: 'https://fixture.example', apiKey: 'test-broad-key', infraKey: 'test-infra-key', fetch: fetcher, account, rpcUrl: 'https://chain-fixture.example' })
    const fresh = await orbio.refresh()
    await fresh.tools.refresh()
    await fresh.infra.refresh()
    await fresh.infra.status()
    expect(authorizations.filter(call => call.path.startsWith('/api/v1/infra')).every(call => call.key === 'Bearer test-infra-key')).toBe(true)
    expect(authorizations.filter(call => !call.path.startsWith('/api/v1/infra')).every(call => call.key === 'Bearer test-broad-key')).toBe(true)
    expect(fresh.signer).toBe(orbio.signer)
    expect(fresh.address?.toLowerCase()).toBe(account.address.toLowerCase())
    expect(authorizations).toHaveLength(7)
  })
  it('preserves typed SDK errors for callers branching on setup and retry policy', () => {
    const error = new OrbioError('unknown send outcome', { code: 'outcome_unknown', status: 503 })
    expect(error.retryable).toBe(false)
  })
})
