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
				// AI Elements scopes these variants off a class-based `.is-user`/`.is-assistant` group.
				// This repo's convention (see `HlmChat`) is to key group variants off a `data-*`
				// attribute instead, so we read `HlmMessage`'s `data-from` attribute here. Uses the
				// same `bg-secondary`/`text-secondary-foreground` tokens as `HlmBubble`'s `secondary`
				// variant (see `libs/helm/bubble`) so user bubbles match exactly across Message and
				// Conversation/Bubble.
				'spartan-message-content group-data-[from=user]/message:bg-secondary group-data-[from=user]/message:text-secondary-foreground flex min-w-0 flex-col gap-2 overflow-hidden rounded-lg text-sm group-data-[from=user]/message:ms-auto group-data-[from=user]/message:max-w-[80%] group-data-[from=user]/message:px-4 group-data-[from=user]/message:py-3',
		);
	}
}
