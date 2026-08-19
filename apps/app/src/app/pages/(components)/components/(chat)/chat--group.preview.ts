import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmChatImports } from '@spartan-ng/helm/chat';

@Component({
	selector: 'spartan-chat-group-preview',
	imports: [HlmChatImports, HlmBubbleImports, HlmAvatarImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-6 py-12',
	},
	template: `
		<div hlmChatGroup>
			<div hlmChat>
				<div hlmChatAvatar></div>
				<div hlmChatContent>
					<div hlmBubble variant="muted">
						<div hlmBubbleContent>I checked the registry addresses.</div>
					</div>
				</div>
			</div>
			<div hlmChat>
				<div hlmChatAvatar>
					<hlm-avatar>
						<img hlmAvatarImage src="https://github.com/spartan-ng.png" alt="@spartan-ng" class="grayscale" />
						<span hlmAvatarFallback>CN</span>
					</hlm-avatar>
				</div>
				<div hlmChatContent>
					<div hlmBubble variant="muted">
						<div hlmBubbleContent>The component and example JSON now live under the UI registry.</div>
					</div>
				</div>
			</div>
		</div>
	`,
})
export class ChatGroupPreview {}
