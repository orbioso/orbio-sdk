/** Generated from the platform catalogue. Schema revision: a9d932db2be1c3506d5c4971f4e4395e128d3b0a9f6e9e9d591f096c4c5623f7. Do not edit. */

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
  }
}

export type InfrastructureToolName = keyof InfrastructureContracts['inputs']
export type InfrastructureInput<K extends InfrastructureToolName> = InfrastructureContracts['inputs'][K]
export type InfrastructureResult<K extends InfrastructureToolName> = InfrastructureContracts['results'][K]
export type InfrastructureOverview = InfrastructureResult<'infra.status'>
export type InfrastructureResource = InfrastructureResult<'resource.get'>
export type InfrastructureOperation = InfrastructureResult<'operation.get'>
export const INFRA_SCHEMA_REVISION = 'a9d932db2be1c3506d5c4971f4e4395e128d3b0a9f6e9e9d591f096c4c5623f7'
export const READ_ONLY_INFRASTRUCTURE_TOOLS: readonly string[] = Object.freeze(["infra.status","resource.list","resource.get","operation.list","operation.get"])
