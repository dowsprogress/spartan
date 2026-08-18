import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { HealthcheckStatus } from '../healthchecks';
import { runHealthcheck } from '../utils/runner';
import { brainCollapsibleHealthcheck } from './brn-collapsible';

describe('brn-collapsible healthcheck', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('flags the deprecated <brn-collapsible> element and its -trigger/-content variants', async () => {
		tree.write(
			'libs/my-lib/src/legacy.component.ts',
			`
				@Component({
					template: \`
						<brn-collapsible>
							<brn-collapsible-trigger>Toggle</brn-collapsible-trigger>
							<brn-collapsible-content>Body</brn-collapsible-content>
						</brn-collapsible>
					\`,
				})
				export class Legacy {}
			`,
		);

		const report = await runHealthcheck(tree, brainCollapsibleHealthcheck, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Failure);
	});

	it('does not flag components that legitimately compose the Brain collapsible primitive', async () => {
		// Mirrors how HlmCollapsible, and any future component (e.g. Reasoning, Sources), builds on
		// top of the Brain primitive via hostDirectives/imports rather than the raw element - this
		// must never be flagged as deprecated usage.
		tree.write(
			'libs/helm/reasoning/src/lib/hlm-reasoning.ts',
			`
				import { Directive } from '@angular/core';
				import { BrnCollapsible, injectBrnCollapsible } from '@spartan-ng/brain/collapsible';

				@Directive({
					selector: '[hlmReasoning],hlm-reasoning',
					hostDirectives: [{ directive: BrnCollapsible, inputs: ['expanded', 'disabled'] }],
				})
				export class HlmReasoning {
					protected readonly state = injectBrnCollapsible().state;
				}
			`,
		);
		tree.write(
			'libs/helm/collapsible/src/lib/hlm-collapsible.ts',
			`
				import { Directive } from '@angular/core';
				import { BrnCollapsible } from '@spartan-ng/brain/collapsible';

				@Directive({
					selector: '[hlmCollapsible],hlm-collapsible',
					hostDirectives: [{ directive: BrnCollapsible, inputs: ['expanded', 'disabled'] }],
				})
				export class HlmCollapsible {}
			`,
		);
		// The CSS custom property name (a substring match away from being a false positive) must
		// also not be flagged when it appears in a template's inline style.
		tree.write(
			'libs/helm/reasoning/src/lib/hlm-reasoning-content.ts',
			`
				@Component({
					template: \`<div style="height: var(--brn-collapsible-content-height)"></div>\`,
				})
				export class HlmReasoningContent {}
			`,
		);

		const report = await runHealthcheck(tree, brainCollapsibleHealthcheck, '@spartan-ng/helm');

		expect(report.status).toBe(HealthcheckStatus.Success);
	});
});
