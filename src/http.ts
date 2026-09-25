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
}

const CONNECT_CODES = new Set(['not_connected', 'connection_revoked', 'unsupported_platform'])

/** What the gateway says went wrong, as the closest typed error. */
const toError = (status: number, body: unknown, retryAfter: number | null): OrbioError => {
  const shape = (body ?? {}) as ErrorShape
  const detail = typeof shape.error === 'string' ? { message: shape.error } : (shape.error ?? {})
  const message = typeof detail.message === 'string' ? detail.message : `request failed with ${status}`
  const rawCode = typeof detail.code === 'string' ? detail.code : typeof detail.type === 'string' ? detail.type : ''

  if (CONNECT_CODES.has(rawCode)) {
    const url = typeof shape.connect_url === 'string' ? shape.connect_url : undefined
    return new NotConnectedError(message, rawCode as OrbioErrorCode, url)
  }
  return new OrbioError(message, { code: (rawCode || 'unknown') as OrbioErrorCode, status, retryAfter })
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

  async request<T>(path: string, init: { method?: string; body?: Body } = {}): Promise<{ data: T; headers: Headers }> {
    const doFetch = this.options.fetch ?? fetch
    const controller = this.options.timeoutMs ? new AbortController() : null
    const timer = controller ? setTimeout(() => controller.abort(), this.options.timeoutMs) : null

    try {
      const response = await doFetch(`${this.options.baseUrl}${path}`, {
        method: init.method ?? 'GET',
        headers: this.headers(init.body !== undefined),
        ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
        ...(controller ? { signal: controller.signal } : {}),
      })

      const text = await response.text()
      const parsed: unknown = text ? safeJson(text) : null

      if (!response.ok) {
        const header = response.headers.get('retry-after')
        throw toError(response.status, parsed, header ? Number(header) : null)
      }
      return { data: parsed as T, headers: response.headers }
    } catch (error) {
      if (error instanceof OrbioError) throw error
      if (error instanceof Error && error.name === 'AbortError') {
        throw new OrbioError('the request timed out', { code: 'unknown', status: 0 })
      }
      throw new OrbioError(error instanceof Error ? error.message : 'the request failed', { code: 'unknown' })
    } finally {
      if (timer) clearTimeout(timer)
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
