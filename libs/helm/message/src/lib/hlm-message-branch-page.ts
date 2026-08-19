import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HlmButtonGroupText } from '@spartan-ng/helm/button-group';
import { classes } from '@spartan-ng/helm/utils';
import { HlmMessageBranch } from './hlm-message-branch';

@Component({
	selector: 'div[hlm-message-branch-page], div[hlmMessageBranchPage]',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [HlmButtonGroupText],
	host: { 'data-slot': 'message-branch-page' },
	template: `
		{{ _label() }}
	`,
})
export class HlmMessageBranchPage {
	private readonly _branch = inject(HlmMessageBranch);

	protected readonly _label = computed(() => `${this._branch.currentBranch() + 1} of ${this._branch.totalBranches()}`);

	constructor() {
		// AI Elements' `MessageBranchPage` overrides `ButtonGroupText`'s default bordered/muted
		// pill styling to a plain borderless/transparent label - it's a page indicator sandwiched
		// between two real buttons in the group, not another grouped "button" segment.
		classes(
			() =>
				'spartan-message-branch-page text-muted-foreground rounded-none border-none !bg-transparent px-2 shadow-none',
		);
	}
}
