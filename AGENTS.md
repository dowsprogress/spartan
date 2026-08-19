# Spartan repo instructions for AI contributors

This file is the repo-specific contract. If anything conflicts with global/personal instructions, this file wins.

## External reference (AI Elements)

- Canonical behavior/spec reference: https://elements.ai-sdk.dev
- Component reference example: https://elements.ai-sdk.dev/components/attachments
- For AI Elements work, React docs/examples are the parity source; implement Angular equivalents in Spartan.

## Repo skills (real, invocable — `.github/skills/`)

These are the only skills that exist for this repo. Each is a proper `SKILL.md` (name +
description frontmatter) that the `skill` tool can load. Do not reference, invoke, or invent any
skill name that is not one of these seven:

- `ai-elements-parity` - React -> Angular parity for AI Elements-style components.
- `nx-validation-gates` - required lint/format/test/build checks before a change is done.
- `pages-deploy` - Storybook -> GitHub Pages deploy workflow.
- `storybook-theme-safety` - theme/token/cascade changes in Storybook.
- `design-token-accessibility` - WCAG contrast/focus-ring/touch-target validation for color and
  interactive-state tokens. Adapted from a real, MIT-licensed community skill (source and license
  noted in the file) - use for any color token, focus ring, or interactive-state change.
- `anti-ui-slop` - forces a design-contract + finish-gate before UI work is called done, to avoid
  generic-looking output. Verbatim copy of the real MIT-licensed `github/awesome-copilot` skill
  (source noted in the file) - use for any new UI pattern/screen, not incremental token tweaks.
- `ui-screenshots` - concrete Playwright + PIL before/after screenshot capture workflow (requires
  `pip install playwright Pillow` + `playwright install chromium`). Verbatim copy of the real
  MIT-licensed `github/awesome-copilot` skill (source noted in the file) - use to produce visual
  evidence for any visible UI change.

If a task needs a workflow not covered above, do not fabricate a skill name — either follow the
plain instructions in this file/`instructions.md`, or propose adding a new real `SKILL.md` under
`.github/skills/` and confirm before creating it.

## Composition-first rule (non-negotiable)

- Build larger patterns by composing existing Spartan primitives first (helm/registry components, variants, wrappers, tokens).
- Do not introduce bespoke structure/styles when an equivalent system pattern already exists.
- Do not hardcode visual values (color, spacing, radius, typography) when semantic tokens exist.

## If component mapping is unclear

- Call out uncertainty explicitly.
- Propose the closest existing primitives/variants first.
- Do not create a new primitive/variant without justification.
- If divergence from React reference is required, document: what differs, why, and UX impact.

## Theming and cascade guardrails (critical)

- Keep PDP light tokens on `:root.style-pdp` (not plain `.style-pdp`) to out-specify default `:root` tokens.
- Keep dark overrides on `.style-pdp.dark`.
- Do not attach `style-pdp` directly to `<body>` bootstrap scripts; theme switching is controlled on `<html>`.
- Keep placeholder and muted hierarchy separate (`--pdp-placeholder` vs `--muted-foreground`).

## UI quality bar

- Preserve state coverage for changed UI: default, hover, active, focus-visible, disabled, invalid.
- Validate light and dark mode parity for visual changes.
- Prefer semantic token updates over per-component one-off overrides.

## Definition of Done (required)

- React AI Elements parity checked for behavior/structure/states on impacted components.
- Light and dark mode behavior verified for changed UI.
- Interactive state coverage verified: default, hover, active, focus-visible, disabled, invalid.
- Required repo checks completed for the scope of change.
- Diff is scoped to requested work with no unrelated file drift.

## Delivery and release control

- Never commit unless explicitly instructed: "commit".
- Never push unless explicitly instructed: "push".
- Never create a PR unless explicitly instructed: "create PR".
- Default is local, review-ready working changes only.

## Remote target (critical — always the fork, never upstream)

- All work in this repo happens against the `fork` remote (`dowsprogress/spartan`), never
  `origin` (`spartan-ng/spartan`, the upstream project repo).
- "push", "merge", "merge to fork/main", and PR instructions always mean the `fork` remote
  and its branches, unless explicitly told otherwise.
- Never push, merge into, or open a PR against `origin`/upstream without explicit instruction.
- When in doubt, confirm with `git remote -v` before any push/merge and target `fork`.

## Required checks before completion

