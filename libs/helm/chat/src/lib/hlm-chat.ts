import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

export type ChatAlign = 'start' | 'end';

@Directive({
	selector: '[hlmChat],hlm-chat',
	host: {
		'data-slot': 'chat',
		'[attr.data-align]': 'align()',
		// Prevent the legacy HTML `align` attribute from forcing text-align.
		'[attr.align]': 'null',
	},
})
export class HlmChat {
	public readonly align = input<ChatAlign>('start');

	constructor() {
		classes(
			() =>
				// 2 explicit row tracks (bubble row, optional footer row) let `HlmChatContent` opt
				// into `grid-rows-subgrid` so the avatar can align to just the bubble row - see its
				// class comment for why.
				'spartan-chat group/chat relative grid w-full min-w-0 grid-cols-[auto_1fr] grid-rows-[auto_auto] data-[align=end]:grid-cols-[1fr_auto]',
		);
	}
}
