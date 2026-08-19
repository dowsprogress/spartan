import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmChatImports } from '@spartan-ng/helm/chat';

@Component({
	selector: 'spartan-chat-header-footer-preview',
	imports: [HlmChatImports, HlmBubbleImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-8 py-12',
	},
	template: `
		<div hlmChat>
			<div hlmChatContent>
				<div hlmChatHeader>Olivia</div>
				<div hlmBubble variant="muted">
					<div hlmBubbleContent>I already checked the logs.</div>
				</div>
			</div>
		</div>

		<div hlmChat align="end">
			<div hlmChatContent>
				<div hlmBubble>
					<div hlmBubbleContent>Send the report to the team. Ping &#64;spartan if you need help.</div>
				</div>
				<div hlmChatFooter>
					<div>
						Read
						<span class="font-normal">Yesterday</span>
					</div>
				</div>
			</div>
		</div>
	`,
})
export class ChatHeaderFooterPreview {}
