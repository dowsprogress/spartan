---
name: storybook-theme-safety
description: >
  Change theme tokens, dark-mode overrides, or Storybook cascade-sensitive CSS without introducing
  regressions. Use this skill whenever a task touches PDP/light/dark token values, semantic token
  tiers, or selector specificity in Storybook — it enforces the repo's known-fragile guardrails
  (token layering, `:root.style-pdp` vs `.style-pdp.dark`, separate placeholder/muted tiers) and
  requires light/dark + interactive-state verification before the change is done.
---

# Storybook theme safety

## Purpose

Change theme/tokens in Storybook without introducing cascade regressions.

## Critical guardrails

- Keep light PDP tokens on `:root.style-pdp`.
- Keep dark overrides on `.style-pdp.dark`.
- Do not re-apply `style-pdp` on `<body>` bootstrap scripts.
- Keep `--pdp-placeholder` and `--muted-foreground` as separate semantic tiers.

## Procedure

1. Identify token/state issue and affected components.
2. Prefer semantic token adjustments over per-component overrides.
3. Check for selector specificity and source-order impacts before changing values.
4. Recheck related states/components likely to share the same token.

## Validation

1. Build Storybook: `pnpm nx run ui-storybook:build-storybook`.
2. Verify affected stories in light and dark.
3. Verify hover/focus/disabled/invalid states where applicable.

## Common failure modes

- `:root` defaults overriding PDP light tokens.
- Dark class applied on `html` while tokens are hard-set on `body`.
- One token reused for multiple semantic tiers causing hierarchy regressions.