- `pnpm run lint`
- `pnpm nx format:write`
- `pnpm nx format:check --base=origin/main`
- Targeted tests where relevant (or `pnpm run test` when needed)
- Targeted build where relevant (or `pnpm run build` when needed)
- Storybook/theme work: `pnpm nx run ui-storybook:build-storybook`
- Storybook/e2e-relevant work: `pnpm nx affected -t e2e --exclude=trpc-app-e2e` (CI's `e2e` job runs
  Cypress against Storybook; this is the 5th CI job and is easy to miss)

## GitHub Actions workflow jobs (required — prevents indefinite hangs)

- Every job in every `.github/workflows/*.yml` file MUST set `timeout-minutes`. None had one
  historically, which let a single hung step (e.g. a stalled Playwright/network install) block a
  job — and everything that `needs:` it — for up to GitHub's 6-hour default, with no automatic
  recovery (this happened to `release / verify-libs`).
- When adding a new job, size the timeout to its real-world duration with headroom (roughly
  2-3x observed wall-clock), not a generous guess: 5 min for trivial aggregator/gate jobs, 10-15
  min for install+lint/git-only jobs, 20 min for build/test/smoke-matrix jobs.
- If a job starts legitimately needing more time, raise its `timeout-minutes` explicitly in the
  same commit — never remove the field to "fix" a timeout failure.

## Releasing only happens on the canonical repo (critical — prevents guaranteed npm publish failures)

- `.github/workflows/release.yml`'s `release` job is gated with
  `github.repository == 'spartan-ng/spartan'`. Do not remove this guard.
- Without it, every push to `fork/main` runs `semantic-release`, which attempts a real
  `npm publish` of `@spartan-ng/brain`/`cli`/`mcp` to the public npm registry. The fork has no
  publish rights to the `@spartan-ng` scope, so this **always** fails with a 404
  ("could not be found or you do not have permission to access it") — it is not a flaky or
  fixable failure, it is structurally guaranteed to fail on any non-upstream repo.
- `verify-libs`/`verify-smoke`/`verify` still run on the fork (useful — they validate the
  publishable libs build/lint/test/smoke cleanly) and are unaffected by this guard.
- `backmerge` needs `release`; when `release` is skipped (fork), `backmerge` is automatically
  skipped too by GitHub Actions' default `needs` success semantics — no extra guard required
  there.
- If you ever need to test the actual publish step from a fork, use `workflow_dispatch` with
  `dry-run: true` (semantic-release computes the release without publishing) rather than removing
  the repository guard.

## Commit/PR conventions

- Follow Conventional Commits and repo commitlint rules from `CONTRIBUTING.md` and `commitlint.config.cjs`.
- Use valid scopes only; omit scope if no valid scope applies. Do not invent a new scope for a
  one-off change — check `commitlint.config.cjs`'s `scope-enum` first and reuse the closest
  existing scope (e.g. `repo` for repo-tooling/meta/docs-process changes). Before writing a commit
  message with a scope, grep for it: `grep -n "'<scope>'" commitlint.config.cjs`. If it's not
  there, either use `repo`/omit the scope, or add the scope to _both_ `commitlint.config.cjs` and
  `CONTRIBUTING.md`'s scope list in the same commit and confirm with the user first.
- Before pushing, reproduce the CI check exactly: `npx commitlint --from=<last-pushed-sha>
--to=HEAD --verbose` (see CLAUDE.md). Do this for every commit that carries a scope, not just
  ones touching helm components.

## History rewrites on `fork/main` (critical — avoid amend + force-push after merge)

- Do not `git commit --amend` + force-push a commit that is already merged into `fork/main` to
  "fix" a red check (e.g. a bad commitlint scope). GitHub's CI computes the commitlint diff range
  from the push event's recorded before/after SHAs; rewriting history invalidates the old
  "before" SHA, which makes the _next_ CI run fail with `Invalid revision range` — a second,
  harder-to-diagnose failure caused by the fix itself.
- If a bad commit message already reached `fork/main`, treat that specific CI run as permanently
  historical/unfixable and move on — it does not block anything without an open PR/branch
  protection. Prevent the class of bug going forward instead (see scope-checking rule above).
- Only amend + force-push an already-pushed commit on `fork/main` if explicitly instructed to do
  so, understanding it will not turn today's failing run green — it only fixes future pushes.
- Fill `.github/PULL_REQUEST_TEMPLATE.md` completely when creating PRs.
