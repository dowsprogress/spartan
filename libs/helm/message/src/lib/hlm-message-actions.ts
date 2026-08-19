import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmMessageActions],hlm-message-actions',
	host: { 'data-slot': 'message-actions' },
})
export class HlmMessageActions {
	constructor() {
		classes(() => 'spartan-message-actions flex items-center gap-1');
	}
}
