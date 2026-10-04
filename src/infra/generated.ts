/** Generated from the platform catalogue. Schema revision: 8fbef1704b118a4b7aaffab57d5234569a614bb8f64821630ca7b49d66c21fe0. Do not edit. */

export interface InfrastructureContracts {
  inputs: {
    'infra.status': Record<string, never>
    'resource.list': {
      limit?: number
      before?: string
    }
    'resource.get': {
      resource_id: string
    }
    'operation.list': {
      limit?: number
      before?: string
    }
    'operation.get': {
      operation_id: string
    }
    'workspace.quote': {
      timeout_seconds?: number
    }
    'workspace.create': {
      idempotency_key: string
      max_cost: string
      name: string
      timeout_seconds?: number
      on_grant_revocation?: 'finish_window' | 'stop'
    }
    'workspace.resume': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      timeout_seconds?: number
      on_grant_revocation?: 'finish_window' | 'stop'
    }
    'workspace.pause': {
      idempotency_key: string
      max_cost: string
      resource_id: string
    }
    'workspace.delete': {
      idempotency_key: string
      max_cost: string
      resource_id: string
    }
  }
  results: {
    'infra.status': {
      project: {
        id: string
        name: string
        budget_micro_usd: number
        reserved_micro_usd: number
        spent_micro_usd: number
        created_at: string
      }
      agent: {
        id: string
        project_id: string
        name: string
        created_at: string
      }
      permissions: string[]
      providers: {
        e2b: boolean
        fly: boolean
        vercel: boolean
        supabase: boolean
        agentmail: boolean
      }
      setup_url: string
    }
    'resource.list': {
      items: {
        id: string
        project_id: string
        agent_id: string
        kind: 'workspace' | 'deployment' | 'worker' | 'database' | 'inbox'
        provider: 'e2b' | 'vercel' | 'fly' | 'supabase' | 'agentmail'
        name: string
        provider_id: string | null
        state:
          'provisioning' | 'ready' | 'running' | 'paused' | 'stopped' | 'deleting' | 'deleted' | 'error' | 'unknown'
        metadata: {
          [k: string]: unknown
        }
        expires_at: string | null
        created_at: string
        updated_at: string
        deleted_at: string | null
      }[]
      next_cursor: string | null
    }
    'resource.get': {
      id: string
      project_id: string
      agent_id: string
      kind: 'workspace' | 'deployment' | 'worker' | 'database' | 'inbox'
      provider: 'e2b' | 'vercel' | 'fly' | 'supabase' | 'agentmail'
      name: string
      provider_id: string | null
      state: 'provisioning' | 'ready' | 'running' | 'paused' | 'stopped' | 'deleting' | 'deleted' | 'error' | 'unknown'
      metadata: {
        [k: string]: unknown
      }
      expires_at: string | null
      created_at: string
      updated_at: string
      deleted_at: string | null
    }
    'operation.list': {
      items: {
        id: string
        project_id: string
        agent_id: string
        resource_id: string | null
        action: string
        permission: string
        state: 'queued' | 'dispatched' | 'running' | 'reconciling' | 'succeeded' | 'failed' | 'cancelled'
        billing_state: 'held' | 'settled' | 'released'
        reserved_micro_usd: number
        charged_micro_usd: number | null
        upstream_micro_usd: number | null
        provider_id: string | null
        error_code: string | null
        created_at: string
        updated_at: string
        completed_at: string | null
        result?: unknown
        retry_after_seconds: number | null
      }[]
      next_cursor: string | null
    }
    'operation.get': {
      id: string
      project_id: string
      agent_id: string
      resource_id: string | null
      action: string
      permission: string
      state: 'queued' | 'dispatched' | 'running' | 'reconciling' | 'succeeded' | 'failed' | 'cancelled'
      billing_state: 'held' | 'settled' | 'released'
      reserved_micro_usd: number
      charged_micro_usd: number | null
      upstream_micro_usd: number | null
      provider_id: string | null
      error_code: string | null
      created_at: string
      updated_at: string
      completed_at: string | null
      result?: unknown
      retry_after_seconds: number | null
    }
    'workspace.quote': {
      timeout_seconds: number
      reserve_micro_usd: number
      suggested_max_cost: string
      cpu_count: number
      memory_mb: number
      margin_bps: number
      tariff_version: string
    }
    'workspace.create': {
      id: string
      project_id: string
      agent_id: string
      resource_id: string | null
      action: string
      permission: string
      state: 'queued' | 'dispatched' | 'running' | 'reconciling' | 'succeeded' | 'failed' | 'cancelled'
      billing_state: 'held' | 'settled' | 'released'
      reserved_micro_usd: number
      charged_micro_usd: number | null
      upstream_micro_usd: number | null
      provider_id: string | null
      error_code: string | null
      created_at: string
      updated_at: string
      completed_at: string | null
      result?: unknown
      retry_after_seconds: number | null
    }
    'workspace.resume': {
      id: string
      project_id: string
      agent_id: string
      resource_id: string | null
      action: string
      permission: string
      state: 'queued' | 'dispatched' | 'running' | 'reconciling' | 'succeeded' | 'failed' | 'cancelled'
      billing_state: 'held' | 'settled' | 'released'
      reserved_micro_usd: number
      charged_micro_usd: number | null
      upstream_micro_usd: number | null
      provider_id: string | null
      error_code: string | null
      created_at: string
      updated_at: string
      completed_at: string | null
      result?: unknown
      retry_after_seconds: number | null
    }
    'workspace.pause': {
      id: string
      project_id: string
      agent_id: string
      resource_id: string | null
      action: string
      permission: string
      state: 'queued' | 'dispatched' | 'running' | 'reconciling' | 'succeeded' | 'failed' | 'cancelled'
      billing_state: 'held' | 'settled' | 'released'
      reserved_micro_usd: number
      charged_micro_usd: number | null
      upstream_micro_usd: number | null
      provider_id: string | null
      error_code: string | null
      created_at: string
      updated_at: string
      completed_at: string | null
      result?: unknown
      retry_after_seconds: number | null
    }
    'workspace.delete': {
      id: string
      project_id: string
      agent_id: string
      resource_id: string | null
      action: string
      permission: string
      state: 'queued' | 'dispatched' | 'running' | 'reconciling' | 'succeeded' | 'failed' | 'cancelled'
      billing_state: 'held' | 'settled' | 'released'
      reserved_micro_usd: number
      charged_micro_usd: number | null
      upstream_micro_usd: number | null
      provider_id: string | null
      error_code: string | null
      created_at: string
      updated_at: string
      completed_at: string | null
      result?: unknown
      retry_after_seconds: number | null
    }
  }
}

export type InfrastructureToolName = keyof InfrastructureContracts['inputs']
export type InfrastructureInput<K extends InfrastructureToolName> = InfrastructureContracts['inputs'][K]
export type InfrastructureResult<K extends InfrastructureToolName> = InfrastructureContracts['results'][K]
export type InfrastructureOverview = InfrastructureResult<'infra.status'>
export type InfrastructureResource = InfrastructureResult<'resource.get'>
export type InfrastructureOperation = InfrastructureResult<'operation.get'>
export const INFRA_SCHEMA_REVISION = '8fbef1704b118a4b7aaffab57d5234569a614bb8f64821630ca7b49d66c21fe0'
export const READ_ONLY_INFRASTRUCTURE_TOOLS: readonly string[] = Object.freeze(["infra.status","resource.list","resource.get","operation.list","operation.get","workspace.quote"])
