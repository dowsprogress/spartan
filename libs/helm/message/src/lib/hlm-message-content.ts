import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmMessageContent],hlm-message-content',
	host: { 'data-slot': 'message-content' },
})
export class HlmMessageContent {
	constructor() {
		classes(
			() =>
				// `grid-rows-subgrid` (spanning the parent message's 2 row tracks) lets this content's own
				// children - the bubble in row 1, an optional footer in row 2 - size independently within
				// those tracks. That's what lets `HlmMessageAvatar`'s `row-start-1` + `self-end` align
				// exactly to the bubble's bottom, regardless of whether/how tall a footer is, with no
				// hardcoded offset needed.
				'spartan-message-content col-start-2 row-span-2 row-start-1 grid min-w-0 grid-rows-[subgrid] wrap-break-word group-data-[align=end]/message:col-start-1 group-data-[align=end]/message:*:data-slot:justify-self-end',
		);
	}
}
