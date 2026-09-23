import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = fileURLToPath(new URL('..', import.meta.url));
const theme = readFileSync(join(packageRoot, 'theme.css'), 'utf8');
const adapter = readFileSync(join(packageRoot, 'spartan.css'), 'utf8');
const packageJson = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
const source = `${theme}\n${adapter}`;

const fail = (message) => {
	console.error(`PDP theme validation failed: ${message}`);
	process.exitCode = 1;
};

const declarations = (css) => new Set([...css.matchAll(/--([\w-]+)\s*:/g)].map((match) => match[1]));

const definedProperties = declarations(source);
const referencedProperties = new Set([...source.matchAll(/var\(--([\w-]+)/g)].map((match) => match[1]));
const unresolvedProperties = [...referencedProperties].filter((property) => !definedProperties.has(property));

if (unresolvedProperties.length > 0) {
	fail(`unresolved custom properties: ${unresolvedProperties.sort().join(', ')}`);
}

if (!theme.includes('@theme inline')) {
	fail('theme.css must use @theme inline so utilities follow runtime theme values');
}

const lightBlock = theme.match(/:root\.style-pdp\s*\{([\s\S]*?)\n\}/)?.[1];
const darkBlock = theme.match(/\.style-pdp\.dark\s*\{([\s\S]*?)\n\}/)?.[1];

if (!lightBlock || !darkBlock) {
	fail('theme.css must define both :root.style-pdp and .style-pdp.dark');
} else {
	const lightProperties = declarations(lightBlock);
	const darkProperties = declarations(darkBlock);
	const requiredColorProperties = [...theme.matchAll(/--color-[\w-]+:\s*var\(--([\w-]+)\)/g)].map((match) => match[1]);

	for (const property of new Set(requiredColorProperties)) {
		if (!lightProperties.has(property)) {
			fail(`light theme is missing --${property}`);
		}
		if (!darkProperties.has(property)) {
			fail(`dark theme is missing --${property}`);
		}
	}
}

if (/\.style-pdp\s+[.#[]/.test(adapter)) {
	fail('spartan.css must use variable integration instead of component selector overrides');
}

const requiredFallbackMappings = [
	'color-primary-hover',
	'color-primary-active',
	'color-secondary-hover',
	'color-secondary-active',
	'color-link',
	'color-link-hover',
	'color-placeholder',
	'radius-sm',
	'radius-md',
	'radius-lg',
	'radius-xl',
	'radius-2xl',
	'radius-3xl',
	'radius-4xl',
];

for (const property of requiredFallbackMappings) {
	const declaration = theme.match(new RegExp(`--${property}:([\\s\\S]*?);`))?.[1];
	if (!declaration?.includes(',')) {
		fail(`--${property} must preserve a non-PDP fallback`);
	}
}

for (const target of Object.values(packageJson.exports)) {
	const exportedPath = join(packageRoot, target.replace(/^\.\//, ''));
	if (!existsSync(exportedPath)) {
		fail(`package export does not exist: ${target}`);
	}
}

const fontExtensions = new Set(['.eot', '.otf', '.ttf', '.woff', '.woff2']);
const packageFiles = readdirSync(packageRoot, { recursive: true });
const bundledFonts = packageFiles.filter((file) => fontExtensions.has(extname(file).toLowerCase()));

if (bundledFonts.length > 0) {
	fail(`font files must remain app-owned: ${bundledFonts.join(', ')}`);
}

if (!process.exitCode) {
	console.log('PDP theme contract is complete.');
}
