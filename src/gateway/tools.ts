import { loadToolCatalogue, type ToolDescriptor } from '../config.js'
import type { Http } from '../http.js'
import { OrbioError } from '../errors.js'
import { formatCreditShort, parseCredit } from '../money.js'

/**
 * The tool catalogue, as something to call rather than read.
 *
 * The catalogue is fetched when the client is created, so `list()` and
 * `describe()` are free and synchronous: an agent can ask what a call would
 * cost before deciding to make one, without a round trip that might itself
 * fail.
 */

export type ToolResult<T = unknown> = {
  id: string
  tool: string
  result: T
  /** What this call charged, exact. Null while a bill is still settling. */
  chargedMicroUsd: bigint | null
  /** The balance afterwards, when the gateway said. */
  balanceMicroUsd: bigint | null
  /** A job that outlived the request. The charge settles when it finishes. */
  pending: boolean
  upstreamId: string | null
}

type Wire = {
  id: string
  tool: string
  status?: string
  result?: unknown
  upstream_id?: string
  cost?: { credit?: string | null; upstream?: string | null; status?: string }
}

const microFromHeader = (headers: Headers, name: string): bigint | null => {
  const value = headers.get(name)
  if (!value) return null
  try {
    return parseCredit(value)
  } catch {
    return null
  }
}

export class Tools {
  constructor(
    private readonly http: Http,
    private catalogue: ToolDescriptor[],
  ) {}

  /** Every tool, with its schemas and its price. No network call. */
  list(): ToolDescriptor[] {
    return [...this.catalogue]
  }

  /** Refresh discovery without replacing this client's credentials or signer. */
  async refresh(): Promise<ToolDescriptor[]> {
    const catalogue = await loadToolCatalogue(this.http)
    this.catalogue = catalogue
    return this.list()
  }

  describe(name: string): ToolDescriptor | undefined {
    return this.catalogue.find(tool => tool.name === name)
  }

  /**
   * What a call would cost at worst, as a sentence, without making it.
   *
   * Reads `credit_to_start` as well as the per-unit rate. Budgeting from the
   * rate alone understates a job by its start fee, which on a small call is
   * most of the bill.
   */
  priceOf(name: string): string | undefined {
    const tool = this.describe(name)
    if (!tool) return undefined
    const start = tool.price.credit_to_start
    return `${tool.price.credit_per_unit} CREDIT per ${tool.price.unit}`
      + `${tool.price.bounded_by ? `, bounded by ${tool.price.bounded_by}` : ''}`
      + `${start ? `, plus ${start} to start` : ''}`
      + `. ${tool.price.typical}`
  }

  /**
   * Run a tool.
   *
   * `maxCost` is a ceiling in CREDIT and is strongly recommended: a call
   * quoted above it is refused before anything runs, so a mistaken bound costs
   * nothing. It is optional rather than required because the gateway already
   * bounds a call by the balance, and forcing a number would mean callers
   * inventing one.
   */
  async call<T = unknown>(
    name: string,
    args: Record<string, unknown> = {},
    options: { maxCost?: string | number | bigint } = {},
  ): Promise<ToolResult<T>> {
    if (!this.describe(name)) {
      if (this.catalogue.length === 0) {
        throw new OrbioError(
          `this gateway publishes no tool catalogue, so ${name} cannot be called here. `
          + 'Check the base URL, or that the deployment has tools enabled.',
          { code: 'unknown_tool', status: 404 },
        )
      }
      const known = this.catalogue.map(tool => tool.name).join(', ')
      throw new OrbioError(`no tool called ${name}. This gateway has: ${known}`, { code: 'unknown_tool', status: 404 })
    }

    const body: Record<string, unknown> = { ...args }
    if (options.maxCost !== undefined) body.max_cost = formatCreditShort(parseCredit(options.maxCost))

    const { data, headers } = await this.http.postWithHeaders<Wire>(
      `/api/v1/tools/${encodeURIComponent(name)}`,
      body,
    )

    const charged = data.cost?.credit
    return {
      id: data.id,
      tool: data.tool ?? name,
      result: (data.result ?? null) as T,
      chargedMicroUsd: charged ? parseCredit(charged) : microFromHeader(headers, 'X-Orbio-Cost'),
      balanceMicroUsd: microFromHeader(headers, 'X-Orbio-Balance'),
      pending: data.status === 'running',
      upstreamId: data.upstream_id ?? null,
    }
  }

  // ---------------------------------------------------------------- named
  // Thin, typed wrappers over the tools people reach for most. They add no
  // behaviour: `call()` covers everything, including tools added after this
  // version shipped, which is why there is no wrapper for every tool.

  /** Search X, read a handle, read mentions, or read a reply tree. */
  async xPosts(
    args: {
      query?: string
      handle?: string
      mentionsOf?: string
      conversationId?: string
      sort?: 'Latest' | 'Top'
      limit?: number
      cursor?: string
    },
    options: { maxCost?: string } = {},
  ) {
    return this.call<{ query: string; tweets: unknown[]; next_cursor: string | null }>('social.x.posts', {
      ...(args.query ? { query: args.query } : {}),
      ...(args.handle ? { handle: args.handle } : {}),
      ...(args.mentionsOf ? { mentions_of: args.mentionsOf } : {}),
      ...(args.conversationId ? { conversation_id: args.conversationId } : {}),
      ...(args.sort ? { sort: args.sort } : {}),
      ...(args.limit ? { limit: args.limit } : {}),
      ...(args.cursor ? { cursor: args.cursor } : {}),
    }, options)
  }

  /** Public profiles for one or more handles. */
  async xProfiles(handles: string[], options: { maxCost?: string } = {}) {
    return this.call<{ profiles: unknown[] }>('social.x.profile', { handles }, options)
  }

  /**
   * Publish to the accounts this account's owner connected.
   *
   * Raises `NotConnectedError` when nothing is connected, carrying the page an
   * owner goes to. That is not a retryable failure: nothing changes until a
   * person acts, so relay it rather than looping.
   */
  async post(text: string, options: { platforms?: string[]; maxCost?: string } = {}) {
    return this.call<{ post_id: string | null; status: string; platforms: unknown[] }>('social.post', {
      text,
      ...(options.platforms ? { platforms: options.platforms } : {}),
    }, options.maxCost === undefined ? {} : { maxCost: options.maxCost })
  }

  /** Whether a post went out, and its live link. Free. */
  async postStatus(postId: string) {
    return this.call<{ post_id: string; status: string; platforms: unknown[] }>('social.post.status', {
      post_id: postId,
    })
  }

  /** Search the web. */
  async webSearch(query: string, options: { limit?: number; scrape?: boolean; maxCost?: string } = {}) {
    return this.call('web.search', {
      query,
      ...(options.limit ? { limit: options.limit } : {}),
      ...(options.scrape ? { scrape: true } : {}),
    }, options.maxCost === undefined ? {} : { maxCost: options.maxCost })
  }

  /** Read one page as markdown. */
  async webScrape(url: string, options: { maxCost?: string } = {}) {
    return this.call('web.scrape', { url }, options)
  }
}
