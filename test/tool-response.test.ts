import { describe, expect, it } from 'vitest'
import { Tools } from '../src/gateway/tools.js'
import { Http } from '../src/http.js'
import type { ToolDescriptor } from '../src/config.js'

const descriptor: ToolDescriptor = {
  name: 'media.video', title: 'Video', description: '', provider: '', input_schema: {}, output_schema: {},
  price: { basis: 'per_call', unit: 'call', credit_per_unit: '1', credit_to_start: null, bounded_by: null, typical: '', note: null, margin_bps: 0 },
}
const client = (raw: string, status = 200, headers: Record<string, string> = {}) => {
  let requests = 0
  const tools = new Tools(new Http({ baseUrl: 'https://example.test', fetch: async () => {
    requests++
    return new Response(raw, { status, headers })
  } }), [descriptor])
  return { tools, requests: () => requests }
}

describe('tool response contracts', () => {
  it.each(['<!doctype html><html>maintenance</html>', 'upstream offline', '', '{'])('rejects non-JSON success bodies without retrying: %s', async raw => {
    const stub = client(raw)
    await expect(stub.tools.call('media.video')).rejects.toMatchObject({ code: 'invalid_response', retryable: false })
    expect(stub.requests()).toBe(1)
  })

  it.each([
    null, [], {}, { result: {} }, { id: 'job' }, { id: 3, result: {} },
    { id: 'job', result: {}, cost: { credit: 3 } },
    { id: 'job', result: {}, cost: { credit: 'not a price' } },
    { id: 'job', status: 'running', collect_with: 3 },
    { id: 'job', status: 'running', retry_after_seconds: -1 },
    { id: 'job', status: 'running', retry_after_seconds: 0.5 },
  ])('rejects malformed JSON envelopes: %j', async body => {
    const stub = client(JSON.stringify(body))
    await expect(stub.tools.call('media.video')).rejects.toMatchObject({ code: 'invalid_response', retryable: false })
    expect(stub.requests()).toBe(1)
  })

  it.each([200, 202])('raises a structured error even with HTTP %i', async status => {
    const stub = client(JSON.stringify({ error: { code: 'outcome_unknown', message: 'Check the existing job' } }), status)
    await expect(stub.tools.call('media.video')).rejects.toMatchObject({ code: 'outcome_unknown', status, retryable: false })
    expect(stub.requests()).toBe(1)
  })

  it('preserves collection instructions on a running job without a result yet', async () => {
    const stub = client(JSON.stringify({ id: 'job', tool: 'media.video', status: 'running', collect_with: 'media.status', retry_after_seconds: 20, cost: { credit: null, status: 'settling' } }), 202)
    await expect(stub.tools.call('media.video')).resolves.toEqual({
      id: 'job', tool: 'media.video', result: null, pending: true,
      chargedMicroUsd: null, balanceMicroUsd: null, upstreamId: null,
      collectWith: 'media.status', retryAfterSeconds: 20,
    })
    expect(stub.requests()).toBe(1)
  })

  it('preserves zero retry delay and accepts completed null results', async () => {
    const stub = client(JSON.stringify({ id: 'job', result: null, retry_after_seconds: 0, cost: { credit: '0' } }))
    await expect(stub.tools.call('media.video')).resolves.toMatchObject({ pending: false, result: null, chargedMicroUsd: 0n, retryAfterSeconds: 0, collectWith: null })
  })

  it('keeps exact charges and ordinary results', async () => {
    const stub = client(JSON.stringify({ id: 'job', result: { video: { url: 'https://example.test/video' } }, cost: { credit: '1.25' } }), 200, { 'X-Orbio-Balance': '4.75' })
    await expect(stub.tools.call('media.video')).resolves.toMatchObject({ chargedMicroUsd: 1_250_000n, balanceMicroUsd: 4_750_000n, pending: false, result: { video: { url: 'https://example.test/video' } } })
  })

  it('keeps a delivered result while its bill is settling', async () => {
    const stub = client(JSON.stringify({ id: 'job', result: { delivered: true }, cost: { credit: null, status: 'settling' } }))
    await expect(stub.tools.call('media.video')).resolves.toMatchObject({ pending: false, chargedMicroUsd: null, result: { delivered: true } })
  })

  it('keeps useful HTTP failures and typed connection errors', async () => {
    await expect(client('<html>bad gateway</html>', 502).tools.call('media.video')).rejects.toMatchObject({ status: 502 })
    await expect(client(JSON.stringify({ error: { code: 'not_connected', message: 'Connect first' }, connect_url: 'https://example.test/connect' }), 409).tools.call('media.video')).rejects.toMatchObject({ name: 'NotConnectedError', url: 'https://example.test/connect' })
  })
})
