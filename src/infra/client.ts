import { DEFAULT_BASE_URL } from '../config.js'
import { OrbioError } from '../errors.js'
import { Http, responseError, type Fetcher } from '../http.js'
import type { InfrastructureInput, InfrastructureOperation, InfrastructureResult, InfrastructureToolName } from './generated.js'
import { READ_ONLY_INFRASTRUCTURE_TOOLS } from './generated.js'

export type InfrastructureRequestOptions = { signal?: AbortSignal | undefined }
export type InfrastructureWaitOptions = InfrastructureRequestOptions & {
  /** Local waiting limit only. Expiration never cancels provider work. Default 5 minutes. */
  timeoutMs?: number | undefined
  /** Polling floor in milliseconds. The server may request a longer wait. Default 1000. */
  pollIntervalMs?: number | undefined
  /** Consecutive retryable read failures before returning the error. Default 3. */
  maxReadRetries?: number | undefined
}
export type InfrastructureDescriptor = {
  name: string; description: string; permission: string
  inputSchema: Record<string, unknown>; outputSchema: Record<string, unknown>
  readOnly: boolean; costBasis: string
  destructive?: boolean
}
export type InfrastructureCatalogue = { version: 1; enabled: boolean; tools: InfrastructureDescriptor[] }
export type InfrastructureOptions = {
  /** Dedicated infrastructure grant key or an Orbio OAuth token with explicit infra consent. */
  apiKey?: string | undefined
  baseUrl?: string | undefined
  fetch?: Fetcher | undefined
  timeoutMs?: number | undefined
}

export class InfrastructureWaitTimeout extends OrbioError {
  constructor(readonly operationId: string, readonly lastKnown: InfrastructureOperation | null) {
    super('local waiting timed out; resume with operations.get() or wait() using the same operation ID', { code: 'wait_timeout' })
    this.name = 'InfrastructureWaitTimeout'
  }
}
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
const invalidResponse = () => new OrbioError('the infrastructure API returned an invalid response', { code: 'invalid_response' })
const uuid = (value: string): string => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) throw new OrbioError('use an Orbio resource or operation UUID, not a provider ID', { code: 'invalid_request' })
  return value.toLowerCase()
}
const aborted = () => new OrbioError('local waiting was aborted; the operation and its resources remain unchanged', { code: 'aborted' })
const sleep = (milliseconds: number, signal: AbortSignal): Promise<void> => new Promise((resolve, reject) => {
  if (signal.aborted) { reject(aborted()); return }
  const cleanup = () => signal.removeEventListener('abort', stop)
  const timer = setTimeout(() => { cleanup(); resolve() }, milliseconds)
  const stop = () => { clearTimeout(timer); cleanup(); reject(aborted()) }
  signal.addEventListener('abort', stop, { once: true })
})
const bound = (value: number, name: string, minimum: number, maximum: number): number => {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) throw new OrbioError(`${name} must be an integer between ${minimum} and ${maximum}`, { code: 'invalid_request' })
  return value
}

/** Shared HTTP contracts also used by hosted MCP; no upstream provider SDK or key needed. */
export class Infrastructure {
  private cached: InfrastructureCatalogue | null = null
  private pending: Promise<InfrastructureCatalogue> | null = null
  private generation = 0

  constructor(private readonly http: Http) {}

