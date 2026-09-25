import { describe, expect, it } from 'vitest'
import { createOrbio, DEFAULT_BASE_URL } from '../src/index.js'

/**
 * The live contract, against a real Orbio.
 *
 * This SDK compiles no address and no price in, which means the only way it
 * can rot is if the shapes it reads change underneath it. Nothing else here
 * would notice: the unit tests stub the responses, so they would keep passing
 * while every installed copy broke.
 *
 * So this reads production and asserts only the fields the SDK actually
 * depends on. It is not a test of Orbio, which has its own; it is a test that
 * the promise "nothing is compiled in" has not quietly become "nothing is
 * compiled in and nothing works".
 *
 *   pnpm run test:contract
 *
 * Skipped unless ORBIO_CONTRACT_TEST=1, because a unit suite that needs the
 * internet is a unit suite that fails on a train.
 */

const enabled = process.env.ORBIO_CONTRACT_TEST === '1'
const base = process.env.ORBIO_BASE_URL ?? DEFAULT_BASE_URL

describe.skipIf(!enabled)('the live gateway still answers the shapes this SDK reads', () => {
  it('serves status with a chain id and, when live, addresses', async () => {
    const orbio = await createOrbio({ baseUrl: base })
    const status = orbio.status

    expect(typeof status.chainId).toBe('number')
    expect(status.chainId).toBeGreaterThan(0)
    expect(typeof status.live).toBe('boolean')

    if (status.addresses) {
      // The four the protocol cannot work without. `agentVault` is allowed to
      // be null: it is deployed after the others and every agent action reads
      // null as "not live" rather than as an address of zero.
      for (const name of ['credit', 'staking', 'exchange', 'payout'] as const) {
        expect(status.addresses[name], `${name} is an address`).toMatch(/^0x[0-9a-fA-F]{40}$/)
      }
    }
  })

  it('serves a catalogue where every tool carries the fields the SDK reads', async () => {
    const orbio = await createOrbio({ baseUrl: base })
    const tools = orbio.tools.list()
    // An empty catalogue is a real answer: this deployment has no tools yet.
    // Asserting a count would turn "not deployed here" into a failure that
    // reads as a broken SDK, which is the opposite of what this suite is for.
    if (tools.length === 0) {
      expect(orbio.tools.priceOf('anything')).toBeUndefined()
      return
    }

    for (const tool of tools) {
      expect(typeof tool.name).toBe('string')
      expect(tool.input_schema, `${tool.name} has an input schema`).toBeTruthy()
      // Added so an agent knows the shape of what comes back rather than
      // writing a parser for a shape nobody promised. Losing it would be a
      // silent regression for every consumer.
      expect(tool.output_schema, `${tool.name} has an output schema`).toBeTruthy()
      expect(tool.price.credit_per_unit, `${tool.name} is priced`).toMatch(/^\d+\.\d+$/)
      // Null is a real answer here: it means nothing is charged before the
      // first result. What must not happen is the field disappearing, because
      // budgeting from the rate alone would then understate every job.
      expect(tool.price).toHaveProperty('credit_to_start')
    }
  })

  it('prices every tool it lists, so an agent can decide before it spends', async () => {
    const orbio = await createOrbio({ baseUrl: base })
    for (const tool of orbio.tools.list()) {
      expect(orbio.tools.priceOf(tool.name), `${tool.name} priced`).toContain('CREDIT per')
    }
  })
})
