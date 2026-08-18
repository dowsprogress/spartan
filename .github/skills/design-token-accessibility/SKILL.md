---
name: design-token-accessibility
description: >
  Validate Spartan design tokens (Tailwind v4 + CSS custom properties, shadcn-style :root
  variables) for WCAG 2.2 AA/AAA contrast, focus-ring compliance, and touch-target sizing. Use
  this skill whenever a task adds/changes a color token, focus ring, or interactive-state style,
  or whenever contrast/accessibility of a theme change needs to be checked.
---

# Design token accessibility (contrast, focus rings, touch targets)

Adapted from the MIT-licensed `design-system` skill in
[Community-Access/accessibility-agents](https://github.com/Community-Access/accessibility-agents)
(Copyright (c) 2026 Taylor Arndt), trimmed to the parts relevant to this repo's stack (Tailwind v4
CSS custom properties / shadcn-style tokens). Framework sections for stacks this repo doesn't use
(MUI, Chakra) were removed to avoid bloat.

## WCAG contrast ratio - computation reference

```js
function relativeLuminance(hex) {
	const c = hex
		.replace('#', '')
		.match(/.{2}/g)
		.map((h) => parseInt(h, 16) / 255)
		.map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
	return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function contrastRatio(hex1, hex2) {
	const L1 = relativeLuminance(hex1);
	const L2 = relativeLuminance(hex2);
	const lighter = Math.max(L1, L2);
	const darker = Math.min(L1, L2);
	return (lighter + 0.05) / (darker + 0.05);
}
```

HSL-to-hex is needed since shadcn-style `:root` variables store HSL triplets:

```js
function hslToHex(h, s, l) {
	s /= 100;
	l /= 100;
	const a = s * Math.min(l, 1 - l);
	const f = (n) => {
		const k = (n + h / 30) % 12;
		return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	};
	return (
		'#' +
		[f(0), f(8), f(4)]
			.map((x) =>
				Math.round(x * 255)
					.toString(16)
					.padStart(2, '0'),
			)
			.join('')
	);
}
```

## WCAG contrast thresholds

| Use case                                | AA     | AAA    | Notes                       |
| --------------------------------------- | ------ | ------ | --------------------------- |
| Normal text (< 18pt / < 14pt bold)      | 4.5:1  | 7:1    | Most body text              |
| Large text (>= 18pt / >= 14pt bold)     | 3:1    | 4.5:1  | Headings, display text      |
| UI components (borders, icons)          | 3:1    | -      | Input borders, icon buttons |
| Focus indicators (WCAG 2.4.13 / 2.4.11) | 3:1    | -      | Against adjacent colors     |
| Placeholder text                        | 4.5:1  | -      | Counts as normal text       |
| Disabled state                          | Exempt | Exempt | Documented exemption        |

## shadcn-style CSS variable tokens (this repo's pattern)

```css
/* HSL triplets without hsl() wrapper - this repo's token convention */
:root {
	--background: 0 0% 100%;
	--foreground: 222.2 84% 4.9%;
	--muted-foreground: 215.4 16.3% 46.9%; /* HIGH RISK - check against --background */
	--destructive: 0 84.2% 60.2%; /* HIGH RISK - red on white, common failure */
	--border: 214.3 31.8% 91.4%; /* UI component - check 3:1 */
	--ring: 222.2 84% 4.9%; /* Focus ring - check 3:1 */
}
.dark {
	/* ... all dark mode variants must be checked too, per this repo's theming guardrails */
}
```

Known high-risk pairs to check whenever these tokens are touched: `--muted-foreground` on
`--background`, `--destructive` on `--background`, and any `--*-foreground` pair introduced for a
new variant.

## Focus ring requirements (WCAG 2.4.13, exceeds 2.4.7 AA baseline)

1. **Area:** indicator encloses the component OR has perimeter >= component perimeter x 2px.
2. **Contrast change:** indicator area must change contrast by >= 3:1 between focused/unfocused.
3. **Not obscured:** must not be hidden by other authored content.

```css
/* Minimum compliant pattern */
:focus-visible {
	outline: 2px solid var(--ring);
	outline-offset: 2px;
}

/* Violation patterns to grep for before calling theming work done */
:focus {
	outline: none;
} /* hard fail */
:focus-visible {
	outline: none;
} /* hard fail */
```

## Touch target sizing

| Check                                   | Requirement |
| --------------------------------------- | ----------- |
| Touch target below 24x24px (WCAG 2.5.8) | Error       |
| Touch target below 44x44px (WCAG 2.5.5) | Warning     |

## Storybook a11y check (this repo already ships `ui-storybook`)

```bash
npm install --save-dev @storybook/addon-a11y
```

```js
// apps/ui-storybook/.storybook/preview.ts (or main.ts addons array)
export const parameters = {
	a11y: {
		config: {
			rules: [
				{ id: 'color-contrast', enabled: true },
				{ id: 'focus-visible', enabled: true },
				{ id: 'target-size', enabled: true },
			],
		},
	},
};
```

## Token file discovery

```bash
find libs/registry libs/helm -type f \( -name "*.css" -o -name "tokens.json" \) -not -path "*/node_modules/*"
```

## Severity classification

| Finding                                    | Severity |
| ------------------------------------------ | -------- |
| Text token below 3:1                       | Critical |
| Text token 3:1-4.49:1 (normal text)        | Error    |
| UI component token below 3:1               | Error    |
| Focus ring missing entirely                | Critical |
| Focus ring below 2px or below 3:1 contrast | Error    |
| Touch target below 24x24px                 | Error    |
| Touch target below 44x44px                 | Warning  |
