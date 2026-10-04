# @orbiodotso/sdk

One key for AI inference, agent tools and the CREDIT protocol. An agent that
can call a model but cannot buy more when it runs out has a deadline. This is
how it pays for itself.

```bash
npm install @orbiodotso/sdk viem
```

```ts
import { createOrbio } from '@orbiodotso/sdk'

const orbio = await createOrbio({ apiKey: process.env.ORBIO_API_KEY })

const { result, chargedMicroUsd } = await orbio.tools.xPosts(
  { handle: 'orbiodotso', limit: 20 },
  { maxCost: '0.01' },
)
```

## What it does

- **Tools.** Read X, search and scrape the web, read Robinhood Chain, scrape
  Instagram, TikTok and Reddit, and publish to connected social accounts.
- **Balance.** Read what a key has and what it has spent, exactly.
- **CREDIT.** Buy it with any supported token, activate it into inference
  balance, stake ORBIO, claim what it earns.
- **The agent launchpad.** Launch a token, harvest its creator fees, claim the
  CREDIT they earn, and manage the agent, all from one wallet.
- **Paying for itself.** `topUp()` and `keepFunded()`.
- **Scoped infrastructure.** Assigned product/agent overview, resource metadata,
  explicit workspace allocation and durable recovery through hosted MCP contracts.
  An explicit infrastructure grant is required; broad gateway keys gain no authority.

## Agent infrastructure

This source branch prepares infrastructure helpers for the platform release;
these additions are not yet published on npm. The platform must enable the
capabilities and the owner must assign a product, agent and permissions.
Workspace quote/create/resume/pause/delete helpers are implemented here. Full
billing, files/processes, other provider workflows and owner resource controls
remain under development. Do not treat provider credential presence as readiness.

```ts
import { createInfrastructure, InfrastructureWaitTimeout } from '@orbiodotso/sdk'

// Needs no chain manifest, signer or upstream provider SDK/key.
const infra = createInfrastructure({ apiKey: process.env.ORBIO_INFRA_KEY })
const discovery = await infra.catalogue() // public descriptions and schemas
const overview = await infra.status()    // this grant's product and stable agent
const page = await infra.resources.list({ limit: 10 })
// Pass page.next_cursor as before to read the next page.

// Recover the same operation after a transport disconnect, rather than dispatching again.
const controller = new AbortController()
try {
  const operation = await infra.operations.wait(savedOperationId, {
    timeoutMs: 300_000,
    signal: controller.signal,
  })
  // Inspect operation.state, operation.result and operation.billing_state separately.
} catch (error) {
  if (error instanceof InfrastructureWaitTimeout) {
    // error.operationId and error.lastKnown let a new connection resume reading.
  }
}
```

Workspace lifecycle grants require both `infra.read` and `workspace.manage`.
Allocation is finite (15–3600 seconds, default 300), with explicit funding and a
caller-approved decimal CREDIT ceiling. Quote first; it reserves nothing.

```ts
const quote = await infra.workspaces.quote({ timeout_seconds: 300 })
// Check quote.reserve_micro_usd against your approved 0.03 CREDIT ceiling.
if (BigInt(quote.reserve_micro_usd) > 30_000n) throw new Error('Quote exceeds approved ceiling')
const request = {
  name: 'Builder workspace',
  timeout_seconds: 300,
  idempotency_key: crypto.randomUUID(),
  max_cost: '0.03',
} // Persist the original request before sending it.
const admitted = await infra.workspaces.create(request)
// Persist admitted.id; allocation runs asynchronously after durable admission.
const completed = await infra.operations.wait(admitted.id)
// Inspect completed.state and billing_state separately, then read its resource UUID.

// A confirmed resource can be paused without deleting its code:
await infra.workspaces.pause(savedResourceId, {
  idempotency_key: savedPauseKey,
  max_cost: '0',
})
```

An ambiguous admission is never automatically retried. If its operation UUID
was lost, resubmit the identical saved request with the same `idempotency_key`.
A new key can allocate a second workspace; raising a ceiling or changing args
is not recovery. `resume(resourceId, args)`, `pause(resourceId, args)` and
`delete(resourceId, args)` require an Orbio resource UUID and saved key/ceiling.
Resume explicitly funds a paused workspace. Pause keeps code; delete permanently
removes it. Neither action erases incurred compute charges or an uncertain bill.
The default allocation revocation policy is `finish_window`; choose
`on_grant_revocation:'stop'` to request stop when consent is revoked.

