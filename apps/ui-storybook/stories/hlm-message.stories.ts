import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideChevronLeft,
	lucideChevronRight,
	lucideCopy,
	lucideRefreshCw,
	lucideThumbsDown,
	lucideThumbsUp,
} from '@ng-icons/lucide';
import { HlmConversationImports } from '@spartan-ng/helm/conversation';
import { HlmMessageImports } from '@spartan-ng/helm/message';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import type { Meta, StoryObj } from '@storybook/angular';
import { NgScrollbarModule } from 'ngx-scrollbar';

// Three regenerated-response branches for the same turn - mirrors the AI Elements recipe where
// `MessageBranch` lets a user tab through multiple candidate answers for the last assistant turn.
const HOOKS_BRANCHES = [
	`# What are React Hooks?

Hooks let you use state and other React features without writing a class.

- **useState** - for managing component state
- **useEffect** - for side effects like data fetching
- **useContext** - for consuming context values

Here's a simple example:

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
\`\`\`

| Hook | Purpose |
| --- | --- |
| useState | Add state to components |
| useEffect | Handle side effects |
| useContext | Access context values |

The beauty of hooks is that they let you reuse stateful logic without changing your component hierarchy.`,
	`## React Hooks, in short

Hooks are functions that let function components opt into React features that used to require a class.

### Rules of hooks

1. Call them **only at the top level** of a component or another hook.
2. Never call them conditionally or inside loops.
3. Name your own hooks starting with \`use\`.

\`\`\`jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}
\`\`\`

This custom hook wraps \`useState\` + \`useEffect\` into a single reusable unit.`,
	`## Why hooks over classes?

Classes require binding \`this\`, verbose lifecycle methods, and make it hard to reuse stateful logic between components. Hooks solve all three.

### Key advantages

- No \`this\` binding gymnastics
- Related logic stays together instead of being split across \`componentDidMount\`/\`componentDidUpdate\`/\`componentWillUnmount\`
- Stateful logic is trivially extractable into custom hooks and shared across components

\`\`\`jsx
// Before: a class with lifecycle methods
class Timer extends React.Component {
  componentDidMount() { this.id = setInterval(this.tick, 1000); }
  componentWillUnmount() { clearInterval(this.id); }
}

// After: a hook
function useTimer() {
  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
}
\`\`\`

| Approach | Lines of boilerplate | Reusable? |
| --- | --- | --- |
| Class lifecycle methods | High | No |
| Custom hook | Low | Yes |`,
];

const meta: Meta = {
	title: 'AI Elements/Message',
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Angular port of AI Elements' `Message` suite (https://elements.ai-sdk.dev/components/message):
// `Message`/`MessageContent` (the bubble), `MessageActions`/`MessageAction` (per-turn actions with
// an optional tooltip), `MessageBranch` and its family (branch/tab navigation between multiple
// regenerated responses), `MessageToolbar`, and `MessageResponse` (Markdown rendering with
// syntax-highlighted code blocks and GFM tables, built on `marked` + `prismjs`). Hosted inside
// `hlmConversation`, matching the bordered scroll container used in the real recipe. The user
// turn's bubble reuses `HlmBubble`'s `secondary` grey token so it matches the `Conversation`/
// `Bubble` stories exactly.
@Component({
	selector: 'spartan-message-demo',
	imports: [NgIcon, NgScrollbarModule, HlmScrollAreaImports, HlmConversationImports, HlmMessageImports],
	providers: [
		provideIcons({
			lucideChevronLeft,
			lucideChevronRight,
			lucideCopy,
			lucideRefreshCw,
			lucideThumbsDown,
			lucideThumbsUp,
		}),
	],
	template: `
		<div hlmConversation class="h-[70vh] w-full max-w-2xl rounded-lg border">
			<ng-scrollbar hlm appearance="compact" class="h-full w-full">
				<div hlmConversationContent>
					<div hlmMessage from="user">
						<div hlmMessageContent>Can you explain React hooks with an example?</div>
					</div>

					<div hlmMessage from="assistant">
						<div hlmMessageBranch [totalBranches]="branches.length" [defaultBranch]="0">
							@for (branch of branches; track $index) {
								<div hlmMessageBranchContent [index]="$index">
									<div hlmMessageContent>
										<div hlmMessageResponse [content]="branch"></div>
									</div>
								</div>
							}

							<div hlmMessageToolbar>
								<div hlmMessageBranchSelector>
									<button hlmMessageBranchPrevious>
										<ng-icon name="lucideChevronLeft" />
									</button>
									<div hlmMessageBranchPage></div>
									<button hlmMessageBranchNext>
										<ng-icon name="lucideChevronRight" />
									</button>
								</div>

								<div hlmMessageActions>
									<button hlmMessageAction tooltip="Regenerate response">
										<ng-icon name="lucideRefreshCw" />
									</button>
									<button hlmMessageAction tooltip="Like this response">
										<ng-icon name="lucideThumbsUp" />
									</button>
									<button hlmMessageAction tooltip="Dislike this response">
										<ng-icon name="lucideThumbsDown" />
									</button>
									<button hlmMessageAction tooltip="Copy to clipboard">
										<ng-icon name="lucideCopy" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</ng-scrollbar>
		</div>
	`,
})
class MessageDemo {
	protected readonly branches = HOOKS_BRANCHES;
}

export const Default: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [MessageDemo],
		},
		template: `<spartan-message-demo />`,
	}),
};
