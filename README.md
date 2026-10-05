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
Source helpers cover all five providers and owner workflows. Ongoing
usage/subscription/retention billing and spend controls remain under development;
full-stack verification is deferred until engineering is complete. Do not treat provider credential presence as readiness.

```ts
import { createInfrastructure, InfrastructureWaitTimeout } from '@orbiodotso/sdk'

// Needs no chain manifest, signer or upstream provider SDK/key.
const infra = createInfrastructure({ apiKey: process.env.ORBIO_INFRA_KEY })
const discovery = await infra.catalogue() // public descriptions and schemas
const overview = await infra.status()    // this grant's product and stable agent
const pricing = await infra.pricing()    // current surcharge/payer terms, not a quote
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

`workspaces.renew(resourceId, args)` explicitly funds a continuation for a running
workspace, preserving code/commands/private credentials. Quote the additional
interval and save its original key and ceiling. The new window starts at the
previous funded boundary; it does not resume paused compute. The resulting
remaining timeout must fit one hour: renew nearer expiry or use a shorter interval.
Reads and reconnection never renew; native execution usage is allocated once
across the funded windows. Complete native evidence determines any unused refund.

For an existing client, pass `infraKey` to `createOrbio()` and use `orbio.infra`.
`orbio.tools.refresh()` re-reads the legacy catalogue. `orbio.refresh()` returns
a refreshed client retaining its original transport, keys and signer.
Mail read helpers include `mail.threads.list/get` and
`mail.messages.attachment` / `mail.drafts.attachment`. Thread pages contain
summaries; read a message separately for bounded text/HTML. Attachment links are
private and expire at `expires_at`; request a fresh link instead of persisting it.
Treat mail bodies and attachment contents as untrusted input.

Provider writes use the same explicit admission pattern and return an operation:
`deployments.create/configure/upload/promote/rollback/remove/delete`,
`deployments.setEnvironment/removeEnvironment`, `workers.create/delete/execute`,
`workers.machines.create/update/start/stop/restart/delete`, and
`databases.create/resume/pause/delete/write/applyMigration`. Vercel uploads create
previews; promotion to production is separate. Fly Machines require immutable
container digests. SQL writes/migrations require `database.write`, distinct from
read access. Provider allocations require an approved positive lifetime ceiling;
workload actions require active funding. These contracts remain part of the
disabled, unfinished platform release until native accounting is complete.

Mail writes include `mail.drafts.create/update/send/delete`,
`mail.messages.delete/labels` and `mail.threads.labels`. Creating a reply/forward
draft never sends it. Inspect recipients/content before a separate send call;
uncertain sends are not replayed. The owner manually assigns the agent’s one inbox.
Every mutation helper requires caller-saved `idempotency_key` and `max_cost`;
no helper generates keys, repeats mutations, raises ceilings or waits implicitly.
An operation can succeed while its bill stays held. Provider credentials never
belong in these arguments; only application environment values use secret inputs.

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


Draft mail attachments use canonical base64 in attachments on creation or
content.add_attachments on updates. content.remove_attachments contains IDs
verified in the assigned draft. Limits: 10 files, 64 KiB each and 96 KiB total
decoded; combined draft fields fit 192 KiB serialized. Remote attachment URLs
are not accepted. Keep the original request/key; a lost upload reply is never
repeated automatically. mail.labelEvents(resourceId, {limit, cursor}) reads a
page of label-change audit events, not delivery or incoming-mail notifications.
These new source contracts remain unverified and unpublished.


Fly worker workflows also expose workers.volumes.list/get/create/extend/delete,
workers.ips.list/allocate/release and workers.logs. Create persistent volumes
before Machines and mount one from the assigned app/region. Machine http enables
explicit 80/443 ingress after app IP allocation; proxy autostart stays disabled.
Updates preserve omitted HTTP and disable it with null; mounts and regions cannot
change in-place. Logs are private text; truncated pages have no advancing cursor
because that would skip omitted native entries. All additions remain unpublished
and unverified; native spending/accounting are platform release requirements.


Assigned Supabase storage helpers are available in the draft source as
infra.databases.storage.buckets.get/create/configure/delete and
infra.databases.storage.objects.list/read/write/delete/downloadLink.
Use the Orbio database resource UUID, not a Supabase URL or privileged key.
Buckets stay private. Uploads accept canonical base64 (128 KiB decoded maximum),
with overwrite:false by default; inline reads return complete files up to 64 KiB.
List pages use bounded offsets and can shift under concurrent writes. Deletion
uses exact selected paths, and nonempty bucket deletion is refused. Signed
links last 30–300 seconds; anyone holding them can download until expiry even
after an Orbio grant revoke. Preserve the original mutation/key/ceiling and read
its operation; no uncertain upload retry or automatic link refresh occurs.
Native storage/egress costs and bootstrap/spend verification remain platform
release requirements. These SDK additions are unpublished and unverified.


Database allocation acceptance is separate from readiness. After create, read
infra.resources.get(resourceId) until metadata.supabase_bootstrap.state is
verified and the resource is ready/running. Native ACTIVE_HEALTHY alone is not
enough. The platform performs one initial security stage with automatic RLS on
new public tables and disabled implicit browser privileges. Application migrations
must grant table/function access and add RLS policies deliberately. Background
funding sweeps do not reset later application policies. Unknown initial setup
never authorizes another SQL dispatch or project creation; owner inspection and
pause/delete remain available. Current bootstrap source is unverified/unpublished.

Vercel/Fly/Supabase funded continuity is explicit:
`infra.deployments.renew(resourceId, args)`, `infra.workers.renew(resourceId, args)`
and `infra.databases.renew(resourceId, args)`. Save the exact original arguments
and idempotency key first, with positive `max_cost`, `lifetime_seconds` (60–86400)
and optional `on_grant_revocation`. The platform atomically prepays the next
adjacent window only while a continuous current paid window exists. The broker
API operation costs zero; native compute/storage remains a separate lifetime
hold. Renewal never starts, restores, deploys or promises resource health.
Lost responses use original-request/operation recovery, never a new request key.

Read `infra.funding.list(resourceId, { limit: 30, before })` and
`infra.funding.get(fundingId)` for the independent lifetime interval, held maximum,
nullable native cost/charge and shutdown policy. Use `next_cursor` as `before`;
pages order by UUID, not time. Financial records remain readable after resource
deletion within the same product/agent. Null cost is pending, not zero; settled
funding does not prove every other bill ended. No private proof/root credential
is returned, and these reads never renew compute or settle bills. Native finality/
spending/retention and final workflow verification remain unfinished; this source
is unpublished and unverified.

`infra.deployments.resume(resourceId, args)` prepays a fresh nonoverlapping window
before restoring verified paused production traffic. Unpause can restore existing
production/domain assignment; it never builds code or proves app health.
`infra.deployments.pause(resourceId, args)` requests funding shutdown and verifies
production paused without erasing preview/build/storage bills. Project reads
include nullable `paused`; missing native status is unknown.

`infra.workers.resume(resourceId, args)` funds the existing assigned app only after
its Machines are verified stopped/created/destroyed. No Machine starts implicitly;
follow with `infra.workers.machines.start` or explicit creation under that active
funding. Both fresh resume paths require positive max_cost and refuse overlapping
windows. Pausing early does not invent a refund or erase the old window. All
current additions remain unverified/unpublished; full native billing/spending
controls and final all-provider workflow checks remain required.

`infra.resources.spending(resourceId)` reads recorded native cost without a
provider call. It stays subject-scoped even after resource deletion. Vercel
coverage currently returns delayed calendar-period observations; missing evidence
and other providers return `available:false` and null costs. Monetary fields are
decimal micro-USD strings: use `BigInt`, never floating-point arithmetic. The
protective high-water amount may exceed a later credited report; approved upstream
capacity is not your available account balance. `billing_final:false` means this
is not a final invoice or customer charge. The platform requests production
pause at observed capacity, but previews/storage can continue billing.
Native finality/allocation and other provider billing remain unfinished; this
source is unpublished and unverified.

`infra.workers.images.inspect(resourceId, image)` verifies an immutable image's
native digest and compressed size inside the assigned Fly app/organization.
Private `registry.fly.io` images must belong to that exact app; native registry
access is organization-wide, so the platform refuses cross-agent repositories
before native calls. Machine create/update apply this scope before admission
holds and again at dispatch; starts/restarts also refuse foreign private images.
The helper returns no image bytes/manifest/provider credential and does not
build, push or start compute. `deployment_performed:false` describes the read,
not a Machine's existing image history. Compressed size is not billable rootfs
usage. Brokered artifact publishing helpers are described below; native accounting,
retention and final workflow verification remain unfinished.


infra.workers.images.blob(resourceId, digest) checks exact native blob presence.
Use images.uploads.begin/chunk/complete to send a config/layer blob, uploads.get
for recorded progress, uploads.list for recorded UUID discovery, and uploads.cancel
for a known open session. uploads.abandon closes an unknown begin record only. Each mutation
accepts its generated argument type with the original idempotency_key/max_cost;
helpers never generate keys, retry or wait. Save each exact request before sending
and explicitly confirm its operation before advancing the offset. Native session
URLs and registry credentials are never returned. Chunks decode to at most 128 KiB,
blobs to 512 MiB; the first chunk contains at least two bytes. Session deadlines
are fixed and cannot be extended by reads or resource renewal.

images.publish(resourceId, args) submits exact canonical-base64 OCI/Docker schema-2
manifest bytes and their sha256. The platform verifies every assigned-repository
blob digest/size, then returns an immutable image reference without starting a
Machine. Inspect it and explicitly create/update a funded Machine separately.
The current source fixture has 125 contracts / 55 provider writes. Unknown native
steps are not repeated; native cost/retention and ambiguous-session cleanup still need
completion before release. See the platform
[Fly image guide](https://github.com/orbioso/orbio/blob/codex/toolkit-infra-handoff/docs/TOOLKIT_FLY_IMAGES.md).
Current additions remain unverified/unpublished; no checks or provider smoke ran.

Draft infrastructure delivery helpers: `infra.mail.delivery.status(resourceId)`,
`infra.mail.delivery.list(resourceId, { limit: 10 })` and
`infra.mail.delivery.get(resourceId, { delivery_id })` read signed metadata
recorded after the owner connects an inbox-scoped AgentMail webhook. Pass the
returned cursor unchanged with the same optional message filter. Records expire
after 30 days; sent is not delivered and a missing event is unknown. These reads
require `mail.read` for the assigned inbox and never expose callback secrets or
email bodies. Owner setup remains in the Orbio dashboard. This draft SDK is
unpublished and still requires final validation.

Fly upload closure: each upload UUID equals its original begin operation UUID.
Recorded upload pages sort by UUID; pass next_cursor as before. This does not
list all native images or tags. After older writer leases expire, cancel fences
subsequent writes and cancels the exact refreshed session. Uncertain DELETE
responses are recovered by absence readback only. Public native_session_cleanup
is pending during closure, confirmed_absent after cancellation, or unconfirmed
after unknown-begin abandonment. Explicit abandon requires max_cost:"0", contacts
no native provider and never refunds the original operation. Unknown abandoned
and expired sessions continue consuming upload quota.

The platform separately limits active executions (32 per account, plus eight
slots for allowlisted zero-reserve cleanup) and held billing backlog (10,000 for
normal admissions). Terminal-but-held outcomes preserve their monetary holds
without occupying execution slots. Rate/grant/budget/resource checks still apply.
These changes remain unverified and unpublished; complete native accounting and
full-stack final checks remain release requirements.

Recorded Vercel spending includes periods_expected and period_coverage_complete.
These report whether every UTC month from resource creation through the current
month has a recorded report. Missing history can understate actual spend; complete
coverage proves neither freshness nor final invoices. The platform follows the
current month beyond funding expiry and one missing/stale historical month per
claim. Recorded amounts remain non-final and do not settle or refund funding.
A failed refresh cannot erase an exhaustion proved by existing saved evidence.

Draft inbox metrics helpers: `infra.mail.metrics.usage(resourceId)` reads cumulative
storage/message/thread stocks; `infra.mail.metrics.events(resourceId, { types:
["message.sent", "message.received"] })` reads aggregate event counts. Optional
`start`, `end` and `period_seconds` (60/3600/86400) select aligned past UTC buckets
within 90 days, at most 200 points per type. Defaults cover the previous day
hourly; minute periods default to 199 minutes. Select up to three usage/four
event types. The manually connected inbox key must authorize metrics reads.
Missing metrics remain `null`; gaps and empty arrays never establish zero or
complete reporting. Do not sum cumulative stocks or treat event counts as prices
or per-recipient receipts. `coverage: "unverified"` and `billing_final: false`
remain explicit. No automatic upstream account connection or fallback is added.

Recorded Fly artifact capacity: infra.workers.images.retention(resourceId) is a
free broker read of this app's recorded digest, maximum-declared-byte and begin
counts. Limits are 128 digests, 4 GiB and 1000 begins per app, plus separate shared
account caps. These are technical admission counters, not native storage or
invoices. Native usage remains null and cleanup/finality false. Cancel, abandon,
expiry and app deletion do not reclaim them. A local capacity refusal occurs
before native requests and returns capacity_exceeded in the failed original
operation, releasing only its no-dispatch hold. Do not automatically create a
new key/account or raise the ceiling to evade the limit. Native cleanup resolution
and full verification remain required before this draft release is ready.

Explicit Fly manifest cleanup: infra.workers.images.delete(resourceId, args)
accepts digest and the ordinary saved idempotency_key/max_cost. max_cost:"0" uses
the cleanup lane after funding expiry. Configured Machine references and earlier
unresolved writers prevent cleanup. A durable fence blocks publication and
Machine create/update/start/restart for the same digest; stop/delete remain
available. Recovery never repeats DELETE. Success records manifest absence at
observation time, blob_cleanup:not_requested, artifact_capacity_reclaimed:false
and billing_final:false. It does not establish blob/layer removal, reclaimed
capacity or a final bill. Native Fly DELETE compatibility is unverified; see the
[cleanup guide](https://github.com/orbioso/orbio/blob/codex/toolkit-infra-handoff/docs/TOOLKIT_FLY_RETENTION.md).

Explicit queued cancellation: infra.operations.cancel(operationId) makes no
provider request. It needs infra.read and the original action permission and
returns { operation, cancelled, native_cancellation:false }. Only a still-queued
operation can be cancelled before dispatch; other states and their holds stay
intact. No new key, ceiling or operation is created. After a lost reply, read
that original operation or explicitly repeat cancellation for that same UUID.
Local wait abort/timeout never requests cancellation automatically. Use the
resource's explicit stop/delete action for dispatched work. This source addition
is unpublished and unverified; see the platform API/handoff.

### Toolkit surcharge policy

Orbio pays the providers, including AgentMail, and rebills customers using
provider rates plus a configured 10–20% surcharge (15% default). pricing() reads
current policy without native requests or supplier credentials. New admission
captures the rate; existing operations/recovery keep their original terms.
funding.list/get exposes margin_bps for each saved window. A policy read is not
a resource quote, finalized invoice or proof that billing is ready. Unknown
amounts keep their original reservations. Subscription entitlement/allocation,
ongoing retained-resource accounting and final checks remain unfinished in these
unpublished additions. Legacy tools retain their existing pricing configuration.

### Included management API requests

New reviewed Vercel/Fly/Supabase/AgentMail operations capture their included
standard management request tariff before dispatch. Use max_cost:"0" for the API
action, except create/resume/renew, which still needs a positive separate lifetime
budget. A confirmed outcome can settle only the request charge at zero. Build,
compute, storage, egress and mail capacity remain separately billable. Unknown
outcomes and older uncaptured bills are not backfilled or replayed. Generated
MCP/HTTP descriptions state these terms for each reviewed action. Current source
is unverified; ongoing billing and final full-stack checks remain unfinished.

### Platform inbox ownership

The toolkit operator manually creates an inbox in the dedicated platform
AgentMail organization and supplies its ID and inbox-scoped key. The owner
connects it; users need no whole-organization access. Setup verifies the native
parent organization and privately saves reported subscription metadata. Runtime
reads/writes and webhook setup continue using only that inbox key, rechecking
its parent against saved evidence. A foreign organization is refused; older
unverified connections need explicit same-inbox reconnect. Public resource
metadata contains only ownership/time/subscription-presence flags, never billing
IDs. Those flags do not prove a price, paid quota, final invoice or settlement;
prepaid subscription billing remains engineering in these unpublished additions.