The owner issues a dedicated `orbio_infra_` key or assigns an Orbio OAuth
connection with explicit `infra` consent to one product and stable agent.
The SDK accepts that token and never connects the user's upstream providers
itself. Provider account connection and assignment belong in owner setup.
Each key/connection is scoped by the server; knowing a provider ID grants nothing.
Resources and operations use Orbio UUIDs. One inbox per stable agent is manually
created/assigned by the owner, never automatically by an agent.

`infra.call(name, args, { signal })` preserves the shared result without the
legacy tools' transformation. Known helpers have generated types; generic calls
can use a future capability discovered at runtime without an SDK release.
`infra.refresh()` explicitly refreshes discovery. `human_action_required`
includes `error.setupUrl`; `rate_limited` includes `error.retryAfter` in seconds.
An ambiguous mutation (`outcome_unknown`) is not automatically retried.

Waiting polls operation reads only. It retries a bounded number of transient
read failures, honors retry guidance and stops on revoked access. Abort and local
timeout never send remote cancel, stop or delete calls. A terminal operation may
still have a held bill or leave a worker running; inspect all returned state.
Failed/cancelled terminal operations are returned for inspection rather than
losing their billing and error fields in an exception.

For an existing client, pass `infraKey` to `createOrbio()` and use `orbio.infra`.
`orbio.tools.refresh()` re-reads the legacy catalogue. `orbio.refresh()` returns
a refreshed client retaining its original transport, keys and signer.
Infrastructure money fields remain exact bounded integer micro-USD numbers in
the shared wire result, at most `1_000_000_000_000`; convert with `BigInt()` when
doing wider arithmetic rather than treating CREDIT as floating point dollars.

Types in `src/infra/generated.ts` come from `src/infra/contracts.json`, exported
from the platform's shared MCP/HTTP capability definitions. `INFRA_SCHEMA_REVISION`
identifies the pinned schema set. To update it, run the platform's
`scripts/export-toolkit-contracts.mts` with that JSON file as its output, then
`pnpm generate:infra`. `pnpm check:infra` checks reproducibility in CI and before
publishing. Runtime discovery is independent of those pinned TypeScript types.

## Nothing is compiled in

No address and no price ships in this package. Both are fetched when you create
a client, which is why `createOrbio` is awaited. A redeployed contract, a new
tool or a repriced one reaches every installed copy immediately, and a version
of this library can never disagree with the chain about where the protocol is.

```ts
orbio.status.chainId          // where it is
orbio.tools.list()            // every tool, with its schemas and its price
orbio.tools.priceOf('web.search')
```

The honest limit: types cannot be generated from data fetched at runtime, so
`tools.call(name, args)` is structurally typed. If you want strict types, pin
them to a moment with codegen. The runtime is never pinned.

## Money is integers

One CREDIT is one dollar and CREDIT has six decimals, so a balance is an exact
integer of micro-dollars. Nothing here turns an amount into a JavaScript
number, because `0.1 + 0.2` is not `0.3`.

```ts
import { parseCredit, formatCredit } from '@orbiodotso/sdk'

parseCredit('1.25')      // 1250000n
formatCredit(1999999n)   // '1.999999', truncated, never rounded up
```

Decide with the integer; show the string.

## Signing

Reads need only an API key. Anything on chain needs a wallet, and the wallet
never leaves your process: everything is signed locally and only a signed
transaction is sent, to an RPC **you** name.

```ts
import { privateKeyToAccount } from 'viem/accounts'

const orbio = await createOrbio({
  apiKey: process.env.ORBIO_API_KEY,
  account: privateKeyToAccount(process.env.ORBIO_PRIVATE_KEY as `0x${string}`),
  rpcUrl: process.env.RPC_URL,
})
```

Prefer, in this order: a viem `Account` you built from a keystore or an HSM; a
`WalletClient` you already have; a raw private key. The last is supported
because people will do it anyway and a documented path is safer than an
undocumented one.

**There is no default RPC.** Every endpoint Orbio runs embeds a key, so one
shipped in a package would be published, and a public endpoint chosen for you
would be a dependency you never agreed to.

Asking for a signature without a wallet raises `NoSignerError` naming the
action, rather than failing somewhere deeper.

## Paying for itself

