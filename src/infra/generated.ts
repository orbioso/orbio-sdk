/** Generated from the platform catalogue. Schema revision: 04b63ed28a0060d0d23f1e9770b4a513f546f5e9abd36a46e5f960b4064e995f. Do not edit. */

export interface InfrastructureContracts {
  inputs: {
    'infra.status': Record<string, never>
    'infra.pricing': Record<string, never>
    'resource.list': {
      limit?: number
      before?: string
    }
    'resource.get': {
      resource_id: string
    }
    'resource.spending': {
      resource_id: string
    }
    'operation.list': {
      limit?: number
      before?: string
    }
    'operation.get': {
      operation_id: string
    }
    'operation.cancel': {
      operation_id: string
    }
    'funding.list': {
      resource_id: string
      limit?: number
      before?: string
    }
    'funding.get': {
      funding_id: string
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
    'workspace.renew': {
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
    'workspace.file.read': {
      resource_id: string
      path: string
      maximum_bytes?: number
    }
    'workspace.file.list': {
      resource_id: string
      path?: string
    }
    'workspace.file.stat': {
      resource_id: string
      path: string
    }
    'workspace.process.list': {
      resource_id: string
    }
    'workspace.command.output': {
      resource_id: string
      command_operation_id: string
      maximum_bytes?: number
    }
    'workspace.preview': {
      resource_id: string
      port: number
      path?: string
    }
    'workspace.file.write': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      path: string
      content: string
      format?: 'text' | 'base64'
    }
    'workspace.directory.create': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      path: string
    }
    'workspace.file.rename': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      source: string
      destination: string
    }
    'workspace.file.delete': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      path: string
    }
    'workspace.command.start': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      command: string
      cwd?: string
      env?: {
        [k: string]: string
      }
      stdin?: boolean
      timeout_seconds?: number
    }
    'workspace.command.input': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      command_operation_id: string
      text: string
    }
    'workspace.command.close': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      command_operation_id: string
    }
    'workspace.command.stop': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      command_operation_id: string
    }
    'mail.delivery.status': {
      resource_id: string
    }
    'mail.delivery.event.list': {
      resource_id: string
      limit?: number
      cursor?: string
      message_id?: string
    }
    'mail.delivery.event.get': {
      resource_id: string
      delivery_id: string
    }
    'mail.inbox': {
      resource_id: string
    }
    'mail.metrics.usage': {
      resource_id: string
      start?: string
      end?: string
      period_seconds?: 60 | 3600 | 86400
      /**
       * @minItems 1
       * @maxItems 3
       */
      types?:
        | ['storage_bytes' | 'message_count' | 'thread_count']
        | ['storage_bytes' | 'message_count' | 'thread_count', 'storage_bytes' | 'message_count' | 'thread_count']
        | [
            'storage_bytes' | 'message_count' | 'thread_count',
            'storage_bytes' | 'message_count' | 'thread_count',
            'storage_bytes' | 'message_count' | 'thread_count'
          ]
    }
    'mail.metrics.events': {
      resource_id: string
      start?: string
      end?: string
      period_seconds?: 60 | 3600 | 86400
      /**
       * @minItems 1
       * @maxItems 4
       */
      types?:
        | [
            | 'message.received'
            | 'message.received.spam'
            | 'message.received.blocked'
            | 'message.received.unauthenticated'
            | 'message.sent'
            | 'message.delivered'
            | 'message.bounced'
            | 'message.complained'
            | 'message.rejected'
          ]
        | [
            (
              | 'message.received'
              | 'message.received.spam'
              | 'message.received.blocked'
              | 'message.received.unauthenticated'
              | 'message.sent'
              | 'message.delivered'
              | 'message.bounced'
              | 'message.complained'
              | 'message.rejected'
            ),
            (
              | 'message.received'
              | 'message.received.spam'
              | 'message.received.blocked'
              | 'message.received.unauthenticated'
              | 'message.sent'
              | 'message.delivered'
              | 'message.bounced'
              | 'message.complained'
              | 'message.rejected'
            )
          ]
        | [
            (
              | 'message.received'
              | 'message.received.spam'
              | 'message.received.blocked'
              | 'message.received.unauthenticated'
              | 'message.sent'
              | 'message.delivered'
              | 'message.bounced'
              | 'message.complained'
              | 'message.rejected'
            ),
            (
              | 'message.received'
              | 'message.received.spam'
              | 'message.received.blocked'
              | 'message.received.unauthenticated'
              | 'message.sent'
              | 'message.delivered'
              | 'message.bounced'
              | 'message.complained'
              | 'message.rejected'
            ),
            (
              | 'message.received'
              | 'message.received.spam'
              | 'message.received.blocked'
              | 'message.received.unauthenticated'
              | 'message.sent'
              | 'message.delivered'
              | 'message.bounced'
              | 'message.complained'
              | 'message.rejected'
            )
          ]
        | [
            (
              | 'message.received'
              | 'message.received.spam'
              | 'message.received.blocked'
              | 'message.received.unauthenticated'
              | 'message.sent'
              | 'message.delivered'
              | 'message.bounced'
              | 'message.complained'
              | 'message.rejected'
            ),
            (
              | 'message.received'
              | 'message.received.spam'
              | 'message.received.blocked'
              | 'message.received.unauthenticated'
              | 'message.sent'
              | 'message.delivered'
              | 'message.bounced'
              | 'message.complained'
              | 'message.rejected'
            ),
            (
              | 'message.received'
              | 'message.received.spam'
              | 'message.received.blocked'
              | 'message.received.unauthenticated'
              | 'message.sent'
              | 'message.delivered'
              | 'message.bounced'
              | 'message.complained'
              | 'message.rejected'
            ),
            (
              | 'message.received'
              | 'message.received.spam'
              | 'message.received.blocked'
              | 'message.received.unauthenticated'
              | 'message.sent'
              | 'message.delivered'
              | 'message.bounced'
              | 'message.complained'
              | 'message.rejected'
            )
          ]
    }
    'mail.label.event.list': {
      resource_id: string
      limit?: number
      cursor?: string
    }
    'mail.message.list': {
      resource_id: string
      limit?: number
      cursor?: string
      before?: string
      after?: string
      subject?: string
      from?: string
      to?: string
    }
    'mail.message.get': {
      resource_id: string
      message_id: string
      maximum_body_characters?: number
    }
    'mail.draft.list': {
      resource_id: string
      limit?: number
      cursor?: string
    }
    'mail.draft.get': {
      resource_id: string
      draft_id: string
      maximum_body_characters?: number
    }
    'mail.thread.list': {
      resource_id: string
      limit?: number
      cursor?: string
    }
    'mail.thread.get': {
      resource_id: string
      thread_id: string
      limit?: number
      cursor?: string
    }
    'mail.message.attachment': {
      resource_id: string
      message_id: string
      attachment_id: string
    }
    'mail.draft.attachment': {
      resource_id: string
      draft_id: string
      attachment_id: string
    }
    'deployment.project': {
      resource_id: string
    }
    'deployment.list': {
      resource_id: string
      limit?: number
      until?: number
    }
    'deployment.get': {
      resource_id: string
      deployment_id: string
    }
    'deployment.logs': {
      resource_id: string
      deployment_id: string
    }
    'deployment.environment.list': {
      resource_id: string
    }
    'worker.app': {
      resource_id: string
    }
    'worker.image.retention': {
      resource_id: string
    }
    'worker.image.upload.list': {
      resource_id: string
      limit?: number
      before?: string
    }
    'worker.image.upload.get': {
      resource_id: string
      upload_id: string
    }
    'worker.image.blob.inspect': {
      resource_id: string
      digest: string
    }
    'worker.image.inspect': {
      resource_id: string
      image: string
    }
    'worker.volume.list': {
      resource_id: string
    }
    'worker.volume.get': {
      resource_id: string
      volume_id: string
    }
    'worker.ip.list': {
      resource_id: string
    }
    'worker.logs': {
      resource_id: string
      machine_id?: string
      cursor?: string
      maximum_bytes?: number
    }
    'worker.machine.list': {
      resource_id: string
    }
    'worker.machine.get': {
      resource_id: string
      machine_id: string
    }
    'worker.machine.events': {
      resource_id: string
      machine_id: string
    }
    'database.project': {
      resource_id: string
    }
    'database.query': {
      resource_id: string
      query: string
      /**
       * @maxItems 100
       */
      parameters?: unknown[]
    }
    'database.migration.list': {
      resource_id: string
    }
    'database.bucket.list': {
      resource_id: string
    }
    'database.bucket.get': {
      resource_id: string
      bucket_id: string
    }
    'database.object.list': {
      resource_id: string
      bucket_id: string
      prefix?: string
      limit?: number
      offset?: number
    }
    'database.object.read': {
      resource_id: string
      bucket_id: string
      path: string
      maximum_bytes?: number
    }
    'database.connection': {
      resource_id: string
    }
    'deployment.create': {
      idempotency_key: string
      max_cost: string
      lifetime_seconds?: number
      on_grant_revocation?: 'finish_window' | 'stop'
      name: string
    }
    'worker.create': {
      idempotency_key: string
      max_cost: string
      lifetime_seconds?: number
      on_grant_revocation?: 'finish_window' | 'stop'
      name: string
    }
    'database.create': {
      idempotency_key: string
      max_cost: string
      lifetime_seconds?: number
      on_grant_revocation?: 'finish_window' | 'stop'
      name: string
      region: string
    }
    'database.resume': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      lifetime_seconds?: number
      on_grant_revocation?: 'finish_window' | 'stop'
    }
    'deployment.resume': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      lifetime_seconds?: number
      on_grant_revocation?: 'finish_window' | 'stop'
    }
    'worker.resume': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      lifetime_seconds?: number
      on_grant_revocation?: 'finish_window' | 'stop'
    }
    'deployment.renew': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      lifetime_seconds?: number
      on_grant_revocation?: 'finish_window' | 'stop'
    }
    'worker.renew': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      lifetime_seconds?: number
      on_grant_revocation?: 'finish_window' | 'stop'
    }
    'database.renew': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      lifetime_seconds?: number
      on_grant_revocation?: 'finish_window' | 'stop'
    }
    'deployment.configure': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      framework?: string | null
      build_command?: string | null
      install_command?: string | null
      root_directory?: string | null
      output_directory?: string | null
    }
    'deployment.upload': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      /**
       * @minItems 1
       * @maxItems 100
       */
      files: [
        {
          path: string
          content_base64: string
        },
        ...{
          path: string
          content_base64: string
        }[]
      ]
    }
    'deployment.environment.set': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      key: string
      value: string
      /**
       * @minItems 1
       * @maxItems 3
       */
      targets?:
        | ['development' | 'preview' | 'production']
        | ['development' | 'preview' | 'production', 'development' | 'preview' | 'production']
        | [
            'development' | 'preview' | 'production',
            'development' | 'preview' | 'production',
            'development' | 'preview' | 'production'
          ]
    }
    'deployment.environment.delete': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      env_id: string
    }
    'deployment.promote': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      deployment_id: string
    }
    'deployment.rollback': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      deployment_id: string
    }
    'deployment.remove': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      deployment_id: string
    }
    'deployment.pause': {
      idempotency_key: string
      max_cost: string
      resource_id: string
    }
    'deployment.delete': {
      idempotency_key: string
      max_cost: string
      resource_id: string
    }
    'worker.image.upload.begin': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      digest: string
      size_bytes: number
    }
    'worker.image.upload.chunk': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      upload_id: string
      offset: number
      content_base64: string
    }
    'worker.image.upload.complete': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      upload_id: string
    }
    'worker.image.upload.cancel': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      upload_id: string
    }
    'worker.image.upload.abandon': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      upload_id: string
    }
    'worker.image.publish': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      digest: string
      manifest_base64: string
    }
    'worker.image.delete': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      digest: string
    }
    'worker.volume.create': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      region: string
      size_gb?: number
      auto_backup_enabled?: boolean
      snapshot_retention?: number
    }
    'worker.volume.extend': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      volume_id: string
      size_gb: number
    }
    'worker.volume.delete': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      volume_id: string
    }
    'worker.ip.allocate': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      type: 'shared_v4' | 'v6'
    }
    'worker.ip.release': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      address: string
    }
    'worker.machine.create': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      image: string
      region: string
      cpu_count?: number
      memory_mb?: number
      /**
       * @maxItems 32
       */
      command?: string[]
      env?: {
        [k: string]: string
      }
      volume?: {
        volume_id: string
        /**
         * Absolute mount path without traversal; create the volume first in this region.
         */
        path: string
      }
      /**
       * Explicit HTTP ingress on ports 80/443 with HTTPS redirect, no proxy autostart. null disables routing; omission preserves routing on updates. App IP allocation is separate.
       */
      http?: {
        internal_port: number
        /**
         * Optional GET health path, for example /health.
         */
        health_path?: string
      } | null
    }
    'worker.machine.update': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      machine_id: string
      configuration: {
        image: string
        region: string
        cpu_count?: number
        memory_mb?: number
        /**
         * @maxItems 32
         */
        command?: string[]
        env?: {
          [k: string]: string
        }
        volume?: {
          volume_id: string
          /**
           * Absolute mount path without traversal; create the volume first in this region.
           */
          path: string
        }
        /**
         * Explicit HTTP ingress on ports 80/443 with HTTPS redirect, no proxy autostart. null disables routing; omission preserves routing on updates. App IP allocation is separate.
         */
        http?: {
          internal_port: number
          /**
           * Optional GET health path, for example /health.
           */
          health_path?: string
        } | null
      }
    }
    'worker.execute': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      machine_id: string
      /**
       * @minItems 1
       * @maxItems 32
       */
      command: [string, ...string[]]
    }
    'worker.delete': {
      idempotency_key: string
      max_cost: string
      resource_id: string
    }
    'database.bucket.create': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      bucket_id: string
      file_size_limit?: number
      /**
       * @minItems 1
       * @maxItems 20
       */
      allowed_mime_types?:
        | [string]
        | [string, string]
        | [string, string, string]
        | [string, string, string, string]
        | [string, string, string, string, string]
        | [string, string, string, string, string, string]
        | [string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string, string]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | null
    }
    'database.bucket.configure': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      bucket_id: string
      file_size_limit?: number
      /**
       * @minItems 1
       * @maxItems 20
       */
      allowed_mime_types?:
        | [string]
        | [string, string]
        | [string, string, string]
        | [string, string, string, string]
        | [string, string, string, string, string]
        | [string, string, string, string, string, string]
        | [string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string, string]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | null
    }
    'database.bucket.delete': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      bucket_id: string
    }
    'database.object.write': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      bucket_id: string
      /**
       * Exact relative object path; no empty/dot/traversal segments, controls, backslash, percent signs, ? or #.
       */
      path: string
      content_base64: string
      content_type?: string
      overwrite?: boolean
    }
    'database.object.delete': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      bucket_id: string
      /**
       * @minItems 1
       * @maxItems 10
       *
       * Items: Exact relative object path; no empty/dot/traversal segments, controls, backslash, percent signs, ? or #.
       */
      paths:
        | [string]
        | [string, string]
        | [string, string, string]
        | [string, string, string, string]
        | [string, string, string, string, string]
        | [string, string, string, string, string, string]
        | [string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string]
    }
    'database.object.download.link': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      bucket_id: string
      /**
       * Exact relative object path; no empty/dot/traversal segments, controls, backslash, percent signs, ? or #.
       */
      path: string
      expires_in_seconds?: number
    }
    'database.write': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      query: string
      /**
       * @maxItems 100
       */
      parameters?: unknown[]
    }
    'database.migration.apply': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      query: string
    }
    'database.pause': {
      idempotency_key: string
      max_cost: string
      resource_id: string
    }
    'database.delete': {
      idempotency_key: string
      max_cost: string
      resource_id: string
    }
    'mail.draft.create': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      /**
       * @maxItems 20
       */
      to?:
        | []
        | [string]
        | [string, string]
        | [string, string, string]
        | [string, string, string, string]
        | [string, string, string, string, string]
        | [string, string, string, string, string, string]
        | [string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string, string]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
      /**
       * @maxItems 20
       */
      cc?:
        | []
        | [string]
        | [string, string]
        | [string, string, string]
        | [string, string, string, string]
        | [string, string, string, string, string]
        | [string, string, string, string, string, string]
        | [string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string, string]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
      /**
       * @maxItems 20
       */
      bcc?:
        | []
        | [string]
        | [string, string]
        | [string, string, string]
        | [string, string, string, string]
        | [string, string, string, string, string]
        | [string, string, string, string, string, string]
        | [string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string, string]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
      subject?: string
      text?: string
      html?: string
      /**
       * @maxItems 10
       */
      attachments?:
        | []
        | [
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            }
          ]
        | [
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            }
          ]
        | [
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            }
          ]
        | [
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            }
          ]
        | [
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            }
          ]
        | [
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            }
          ]
        | [
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            }
          ]
        | [
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            }
          ]
        | [
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            }
          ]
        | [
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            },
            {
              /**
               * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
               */
              content: string
              /**
               * A filename, without directory separators or control characters.
               */
              filename?: string
              /**
               * MIME type without parameters, for example application/pdf.
               */
              content_type?: string
              content_disposition?: 'inline' | 'attachment'
              /**
               * Allowed only with content_disposition:inline.
               */
              content_id?: string
            }
          ]
      in_reply_to?: string
      forward_of?: string
      reply_all?: boolean
    }
    'mail.draft.update': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      draft_id: string
      content: {
        /**
         * @maxItems 20
         */
        to?:
          | []
          | [string]
          | [string, string]
          | [string, string, string]
          | [string, string, string, string]
          | [string, string, string, string, string]
          | [string, string, string, string, string, string]
          | [string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string, string, string, string, string, string]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | null
        /**
         * @maxItems 20
         */
        cc?:
          | []
          | [string]
          | [string, string]
          | [string, string, string]
          | [string, string, string, string]
          | [string, string, string, string, string]
          | [string, string, string, string, string, string]
          | [string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string, string, string, string, string, string]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | null
        /**
         * @maxItems 20
         */
        bcc?:
          | []
          | [string]
          | [string, string]
          | [string, string, string]
          | [string, string, string, string]
          | [string, string, string, string, string]
          | [string, string, string, string, string, string]
          | [string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string, string, string, string, string]
          | [string, string, string, string, string, string, string, string, string, string, string, string, string]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | [
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string,
              string
            ]
          | null
        subject?: string | null
        text?: string | null
        html?: string | null
        /**
         * @maxItems 10
         */
        add_attachments?:
          | []
          | [
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              }
            ]
          | [
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              }
            ]
          | [
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              }
            ]
          | [
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              }
            ]
          | [
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              }
            ]
          | [
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              }
            ]
          | [
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              }
            ]
          | [
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              }
            ]
          | [
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              }
            ]
          | [
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              },
              {
                /**
                 * Canonical base64; at most 64 KiB decoded per file and 96 KiB across the batch. No remote URL.
                 */
                content: string
                /**
                 * A filename, without directory separators or control characters.
                 */
                filename?: string
                /**
                 * MIME type without parameters, for example application/pdf.
                 */
                content_type?: string
                content_disposition?: 'inline' | 'attachment'
                /**
                 * Allowed only with content_disposition:inline.
                 */
                content_id?: string
              }
            ]
        /**
         * @maxItems 100
         */
        remove_attachments?: string[]
      }
    }
    'mail.draft.send': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      draft_id: string
    }
    'worker.machine.start': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      machine_id: string
    }
    'worker.machine.stop': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      machine_id: string
    }
    'worker.machine.restart': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      machine_id: string
    }
    'worker.machine.delete': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      machine_id: string
    }
    'mail.draft.delete': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      draft_id: string
    }
    'mail.message.delete': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      message_id: string
    }
    'mail.message.labels': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      message_id: string
      /**
       * @maxItems 20
       */
      add?:
        | []
        | [string]
        | [string, string]
        | [string, string, string]
        | [string, string, string, string]
        | [string, string, string, string, string]
        | [string, string, string, string, string, string]
        | [string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string, string]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
      /**
       * @maxItems 20
       */
      remove?:
        | []
        | [string]
        | [string, string]
        | [string, string, string]
        | [string, string, string, string]
        | [string, string, string, string, string]
        | [string, string, string, string, string, string]
        | [string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string, string]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
    }
    'mail.thread.labels': {
      idempotency_key: string
      max_cost: string
      resource_id: string
      thread_id: string
      /**
       * @maxItems 20
       */
      add?:
        | []
        | [string]
        | [string, string]
        | [string, string, string]
        | [string, string, string, string]
        | [string, string, string, string, string]
        | [string, string, string, string, string, string]
        | [string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string, string]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
      /**
       * @maxItems 20
       */
      remove?:
        | []
        | [string]
        | [string, string]
        | [string, string, string]
        | [string, string, string, string]
        | [string, string, string, string, string]
        | [string, string, string, string, string, string]
        | [string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string]
        | [string, string, string, string, string, string, string, string, string, string, string, string, string]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
          ]
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
    'infra.pricing': {
      version: 1
      model: 'provider_rates_plus_surcharge'
      margin_bps: number
      agentmail_subscription_payer: 'orbio'
      captured_at_admission: true
      unknown_cost_policy: 'retain_original_reservation'
      supplier_invoice_finality: 'separate_from_customer_charge'
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
    'resource.spending': {
      resource_id: string
      project_id: string
      agent_id: string
      provider: 'e2b' | 'vercel' | 'fly' | 'supabase' | 'agentmail'
      available: boolean
      reported_upstream_micro_usd: string | null
      protective_high_water_micro_usd: string | null
      approved_upstream_capacity_micro_usd: string | null
      periods_observed: number
      periods_expected: number | null
      period_coverage_complete: boolean | null
      captured_at: string | null
      billing_final: false
      budget_exhausted: boolean | null
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
    'operation.cancel': {
      operation: {
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
      cancelled: boolean
      native_cancellation: false
    }
    'funding.list': {
      items: {
        id: string
        operation_id: string
        resource_id: string
        project_id: string
        agent_id: string
        window_start: string
        funded_until: string
        reserved_micro_usd: number
        margin_bps: number
        state: 'prepared' | 'active' | 'stopping' | 'unknown' | 'closed'
        billing_state: 'held' | 'settled' | 'released'
        upstream_micro_usd: number | null
        charged_micro_usd: number | null
        usage_ended_at: string | null
        on_grant_revocation: 'finish_window' | 'stop'
        shutdown_requested_at: string | null
        shutdown_reason:
          'owner_requested' | 'funding_expired' | 'grant_revoked' | 'provider_error' | 'budget_exhausted' | null
        created_at: string
        updated_at: string
        closed_at: string | null
      }[]
      next_cursor: string | null
    }
    'funding.get': {
      id: string
      operation_id: string
      resource_id: string
      project_id: string
      agent_id: string
      window_start: string
      funded_until: string
      reserved_micro_usd: number
      margin_bps: number
      state: 'prepared' | 'active' | 'stopping' | 'unknown' | 'closed'
      billing_state: 'held' | 'settled' | 'released'
      upstream_micro_usd: number | null
      charged_micro_usd: number | null
      usage_ended_at: string | null
      on_grant_revocation: 'finish_window' | 'stop'
      shutdown_requested_at: string | null
      shutdown_reason:
        'owner_requested' | 'funding_expired' | 'grant_revoked' | 'provider_error' | 'budget_exhausted' | null
      created_at: string
      updated_at: string
      closed_at: string | null
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
    'workspace.renew': {
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
    'workspace.file.read': {
      path: string
      content_base64: string
      truncated: boolean
    }
    'workspace.file.list': {
      items: {
        name: string
        path: string
        type: 'file' | 'directory' | 'symlink'
        size: string | null
      }[]
      truncated: boolean
    }
    'workspace.file.stat': {
      name: string
      path: string
      type: 'file' | 'directory' | 'symlink'
      size: string | null
    }
    'workspace.process.list': {
      items: {
        pid: number
        operation_id: string | null
        command: string
      }[]
      truncated: boolean
    }
    'workspace.command.output': {
      pid: number | null
      state: 'exited' | 'unknown'
      exit_code: number | null
      stdout: string
      stderr: string
      truncated: boolean
    }
    'workspace.preview': {
      status: number
      content_type: string | null
      content_base64: string
      truncated: boolean
    }
    'workspace.file.write': {
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
    'workspace.directory.create': {
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
    'workspace.file.rename': {
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
    'workspace.file.delete': {
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
    'workspace.command.start': {
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
    'workspace.command.input': {
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
    'workspace.command.close': {
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
    'workspace.command.stop': {
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
    'mail.delivery.status': {
      resource_id: string
      inbox_id: string
      connected: boolean
      callback_url: string
      webhook_id: string | null
      event_types: (
        | 'message.received'
        | 'message.received.spam'
        | 'message.received.blocked'
        | 'message.received.unauthenticated'
        | 'message.sent'
        | 'message.delivered'
        | 'message.bounced'
        | 'message.complained'
        | 'message.rejected'
        | 'message.opened'
      )[]
      connected_at: string | null
      last_received_at: string | null
      retention_days: 30
    }
    'mail.delivery.event.list': {
      items: {
        delivery_id: string
        resource_id: string
        event_id: string
        event_type:
          | 'message.received'
          | 'message.received.spam'
          | 'message.received.blocked'
          | 'message.received.unauthenticated'
          | 'message.sent'
          | 'message.delivered'
          | 'message.bounced'
          | 'message.complained'
          | 'message.rejected'
          | 'message.opened'
        inbox_id: string
        thread_id: string
        message_id: string
        occurred_at: string
        received_at: string
        recipients: {
          address: string
          status: string | null
        }[]
        reason: string | null
        category: string | null
        subcategory: string | null
      }[]
      next_cursor: string | null
    }
    'mail.delivery.event.get': {
      delivery_id: string
      resource_id: string
      event_id: string
      event_type:
        | 'message.received'
        | 'message.received.spam'
        | 'message.received.blocked'
        | 'message.received.unauthenticated'
        | 'message.sent'
        | 'message.delivered'
        | 'message.bounced'
        | 'message.complained'
        | 'message.rejected'
        | 'message.opened'
      inbox_id: string
      thread_id: string
      message_id: string
      occurred_at: string
      received_at: string
      recipients: {
        address: string
        status: string | null
      }[]
      reason: string | null
      category: string | null
      subcategory: string | null
    }
    'mail.inbox': {
      inbox_id: string
      email: string
      display_name: string | null
      state: 'active' | 'paused'
      created_at: string
      updated_at: string
    }
    'mail.metrics.usage': {
      inbox_id: string
      start: string
      end: string
      period_seconds: 60 | 3600 | 86400
      native_limit: 200
      semantics: 'cumulative_usage'
      coverage: 'unverified'
      billing_final: false
      /**
       * @maxItems 3
       */
      items:
        | []
        | [
            {
              metric: 'storage_bytes' | 'message_count' | 'thread_count'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            }
          ]
        | [
            {
              metric: 'storage_bytes' | 'message_count' | 'thread_count'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            },
            {
              metric: 'storage_bytes' | 'message_count' | 'thread_count'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            }
          ]
        | [
            {
              metric: 'storage_bytes' | 'message_count' | 'thread_count'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            },
            {
              metric: 'storage_bytes' | 'message_count' | 'thread_count'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            },
            {
              metric: 'storage_bytes' | 'message_count' | 'thread_count'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            }
          ]
    }
    'mail.metrics.events': {
      inbox_id: string
      start: string
      end: string
      period_seconds: 60 | 3600 | 86400
      native_limit: 200
      semantics: 'event_count'
      coverage: 'unverified'
      billing_final: false
      /**
       * @maxItems 4
       */
      items:
        | []
        | [
            {
              metric:
                | 'message.received'
                | 'message.received.spam'
                | 'message.received.blocked'
                | 'message.received.unauthenticated'
                | 'message.sent'
                | 'message.delivered'
                | 'message.bounced'
                | 'message.complained'
                | 'message.rejected'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            }
          ]
        | [
            {
              metric:
                | 'message.received'
                | 'message.received.spam'
                | 'message.received.blocked'
                | 'message.received.unauthenticated'
                | 'message.sent'
                | 'message.delivered'
                | 'message.bounced'
                | 'message.complained'
                | 'message.rejected'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            },
            {
              metric:
                | 'message.received'
                | 'message.received.spam'
                | 'message.received.blocked'
                | 'message.received.unauthenticated'
                | 'message.sent'
                | 'message.delivered'
                | 'message.bounced'
                | 'message.complained'
                | 'message.rejected'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            }
          ]
        | [
            {
              metric:
                | 'message.received'
                | 'message.received.spam'
                | 'message.received.blocked'
                | 'message.received.unauthenticated'
                | 'message.sent'
                | 'message.delivered'
                | 'message.bounced'
                | 'message.complained'
                | 'message.rejected'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            },
            {
              metric:
                | 'message.received'
                | 'message.received.spam'
                | 'message.received.blocked'
                | 'message.received.unauthenticated'
                | 'message.sent'
                | 'message.delivered'
                | 'message.bounced'
                | 'message.complained'
                | 'message.rejected'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            },
            {
              metric:
                | 'message.received'
                | 'message.received.spam'
                | 'message.received.blocked'
                | 'message.received.unauthenticated'
                | 'message.sent'
                | 'message.delivered'
                | 'message.bounced'
                | 'message.complained'
                | 'message.rejected'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            }
          ]
        | [
            {
              metric:
                | 'message.received'
                | 'message.received.spam'
                | 'message.received.blocked'
                | 'message.received.unauthenticated'
                | 'message.sent'
                | 'message.delivered'
                | 'message.bounced'
                | 'message.complained'
                | 'message.rejected'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            },
            {
              metric:
                | 'message.received'
                | 'message.received.spam'
                | 'message.received.blocked'
                | 'message.received.unauthenticated'
                | 'message.sent'
                | 'message.delivered'
                | 'message.bounced'
                | 'message.complained'
                | 'message.rejected'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            },
            {
              metric:
                | 'message.received'
                | 'message.received.spam'
                | 'message.received.blocked'
                | 'message.received.unauthenticated'
                | 'message.sent'
                | 'message.delivered'
                | 'message.bounced'
                | 'message.complained'
                | 'message.rejected'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            },
            {
              metric:
                | 'message.received'
                | 'message.received.spam'
                | 'message.received.blocked'
                | 'message.received.unauthenticated'
                | 'message.sent'
                | 'message.delivered'
                | 'message.bounced'
                | 'message.complained'
                | 'message.rejected'
              /**
               * @maxItems 200
               */
              points:
                | {
                    timestamp: string
                    value: number
                  }[]
                | null
            }
          ]
    }
    'mail.label.event.list': {
      items: {
        inbox_id: string
        event_id: string
        event_type: 'label.added' | 'label.removed'
        message_id: string
        label: string
        event_at: string
        created_at: string
      }[]
      next_cursor: string | null
    }
    'mail.message.list': {
      items: {
        inbox_id: string
        labels: string[]
        to: string[]
        cc: string[]
        bcc: string[]
        subject: string | null
        preview: string | null
        attachments: {
          attachment_id: string
          size: number
          filename: string | null
          content_type: string | null
        }[]
        message_id: string
        thread_id: string
        timestamp: string
        from: string
        size: number
      }[]
      next_cursor: string | null
    }
    'mail.message.get': {
      inbox_id: string
      labels: string[]
      to: string[]
      cc: string[]
      bcc: string[]
      subject: string | null
      preview: string | null
      attachments: {
        attachment_id: string
        size: number
        filename: string | null
        content_type: string | null
      }[]
      message_id: string
      thread_id: string
      timestamp: string
      from: string
      size: number
      text: string | null
      html: string | null
      truncated_fields: ('text' | 'html')[]
    }
    'mail.draft.list': {
      items: {
        inbox_id: string
        labels: string[]
        to: string[]
        cc: string[]
        bcc: string[]
        subject: string | null
        preview: string | null
        attachments: {
          attachment_id: string
          size: number
          filename: string | null
          content_type: string | null
        }[]
        draft_id: string
        updated_at: string
        client_id: string | null
        send_status: string | null
        send_at: string | null
      }[]
      next_cursor: string | null
    }
    'mail.draft.get': {
      inbox_id: string
      labels: string[]
      to: string[]
      cc: string[]
      bcc: string[]
      subject: string | null
      preview: string | null
      attachments: {
        attachment_id: string
        size: number
        filename: string | null
        content_type: string | null
      }[]
      draft_id: string
      updated_at: string
      client_id: string | null
      send_status: string | null
      send_at: string | null
      text: string | null
      html: string | null
      truncated_fields: ('text' | 'html')[]
    }
    'mail.thread.list': {
      items: {
        inbox_id: string
        thread_id: string
        labels: string[]
        timestamp: string
        senders: string[]
        recipients: string[]
        last_message_id: string
        message_count: number
        size: number
        subject: string | null
        preview: string | null
        created_at: string
        updated_at: string
      }[]
      next_cursor: string | null
    }
    'mail.thread.get': {
      inbox_id: string
      thread_id: string
      labels: string[]
      timestamp: string
      senders: string[]
      recipients: string[]
      last_message_id: string
      message_count: number
      size: number
      subject: string | null
      preview: string | null
      created_at: string
      updated_at: string
      messages: {
        inbox_id: string
        labels: string[]
        to: string[]
        cc: string[]
        bcc: string[]
        subject: string | null
        preview: string | null
        attachments: {
          attachment_id: string
          size: number
          filename: string | null
          content_type: string | null
        }[]
        message_id: string
        thread_id: string
        timestamp: string
        from: string
        size: number
      }[]
      next_cursor: string | null
    }
    'mail.message.attachment': {
      attachment_id: string
      size: number
      filename: string | null
      content_type: string | null
      download_url: string
      text_url: string | null
      expires_at: string
    }
    'mail.draft.attachment': {
      attachment_id: string
      size: number
      filename: string | null
      content_type: string | null
      download_url: string
      text_url: string | null
      expires_at: string
    }
    'deployment.project': {
      project_id: string
      name: string
      framework: string | null
      build_command: string | null
      install_command: string | null
      root_directory: string | null
      output_directory: string | null
      paused: boolean | null
    }
    'deployment.list': {
      items: {
        deployment_id: string
        project_id: string
        url: string
        state: string
        target: string | null
        created_at: number | null
      }[]
      next_cursor: number | null
    }
    'deployment.get': {
      deployment_id: string
      project_id: string
      url: string
      state: string
      target: string | null
      created_at: number | null
    }
    'deployment.logs': {
      items: {
        type: string
        text: string
        created_at: number | null
      }[]
    }
    'deployment.environment.list': {
      items: {
        env_id: string
        key: string
        type: string
        targets: string[]
      }[]
    }
    'worker.app': {
      app_name: string
      state: string
    }
    'worker.image.retention': {
      resource_id: string
      recorded_digests: number
      declared_bytes: number
      begin_records: number
      limits: {
        recorded_digests: 128
        declared_bytes: 4294967296
        begin_records: 1000
      }
      account_limit_shared: true
      native_storage_usage_bytes: null
      native_cleanup_verified: false
      billing_final: false
    }
    'worker.image.upload.list': {
      items: {
        upload_id: string
        resource_id: string
        digest: string
        size_bytes: number
        received_bytes: number
        state: 'preparing' | 'uploading' | 'cancelling' | 'abandoning' | 'completed' | 'cancelled' | 'abandoned'
        expires_at: string
        native_session_cleanup: 'not_requested' | 'pending' | 'confirmed_absent' | 'unconfirmed'
      }[]
      next_cursor: string | null
    }
    'worker.image.upload.get': {
      upload_id: string
      resource_id: string
      digest: string
      size_bytes: number
      received_bytes: number
      state: 'preparing' | 'uploading' | 'cancelling' | 'abandoning' | 'completed' | 'cancelled' | 'abandoned'
      expires_at: string
      native_session_cleanup: 'not_requested' | 'pending' | 'confirmed_absent' | 'unconfirmed'
    }
    'worker.image.blob.inspect': {
      digest: string
      present: boolean
      size_bytes: number | null
    }
    'worker.image.inspect': {
      app_name: string
      image: string
      digest: string
      compressed_size_bytes: number
      deployment_performed: false
    }
    'worker.volume.list': {
      items: {
        volume_id: string
        name: string
        state: string
        region: string
        size_gb: number
        encrypted: boolean
        attached_machine_id: string | null
        created_at: string
        auto_backup_enabled: boolean
        snapshot_retention: number
      }[]
    }
    'worker.volume.get': {
      volume_id: string
      name: string
      state: string
      region: string
      size_gb: number
      encrypted: boolean
      attached_machine_id: string | null
      created_at: string
      auto_backup_enabled: boolean
      snapshot_retention: number
    }
    'worker.ip.list': {
      hostname: string
      url: string | null
      items: {
        address: string
        type: 'shared_v4' | 'v4' | 'v6' | 'private_v6'
      }[]
    }
    'worker.logs': {
      items: {
        timestamp: string
        message: string
        level: string
        machine_id: string | null
        region: string | null
      }[]
      truncated: boolean
      next_cursor: string | null
    }
    'worker.machine.list': {
      items: {
        machine_id: string
        name: string
        state: string
        region: string
        instance_id: string | null
        image: string
        cpu_count: number
        memory_mb: number
        environment_keys: string[]
        mounts: {
          volume_id: string
          path: string
        }[]
        http_port: number | null
      }[]
    }
    'worker.machine.get': {
      machine_id: string
      name: string
      state: string
      region: string
      instance_id: string | null
      image: string
      cpu_count: number
      memory_mb: number
      environment_keys: string[]
      mounts: {
        volume_id: string
        path: string
      }[]
      http_port: number | null
    }
    'worker.machine.events': {
      items: unknown[]
    }
    'database.project': {
      project_id: string
      name: string
      state: string
      region: string
      url: string
    }
    'database.query': unknown
    'database.migration.list': {
      items: unknown[]
    }
    'database.bucket.list': {
      items: {
        bucket_id: string
        name: string
        public: boolean
        file_size_limit: number | null
      }[]
    }
    'database.bucket.get': {
      bucket_id: string
      name: string
      public: boolean
      file_size_limit: number | null
      allowed_mime_types: string[] | null
    }
    'database.object.list': {
      bucket_id: string
      prefix: string
      items: {
        path: string
        kind: 'file' | 'folder'
        object_id: string | null
        size: number | null
        content_type: string | null
        updated_at: string | null
      }[]
      next_offset: number | null
    }
    'database.object.read': {
      bucket_id: string
      path: string
      content_base64: string
      size: number
      content_type: string | null
    }
    'database.connection': {
      project_id: string
      url: string
      publishable_key: string
    }
    'deployment.create': {
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
    'worker.create': {
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
    'database.create': {
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
    'database.resume': {
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
    'deployment.resume': {
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
    'worker.resume': {
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
    'deployment.renew': {
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
    'worker.renew': {
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
    'database.renew': {
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
    'deployment.configure': {
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
    'deployment.upload': {
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
    'deployment.environment.set': {
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
    'deployment.environment.delete': {
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
    'deployment.promote': {
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
    'deployment.rollback': {
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
    'deployment.remove': {
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
    'deployment.pause': {
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
    'deployment.delete': {
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
    'worker.image.upload.begin': {
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
    'worker.image.upload.chunk': {
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
    'worker.image.upload.complete': {
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
    'worker.image.upload.cancel': {
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
    'worker.image.upload.abandon': {
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
    'worker.image.publish': {
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
    'worker.image.delete': {
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
    'worker.volume.create': {
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
    'worker.volume.extend': {
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
    'worker.volume.delete': {
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
    'worker.ip.allocate': {
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
    'worker.ip.release': {
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
    'worker.machine.create': {
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
    'worker.machine.update': {
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
    'worker.execute': {
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
    'worker.delete': {
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
    'database.bucket.create': {
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
    'database.bucket.configure': {
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
    'database.bucket.delete': {
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
    'database.object.write': {
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
    'database.object.delete': {
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
    'database.object.download.link': {
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
    'database.write': {
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
    'database.migration.apply': {
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
    'database.pause': {
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
    'database.delete': {
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
    'mail.draft.create': {
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
    'mail.draft.update': {
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
    'mail.draft.send': {
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
    'worker.machine.start': {
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
    'worker.machine.stop': {
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
    'worker.machine.restart': {
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
    'worker.machine.delete': {
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
    'mail.draft.delete': {
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
    'mail.message.delete': {
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
    'mail.message.labels': {
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
    'mail.thread.labels': {
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
export const INFRA_SCHEMA_REVISION = '04b63ed28a0060d0d23f1e9770b4a513f546f5e9abd36a46e5f960b4064e995f'
export const READ_ONLY_INFRASTRUCTURE_TOOLS: readonly string[] = Object.freeze(["infra.status","infra.pricing","resource.list","resource.get","resource.spending","operation.list","operation.get","funding.list","funding.get","workspace.quote","workspace.file.read","workspace.file.list","workspace.file.stat","workspace.process.list","workspace.command.output","workspace.preview","mail.delivery.status","mail.delivery.event.list","mail.delivery.event.get","mail.inbox","mail.metrics.usage","mail.metrics.events","mail.label.event.list","mail.message.list","mail.message.get","mail.draft.list","mail.draft.get","mail.thread.list","mail.thread.get","mail.message.attachment","mail.draft.attachment","deployment.project","deployment.list","deployment.get","deployment.logs","deployment.environment.list","worker.app","worker.image.retention","worker.image.upload.list","worker.image.upload.get","worker.image.blob.inspect","worker.image.inspect","worker.volume.list","worker.volume.get","worker.ip.list","worker.logs","worker.machine.list","worker.machine.get","worker.machine.events","database.project","database.query","database.migration.list","database.bucket.list","database.bucket.get","database.object.list","database.object.read","database.connection"])
