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
    expect((await infra.catalogue()).tools).toHaveLength(fixture.tools.length)
    expect(calls).toHaveLength(1)
    await infra.refresh()
    expect(calls).toHaveLength(2)
    expect(calls.every(url => url.endsWith('/api/v1/infra/tools'))).toBe(true)
  })
  it('does not cache failed/unknown discovery as an empty healthy catalogue', async () => {
    let calls = 0
    const infra = client(async () => ++calls === 1 ? error('not_configured', 503) : Response.json(catalogue))
    await expect(infra.catalogue()).rejects.toMatchObject({ code: 'not_configured', retryable: false })
    expect((await infra.catalogue()).tools).toHaveLength(fixture.tools.length)
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
  it('retains explicit destructive discovery hints and rejects malformed ones', async () => {
    const infra = client(async () => Response.json(catalogue))
    expect((await infra.catalogue()).tools.find(tool => tool.name === 'workspace.delete')).toMatchObject({ readOnly: false, destructive: true })
    const invalid = client(async () => Response.json({ ...catalogue, tools: [{ ...(fixture.tools[0] as object), destructive: 'true' }] }))
    await expect(invalid.catalogue()).rejects.toMatchObject({ code: 'invalid_response' })
  })
})

describe('workspace admission and explicit recovery', () => {
  it('quotes without admitting work and preserves original keys, ceilings and scope UUIDs for all lifecycle helpers', async () => {
    const calls: { path: string; body: unknown }[] = []
    const controller = new AbortController()
    const infra = client(async (url, init) => {
      calls.push({ path: new URL(String(url)).pathname, body: JSON.parse(String(init?.body)) })
      expect(new Headers(init?.headers).get('authorization')).toBe('Bearer test-infra-grant')
      expect(init?.signal).toBeInstanceOf(AbortSignal)
      return json(String(url).endsWith('workspace.quote') ? { suggested_max_cost: '0.006831' } : operation('queued'))
    })
    expect(await infra.workspaces.quote({ timeout_seconds: 15 })).toEqual({ suggested_max_cost: '0.006831' })
    const args = { name: 'Workspace', timeout_seconds: 15, idempotency_key: 'saved-create', max_cost: '0.006831' }
    expect(await infra.workspaces.create(args, { signal: controller.signal })).toMatchObject({ id: operationId, state: 'queued' })
    await infra.workspaces.resume(projectId.toUpperCase(), { idempotency_key: 'saved-resume', max_cost: '0.006831', timeout_seconds: 15, on_grant_revocation: 'stop' })
    await infra.workspaces.pause(projectId, { idempotency_key: 'saved-pause', max_cost: '0' })
    await infra.workspaces.delete(projectId, { idempotency_key: 'saved-delete', max_cost: '0' })
    expect(calls).toEqual([
      { path: '/api/v1/infra/tools/workspace.quote', body: { timeout_seconds: 15 } },
      { path: '/api/v1/infra/tools/workspace.create', body: args },
      { path: '/api/v1/infra/tools/workspace.resume', body: { resource_id: projectId, idempotency_key: 'saved-resume', max_cost: '0.006831', timeout_seconds: 15, on_grant_revocation: 'stop' } },
      { path: '/api/v1/infra/tools/workspace.pause', body: { resource_id: projectId, idempotency_key: 'saved-pause', max_cost: '0' } },
      { path: '/api/v1/infra/tools/workspace.delete', body: { resource_id: projectId, idempotency_key: 'saved-delete', max_cost: '0' } },
    ])
  })
  it('never retries an ambiguous admission and explains recovery when its operation ID was lost', async () => {
    let calls = 0
    const bodies: unknown[] = []
    const infra = client(async (_url, init) => {
      bodies.push(JSON.parse(String(init?.body)))
      if (++calls === 1) throw new Error('fixture private provider value')
      return json(operation('queued'))
    })
    const args = { name: 'Workspace', idempotency_key: 'same-original-key', max_cost: '0.02' }
    const failure = await infra.workspaces.create(args).catch(reason => reason)
    expect(failure).toMatchObject({ code: 'outcome_unknown', retryable: false })
    expect(String(failure)).toContain('identical arguments')
    expect(String(failure)).toContain('same idempotency_key')
    expect(String(failure)).not.toContain('private provider value')
    expect(calls).toBe(1)
    expect(await infra.workspaces.create(args)).toMatchObject({ id: operationId, state: 'queued' })
    expect(bodies).toEqual([args, args])
  })
  it('rejects provider IDs before sending lifecycle mutations', async () => {
    let calls = 0
    const infra = client(async () => { calls++; return json(operation('queued')) })
    const args = { idempotency_key: 'saved-key', max_cost: '0' }
    await expect(infra.workspaces.resume('provider-sandbox-id', args)).rejects.toMatchObject({ code: 'invalid_request' })
    await expect(infra.workspaces.pause('provider-sandbox-id', args)).rejects.toMatchObject({ code: 'invalid_request' })
    await expect(infra.workspaces.delete('provider-sandbox-id', args)).rejects.toMatchObject({ code: 'invalid_request' })
    expect(calls).toBe(0)
  })
  it('never treats a quote transport failure as an ambiguous mutation', async () => {
    let calls = 0
    const infra = client(async () => { calls++; throw new Error('fixture hidden transport error') })
    await expect(infra.workspaces.quote()).rejects.toMatchObject({ code: 'upstream_unavailable', retryable: true })
    expect(calls).toBe(1)
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
  it('uses the existing API key for integrated and standalone infra, with explicit overrides first', async () => {
    vi.stubEnv('ORBIO_INFRA_KEY', undefined)
    vi.stubEnv('ORBIO_API_KEY', 'environment-api-key')
    const seen: string[] = []
    const fetcher: typeof fetch = async (url, init) => {
      const path = new URL(String(url)).pathname
      if (path === '/api/protocol/status') return Response.json({ live: false, chainId: 4663, addresses: null })
      if (path.startsWith('/api/v1/infra/')) seen.push(new Headers(init?.headers).get('authorization') ?? '')
      return json({ fixture: true })
    }
    await createInfrastructure({ fetch: fetcher }).status()
    const orbio = await createOrbio({ apiKey: 'explicit-api-key', fetch: fetcher })
    await orbio.infra.status()
    await (await orbio.refresh()).infra.status()
    vi.stubEnv('ORBIO_INFRA_KEY', 'scoped-environment-key')
    await createInfrastructure({ fetch: fetcher }).status()
    await createInfrastructure({ apiKey: 'explicit-infra-key', fetch: fetcher }).status()
    expect(seen).toEqual(['Bearer environment-api-key', 'Bearer explicit-api-key', 'Bearer explicit-api-key', 'Bearer scoped-environment-key', 'Bearer explicit-infra-key'])
  })
  it('preserves typed SDK errors for callers branching on setup and retry policy', () => {
    const error = new OrbioError('unknown send outcome', { code: 'outcome_unknown', status: 503 })
    expect(error.retryable).toBe(false)
  })
})
