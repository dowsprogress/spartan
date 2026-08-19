import { Component, OnDestroy, signal } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmChatImports } from '@spartan-ng/helm/chat';
import { HlmConversationImports } from '@spartan-ng/helm/conversation';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import type { Meta, StoryObj } from '@storybook/angular';
import { NgScrollbarModule } from 'ngx-scrollbar';

const meta: Meta = {
	title: 'Chat',
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

type ChatStepKind = 'bubble' | 'bubbleFooter' | 'bubbleGroup' | 'typing';

interface ChatBubble {
	variant?: 'muted';
	text: string;
	reaction?: string;
}

interface ChatStep {
	kind: ChatStepKind;
	align: 'start' | 'end';
	avatarFallback?: string;
	text?: string;
	footer?: string;
	bubbles?: ChatBubble[];
}

// Mirrors the AI Elements Message recipe's richer feature set (avatars, bubble groups,
// reactions, delivery footers, a typing indicator) composed inside the real Conversation
// container. Chat (Spartan's port of AI Elements' `Message`) is always the child turn;
// Conversation is the scrollable parent that hosts it (see the dedicated
// `AI Elements/Conversation` story for Conversation's own scroll/auto-stick behavior in
// isolation).
const SCRIPT: ChatStep[] = [
	{ kind: 'bubble', align: 'end', avatarFallback: 'ME', text: 'Deploying to prod real quick.' },
	{ kind: 'bubble', align: 'start', avatarFallback: 'R', text: "It's 4:55 PM. On a Friday." },
	{ kind: 'bubbleFooter', align: 'end', avatarFallback: 'ME', text: "It's a one-line change.", footer: 'Delivered' },
	{
		kind: 'bubbleGroup',
		align: 'start',
		avatarFallback: 'R',
		bubbles: [
			{ variant: 'muted', text: "It's always a one-line change 😭." },
			{ variant: 'muted', text: 'Alright, let me take a look.', reaction: '👍' },
		],
	},
	{ kind: 'bubble', align: 'end', avatarFallback: 'ME', text: 'Appreciate it, thanks!' },
	{ kind: 'bubble', align: 'start', avatarFallback: 'R', text: 'Found it, pushing the fix now.' },
	{ kind: 'bubbleFooter', align: 'start', avatarFallback: 'R', text: 'Should be live in a minute.', footer: 'Sent' },
	{ kind: 'bubble', align: 'end', avatarFallback: 'ME', text: "You're a lifesaver." },
	{ kind: 'typing', align: 'start', avatarFallback: 'R' },
];

const REPLAY_INTERVAL_MS = 1200;

@Component({
	selector: 'spartan-chat-demo',
	imports: [
		NgScrollbarModule,
		HlmScrollAreaImports,
		HlmConversationImports,
		HlmButtonImports,
		HlmBubbleImports,
		HlmAvatarImports,
		HlmMarkerImports,
		HlmChatImports,
	],
	template: `
		<div class="flex w-full max-w-sm flex-col gap-3">
			<div hlmConversation class="h-[70vh] rounded-lg border">
				<ng-scrollbar hlm appearance="compact" class="h-full w-full">
					<div hlmConversationContent class="p-4">
						@for (step of _visibleSteps(); track $index) {
							@if (step.kind === 'typing') {
								<div hlmMarker role="status">
									<span hlmMarkerContent class="shimmer">
										<span class="font-medium">Oliver</span>
										is typing...
									</span>
								</div>
							} @else {
								<div hlmChat [align]="step.align">
									<div hlmChatAvatar>
										<hlm-avatar>
											<span hlmAvatarFallback>{{ step.avatarFallback }}</span>
										</hlm-avatar>
									</div>
									<div hlmChatContent>
										@switch (step.kind) {
											@case ('bubbleGroup') {
												<div hlmBubbleGroup>
													@for (bubble of step.bubbles; track $index) {
														<div hlmBubble [variant]="bubble.variant ?? 'default'">
															<div hlmBubbleContent>{{ bubble.text }}</div>
															@if (bubble.reaction) {
																<div hlmBubbleReactions role="img" [attr.aria-label]="'Reaction: thumbs up'">
																	<span>{{ bubble.reaction }}</span>
																</div>
															}
														</div>
													}
												</div>
											}
											@default {
												<div hlmBubble [variant]="step.align === 'start' ? 'muted' : 'default'">
													<div hlmBubbleContent>{{ step.text }}</div>
												</div>
												@if (step.kind === 'bubbleFooter') {
													<div hlmChatFooter>{{ step.footer }}</div>
												}
											}
										}
									</div>
								</div>
							}
						}
					</div>
				</ng-scrollbar>
				<button hlmConversationScrollButton aria-label="Scroll to bottom"></button>
			</div>
			<button hlmBtn variant="outline" size="sm" type="button" (click)="replay()">Replay</button>
		</div>
	`,
})
class ChatDemo implements OnDestroy {
	protected readonly _visibleSteps = signal<ChatStep[]>([]);

	private _timer?: ReturnType<typeof setInterval>;

	constructor() {
		this.replay();
	}

	ngOnDestroy(): void {
		clearInterval(this._timer);
	}

	// Reveals one turn at a time, like turns arriving in a live conversation, instead of
	// rendering the whole script at once - this drives Conversation's stick-to-bottom
	// auto-scroll and scroll-button behavior in the demo below, matching the
	// `AI Elements/Conversation` story's interaction pattern.
	protected replay(): void {
		clearInterval(this._timer);
		this._visibleSteps.set([]);

		let index = 0;
		this._timer = setInterval(() => {
			this._visibleSteps.update((steps) => [...steps, SCRIPT[index]]);
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
			imports: [ChatDemo],
		},
		template: `<spartan-chat-demo />`,
	}),
};
