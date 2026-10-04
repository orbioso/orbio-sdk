/** Generated from the platform catalogue. Schema revision: 386c55e932b1a264c15656b5a87b183fecb91511687d203e7581894870a51181. Do not edit. */

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
    'mail.inbox': {
      resource_id: string
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
    'deployment.delete': {
      idempotency_key: string
      max_cost: string
      resource_id: string
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
    'mail.inbox': {
      inbox_id: string
      email: string
      display_name: string | null
      state: 'active' | 'paused'
      created_at: string
      updated_at: string
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
export const INFRA_SCHEMA_REVISION = '386c55e932b1a264c15656b5a87b183fecb91511687d203e7581894870a51181'
export const READ_ONLY_INFRASTRUCTURE_TOOLS: readonly string[] = Object.freeze(["infra.status","resource.list","resource.get","operation.list","operation.get","workspace.quote","workspace.file.read","workspace.file.list","workspace.file.stat","workspace.process.list","workspace.command.output","workspace.preview","mail.inbox","mail.message.list","mail.message.get","mail.draft.list","mail.draft.get","mail.thread.list","mail.thread.get","mail.message.attachment","mail.draft.attachment","deployment.project","deployment.list","deployment.get","deployment.logs","deployment.environment.list","worker.app","worker.machine.list","worker.machine.get","worker.machine.events","database.project","database.query","database.migration.list","database.bucket.list","database.connection"])
