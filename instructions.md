# Spartan implementation playbook

Sequential workflow for implementing UI/design-system changes. The rules themselves live in
`AGENTS.md` (that file wins on any conflict) - this file only orders them into steps and adds the
procedure that isn't covered there.

1. Confirm the user's goal and the affected stories/screens.
2. If AI Elements-related, read the React reference first (see AGENTS.md "External reference")
   before writing any markup/styles.
3. Map the request to existing Spartan primitives; compose per AGENTS.md "Composition-first rule".
   If the mapping is unclear, stop and escalate per AGENTS.md "If component mapping is unclear"
   before creating anything new.
4. Implement, following AGENTS.md "Theming and cascade guardrails" for any token/theme changes.
5. For any intentional divergence from the React reference, log: what differs, why, the UX
   impact, and where it's implemented (file/path). Include this note in the PR description when a
   PR is created.
6. Validate per AGENTS.md "Required checks before completion".
7. Release (commit/push/PR) only on explicit instruction, per AGENTS.md "Delivery and release
   control".
