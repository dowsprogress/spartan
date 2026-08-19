# Working in this repo (notes for Claude / AI agents)

Conventions for this nx workspace, written to avoid the common CI failures.

## Remote target

- Always work against the `fork` remote (`dowsprogress/spartan`), never `origin`
  (`spartan-ng/spartan` upstream). Push/merge/PR instructions target `fork` unless told otherwise.
  See `AGENTS.md` for the full rule (that file wins on any conflict).

## Adding a new helm component: required steps (do all of these, not just the code)

Missing either of these two steps is what caused CI to fail (`commitlint` + `unit`) after the
`conversation` component was first added - do both in the _same_ commit that adds the component:

1. **Register the scope.** Add the new component's kebab-case name to the `scope-enum` array in
   `commitlint.config.cjs` (keep it alphabetically sorted) AND to the scope list in
   `CONTRIBUTING.md` under "Primitives". Without this, any `feat(<scope>): ...` / `fix(<scope>): ...`
   commit for the new component fails `commitlint` CI.
2. **Regenerate the docs snapshot.** `libs/tools/src/executors/docs/generate-ui-docs` has a
   snapshot test (`executor.spec.ts`) that dumps the generated docs metadata for _every_ component.
   Adding a component, or changing any component's public inputs/outputs/selector, makes that
   snapshot stale and fails `tools:test` (part of the `unit` CI job). Run
   `npx nx test tools -- -u` after such changes and commit the updated `.snap` file.

## Before pushing: run the CI checks locally

CI (`.github/workflows/ci.yml`) runs 5 jobs: `commitlint`, `format-and-lint`, `build`, `unit`,
`e2e`. Run the equivalents below locally first so a push does not bounce on something avoidable:

- `pnpm run lint`
- `pnpm nx format:write` then `pnpm nx format:check --base=origin/main` - the `format-and-lint`
  job fails on any unformatted file; `format:write` fixes them. Run this AFTER any code change,
  including ones a linter/formatter made, and re-check before committing.
- `pnpm run test`
- `pnpm run build`
- If the change touches Storybook stories/e2e-relevant behavior: `pnpm nx affected -t e2e
--exclude=trpc-app-e2e --parallel=1` - the `e2e` job runs Cypress against Storybook
  (`ui-storybook:static-storybook`) and is easy to forget since it's independent of `build`/`unit`.
- The `unit` CI job runs `pnpm nx affected -t test --parallel=3`, NOT just the project(s) you
  touched directly. Changes to shared files (e.g. `tsconfig.base.json`, `libs/cli/*`) can mark many
  more projects as affected than expected. Reproduce exactly what CI runs before pushing:
  `npx nx affected -t test --parallel=3 --base=<last-pushed-sha> --head=HEAD` (use
  `npx nx show projects --affected --base=<last-pushed-sha>` to see which projects will run).
- Reproduce the `commitlint` CI check directly for your commit range before pushing:
  `npx commitlint --from=<last-pushed-sha> --to=HEAD --verbose` (merge commits are auto-ignored by
  commitlint's default merge-pattern detection, so they never need a valid scope/type).

## Workflow jobs must have `timeout-minutes`

Every job in `.github/workflows/*.yml` must set `timeout-minutes` (see AGENTS.md). Without it a
hung step blocks the job - and anything that `needs:` it - for up to GitHub's 6-hour default with
no automatic recovery (this happened to `release / verify-libs`). Size new timeouts with headroom
over observed real duration; never delete the field to silence a legitimate timeout failure.

## Playwright `--with-deps` install needs a retry + per-attempt timeout (see AGENTS.md)

`ci.yml`'s `unit` job and `release.yml`'s `verify-libs` job both wrap
`pnpm exec playwright install --with-deps chromium` in a `timeout 180 ... ` retry loop (3
attempts) because the bare command has hung indefinitely on a stuck apt mirror, silently eating
the whole job timeout. Don't revert to the bare command; copy the retry loop for any new job that
needs `--with-deps` Chromium.

## Cypress e2e retries (see AGENTS.md)

`apps/ui-storybook-e2e/cypress.config.cjs` retries failed tests up to 3 times in CI
(`retries.runMode`) because the suite runs as one long single-process Chromium session and
individual assertions occasionally exceed the command timeout under load. A spec failing all
retries once, with no related code change, is more likely CI-load flakiness than a regression -
re-run before investigating. A spec failing repeatedly across multiple pushes is a real
regression/chronic flake and needs a targeted fix, not a bigger retry count.

## `release` job only runs for real on `spartan-ng/spartan` (see AGENTS.md)

The `release` job in `release.yml` is gated with `github.repository == 'spartan-ng/spartan'`.
Without this, every push to `fork/main` runs `semantic-release`, which attempts a real
`npm publish` of `@spartan-ng/brain`/`cli`/`mcp` - the fork has no publish rights to that npm
scope, so this fails 100% of the time with a 404, not a fixable/flaky error. Do not remove this
guard; `verify-libs`/`verify-smoke` still run and validate the fork's build/test/smoke.

## Commit messages (Conventional Commits, enforced by commitlint with `failOnWarnings`)

See `commitlint.config.cjs` and `CONTRIBUTING.md`.

- Format: `<type>(<scope>): <subject>` - the scope is OPTIONAL.
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
  `chore`, `revert`.
- If you include a scope it MUST be one of the `scope-enum` values (the component names plus
  `cli`, `nx`, `repo`, `trpc`, `typography`). NOTE: `app` and `skills` are NOT valid scopes -
  omit the scope, or use `repo` for repo-tooling/meta/docs-process changes, rather than
  inventing one. Check first: `grep -n "'<scope>'" commitlint.config.cjs`.
- A blank line is required between the subject and the body, and before the footer.
- No line in the message may exceed 100 characters.
- Do NOT add a `Co-Authored-By` (or any AI) trailer.
- If a bad scope already reached `fork/main`, do NOT amend + force-push to fix it: rewriting an
  already-merged commit changes its SHA, which invalidates the "before" SHA GitHub recorded for
  that push event and makes the _next_ CI run fail with `Invalid revision range` instead. Accept
  that one historical run as unfixable and prevent it going forward instead.

## Pull requests

- Always populate `.github/PULL_REQUEST_TEMPLATE.md`: tick the checklist, the PR type, the affected
  package(s), and fill "current behavior" / "new behavior" / breaking-change. Create with
  `gh pr create --body-file <filled-template-file>`.
