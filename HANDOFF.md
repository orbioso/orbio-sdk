# Scoped infrastructure SDK continuation

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

Implemented: standalone `createInfrastructure()` and `orbio.infra`, distinct
explicit grant credential, public discovery/cache/refresh, typed status/resource/
operation helpers and bounded operation polling. Local abort/timeout never sends
remote cancellation or re-dispatch. Shared machine codes/setup URL/retry guidance
are retained. Failed reads and uncertain mutations have different retry behavior.
Existing manifest refresh retains transport, credentials and signer; legacy
tool discovery also has an explicit refresh method.

Current breadth increment: source fixture/generated types contain 47 contracts.

The latest four additions are mail.thread.list/get and mail.message.attachment/
mail.draft.attachment. Typed helpers are under mail.threads and the existing
mail.messages/mail.drafts namespaces. Attachment links are private and temporary;
thread pages contain summaries, so fetch a message separately for bounded bodies.
This increment is unverified: the user explicitly deferred tests/checks/CI/smoke
runs until the whole engineering stack is implemented. Do not inherit prior green
results. Internal platform mutations for the remaining providers are in progress;
their public accounting contracts/helpers remain required in the same release.
Workspace helpers now include files, directories, commands/output/stdin/stop,
process listing and private previews. Mail, deployments, workers and databases
have scoped read helpers with explicit resource UUID arguments. Readable shapes
come from the application catalogue; dynamic SQL rows are caller-typed unknown
data rather than a promise of a particular table schema. Native provider IDs are
nested targets only. This increment is unverified: the user requested finishing
engineering first, then running tests/checks and smoke tests at the end. Earlier
passing counts below do not validate these new helpers. Remaining provider
mutation helpers wait for the application's funded action contracts. No publish.

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

Remaining: workspace files/processes/preview and worker/deployment/database/mail helpers and
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
