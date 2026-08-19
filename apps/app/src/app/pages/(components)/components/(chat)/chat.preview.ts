import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmChatImports } from '@spartan-ng/helm/chat';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';

@Component({
	selector: 'spartan-chat-preview',
	imports: [HlmChatImports, HlmBubbleImports, HlmAvatarImports, HlmMarkerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-6 py-12',
	},
	template: `
		<div hlmChat align="end">
			<div hlmChatAvatar>
				<hlm-avatar>
					<img hlmAvatarImage src="/assets/avatar.png" alt="@me" class="grayscale" />
					<span hlmAvatarFallback>ME</span>
				</hlm-avatar>
			</div>
			<div hlmChatContent>
				<div hlmBubble>
					<div hlmBubbleContent>Deploying to prod real quick.</div>
				</div>
			</div>
		</div>

		<div hlmChat>
			<div hlmChatAvatar>
				<hlm-avatar>
					<img hlmAvatarImage src="https://github.com/spartan-ng.png" alt="@spartan-ng" class="grayscale" />
					<span hlmAvatarFallback>R</span>
				</hlm-avatar>
			</div>
			<div hlmChatContent>
				<div hlmBubble variant="muted">
					<div hlmBubbleContent>It's 4:55 PM. On a Friday.</div>
				</div>
			</div>
		</div>

		<div hlmChat align="end">
			<div hlmChatAvatar>
				<hlm-avatar>
					<img hlmAvatarImage src="/assets/avatar.png" alt="@me" class="grayscale" />
					<span hlmAvatarFallback>ME</span>
				</hlm-avatar>
			</div>
			<div hlmChatContent>
				<div hlmBubble>
					<div hlmBubbleContent>It's a one-line change.</div>
				</div>
				<div hlmChatFooter>Delivered</div>
			</div>
		</div>

		<div hlmChat>
			<div hlmChatAvatar>
				<hlm-avatar>
					<img hlmAvatarImage src="https://github.com/spartan-ng.png" alt="@spartan-ng" class="grayscale" />
					<span hlmAvatarFallback>R</span>
				</hlm-avatar>
			</div>
			<div hlmChatContent>
				<div hlmBubbleGroup>
					<div hlmBubble variant="muted">
						<div hlmBubbleContent>It's always a one-line change 😭.</div>
					</div>
					<div hlmBubble variant="muted">
						<div hlmBubbleContent>Alright, let me take a look.</div>
						<div hlmBubbleReactions aria-label="Reactions: thumbs up">
							<span>👍</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div hlmMarker role="status">
			<span hlmMarkerContent class="shimmer">
				<span class="font-medium">Spartan</span>
				is typing...
			</span>
		</div>
	`,
})
export class ChatPreview {}

export const defaultImports = `
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';
import { HlmChatImports } from '@spartan-ng/helm/chat';
`;

export const defaultSkeleton = `
<div hlmChat>
  <div hlmChatAvatar>
    <hlm-avatar>
      <img hlmAvatarImage src="/assets/avatar.png" alt="@spartan" />
      <span hlmAvatarFallback>SP</span>
    </hlm-avatar>
  </div>
  <div hlmChatContent>
    <div hlmBubble>
      <div hlmBubbleContent>How can I help you today?</div>
    </div>
  </div>
</div>
`;
