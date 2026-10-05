import { NotConnectedError, OrbioError, type OrbioErrorCode } from './errors.js'

/**
 * The one place a request leaves this library.
 *
 * Small on purpose: no retries, no backoff, no queue. An agent's retry policy
 * is the agent's business, and a library that silently retries a call that
 * spends money is a library that spends money twice. What this does provide is
 * the thing retries need, which is an error that says whether trying again
 * could ever work.
 */

export type Fetcher = typeof fetch

export type HttpOptions = {
  baseUrl: string
  apiKey?: string | undefined
  fetch?: Fetcher | undefined
  /** Per-request ceiling. Unset, requests inherit the runtime's own. */
  timeoutMs?: number | undefined
}

type Body = Record<string, unknown>

type ErrorShape = {
  error?: { message?: unknown; code?: unknown; type?: unknown } | string
  connect_url?: unknown
  setup_url?: unknown
  retry_after_seconds?: unknown
}

const CONNECT_CODES = new Set(['not_connected', 'connection_revoked', 'unsupported_platform'])

/** What the gateway says went wrong, as the closest typed error. */
export const responseError = (status: number, body: unknown, retryAfter: number | null): OrbioError => {
  const shape = (body ?? {}) as ErrorShape
  const detail = typeof shape.error === 'string' ? { message: shape.error } : (shape.error ?? {})
  const message = typeof detail.message === 'string' ? detail.message : `request failed with ${status}`
  const rawCode = typeof detail.code === 'string' ? detail.code : typeof detail.type === 'string' ? detail.type : ''

  if (CONNECT_CODES.has(rawCode)) {
    const url = typeof shape.connect_url === 'string' ? shape.connect_url : undefined
    return new NotConnectedError(message, rawCode as OrbioErrorCode, url)
  }
  const bodyRetry = typeof shape.retry_after_seconds === 'number' && Number.isSafeInteger(shape.retry_after_seconds) && shape.retry_after_seconds >= 0 ? shape.retry_after_seconds : null
  return new OrbioError(message, { code: (rawCode || 'unknown') as OrbioErrorCode, status, retryAfter: retryAfter ?? bodyRetry, setupUrl: typeof shape.setup_url === 'string' ? shape.setup_url : null })
}

export class Http {
  constructor(private readonly options: HttpOptions) {}

  get baseUrl(): string {
    return this.options.baseUrl
  }

  /** A key is only sent when there is one: every read here is public without it. */
  private headers(json: boolean): Record<string, string> {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (json) headers['Content-Type'] = 'application/json'
    if (this.options.apiKey) headers['Authorization'] = `Bearer ${this.options.apiKey}`
    return headers
  }

  async request<T>(path: string, init: { method?: string; body?: Body; signal?: AbortSignal | undefined; maximumBytes?: number } = {}): Promise<{ data: T; headers: Headers }> {
    const doFetch = this.options.fetch ?? fetch
    if (init.signal?.aborted) throw new OrbioError('the local request was aborted; this does not cancel remote work', { code: 'aborted' })
    if (init.maximumBytes !== undefined && (!Number.isSafeInteger(init.maximumBytes) || init.maximumBytes < 1)) throw new OrbioError('invalid response size bound', { code: 'invalid_request' })
    const controller = this.options.timeoutMs || init.signal ? new AbortController() : null
    const timer = controller && this.options.timeoutMs ? setTimeout(() => controller.abort(), this.options.timeoutMs) : null
    const onAbort = () => controller?.abort()
    init.signal?.addEventListener('abort', onAbort, { once: true })
    if (init.signal?.aborted) controller?.abort()

    try {
      const response = await doFetch(`${this.options.baseUrl}${path}`, {
        method: init.method ?? 'GET',
        headers: this.headers(init.body !== undefined),
        redirect: 'error',
        ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
        ...(controller ? { signal: controller.signal } : {}),
      })

      const text = init.maximumBytes === undefined ? await response.text() : await boundedText(response, init.maximumBytes)
      if (init.signal?.aborted) throw new OrbioError('the local request was aborted; this does not cancel remote work', { code: 'aborted' })
      const parsed: unknown = text ? safeJson(text) : null

      if (!response.ok) {
        const header = response.headers.get('retry-after')
        const retry = header && /^\d{1,6}$/.test(header) ? Number(header) : null
        throw responseError(response.status, parsed, retry)
      }
      return { data: parsed as T, headers: response.headers }
    } catch (error) {
      if (error instanceof OrbioError) throw error
      if (init.signal?.aborted) throw new OrbioError('the local request was aborted; this does not cancel remote work', { code: 'aborted' })
      if (error instanceof Error && error.name === 'AbortError') {
        throw new OrbioError('the request timed out', { code: 'unknown', status: 0 })
      }
      // Custom fetch exceptions can contain authorization headers or private URLs.
      throw new OrbioError('the request failed before a response was confirmed', { code: 'unknown' })
    } finally {
      if (timer) clearTimeout(timer)
      init.signal?.removeEventListener('abort', onAbort)
    }
  }

  async get<T>(path: string): Promise<T> {
    return (await this.request<T>(path)).data
  }

  async post<T>(path: string, body: Body): Promise<T> {
    return (await this.request<T>(path, { method: 'POST', body })).data
  }

  /** Like `post`, but the caller wants the headers too: cost and balance ride on them. */
  async postWithHeaders<T>(path: string, body: Body): Promise<{ data: T; headers: Headers }> {
    return await this.request<T>(path, { method: 'POST', body })
  }

  withKey(apiKey: string | undefined): Http {
    return new Http({ ...this.options, apiKey })
  }
}

/** Infrastructure responses are bounded separately without shrinking legacy tool output. */
const boundedText = async (response: Response, maximum: number): Promise<string> => {
  if (!Number.isSafeInteger(maximum) || maximum < 1) throw new OrbioError('invalid response size bound', { code: 'invalid_request' })
  const reader = response.body?.getReader()
  if (!reader) return ''
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    for (;;) {
      const next = await reader.read()
      if (next.done) break
      size += next.value.byteLength
      if (size > maximum) {
        await reader.cancel()
        throw new OrbioError('the infrastructure response exceeded its bound; read operation status before retrying a mutation', { code: 'invalid_response' })
      }
      chunks.push(next.value)
    }
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } finally { reader.releaseLock() }
}

/**
 * A body that is not JSON is almost always an error page from something in
 * front of the gateway, and pasting a doctype into an exception helps nobody.
 * Plain text is kept, since a proxy sometimes says something useful in it.
 */
const safeJson = (text: string): unknown => {
  try {
    return JSON.parse(text)
  } catch {
    const looksLikeHtml = /^\s*<(!doctype|html)/i.test(text)
    return { error: { message: looksLikeHtml ? 'the server answered with a page, not JSON' : text.slice(0, 200) } }
  }
}
