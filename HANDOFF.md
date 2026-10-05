# Infrastructure SDK handoff

Updated 2026-10-05. Current context for [SDK PR #1](https://github.com/orbioso/orbio-sdk/pull/1), branch `codex/toolkit-infra-sdk`, paired with [platform PR #318](https://github.com/orbioso/orbio/pull/318). Earlier engineering decisions and progress are preserved in [HANDOFF_HISTORY.md](HANDOFF_HISTORY.md); obsolete blockers there are superseded by this file.

## Scope and settled decisions

The user requested the complete E2B, Vercel, Fly, Supabase and AgentMail engineering, UI, MCP, SDK and documentation stack together. Orbio pays upstream providers, defaults to a **15% surcharge**, and absorbs unmetered costs for launch. No pricing/payer question is pending. Toolkit organizations and credentials remain separate from Orbio's own production setup. There is one live inbox per stable agent UUID; explicit `mail.manage` creation is now supported. Keys/tokens do not create additional inboxes.

The SDK mirrors 133 capability contracts and 60 provider mutations. `createInfrastructure` needs only the owner's scoped `orbio_infra_` key or assigned Orbio OAuth token. The server enforces account/product/agent scope. No upstream credentials, automatic provider OAuth, native IDs as authorization, implicit renewal or mutation retry are added. The release version is prepared as 0.2.0 and is not yet published on npm.

## Implemented client surfaces

- Discovery/status/pricing, resources and recorded spending, paginated operations, explicit queued cancellation and bounded read-only wait/reconnection.
- E2B finite create/resume/renew/pause/delete; files, directories, commands/stdin/output/processes and private previews.
- Vercel project/config/env/upload/status/logs/promotion/rollback/lifecycle. The first upload becomes production. Later uploads default to preview; `target: 'production'` explicitly creates a production build. Preview builds cannot be directly promoted.
- Fly lifecycle, Machines/exec/logs, volumes, HTTP/IPs and scoped immutable images with chunk upload/publish/cancel/abandon/delete and recorded capacity.
- Supabase project lifecycle, initial bootstrap readiness, read-only SQL/write/migrations, private storage and expiring download links.
- AgentMail explicit create/renew, drafts/send/read/delete, threads/labels/attachments, delivery records and metrics. Creation includes one calendar month for 2.30 CREDIT at the default margin; renewal adds a month. Sends cost 0.05 CREDIT per action (1–20 recipients), with no additional markup. Reads/drafts/deletion are free. No auto-renewal or operator billing-date/allowance gate.
- Funding reads include captured margin, report accrual and sampled-capacity fields: `metered_micro_usd`, `metered_ms`, `meter_observed_at`, `meter_error`, `cleanup_pending`.

Money stays integer micro-USD, bounded by the original approval. E2B uses measured execution allocation; Vercel uses capped project reports and corrections; Fly/Supabase use captured sampled tariffs; mail uses an explicit prepaid allocation. Unmetered costs are absorbed. Financial closure and native cleanup are separate. Preserve original request/idempotency key and operation UUID; an uncertain reply never authorizes replay.

## Verification

40 SDK tests pass. Typecheck, build, reproducible contract generation, `publint --strict`, packed CJS/ESM declarations and `attw --pack` pass. Platform verification includes 1,268 Node tests (eight skipped), full disposable Postgres migrations/financial/scope checks, build/type/lint and representative live workflows on all five providers. See the [platform verification record](https://github.com/orbioso/orbio/blob/codex/toolkit-infra-handoff/docs/TOOLKIT_VERIFICATION.md) for exact coverage and limitations. This is not a claim that every API permutation or a production rollout was tested.

## Fresh user-path QA follow-up

Real SDK and MCP requests were exercised through the platform HTTP routes, durable
store/runner and a disposable local control database, with real native providers.
The SDK held only an Orbio scoped key. Next.js creation/build/private preview,
reconnection/pause/resume, public Vercel deployment, public Fly HTTP server,
Supabase SQL/RLS/storage, AgentMail capacity/draft/send/read/delete and sibling
agent denial passed. Temporary resources and test keys were removed. One first
Supabase migration receipt remained uncertain and was not replayed; a separate
migration succeeded. The original test project was then deleted.

Contracts now expose Vercel deployment aliases. README explains generated URL
protection, the bounded Next.js build recipe, pause/funding timing and mail-key
permissions. Platform fixes and desktop/mobile dashboard checks are documented
in [user journey evidence](https://github.com/orbioso/orbio/blob/codex/toolkit-infra-handoff/docs/TOOLKIT_USER_JOURNEY.md).
This does not cover production Privy/OAuth sign-in, hosted scheduling, native invoice
periods or independent external email delivery. The operator confirms Developer
AgentMail. The new self-service journey passed pricing/create/renew/free drafts/fixed send/MCP reads/sibling denial/delete. All three follow-up native inboxes and local grants were cleaned up; private fixture ledgers were archived. Operator renewal timestamps are no longer required.

## Generation and rollout

Export the platform's shared catalogue to `src/infra/contracts.json`, then run `pnpm generate:infra`; `pnpm check:infra` verifies reproducibility. Do not hand-edit generated declarations or installed packages. Known helpers use generated types; `infra.call` can use future discovered names without silently transforming their responses.

Review latest-head CI for both PRs. Coordinate platform migrations/configuration and scheduled workers with authenticated SDK publication and feature activation. The platform feature remains off and production migrations unapplied. The user explicitly authorized SDK publication and completed npm CLI authentication as `orbiodotso`. Publish 0.2.0 after checks, verify the registry and record its result here. App merge/production activation remain coordinated release actions. Main operational continuation document: [platform handoff](https://github.com/orbioso/orbio/blob/codex/toolkit-infra-handoff/docs/TOOLKIT_INFRA_HANDOFF.md).
