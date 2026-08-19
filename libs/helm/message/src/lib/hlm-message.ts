import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

/** Mirrors `UIMessage['role']` from the `ai` package without taking a dependency on it. */
export type MessageFrom = 'user' | 'assistant' | 'system';

@Directive({
	selector: '[hlmMessage],hlm-message',
	host: {
		'data-slot': 'message',
		'[attr.data-from]': 'from()',
	},
})
export class HlmMessage {
	public readonly from = input.required<MessageFrom>();

	constructor() {
		classes(
			() =>
				'spartan-message group/message flex w-full max-w-[95%] min-w-0 flex-col gap-2 data-[from=user]:ms-auto data-[from=user]:justify-end',
		);
	}
}
