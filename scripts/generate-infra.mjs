import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { compile } from 'json-schema-to-typescript'
import process from 'node:process'
import { URL } from 'node:url'

// Regenerate from the platform's public catalogue export, never its environment.
const source = JSON.parse(await readFile(new URL('../src/infra/contracts.json', import.meta.url), 'utf8'))
const hash = createHash('sha256').update(JSON.stringify(source.tools)).digest('hex')
if (source.version !== 1 || source.schemaRevision !== hash) throw new Error('Invalid infrastructure contract export')
const inputs = {}, results = {}
for (const tool of source.tools) {
  if (!/^[a-z]+(?:\.[a-z]+)*$/.test(tool.name) || Object.hasOwn(inputs, tool.name)) throw new Error('Invalid or duplicated capability name')
  const input = tool.inputSchema
  // A closed empty JSON object is narrower than TypeScript's non-nullish `{}`.
  inputs[tool.name] = input.type === 'object' && input.additionalProperties === false && Object.keys(input.properties ?? {}).length === 0
    ? { ...input, tsType: 'Record<string, never>' } : input
  const result = tool.outputSchema?.oneOf?.[0]?.properties?.result
  if (!result) throw new Error(`Missing result schema for ${tool.name}`)
  results[tool.name] = result
}
const object = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false })
const generated = await compile(object({ inputs: object(inputs), results: object(results) }), 'InfrastructureContracts', {
  bannerComment: `/** Generated from the platform catalogue. Schema revision: ${hash}. Do not edit. */`,
  unknownAny: true, style: { singleQuote: true, semi: false },
})
const output = generated + '\nexport type InfrastructureToolName = keyof InfrastructureContracts[\'inputs\']\n'
  + 'export type InfrastructureInput<K extends InfrastructureToolName> = InfrastructureContracts[\'inputs\'][K]\n'
  + 'export type InfrastructureResult<K extends InfrastructureToolName> = InfrastructureContracts[\'results\'][K]\n'
  + 'export type InfrastructureOverview = InfrastructureResult<\'infra.status\'>\n'
  + 'export type InfrastructureResource = InfrastructureResult<\'resource.get\'>\n'
  + 'export type InfrastructureOperation = InfrastructureResult<\'operation.get\'>\n'
  + `export const INFRA_SCHEMA_REVISION = '${hash}'\n`
  + `export const READ_ONLY_INFRASTRUCTURE_TOOLS: readonly string[] = Object.freeze(${JSON.stringify(source.tools.filter(tool => tool.readOnly).map(tool => tool.name))})\n`
const target = new URL('../src/infra/generated.ts', import.meta.url)
if (process.argv.includes('--check')) {
  if (await readFile(target, 'utf8') !== output) throw new Error('Generated infrastructure types are stale; run pnpm generate:infra')
} else await writeFile(target, output)
