import { visitNotIgnoredFiles } from '@nx/devkit';
import { migrateCollapsibleGenerator } from '../../migrate-collapsible/generator';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

// Only the raw <brn-collapsible> *element* usage is deprecated in favor of <hlm-collapsible>.
// Importing the underlying Brain primitives (BrnCollapsible, injectBrnCollapsible, etc.) from
// '@spartan-ng/brain/collapsible' to compose a new component - as HlmCollapsible itself does, and
// as Reasoning/Sources and any future component may do - is the supported, intended pattern and
// must not be flagged. Matching on the literal tag (open or close, with its -trigger/-content
// variants) instead of a blanket 'brn-collapsible' substring avoids false positives on things like
// TS imports, class names, or the `--brn-collapsible-content-height` CSS custom property, and
// avoids needing to keep a per-component filename allowlist up to date.
const deprecatedTagPattern = /<\/?brn-collapsible(-trigger|-content)?[\s/>]/;

export const brainCollapsibleHealthcheck: Healthcheck = {
	name: 'Brain Collapsible',
	async detect(tree, failure) {
		visitNotIgnoredFiles(tree, '/', (file) => {
			// if the file is a .ts or .htlm file, check for helm icons
			if (!file.endsWith('.ts') && !file.endsWith('.html')) {
				return;
			}

			const contents = tree.read(file, 'utf-8');

			if (!contents) {
				return;
			}

			if (deprecatedTagPattern.test(contents)) {
				failure(
					`The <brn-collapsible> component is deprecated. Please use the <hlm-collapsible> instead.`,
					HealthcheckSeverity.Error,
					true,
				);
			}
		});
	},
	fix: async (tree) => {
		await migrateCollapsibleGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate brn-collapsible to hlm-collapsible?',
};