  /** Public discovery, fetched on first use and then cached. Does not list tenant resources. */
  async catalogue(): Promise<InfrastructureCatalogue> {
    if (this.cached) return structuredClone(this.cached)
    return structuredClone(await (this.pending ?? this.refresh()))
  }
  /** Explicitly re-read discovery without recreating credentials or a signing client. */
  async refresh(options: InfrastructureRequestOptions = {}): Promise<InfrastructureCatalogue> {
    const generation = ++this.generation
    const pending = this.readCatalogue(options)
    this.pending = pending
    try {
      const result = await pending
      if (generation === this.generation) this.cached = result
      return structuredClone(result)
    } finally { if (this.pending === pending) this.pending = null }
  }
  private async readCatalogue(options: InfrastructureRequestOptions): Promise<InfrastructureCatalogue> {
    const { data } = await this.http.request<unknown>('/api/v1/infra/tools', { signal: options.signal, maximumBytes: 1_048_576 })
    if (!object(data) || data.version !== 1 || typeof data.enabled !== 'boolean' || !Array.isArray(data.tools) || data.tools.length > 200) throw invalidResponse()
    const names = new Set<string>()
    const tools = data.tools.map(value => {
      if (!object(value) || typeof value.name !== 'string' || names.has(value.name) || typeof value.description !== 'string' || typeof value.permission !== 'string' || typeof value.readOnly !== 'boolean' || typeof value.costBasis !== 'string' || (value.destructive !== undefined && typeof value.destructive !== 'boolean') || !object(value.inputSchema) || !object(value.outputSchema)) throw invalidResponse()
      names.add(value.name)
      return { name: value.name, description: value.description, permission: value.permission, readOnly: value.readOnly, costBasis: value.costBasis, inputSchema: value.inputSchema, outputSchema: value.outputSchema, ...(value.destructive === undefined ? {} : { destructive: value.destructive }) }
    })
    return { version: 1, enabled: data.enabled, tools }
  }
  async call<K extends InfrastructureToolName>(name: K, args: InfrastructureInput<K>, options?: InfrastructureRequestOptions): Promise<InfrastructureResult<K>>
  async call<T = unknown>(name: string, args?: Record<string, unknown>, options?: InfrastructureRequestOptions): Promise<T>
  async call(name: string, args: Record<string, unknown> = {}, options: InfrastructureRequestOptions = {}): Promise<unknown> {
    if (!/^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)*$/.test(name)) throw new OrbioError('use the canonical capability name from infrastructure discovery', { code: 'invalid_request' })
    const { data, headers } = await this.http.request<unknown>(`/api/v1/infra/tools/${encodeURIComponent(name)}`, { method: 'POST', body: args, signal: options.signal, maximumBytes: 4_194_304 }).catch((error: unknown) => {
      if (error instanceof OrbioError && error.code === 'unknown' && error.status === 0) {
        if (name === 'operation.cancel') throw new OrbioError('queued cancellation could not be confirmed; read the original operation ID or explicitly repeat cancellation for that same ID', { code: 'outcome_unknown' })
        if (READ_ONLY_INFRASTRUCTURE_TOOLS.includes(name) || this.cached?.tools.some(tool => tool.name === name && tool.readOnly)) throw new OrbioError('the infrastructure read could not be completed', { code: 'upstream_unavailable', status: 503 })
        throw new OrbioError('the request outcome is unknown; read the saved operation ID, or recover admission with identical arguments and the same idempotency_key', { code: 'outcome_unknown' })
      }
      throw error
    })
    // A 202 ambiguous-outcome error is still an error, not a successful result.
    if (object(data) && object(data.error)) {
      const value = headers.get('retry-after')
      throw responseError(202, data, value && /^\d{1,6}$/.test(value) ? Number(value) : null)
    }
    if (!object(data) || !Object.hasOwn(data, 'result')) throw invalidResponse()
    return data.result
  }
  /** Cheap assigned product/agent overview; provider presence is not a health probe. */
  status(options: InfrastructureRequestOptions = {}) { return this.call('infra.status', {}, options) }
  /** Current toolkit surcharge/payer policy, not a resource quote or invoice.
   * Existing operations/funding retain the rate captured at admission. */
  pricing(options: InfrastructureRequestOptions = {}) { return this.call('infra.pricing', {}, options) }

  private scoped<K extends InfrastructureToolName>(name: K, resourceId: string,
    args: Omit<InfrastructureInput<K>, 'resource_id'>, options: InfrastructureRequestOptions) {
    return this.call(name, { ...args, resource_id: uuid(resourceId) } as InfrastructureInput<K>, options)
  }

  readonly resources = {
    list: (args: InfrastructureInput<'resource.list'> = {}, options: InfrastructureRequestOptions = {}) => this.call('resource.list', args, options),
    get: async (resourceId: string, options: InfrastructureRequestOptions = {}) => this.call('resource.get', { resource_id: uuid(resourceId) }, options),
    /** Recorded, delayed native cost observations; never a final customer bill.
     * Decimal micro-USD strings preserve resource-wide totals. No provider call. */
    spending: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.call('resource.spending', { resource_id: uuid(resourceId) }, options),
  }
  readonly operations = {
    list: (args: InfrastructureInput<'operation.list'> = {}, options: InfrastructureRequestOptions = {}) => this.call('operation.list', args, options),
    get: async (operationId: string, options: InfrastructureRequestOptions = {}) => this.call('operation.get', { operation_id: uuid(operationId) }, options),
    /** Explicit queued-only cancellation. No provider stop, replay or new hold. */
    cancel: (operationId: string, options: InfrastructureRequestOptions = {}) => this.call('operation.cancel', { operation_id: uuid(operationId) }, options),
    /** Read-only polling. No dispatch, replay or cancellation on timeout/abort. */
    wait: (operationId: string, options: InfrastructureWaitOptions = {}) => this.wait(operationId, options),
  }
  /** Lifetime holds are independent of operation completion. Null cost remains
   * unknown; this read neither resumes compute nor settles an upstream bill. */
  readonly funding = {
    list: (resourceId: string, args: Omit<InfrastructureInput<'funding.list'>, 'resource_id'> = {}, options: InfrastructureRequestOptions = {}) => this.scoped('funding.list', resourceId, args, options),
    get: (fundingId: string, options: InfrastructureRequestOptions = {}) => this.call('funding.get', { funding_id: uuid(fundingId) }, options),
  }
  /** Every mutation returns a durable operation. Save the caller-chosen key and
   * original arguments before sending; these helpers never retry or raise caps. */
  readonly workspaces = {
    quote: (args: InfrastructureInput<'workspace.quote'> = {}, options: InfrastructureRequestOptions = {}) => this.call('workspace.quote', args, options),
    create: (args: InfrastructureInput<'workspace.create'>, options: InfrastructureRequestOptions = {}) => this.call('workspace.create', args, options),
    resume: async (resourceId: string, args: Omit<InfrastructureInput<'workspace.resume'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.call('workspace.resume', { ...args, resource_id: uuid(resourceId) }, options),
    renew: (resourceId: string, args: Omit<InfrastructureInput<'workspace.renew'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('workspace.renew', resourceId, args, options),
    pause: async (resourceId: string, args: Omit<InfrastructureInput<'workspace.pause'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.call('workspace.pause', { ...args, resource_id: uuid(resourceId) }, options),
    delete: async (resourceId: string, args: Omit<InfrastructureInput<'workspace.delete'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.call('workspace.delete', { ...args, resource_id: uuid(resourceId) }, options),
    files: {
      read: (resourceId: string, args: Omit<InfrastructureInput<'workspace.file.read'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('workspace.file.read', resourceId, args, options),
      list: (resourceId: string, args: Omit<InfrastructureInput<'workspace.file.list'>, 'resource_id'> = {}, options: InfrastructureRequestOptions = {}) => this.scoped('workspace.file.list', resourceId, args, options),
      stat: (resourceId: string, path: string, options: InfrastructureRequestOptions = {}) => this.scoped('workspace.file.stat', resourceId, { path }, options),
      write: (resourceId: string, args: Omit<InfrastructureInput<'workspace.file.write'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('workspace.file.write', resourceId, args, options),
      rename: (resourceId: string, args: Omit<InfrastructureInput<'workspace.file.rename'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('workspace.file.rename', resourceId, args, options),
      delete: (resourceId: string, args: Omit<InfrastructureInput<'workspace.file.delete'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('workspace.file.delete', resourceId, args, options),
      mkdir: (resourceId: string, args: Omit<InfrastructureInput<'workspace.directory.create'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('workspace.directory.create', resourceId, args, options),
    },
    commands: {
      start: (resourceId: string, args: Omit<InfrastructureInput<'workspace.command.start'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('workspace.command.start', resourceId, args, options),
      output: (resourceId: string, args: Omit<InfrastructureInput<'workspace.command.output'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('workspace.command.output', resourceId, args, options),
      input: (resourceId: string, args: Omit<InfrastructureInput<'workspace.command.input'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('workspace.command.input', resourceId, args, options),
      close: (resourceId: string, args: Omit<InfrastructureInput<'workspace.command.close'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('workspace.command.close', resourceId, args, options),
      stop: (resourceId: string, args: Omit<InfrastructureInput<'workspace.command.stop'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('workspace.command.stop', resourceId, args, options),
    },
    processes: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.scoped('workspace.process.list', resourceId, {}, options),
    preview: (resourceId: string, args: Omit<InfrastructureInput<'workspace.preview'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('workspace.preview', resourceId, args, options),
  }
  readonly mail = {
    pricing: (options: InfrastructureRequestOptions = {}) => this.call('mail.pricing', {}, options),
    createInbox: (args: InfrastructureInput<'mail.inbox.create'>, options: InfrastructureRequestOptions = {}) => this.call('mail.inbox.create', args, options),
    renewInbox: (resourceId: string, args: Omit<InfrastructureInput<'mail.inbox.renew'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.inbox.renew', resourceId, args, options),
    billing: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.scoped('mail.billing.status', resourceId, {}, options),
    metrics: {
      usage: (resourceId: string, args: Omit<InfrastructureInput<'mail.metrics.usage'>, 'resource_id'> = {}, options: InfrastructureRequestOptions = {}) => this.scoped('mail.metrics.usage', resourceId, args, options),
      events: (resourceId: string, args: Omit<InfrastructureInput<'mail.metrics.events'>, 'resource_id'> = {}, options: InfrastructureRequestOptions = {}) => this.scoped('mail.metrics.events', resourceId, args, options),
    },
    delivery: {
      status: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.scoped('mail.delivery.status', resourceId, {}, options),
      list: (resourceId: string, args: Omit<InfrastructureInput<'mail.delivery.event.list'>, 'resource_id'> = {}, options: InfrastructureRequestOptions = {}) => this.scoped('mail.delivery.event.list', resourceId, args, options),
      get: (resourceId: string, args: Omit<InfrastructureInput<'mail.delivery.event.get'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.delivery.event.get', resourceId, args, options),
    },
    pause: (resourceId: string, args: Omit<InfrastructureInput<'mail.inbox.pause'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.inbox.pause', resourceId, args, options),
    resume: (resourceId: string, args: Omit<InfrastructureInput<'mail.inbox.resume'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.inbox.resume', resourceId, args, options),
    deleteInbox: (resourceId: string, args: Omit<InfrastructureInput<'mail.inbox.delete'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.inbox.delete', resourceId, args, options),
    inbox: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.scoped('mail.inbox', resourceId, {}, options),
    labelEvents: (resourceId: string, args: Omit<InfrastructureInput<'mail.label.event.list'>, 'resource_id'> = {}, options: InfrastructureRequestOptions = {}) => this.scoped('mail.label.event.list', resourceId, args, options),
    messages: {
      list: (resourceId: string, args: Omit<InfrastructureInput<'mail.message.list'>, 'resource_id'> = {}, options: InfrastructureRequestOptions = {}) => this.scoped('mail.message.list', resourceId, args, options),
      get: (resourceId: string, args: Omit<InfrastructureInput<'mail.message.get'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.message.get', resourceId, args, options),
      attachment: (resourceId: string, args: Omit<InfrastructureInput<'mail.message.attachment'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.message.attachment', resourceId, args, options),
      delete: (resourceId: string, args: Omit<InfrastructureInput<'mail.message.delete'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.message.delete', resourceId, args, options),
      labels: (resourceId: string, args: Omit<InfrastructureInput<'mail.message.labels'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.message.labels', resourceId, args, options),
    },
    drafts: {
      list: (resourceId: string, args: Omit<InfrastructureInput<'mail.draft.list'>, 'resource_id'> = {}, options: InfrastructureRequestOptions = {}) => this.scoped('mail.draft.list', resourceId, args, options),
      get: (resourceId: string, args: Omit<InfrastructureInput<'mail.draft.get'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.draft.get', resourceId, args, options),
      attachment: (resourceId: string, args: Omit<InfrastructureInput<'mail.draft.attachment'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.draft.attachment', resourceId, args, options),
      create: (resourceId: string, args: Omit<InfrastructureInput<'mail.draft.create'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.draft.create', resourceId, args, options),
      update: (resourceId: string, args: Omit<InfrastructureInput<'mail.draft.update'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.draft.update', resourceId, args, options),
      send: (resourceId: string, args: Omit<InfrastructureInput<'mail.draft.send'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.draft.send', resourceId, args, options),
      delete: (resourceId: string, args: Omit<InfrastructureInput<'mail.draft.delete'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.draft.delete', resourceId, args, options),
    },
    threads: {
      list: (resourceId: string, args: Omit<InfrastructureInput<'mail.thread.list'>, 'resource_id'> = {}, options: InfrastructureRequestOptions = {}) => this.scoped('mail.thread.list', resourceId, args, options),
      get: (resourceId: string, args: Omit<InfrastructureInput<'mail.thread.get'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.thread.get', resourceId, args, options),
      labels: (resourceId: string, args: Omit<InfrastructureInput<'mail.thread.labels'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('mail.thread.labels', resourceId, args, options),
    },
  }
  readonly deployments = {
    create: (args: InfrastructureInput<'deployment.create'>, options: InfrastructureRequestOptions = {}) => this.call('deployment.create', args, options),
    resume: (resourceId: string, args: Omit<InfrastructureInput<'deployment.resume'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.resume', resourceId, args, options),
    pause: (resourceId: string, args: Omit<InfrastructureInput<'deployment.pause'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.pause', resourceId, args, options),
    renew: (resourceId: string, args: Omit<InfrastructureInput<'deployment.renew'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.renew', resourceId, args, options),
    configure: (resourceId: string, args: Omit<InfrastructureInput<'deployment.configure'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.configure', resourceId, args, options),
    upload: (resourceId: string, args: Omit<InfrastructureInput<'deployment.upload'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.upload', resourceId, args, options),
    promote: (resourceId: string, args: Omit<InfrastructureInput<'deployment.promote'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.promote', resourceId, args, options),
    rollback: (resourceId: string, args: Omit<InfrastructureInput<'deployment.rollback'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.rollback', resourceId, args, options),
    remove: (resourceId: string, args: Omit<InfrastructureInput<'deployment.remove'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.remove', resourceId, args, options),
    delete: (resourceId: string, args: Omit<InfrastructureInput<'deployment.delete'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.delete', resourceId, args, options),
    setEnvironment: (resourceId: string, args: Omit<InfrastructureInput<'deployment.environment.set'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.environment.set', resourceId, args, options),
    removeEnvironment: (resourceId: string, args: Omit<InfrastructureInput<'deployment.environment.delete'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.environment.delete', resourceId, args, options),
    project: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.project', resourceId, {}, options),
    list: (resourceId: string, args: Omit<InfrastructureInput<'deployment.list'>, 'resource_id'> = {}, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.list', resourceId, args, options),
    get: (resourceId: string, deploymentId: string, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.get', resourceId, { deployment_id: deploymentId }, options),
    logs: (resourceId: string, deploymentId: string, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.logs', resourceId, { deployment_id: deploymentId }, options),
    environment: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.scoped('deployment.environment.list', resourceId, {}, options),
  }
  readonly workers = {
    create: (args: InfrastructureInput<'worker.create'>, options: InfrastructureRequestOptions = {}) => this.call('worker.create', args, options),
    resume: (resourceId: string, args: Omit<InfrastructureInput<'worker.resume'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.resume', resourceId, args, options),
    renew: (resourceId: string, args: Omit<InfrastructureInput<'worker.renew'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.renew', resourceId, args, options),
    delete: (resourceId: string, args: Omit<InfrastructureInput<'worker.delete'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.delete', resourceId, args, options),
    execute: (resourceId: string, args: Omit<InfrastructureInput<'worker.execute'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.execute', resourceId, args, options),
    app: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.scoped('worker.app', resourceId, {}, options),
    images: {
      retention: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.scoped('worker.image.retention', resourceId, {}, options),
      inspect: (resourceId: string, image: string, options: InfrastructureRequestOptions = {}) => this.scoped('worker.image.inspect', resourceId, { image }, options),
      blob: (resourceId: string, digest: string, options: InfrastructureRequestOptions = {}) => this.scoped('worker.image.blob.inspect', resourceId, { digest }, options),
      publish: (resourceId: string, args: Omit<InfrastructureInput<'worker.image.publish'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.image.publish', resourceId, args, options),
      delete: (resourceId: string, args: Omit<InfrastructureInput<'worker.image.delete'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.image.delete', resourceId, args, options),
      uploads: {
        list: (resourceId: string, args: Omit<InfrastructureInput<'worker.image.upload.list'>, 'resource_id'> = {}, options: InfrastructureRequestOptions = {}) => this.scoped('worker.image.upload.list', resourceId, args, options),
        get: (resourceId: string, uploadId: string, options: InfrastructureRequestOptions = {}) => this.scoped('worker.image.upload.get', resourceId, { upload_id: uploadId }, options),
        begin: (resourceId: string, args: Omit<InfrastructureInput<'worker.image.upload.begin'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.image.upload.begin', resourceId, args, options),
        chunk: (resourceId: string, args: Omit<InfrastructureInput<'worker.image.upload.chunk'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.image.upload.chunk', resourceId, args, options),
        complete: (resourceId: string, args: Omit<InfrastructureInput<'worker.image.upload.complete'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.image.upload.complete', resourceId, args, options),
        cancel: (resourceId: string, args: Omit<InfrastructureInput<'worker.image.upload.cancel'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.image.upload.cancel', resourceId, args, options),
        abandon: (resourceId: string, args: Omit<InfrastructureInput<'worker.image.upload.abandon'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.image.upload.abandon', resourceId, args, options),
      },
    },
    logs: (resourceId: string, args: Omit<InfrastructureInput<'worker.logs'>, 'resource_id'> = {}, options: InfrastructureRequestOptions = {}) => this.scoped('worker.logs', resourceId, args, options),
    volumes: {
      list: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.scoped('worker.volume.list', resourceId, {}, options),
      get: (resourceId: string, volumeId: string, options: InfrastructureRequestOptions = {}) => this.scoped('worker.volume.get', resourceId, { volume_id: volumeId }, options),
      create: (resourceId: string, args: Omit<InfrastructureInput<'worker.volume.create'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.volume.create', resourceId, args, options),
      extend: (resourceId: string, args: Omit<InfrastructureInput<'worker.volume.extend'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.volume.extend', resourceId, args, options),
      delete: (resourceId: string, args: Omit<InfrastructureInput<'worker.volume.delete'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.volume.delete', resourceId, args, options),
    },
    ips: {
      list: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.scoped('worker.ip.list', resourceId, {}, options),
      allocate: (resourceId: string, args: Omit<InfrastructureInput<'worker.ip.allocate'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.ip.allocate', resourceId, args, options),
      release: (resourceId: string, args: Omit<InfrastructureInput<'worker.ip.release'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.ip.release', resourceId, args, options),
    },
    machines: {
      create: (resourceId: string, args: Omit<InfrastructureInput<'worker.machine.create'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.machine.create', resourceId, args, options),
      update: (resourceId: string, args: Omit<InfrastructureInput<'worker.machine.update'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.machine.update', resourceId, args, options),
      start: (resourceId: string, args: Omit<InfrastructureInput<'worker.machine.start'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.machine.start', resourceId, args, options),
      stop: (resourceId: string, args: Omit<InfrastructureInput<'worker.machine.stop'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.machine.stop', resourceId, args, options),
      restart: (resourceId: string, args: Omit<InfrastructureInput<'worker.machine.restart'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.machine.restart', resourceId, args, options),
      delete: (resourceId: string, args: Omit<InfrastructureInput<'worker.machine.delete'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('worker.machine.delete', resourceId, args, options),
      list: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.scoped('worker.machine.list', resourceId, {}, options),
      get: (resourceId: string, machineId: string, options: InfrastructureRequestOptions = {}) => this.scoped('worker.machine.get', resourceId, { machine_id: machineId }, options),
      events: (resourceId: string, machineId: string, options: InfrastructureRequestOptions = {}) => this.scoped('worker.machine.events', resourceId, { machine_id: machineId }, options),
    },
  }
  readonly databases = {
    create: (args: InfrastructureInput<'database.create'>, options: InfrastructureRequestOptions = {}) => this.call('database.create', args, options),
    renew: (resourceId: string, args: Omit<InfrastructureInput<'database.renew'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('database.renew', resourceId, args, options),
    resume: (resourceId: string, args: Omit<InfrastructureInput<'database.resume'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('database.resume', resourceId, args, options),
    pause: (resourceId: string, args: Omit<InfrastructureInput<'database.pause'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('database.pause', resourceId, args, options),
    delete: (resourceId: string, args: Omit<InfrastructureInput<'database.delete'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('database.delete', resourceId, args, options),
    write: (resourceId: string, args: Omit<InfrastructureInput<'database.write'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('database.write', resourceId, args, options),
    applyMigration: (resourceId: string, args: Omit<InfrastructureInput<'database.migration.apply'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('database.migration.apply', resourceId, args, options),
    project: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.scoped('database.project', resourceId, {}, options),
    query: <T = unknown>(resourceId: string, args: Omit<InfrastructureInput<'database.query'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('database.query', resourceId, args, options) as Promise<T>,
    migrations: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.scoped('database.migration.list', resourceId, {}, options),
    buckets: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.scoped('database.bucket.list', resourceId, {}, options),
    storage: {
      buckets: {
        get: (resourceId: string, bucketId: string, options: InfrastructureRequestOptions = {}) => this.scoped('database.bucket.get', resourceId, { bucket_id: bucketId }, options),
        create: (resourceId: string, args: Omit<InfrastructureInput<'database.bucket.create'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('database.bucket.create', resourceId, args, options),
        configure: (resourceId: string, args: Omit<InfrastructureInput<'database.bucket.configure'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('database.bucket.configure', resourceId, args, options),
        delete: (resourceId: string, args: Omit<InfrastructureInput<'database.bucket.delete'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('database.bucket.delete', resourceId, args, options),
      },
      objects: {
        list: (resourceId: string, args: Omit<InfrastructureInput<'database.object.list'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('database.object.list', resourceId, args, options),
        read: (resourceId: string, args: Omit<InfrastructureInput<'database.object.read'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('database.object.read', resourceId, args, options),
        write: (resourceId: string, args: Omit<InfrastructureInput<'database.object.write'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('database.object.write', resourceId, args, options),
        delete: (resourceId: string, args: Omit<InfrastructureInput<'database.object.delete'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('database.object.delete', resourceId, args, options),
        downloadLink: (resourceId: string, args: Omit<InfrastructureInput<'database.object.download.link'>, 'resource_id'>, options: InfrastructureRequestOptions = {}) => this.scoped('database.object.download.link', resourceId, args, options),
      },
    },
    connection: (resourceId: string, options: InfrastructureRequestOptions = {}) => this.scoped('database.connection', resourceId, {}, options),
  }
  private async wait(operationId: string, options: InfrastructureWaitOptions): Promise<InfrastructureOperation> {
    operationId = uuid(operationId)
    const timeout = bound(options.timeoutMs ?? 300_000, 'timeoutMs', 1, 86_400_000)
    const interval = bound(options.pollIntervalMs ?? 1000, 'pollIntervalMs', 100, 30_000)
    const retries = bound(options.maxReadRetries ?? 3, 'maxReadRetries', 0, 20)
    const controller = new AbortController()
    const onAbort = () => controller.abort()
    options.signal?.addEventListener('abort', onAbort, { once: true })
    if (options.signal?.aborted) controller.abort()
    let timedOut = false
    const timer = setTimeout(() => { timedOut = true; controller.abort() }, timeout)
    let lastKnown: InfrastructureOperation | null = null
    let errors = 0
    try {
      for (;;) {
        if (controller.signal.aborted) throw aborted()
        let delay = interval
        try {
          const result = await this.operations.get(operationId, { signal: controller.signal })
          if (!object(result) || result.id !== operationId || !['queued', 'dispatched', 'running', 'reconciling', 'succeeded', 'failed', 'cancelled'].includes(result.state)) throw invalidResponse()
          lastKnown = result
          errors = 0
          if (['succeeded', 'failed', 'cancelled'].includes(result.state)) return result
          if (typeof result.retry_after_seconds === 'number' && Number.isFinite(result.retry_after_seconds)) delay = Math.max(delay, Math.min(86_400_000, Math.max(0, result.retry_after_seconds) * 1000))
        } catch (error) {
          if (!(error instanceof OrbioError) || !error.retryable || ++errors > retries) throw error
          delay = Math.max(delay, Math.min(86_400_000, (error.retryAfter ?? 3) * 1000))
        }
        await sleep(delay, controller.signal)
      }
    } catch (error) {
      if (options.signal?.aborted) throw aborted()
      if (timedOut) throw new InfrastructureWaitTimeout(operationId, lastKnown)
      throw error
    } finally {
      clearTimeout(timer)
      options.signal?.removeEventListener('abort', onAbort)
    }
  }
}

/** Standalone infra client needs no chain manifest, wallet or broad gateway key. */
export const createInfrastructure = (options: InfrastructureOptions = {}): Infrastructure => new Infrastructure(new Http({
  baseUrl: (options.baseUrl ?? process.env.ORBIO_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, ''),
  apiKey: options.apiKey ?? process.env.ORBIO_INFRA_KEY, fetch: options.fetch, timeoutMs: options.timeoutMs ?? 30_000,
}))
