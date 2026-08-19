import { VERSION } from '@angular/core';

// angular dependency
export const FALLBACK_ANGULAR_VERSION = `^${VERSION.major}.0.0`;
export const FALLBACK_ANGULAR_CDK_VERSION = `^${VERSION.major}.0.0`;

// ng-icon dependency
export const NG_ICONS_VERSION = '^32.2.0';

// dev dependencies
export const TAILWIND_MERGE_VERSION = '^3.5.0';
export const TW_ANIMATE_CSS = '^1.4.0';
// prismjs (used by hlm-message-code-block) ships no bundled types; the runtime package is
// declared as a peerDependency in supported-ui-libraries.json, but the type declarations need to
// land in devDependencies so consumer builds can resolve `import('prismjs')` type-only usages.
export const PRISMJS_TYPES_VERSION = '^1.26.4';
