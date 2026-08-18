import { Component, OnDestroy, signal } from '@angular/core';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmConversationImports } from '@spartan-ng/helm/conversation';
import { HlmMessageImports } from '@spartan-ng/helm/message';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import type { Meta, StoryObj } from '@storybook/angular';
import { NgScrollbarModule } from 'ngx-scrollbar';

const meta: Meta = {
	title: 'AI Elements/Conversation',
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

interface DemoMessage {
	from: 'user' | 'assistant';
	text: string;
}

// Mirrors the AI Elements default recipe: user turns get a secondary-background bubble and are
// right-aligned; assistant turns are plain, full-width text, left-aligned. No avatars by default.
const SCRIPT: DemoMessage[] = [
	{ from: 'user', text: 'Hello, how are you?' },
	{ from: 'assistant', text: "I'm good, thank you! How can I assist you today?" },
	{ from: 'user', text: "I'm looking for information about your services." },
	{ from: 'assistant', text: 'Sure! We offer a variety of AI solutions. What are you interested in?' },
	{ from: 'user', text: "I'm interested in natural language processing tools." },
	{ from: 'assistant', text: 'Great choice! We have several NLP APIs. Would you like a demo?' },
	{ from: 'user', text: 'Yes, a demo would be helpful.' },
	{ from: 'assistant', text: "Perfect, I'll set one up. Do you have a preferred time this week?" },
	{ from: 'user', text: 'Thursday afternoon works best for me.' },
	{ from: 'assistant', text: "Great, I've booked Thursday at 2pm. You'll get a calendar invite shortly." },
	{ from: 'user', text: 'Can the demo also cover summarization use cases?' },
	{
		from: 'assistant',
		text: 'Absolutely, we can walk through summarization, extraction, and classification examples.',
	},
	{ from: 'user', text: 'That sounds great, thank you!' },
	{ from: 'assistant', text: "You're welcome! Let me know if there's anything else I can help with before then." },
];

const REPLAY_INTERVAL_MS = 1200;

@Component({
	selector: 'spartan-conversation-demo',
	imports: [
		NgScrollbarModule,
		HlmScrollAreaImports,
		HlmConversationImports,
		HlmButtonImports,
		HlmBubbleImports,
		HlmMessageImports,
	],
	// The panel width is 50% wider than a typical `max-w-2xl` chat pane (42rem -> 63rem), to more
	// accurately simulate how Conversation behaves at a wider real browser viewport.
	template: `
		<div class="flex w-full max-w-[63rem] flex-col gap-3">
			<div hlmConversation class="h-[70vh] rounded-lg border">
				<ng-scrollbar hlm appearance="compact" class="h-full w-full">
					<div hlmConversationContent>
						@for (message of _visibleMessages(); track $index) {
							<div hlmMessage [align]="message.from === 'user' ? 'end' : 'start'">
								<div hlmMessageContent>
									@if (message.from === 'user') {
										<div hlmBubble variant="secondary">
											<div hlmBubbleContent>{{ message.text }}</div>
										</div>
									} @else {
										{{ message.text }}
									}
								</div>
							</div>
						}
					</div>
				</ng-scrollbar>
				<button hlmConversationScrollButton aria-label="Scroll to bottom"></button>
			</div>
			<button hlmBtn variant="outline" size="sm" type="button" (click)="replay()">Replay</button>
		</div>
	`,
})
class ConversationDemo implements OnDestroy {
	protected readonly _visibleMessages = signal<DemoMessage[]>([]);

	private _timer?: ReturnType<typeof setInterval>;

	constructor() {
		this.replay();
	}

	ngOnDestroy(): void {
		clearInterval(this._timer);
	}

	// Reveals one message at a time, like turns arriving in a live conversation, instead of
	// rendering the whole script at once - this is what drives Conversation's stick-to-bottom
	// auto-scroll and scroll-button behavior in the demo below.
	protected replay(): void {
		clearInterval(this._timer);
		this._visibleMessages.set([]);

		let index = 0;
		this._timer = setInterval(() => {
			this._visibleMessages.update((messages) => [...messages, SCRIPT[index]]);
			index++;

			if (index >= SCRIPT.length) {
				clearInterval(this._timer);
			}
		}, REPLAY_INTERVAL_MS);
	}
}

export const Default: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [ConversationDemo],
		},
		template: `<spartan-conversation-demo />`,
	}),
};
