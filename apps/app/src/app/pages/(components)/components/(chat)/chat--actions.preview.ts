import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideRefreshCcw, lucideThumbsDown, lucideThumbsUp } from '@ng-icons/lucide';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmChatImports } from '@spartan-ng/helm/chat';

@Component({
	selector: 'spartan-chat-actions-preview',
	imports: [HlmChatImports, HlmBubbleImports, HlmButton, NgIcon],
	providers: [provideIcons({ lucideCopy, lucideThumbsUp, lucideThumbsDown, lucideRefreshCcw })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-8 py-12',
	},
	template: `
		<div hlmChat>
			<div hlmChatContent>
				<div hlmBubble variant="muted">
					<div hlmBubbleContent>The install failure is coming from the workspace package.</div>
				</div>
				<div hlmChatFooter>
					<button hlmBtn variant="ghost" size="icon" aria-label="Copy" title="Copy">
						<ng-icon name="lucideCopy" />
					</button>
					<button hlmBtn variant="ghost" size="icon" aria-label="Like" title="Like">
						<ng-icon name="lucideThumbsUp" />
					</button>
					<button hlmBtn variant="ghost" size="icon" aria-label="Dislike" title="Dislike">
						<ng-icon name="lucideThumbsDown" />
					</button>
				</div>
			</div>
		</div>

		<div hlmChat align="end">
			<div hlmChatContent>
				<div hlmBubble>
					<div hlmBubbleContent>Okay drop me a link. Taking a look...</div>
				</div>
				<div hlmChatFooter class="gap-2">
					<span class="text-destructive font-normal">Failed to send</span>
					<button hlmBtn variant="ghost" size="icon-xs" title="Retry" aria-label="Retry">
						<ng-icon name="lucideRefreshCcw" />
					</button>
				</div>
			</div>
		</div>
	`,
})
export class ChatActionsPreview {}
