# Scoped infrastructure SDK continuation

## Vercel customer usage accrual, 2026-10-05

New deployment create/resume/renew approvals capture `resource_report_v1` in the
private intent/contract and SQL funding row. Legacy contracts retain null; mixed
legacy histories cannot silently acquire this policy. Complete signed native
reports across covered months accrue against the assigned resource’s activated
budgets oldest first, using each captured margin. Account/project held balances
fall by the exact charge delta. Credits first reduce Orbio-absorbed excess and
then refund prior customer allocations. Open refunds restore the hold; closed
refunds return available balance. Excess is recorded so a later top-up cannot
rebill it. Every write requires the original exclusive lease, full resource
scope and finance mutex; private snapshot-linked journals preserve adjustments.
Accrual and the spending guard commit atomically. Generic closure releases only
remaining holds and cannot duplicate previous charges.

Public funding reads, the owner history panel and generated SDK expose
billing_policy/accrued_upstream_micro_usd/accrued_charged_micro_usd. The original
reserved ceiling and original terminal closure fields remain separate. Shared
schema stays 132 contracts /59 provider mutations. See
[customer billing](https://github.com/orbioso/orbio/blob/codex/toolkit-infra-handoff/docs/TOOLKIT_NATIVE_BILLING.md) for precise policy and bounds.

Migration 20261005027000 is unapplied. Engineering only: contract export/type
generation ran; tests/type/lint/build/CI/native smoke and adversarial review are
still deferred. No secrets, native mutations, deployment, publishing or merge.
The full goal remains active. Vercel terminal retention/cleanup and hold release,
independent post-closure correction observation, Fly/Supabase full metering and
retained-mail costs remain to implement before final all-provider verification.
Supplier invoice finality is separate and must not block customer usage charges.
The current held-funding sweep drives accrual; it is not yet a closed-resource
billing watcher. Earlier observation-only descriptions below are historical.

## Paid database expiry, 2026-10-05

Current Supabase documentation requires moving paid projects to a Free organization
before pause. New database create/resume/renew requests therefore require explicit
`on_expiry: delete`; the owner UI marks them destructive and requires acknowledgement.
Funding rows expose this consent and bind it to the encrypted original contract.
The worker deletes only the assigned project after finite funding ends, budget
exhaustion, subject archival or selected stop-on-revocation; a current paid successor
prevents deletion. An explicit pause alone never authorizes early deletion. There
is no automatic backup/export or renewal. Existing contracts gain no deletion
permission. A resource-unique SQL dispatch marker prevents native DELETE replay;
recovery observes absence without asserting a final bill or physical backup purge.

Migration 20261005026000 is unapplied. Shared schema remains 132 contracts /59
provider mutations; generated SDK arguments and funding results, owner controls,
public guide and continuity docs match. Current source is unverified; no tests,
CI inspection, live provider calls, secret reads, migration application, deployment,
publishing or merge. Full cost/retention settlement and final all-provider gates
remain required. See [database expiry](https://github.com/orbioso/orbio/blob/codex/toolkit-infra-handoff/docs/TOOLKIT_DATABASE_EXPIRY.md).

## Mail recipient allowance and authorized expiry, 2026-10-05

Current source supersedes the earlier flat 20-unit send reservation and
explicit-pause-only expiry descriptions below. Sends reserve the validated native
draft recipient count (1–20) immediately before native dispatch. Mail mutations,
recovery, credential rotation and expiry serialize on the assigned inbox through
database leases. Reconnection preserves the last observed resource state.
Purchase quotes capture `on_expiry: pause_inbox`; expiry blocks toolkit sends and
the worker requests native pause unless a newer paid period covers the inbox.
A one-time dispatch marker prevents replay after uncertain transport. Recovery
observes only; public status and the owner card show confirmation or uncertainty.
Paused inboxes reject incoming mail without replay after resume; stored mail can
still incur provider cost. No deletion, renewal, send or organization-key fallback.

The shared 132-contract catalogue, owner quote/approval UI and generated SDK types
carry recipient-count terms and expiry observations. The minute sweep discovers
expired subscriptions even when new admissions are off. New migration
20261005025000 is unapplied. Current source is unverified; tests, CI, SQL, UI,
packed SDK and native smoke/adversarial gates remain deferred until engineering
is complete. Full cross-provider cost/retention work remains in scope.

## Mail subscription capacity and lifecycle, 2026-10-05

Current source implements captured, operator-configured AgentMail period quotes,
explicit prepaid activation and a separate customer charge/capacity ledger.
Shared SQL finance mutex checks exact leased operation, current subject/grant/
Orbio OAuth assignment, encrypted credential CAS, balance, product budget,
nonoverlap and shared purchased inbox/recipient capacity. Original recovery
cannot charge twice. No default plan/rate or finalized supplier invoice is
invented; server-only ORBIO_TOOLKIT_AGENTMAIL_RATE_CARD must capture actual
purchased terms/allocation. Full-period price applies even mid-period, with no
proration, automatic renewal or unused-capacity refund. See [mail billing](https://github.com/orbioso/orbio/blob/codex/toolkit-infra-handoff/docs/TOOLKIT_MAIL_BILLING.md)
for all fields, public workflow and limitations.

Each toolkit send requires an active paid window and reserves the validated draft
recipient count (1–20) once per original operation immediately before native send.
Refused or uncertain attempts after reservation retain those units. This conservative broker capacity is not a provider send
meter, and direct provider edits/use are outside its guarantee. Native inbox
pause/resume and owner-only deletion are exposed; resume requires paid capacity,
pause blocks native sending/receiving with no later replay of missed incoming
mail, and deletion retains charges/history. Uncertain native calls are never
replayed or recovered with an organization-wide key.

The owner has an explicit quote/approval/capacity card with saved original-intent
recovery, no automatic purchase/send, and exact subject/resource response checks.
Catalogue, HTTP/MCP, generic workbench, SDK helpers/types and rendered/Markdown
guide share 132 contracts /59 provider mutations plus broker cancellation.
Migrations 20261005024000 and 20261005025000 are unapplied. Source is unverified; only contract export
and type generation ran, no tests/checks/CI/native smoke/email/secret reads.
No production configuration, package publication, deployment or merge.

The full goal remains active. Retained mail can still incur provider storage/
subscription cost after toolkit expiry. Current quotes authorize native inbox
pause at expiry; there is no automatic deletion or renewal.
Other-provider ongoing billing/retention/spend controls and final all-provider
regression/SQL/UI/packed-SDK/live/adversarial verification remain required. Older
126-contract and ownership-only summaries below describe earlier source.


Platform work: [orbioso/orbio PR #318](https://github.com/orbioso/orbio/pull/318).
Complete builder-stack acceptance and provider smoke context live in its
`docs/TOOLKIT_INFRA_HANDOFF.md` and `docs/TOOLKIT_IMPLEMENTATION.md`.
Do not merge or publish until that full-stack release is verified ready.

This companion worktree is `/Users/aster27/.codex/worktrees/a17a/orbio-sdk`,
branch `codex/toolkit-infra-sdk`, based on SDK main `9576357`.
Primary SDK checkout `/Users/aster27/Desktop/orbio-sdk` is unchanged.
Package version remains `0.1.0` while work is in progress; select/bump the new
release version only after the provider helpers/contracts are finalized.
No publish, tag, release workflow or main push has been performed.

Billing decision resolved (2026-10-05): the human confirmed Orbio pays the
providers, including AgentMail, and rebills with a 10–20% surcharge. Platform
uses configurable 15% default for new admissions; original captured margins
remain immutable. Do not ask these choices again. Current increment adds shared
infra.pricing and SDK pricing(), plus funding.margin_bps visibility. Generated
source now mirrors 126 contracts / 55 provider mutations and broker cancellation.
See platform docs/TOOLKIT_PRICING.md. The selected policy does not finish ongoing
subscription/usage/retention billing or spend controls. Those remain engineering,
then final tests/smokes/adversarial review. Current source is unverified, both PRs
stay draft, platform migrations unapplied, feature disabled and SDK unpublished.
No checks, native mutations, publication or merge accompanied this increment.
Earlier pending-question records below are historical and superseded.

## Platform inbox billing ownership, 2026-10-05

The Orbio-payer decision now has a native ownership gate. An owner first passes
Privy/current product/agent checks and the one-inbox identity rule. The supplied
key is introspected as exactly that inbox and records its parent organization.
A separate server-only AgentMailBilling verifier uses only the dedicated toolkit
organization key for GET auth/me and GET organizations, requires organization
scope and exact parent identity, and privately captures reported subscription,
billing-customer/type metadata. A foreign organization or ambiguous verification
is refused before storing a connection. No inbox/key creation or native mutation.

The signed resource credential box contains this binding beside the inbox key;
public metadata contains only platform_owned_inbox, capture time, whether the
provider reported a subscription identifier, and invoice_final:false. IDs/plan
metadata never become public. Subscription presence is not a price, measured
consumption, paid capacity, invoice or settlement proof; missing metadata is
unknown rather than a free bill. Operational reads/mutations and owner webhook
setup share connectPlatformInbox: they use only the saved inbox key and compare
its current parent organization against authenticated saved evidence. They never
construct/use the organization verifier or fall back to its root key. Older
connections missing evidence require explicit same-inbox reconnect; no silent
migration, identity reassignment or key creation occurs.

Manual fulfillment stays explicit: the toolkit operator manually creates one
platform-org inbox and its scoped key; the owner connects it. End users should
not be invited into the whole provider organization or given a broad credential.
Owner copy, shared mail.inbox description and SDK generated docs now explain this
flow. Root verifier consumes the existing ORBIO_TOOLKIT_AGENTMAIL_API_KEY; no new
variable, secret read, provider call or production configuration change. Native
ownership is a prerequisite, not completed subscription billing: captured rate/
allocation, prepaid windows, send-capacity enforcement and retained-mail charging
remain engineering, followed by all-provider final tests/smokes/adversarial review.
Current source is unverified and the feature disabled; no migration, native
mutation, email, deploy, merge or publication in this increment. Final fixtures
must add native organization_id, private binding data, owner verifier HTTP mocks,
foreign/root-scope mismatch, missing/changed subscription metadata, encrypted
privacy and same-inbox rotation/reconnect cases. Source contracts remain 126 /55
provider mutations plus broker cancellation.

## Included control API settlement, 2026-10-05

New operations for the explicit 55 Vercel/Fly/Supabase/AgentMail action names
capture a versioned standard control-API tariff in the encrypted admission
envelope. Their management API request has zero separate per-request charge;
builds, compute, storage, egress and mailbox/subscription capacity are excluded.
The operator's 10–20% surcharge applies to the separate attributable provider
charges, not to an invented fee for an included request. Published standard-plan
sources are linked in platform docs/TOOLKIT_CONTROL_API_PRICING.md; this classification is an
inference from the providers' listed charge dimensions and requires those terms
at activation. It does not prove a zero total resource bill or a final invoice.

Runtime decorates only reviewed action names. New names do not inherit a tariff
from a provider prefix. The operation reserve is zero; create/resume/renew still
requires and atomically reserves a positive separate lifetime budget before its
native mutation. New terminal outcomes or their exact saved response receipt can
settle only the included API charge through the existing scoped atomic checkpoint
and finish ledger. Local refusal proofs remain intact. Uncertain outcomes do not
become success/failure, and neither native actions nor their uncertain steps replay.
Old operations without admission-captured terms keep their existing billing state;
current policy cannot retroactively manufacture a free bill. Original tariff,
action, provider, scope and fee are revalidated before recovery. No lifetime
settlement or retained-resource cost release is performed by this API proof.

Shared descriptions now explain max_cost:"0" for these API actions, except the
positive lifetime window actions, without widening grants/cleanup allowlists or
native scope. HTTP/MCP/owner discovery and SDK generated descriptions match;
contracts remain 126 / 55 provider mutations plus broker cancellation. Current
source is unverified. No tests, CI inspection, provider calls, secret reads,
production migrations/configuration, publication, deployment or merge. Full
ongoing billing/retention and spend engineering, then final all-provider checks
and adversarial review remain. Final fixtures should cover tariff/action/provider
binding, original-terms recovery, legacy unknown holds, response-checkpoint crash
recovery, zero API versus positive lifetime holds and scope/duplicate settlement.

Implemented: standalone `createInfrastructure()` and `orbio.infra`, distinct
explicit grant credential, public discovery/cache/refresh, typed status/resource/
operation helpers and bounded operation polling. Local abort/timeout never sends
remote cancellation or re-dispatch. Shared machine codes/setup URL/retry guidance
are retained. Failed reads and uncertain mutations have different retry behavior.
Existing manifest refresh retains transport, credentials and signer; legacy
tool discovery also has an explicit refresh method.

Current breadth increment: source fixture/generated types contain 125 contracts / 55 provider writes.
Latest queued cancellation (2026-10-05): operations.cancel(operationId) uses
operation.cancel with only the original operation UUID. It requires infra.read
and the original action permission; creates no new operation, key or ceiling.
Atomic cancellation/dispatch/hold release serialize in the platform. Only a
queued undispatched operation can be cancelled; dispatched/uncertain/terminal
work is returned unchanged. Result has operation, cancelled and
native_cancellation:false. Read the original operation or explicitly repeat that
same cancellation UUID after uncertainty. Timeout/abort never invokes it.
Current source fixture/generated types have 125 contracts / 55 provider writes.
Platform owner history button and shared MCP/HTTP contract are wired. Platform
migration 20261005023000 is unapplied. No checks/tests/CI/native calls/publication.
Final fixtures require the new service cancellation method; billing decisions,
full retention/accounting and all-provider verification remain open.

Prior Fly cleanup increment (2026-10-05): workers.images.delete(resourceId, args)
mirrors exact assigned-repository immutable manifest deletion. Supply digest plus
saved idempotency key/max_cost; max_cost:"0" enables the cleanup admission lane.
Configured/unknown Machine references and unresolved earlier writers prevent
cleanup. A checking fence precedes inventory and a separate single-attempt marker
precedes native DELETE; recovery never repeats DELETE. Publication/create/update/
start/restart for this digest are fenced until resolution, while stop/delete stay
available. Success is historical observed manifest absence, not blob/layer removal,
reclaimed capacity or final charges. Native Fly compatibility remains unverified.
Platform migration 20261005022000 is unapplied; current fixture/generated source
has 124 contracts / 55 provider writes. Generation is engineering output, not
validation. No checks/tests/CI/native calls/publication. Physical retention,
pricing/inbox-payer decisions and final full-stack gates remain. See platform
TOOLKIT_FLY_RETENTION.md and canonical handoff.

Prior Fly artifact increment (2026-10-05): workers.images.retention(resourceId)
reads this app's conservative recorded digest/maximum-declared-byte/begin-count
capacity, not native storage or invoices. App limits are 128 digests, 4 GiB and
1000 begins; account limits are shared without exposing account/other-agent
aggregates. Native usage stays null, cleanup/finality false. Cancel, abandon,
expiry and app deletion do not reclaim counters. Local capacity refusal precedes
native requests and releases only its original no-dispatch operation hold; SDK
recognizes capacity_exceeded as a non-retryable error. Platform migration is
unapplied; generated contracts contain 123 shared calls / 54 provider writes.
No tests/checks/CI/live calls. See platform TOOLKIT_FLY_RETENTION.md. Native
retained-artifact cleanup and pricing-model/inbox-payer decisions remain pending;
this increment does not complete the full release.

Prior platform history collection (2026-10-05): first-time E2B collection now
persists collect/verify offsets/hashes across funding claims, at most two native
100-row/256 KiB reads per run. Resumed head and verification changes restart;
archive/checkpoint failure cannot advance money. Completed scans can outlive
native history outages; incomplete scans cannot. Pricing still requires exact
scope, complete measured execution, captured tariff and immutable shares. Native
rate-limit backoff is bounded by upcoming expiry, with separate broker shutdown
wake for newly necessary revocation/archival/expiry. No new SDK contract; source
breadth remains 122/54. New platform migrations are unapplied; no checks/native
calls. See TOOLKIT_E2B_HISTORY.md; final source/fixture/live/adversarial gates and
remaining all-provider native accounting/retention stay required.

Prior platform accounting recovery (2026-10-05): E2B sibling/retried funding
windows reuse the exact original authenticated archived event only after an
immutable allocation checkpoint exists. Native current-state reads, full subject/
sandbox/event binding, candidate uniqueness/conflicts, captured tariff and lease-
checked share membership remain required. No new SDK surface. Missing/conflicting
proof remains unknown; first-time native collection remains independently bounded
and still needs large/slow-history verification. No checks/native calls.

Prior lifecycle descriptions (2026-10-05): worker.resume now verifies native
created/stopped/suspended/destroyed overall states, refusing failed/transient/
version-specific ambiguity. No implicit Machine start. Platform cleanup uses
the same states and requests at most two stops per claim; confirmed paused Vercel
projects avoid repeated pause writes. Funding task duration is 240 seconds below
the existing five-minute lease. Retained bills stay unknown; no checks/live calls.

Prior mail addition (2026-10-05): mail.metrics.usage/events accept typed selected
inbox metric names, optional UTC start/end and 60/3600/86400 second periods. Native
reads require the manually connected inbox key to authorize metrics; no root
fallback. Defaults use the prior day hourly or 199 minutes for minute periods;
limits are 200 points/type, three usage/four event types, a 90-day past range.
Cumulative usage stocks must not be summed. Missing metrics are null, gaps and
empty arrays do not establish zero or complete reporting; billing_final is false.
Events are aggregate counts, not individual delivery receipts or prices. Platform
strict timestamp/value/scope parsing and a 256 KiB native bound are unverified.
Generation is engineering only; no checks/live calls/publication. See platform
TOOLKIT_MAIL_METRICS.md. Native payer/price/finality/allocation work remains.

Prior finance addition (2026-10-05): resources.spending now includes typed
periods_expected and period_coverage_complete. Platform observation follows
current-month retained costs beyond funding expiry and one missing/stale prior
month per claim. Missing-month totals can understate spend; complete month
coverage is not freshness/finality. Saved protective evidence remains usable
when a new refresh fails. Generated types/README mirror the change; no checks
or provider calls. Native invoice attribution and all-provider accounting remain.

Latest addition (2026-10-05): workers.images.uploads.list/abandon mirror scoped
broker inventory and explicit unknown-begin closure. Upload UUIDs equal original
begin operation UUIDs. Known-session cancel now fences writes after earlier
leases expire; an uncertain DELETE is only recovered by native absence. Abandon
with max_cost:"0" proves no new native dispatch, never original session cleanup
or refund. Public native_session_cleanup distinguishes pending/confirmed_absent/
unconfirmed. Unknown expired/abandoned records retain quota. Execution/billing
admission lanes retain monetary holds separately: 32 active, eight cleanup slots,
10,000 held backlog, unchanged per-minute/grant/budget checks. Generation is
engineering output; no checks/provider calls. Native attribution/retention and
full-stack final verification remain.

Prior addition (2026-10-05): workers.images.blob/publish and uploads.get/begin/
chunk/complete/cancel mirror the platform's exact assigned-repository artifact
path. Callers save original requests/keys/caps and explicitly wait; no bulk loop,
retry, key creation or upstream credentials are introduced. 128 KiB chunks support
512 MiB blobs, fixed upload deadlines and immutable sha256 manifest publication.
Private native URLs remain encrypted server-side. Publication does not build or
start a Machine. Unknown steps block further writes; native cost/retention and
ambiguous-session cleanup remain platform release work. Source unverified;
contract generation is engineering output, not validation.
Latest addition: workers.images.inspect resolves native digest/compressed-size
metadata through the assigned Fly app. Private registry references are exact
app-bound; the platform refuses cross-product/agent repositories before holds
and native dispatch, and on existing Machine start/restart. No token/manifest/
image bytes are returned. Native Fly registry reuse is organization-wide, so
standard deploy tokens remain private. Brokered upload/publish helpers are now
added below; native billing/retention and final workflow verification remain. README/generated schemas/owner discovery match;
new source remains unverified and unpublished.
Latest addition: resources.spending exposes recorded, non-final native cost
observations without a provider call. The platform captures private scoped Vercel
calendar-period evidence and requests production pause at protective high-water
capacity. Public summaries use decimal micro-USD strings, retain deleted-resource
visibility and leave missing evidence null. Final funding/customer charges stay
in funding.list/get. README/generated contracts/owner views mirror the addition;
no tests/CI/native changes/publication. Full all-provider native billing, remaining
workflows and final verification remain required.
Latest addition: deployments.resume/pause and workers.resume reuse original
platform lifecycle funding/receipt rails. Vercel resume prepays a fresh window
before native unpause (explicit production/domain effects), while pause verifies
production paused:true without assuming preview bills ended. Project reads now
include nullable native paused; absence is unknown. Fly resume finances an app
with verified stopped/created/destroyed Machines, then requires a separate
explicit Machine start/create. Overlapping windows are refused; no implicit
restart/redeploy or unknown-zero refund. All 48 provider writes have typed
helpers. README/generated schemas/owner workflows match; no checks/CI/native
calls or publication. Complete native billing/finality/spend/retention remain.

Latest addition: deployments.renew/workers.renew/databases.renew explicitly prepay
one adjacent native-provider window. Broker-only zero API cost is separate from
the positive lifetime hold; no provider restart/deploy/restore occurs. The platform
atomically checks current continuous paid parent, subject, live grant and balance/
budget before reservation/activation. Recovery reads the original immutable window,
never reactivates it or extends the deadline. Native accounting/spending/retention remain platform engineering work in the same release.

Added funding.list(resourceId, pageArgs) and funding.get(fundingId), with generated
public financial shapes. Reads stay scoped to product/agent, include deleted-
resource bills and expose no private evidence/credentials. A null cost is unknown;
future windows do not start compute. The owner panel shows bounded UUID pages,
individual lookup and independent lifetime holds/charges. All 45 provider writes
now have typed helpers. Generation is engineering output only; no checks/CI/
provider calls/publication were performed. Full verification remains deferred.

Prior platform addition: new-project security bootstrap captures policy before
allocation, gates native SQL once under the original funding claim, then reads
native proof and checkpoints readiness. SQL/storage/connection access stays
blocked until resources.get metadata.supabase_bootstrap.state:verified, regardless
of native ACTIVE_HEALTHY. Poll that resource after allocation acceptance; operation
success alone does not prove readiness. Public-table RLS and explicit browser
privileges are initial defaults, not recurring resets of app policy. Generated
MCP/SDK descriptions are updated. Native/Auth/Storage/gate/UX isolation checks are
still deferred; this source remains unverified and unpublished.
Latest addition: databases.storage.buckets get/create/configure/delete and
objects list/read/write/delete/downloadLink. Buckets stay private, uploads use
bounded canonical base64 with explicit overwrite, inline reads refuse oversize,
and deletion never recursively empties a bucket. Download links last 30–300
seconds and survive grant revocation until expiry; receipt recovery never
refreshes them. Native project keys stay in the platform. Storage workload funding,
permissions and exact native project binding are platform enforced. Bootstrap,
native storage/egress accounting and final verification remain unfinished. No
checks/live storage calls/publish were performed; generation is source output.

Prior source fixture/generated types contained 89 contracts.
Latest increment adds workers.logs, workers.volumes list/get/create/extend/delete
and workers.ips list/allocate/release. Generated Machine types add verified volume
mounts and explicit HTTP ingress with no proxy autostart. Omitted HTTP preserves
routing, null disables it; mounts/regions cannot change in-place. Native platform
cost attribution/renewal/image credentials remain unfinished. This increment is
unverified; no checks or live smoke performed.

Prior increment adds mail.labelEvents (native label audit, not delivery
webhooks) and generated inline attachment fields for draft create/update. Uploads
are canonical base64, limited to 10 files/64 KiB each/96 KiB total decoded and
192 KiB serialized draft fields. Remove IDs must belong to the assigned draft.
No remote URLs or automatic upload retry. The platform adds atomic known-cost/
readiness checkpoint recovery; mail monetary attribution remains unfinished.
All current changes are unverified, with checks still deferred.

Prior addition: workspaces.renew explicitly funds a running workspace continuation
under caller-saved arguments/key/ceiling. The platform now has adjacent funding
and native measured execution allocation, immutable lease-checked cost shares,
early native-zero continuation settlement and captured published paused-retention
policy. These changes are unverified, with final checks still deferred. Root keys
remain private; renewal does not start waiting, reconnect or repeat a timeout call.

The preceding 78-contract increment:
The latest 31 additions expose Vercel/Fly/Supabase allocation/control mutations
and assigned-inbox drafts/send/delete/labels, with typed helpers in the existing
provider namespaces. Vercel environment reads preserve their existing method;
setEnvironment/removeEnvironment are explicit additional helpers. Native IDs are
still nested targets, never replacements for resource UUIDs. Positive lifetime
ceilings, active funding and private root credentials are platform responsibilities;
the client neither invents costs nor treats a succeeded operation as settled.
The platform now has catalogue-driven owner workflow controls and authenticated
256 KiB request envelopes for bounded artifacts. Its complete native attribution,
spending enforcement and additional provider features remain release gates.
No checks/tests/CI polling or live calls were performed for this increment.
Generation is engineering output, not verification. Keep version 0.1.0 unpublished;
do not inherit historical green counts below.

Earlier four mail-read additions (thread summaries and signed attachment links)
remain available in source. Attachment links are private and temporary; thread
pages contain summaries, so fetch a message separately for bounded bodies.
Workspace helpers now include files, directories, commands/output/stdin/stop,
process listing and private previews. Mail, deployments, workers and databases
have scoped read helpers with explicit resource UUID arguments. Readable shapes
come from the application catalogue; dynamic SQL rows are caller-typed unknown
data rather than a promise of a particular table schema. Native provider IDs are
nested targets only. This increment is unverified: the user requested finishing
engineering first, then running tests/checks and smoke tests at the end. Earlier
passing counts below do not validate these new helpers. Further provider features
and final full-stack verification remain required. No publish.

The 2026-10-04 lifecycle increment adds typed `workspaces.quote/create/resume/pause/delete`
helpers and regenerates the shared fixture/types for ten public capabilities.
Each mutation requires caller-saved original arguments, an idempotency key and
approved decimal-string ceiling. The client never retries a mutation, generates
a key, raises a ceiling or starts waiting implicitly. Resume/pause/delete reject
native provider IDs before transport. Unknown transport outcomes explain reading
a saved operation UUID or recovering lost admission with the same args/key.
Discovery preserves optional destructive hints and rejects malformed ones.

Types are generated from the platform's shared public capability schemas. Export
them with its `scripts/export-toolkit-contracts.mts` to `src/infra/contracts.json`,
then run `pnpm generate:infra`. `pnpm check:infra` verifies the SHA and generated
file, in CI and before publish. The compiler is dev-only, pinned to 16.0.0;
no provider SDK or new runtime dependency was added.

Verification on 2026-10-04: 35 SDK tests pass (17 existing, 18 infrastructure),
typecheck/lint/generated-file check/build pass, publint and packed ESM/CJS
consumer checks pass. Built SDK was also exercised against the actual platform
shared service and hosted MCP result projection with seven in-memory HTTP calls,
no provider calls or production changes. The ad-hoc parity harness is
`/tmp/orbio-toolkit-sdk-parity.mts`; it uses one consistent application module
loader so errors retain class identity. That harness is not a CI dependency.

Lifecycle increment verification: 40 SDK tests pass (17 existing, 23 infrastructure),
including destructive hints, all typed lifecycle routes, original decimal
ceilings/keys, no automatic retry after a lost reply, local UUID rejection and
quote/read transport errors. Current typecheck, lint, generated-contract check,
build, publint and packed ESM/CJS consumer checks pass. Its ten-tool exported JSON
matches the application descriptor export byte-for-byte. No provider calls,
production changes or publication occurred. After push, inspect this head's CI
separately from earlier read-helper CI `37187651777`.

Historical lifecycle-only checkpoint (superseded by current breadth above):
At that point, remaining work was workspace files/processes/preview and worker/deployment/database/mail helpers and
their finalized mutation/reconciliation/lifetime-cost contracts, full platform
integration and live feature evidence, final adversarial review, version bump and
release preparation. Generating current read types does not implement these
provider features. Lifecycle helpers also do not establish complete billing or
production readiness. Keep generic `infra.call()` available for capabilities added
after a client was released, while each published helper pins its schema.

Release uses the repository's existing npm trusted publishing/OIDC workflow and
an intentional version tag. Do not create a new long-lived npm token as a default.
Confirm release readiness, version/tag agreement and the operator's authorization
at that final step. Provider root secrets never belong in an SDK client;
`ORBIO_INFRA_KEY` is an owner-issued Orbio grant, separate from `ORBIO_API_KEY`.


On 2026-10-05 the SDK worktree was found absent. Both draft PRs were still open
at their prior heads. Restored codex/toolkit-infra-sdk from 844f4c2, restored local
Fly helper edits and regenerated the 115-contract fixture/types. Dependencies
were installed with lifecycle scripts disabled. No tests/checks/CI/provider calls,
publication, tag, merge or main push. App progress remained present in its worktree.

## 2026-10-05: Recorded inbox delivery helpers

Application contracts now total 118. Added infra.mail.delivery.status/list/get
for exact assigned inbox resources. These free broker reads require mail.read;
owner connection/disable remains Privy-only in the application. Results contain
signed event metadata, not email content or secrets. Native occurred time and
broker received time are distinct; ingestion-order cursors bind the same
resource/filter. Events expire after 30 days. Sent is not delivered; missing
receipts are unknown. See application docs/TOOLKIT_MAIL_DELIVERY.md for manual
native webhook setup, callback limits, signatures and reconnection semantics.
Generated source only: no tests/build/package checks, publish or live calls.
Full billing/retention and final all-provider verification remain outstanding.
