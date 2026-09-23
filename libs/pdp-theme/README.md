# `@progress/pdp-theme`

Shared Progress Design System theme for Tailwind CSS v4. The package contains no JavaScript and no
framework runtime.

Color, typography, radius, and state values are mapped from the compiled
[`public/css/pdp_styles.css`](https://github.com/Progress-Data-Platform/PDP-Design-System/blob/main/public/css/pdp_styles.css)
contract in the PDP Design System repository. Semantic aliases that do not exist there, such as
Spartan sidebar roles, resolve directly to the nearest canonical PDP surface and state tokens.

## Universal Tailwind theme

Import the theme after Tailwind in both Angular and React applications:

```css
@import 'tailwindcss';
@import '@progress/pdp-theme';
```

Apply `style-pdp` to the root HTML element. Add `dark` for dark mode:

```html
<html class="style-pdp">
	<html class="style-pdp dark"></html>
</html>
```

The package defines the semantic variables consumed by utilities such as `bg-primary`,
`text-muted-foreground`, `border-border`, and `ring-ring`. It also exposes explicit state utilities
including `bg-primary-hover`, `bg-primary-active`, `bg-secondary-hover`, `text-link`, and
`text-placeholder`.

Progress Sans is not distributed with this package. Each application must load the licensed font
files and make either the `Progress Sans Text` or canonical `ProgressSansText` family available.

## Spartan

Spartan applications also import the compatibility adapter after the selected Spartan style:

```css
@import '@spartan-ng/brain/hlm-tailwind-preset.css';
@import '@progress/pdp-theme';
@import '@progress/pdp-theme/spartan.css';
```

Alternatively, `@progress/pdp-theme/all.css` imports both the universal theme and Spartan adapter.
The adapter only maps Spartan Sonner variables to the universal PDP semantic tokens. Nova consumes
the universal interaction, link, and placeholder tokens directly.

PDP typography follows the compiled design-system contract: body text uses regular weight (400),
interactive medium text uses 500, and semibold text uses 600. The package does not patch individual
Spartan components to force lighter text or custom spacing.
