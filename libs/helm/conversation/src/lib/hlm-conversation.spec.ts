import { HlmScrollArea } from '@spartan-ng/helm/scroll-area';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HlmConversation } from './hlm-conversation';
import { HlmConversationContent } from './hlm-conversation-content';
import { HlmConversationScrollButton } from './hlm-conversation-scroll-button';

describe('HlmConversation', () => {
	const setup = async () => {
		await render(
			`
			<div hlmConversation style="height: 100px; display: flex;" data-testid="wrapper">
				<ng-scrollbar hlm class="h-full w-full" data-testid="viewport">
					<div hlmConversationContent data-testid="content">
						@for (item of items; track item) {
							<p style="height: 40px; margin: 0;">{{ item }}</p>
						}
					</div>
				</ng-scrollbar>
				<button hlmConversationScrollButton data-testid="scroll-button">Scroll to bottom</button>
			</div>
			`,
			{
				imports: [
					NgScrollbarModule,
					HlmScrollArea,
					HlmConversation,
					HlmConversationContent,
					HlmConversationScrollButton,
				],
				componentProperties: { items: Array.from({ length: 10 }, (_, i) => `Message ${i}`) },
			},
		);
		const viewport = screen.getByTestId('viewport');
		// Content dimensions are measured asynchronously (ResizeObserver), so wait until they've
		// settled - and the initial auto-scroll-to-bottom has run - before driving interactions below.
		await waitFor(() => {
			expect(Number.parseFloat(getComputedStyle(viewport).getPropertyValue('--content-height'))).toBeGreaterThan(0);
		});
		return {
			user: userEvent.setup(),
			viewport,
			scrollButton: screen.getByTestId('scroll-button'),
		};
	};

	it('starts at the bottom with the scroll button hidden', async () => {
		const { scrollButton } = await setup();
		expect(scrollButton).toHaveAttribute('hidden');
	});

	it('shows the scroll button once the user scrolls away from the bottom', async () => {
		const { viewport, scrollButton } = await setup();

		viewport.scrollTop = 0;
		viewport.dispatchEvent(new Event('scroll'));

		await waitFor(() => expect(scrollButton).not.toHaveAttribute('hidden'));
	});

	it('scrolls back to the bottom and re-hides the scroll button when clicked', async () => {
		const { user, viewport, scrollButton } = await setup();

		viewport.scrollTop = 0;
		viewport.dispatchEvent(new Event('scroll'));
		await waitFor(() => expect(scrollButton).not.toHaveAttribute('hidden'));

		await user.click(scrollButton);

		await waitFor(() => expect(scrollButton).toHaveAttribute('hidden'), { timeout: 2000 });
	});
});