```ts
const result = await orbio.topUp({ token: 'USDG', amount: '20' })

if (result.warning) console.warn(result.warning)
else console.log(`credited ${formatCredit(result.creditedMicroUsd)} CREDIT`)
```

Two steps happen, and the second goes wrong quietly. Buying gets you CREDIT the
token. **Activating** burns it and credits an Orbio account with the same face
value of inference. If the beneficiary is not the account your API key spends
from, both succeed and the balance you are watching never moves. So `topUp`
reads the balance before and after and tells you when it did not change.

To keep a floor:

```ts
for await (const event of orbio.keepFunded({
  floor: '5',
  buy: { token: 'USDG', amount: '20' },
})) {
  if (event.kind === 'topped-up') console.log('topped up', event.result.afterMicroUsd)
  if (event.kind === 'failed') console.warn(event.error.message)
}
```

It is a generator rather than a daemon: it yields every time it does something,
holds no timers that could outlive your process, and stops when you break.

## Buying is Uniswap

The SDK swaps through Uniswap and does not expose Orbio's order book. Both work
on chain, but an agent topping itself up should not have to reason about asks,
fills and a venue. The gateway quotes the route and refuses to hand back an
approval to anything but Permit2, a permit for any spender but the router, or a
transaction to any address but the router.

## The agent launchpad

An agent launches a token, the launchpad takes 5% of its creator fees and
stakes the rest, and that position earns CREDIT hourly.

```ts
const terms = await orbio.agents.launchTerms()

const { agentId, token } = await orbio.agents.launch({
  name: 'Scout',
  symbol: 'SCOUT',
  feeWei: BigInt(terms.launchFeeWei),
  expectedEconomics: terms.economics!,
})

await orbio.agents.harvest([agentId])
await orbio.agents.claimCredit(agentId, { activate: true })
```

**One wallet.** Launch without `agentWallet` and the launching wallet is the
agent wallet, so one key does everything and the agent owns itself.
`capabilities(agentId)` reports what the connected wallet may actually do. Said
once: that key can also withdraw principal, so it should hold what the agent
needs rather than everything you own.

`launch` is the one call no relay can sponsor. It is payable, and a sponsored
operation spends the sender's own ETH.

## Errors are something to branch on

```ts
import { NotConnectedError, OrbioError } from '@orbiodotso/sdk'

try {
  await orbio.tools.post('Shipped v2.')
} catch (error) {
  if (error instanceof NotConnectedError) {
    // Nothing is wrong with the call. A person has to connect an account.
    // Never retryable; relay it and carry on.
    console.log(`Ask your owner to connect an account at ${error.url}`)
  } else if (error instanceof OrbioError && error.retryable) {
    // Rate limits and provider failures are worth another go.
  }
}
```

`error.retryable` is deliberately conservative. A bad argument, an empty
balance and anything waiting on a person are all false.

## Publishing needs a connected account

Reading X needs only a key. `social.post` acts as somebody on an account Orbio
does not own, so it is authorised in the dashboard by the wallet that owns the
agent. A key can post once an account is connected; a key can never connect
one. Orbio stores an account id and never a social credential.

## Also available

- **MCP**, hosted at `https://api.orbio.so/api/mcp`, for a model in any client.
  No install, no key on disk, and it can never sign.
- **The Claude Code plugin**, which is that server plus skills and a command.

Use the SDK when you are writing code, MCP when a model is driving.

## Reference

| | |
| --- | --- |
| `createOrbio(options)` | Make a client. Fetches addresses and the catalogue. |
| `orbio.tools` | `list`, `describe`, `priceOf`, `call`, and named helpers |
| `orbio.infra` / `createInfrastructure(options)` | `catalogue`, `refresh`, `status`, `call`, `resources.list/get`, `operations.list/get/wait`, workspace lifecycle/files/commands/output/preview, scoped `mail`, `deployments`, `workers`, `databases` reads |
| `orbio.account` | `key`, `balance`, `models` |
| `orbio.credit` | `balanceOf`, `activate`, `feeExempt` |
| `orbio.staking` | `stake`, `unstake`, `claim`, `positionOf`, `settledOf` |
| `orbio.swap` | `quote`, `buy` |
| `orbio.agents` | `list`, `get`, `launch`, `harvest`, `claimCredit`, and the rest |
| `orbio.topUp` / `orbio.keepFunded` | Pay for itself |

## Licence

MIT
