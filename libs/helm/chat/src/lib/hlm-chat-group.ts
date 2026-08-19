import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmChatGroup],hlm-chat-group',
	host: { 'data-slot': 'chat-group' },
})
export class HlmChatGroup {
	constructor() {
		classes(() => 'spartan-chat-group flex min-w-0 flex-col');
	}
}
