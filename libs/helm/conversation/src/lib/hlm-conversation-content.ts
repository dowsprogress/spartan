import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmConversationContent],hlm-conversation-content',
	host: { 'data-slot': 'conversation-content' },
})
export class HlmConversationContent {
	constructor() {
		classes(() => 'spartan-conversation-content flex min-h-full w-full min-w-0 flex-col gap-8 p-4');
	}
}
