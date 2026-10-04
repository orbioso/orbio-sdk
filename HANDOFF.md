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

Remaining: provider workspace/worker/deployment/database/mail typed helpers and
their finalized mutation/reconciliation/lifetime-cost contracts, full platform
integration and live feature evidence, final adversarial review, version bump and
release preparation. Generating current read types does not implement these
provider features. Keep generic `infra.call()` available for capabilities added
after a client was released, while each published helper pins its schema.

Release uses the repository's existing npm trusted publishing/OIDC workflow and
an intentional version tag. Do not create a new long-lived npm token as a default.
Confirm release readiness, version/tag agreement and the operator's authorization
at that final step. Provider root secrets never belong in an SDK client;
`ORBIO_INFRA_KEY` is an owner-issued Orbio grant, separate from `ORBIO_API_KEY`.
