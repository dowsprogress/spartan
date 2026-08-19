import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy, lucideDownload } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { classes } from '@spartan-ng/helm/utils';
import 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
declare const Prism: typeof import('prismjs');

const EXTENSION_BY_LANGUAGE: Record<string, string> = {
	javascript: 'js',
	typescript: 'ts',
	jsx: 'jsx',
	tsx: 'tsx',
	bash: 'sh',
	shell: 'sh',
	json: 'json',
	css: 'css',
	html: 'html',
	markup: 'html',
};

/** A fenced code block within `HlmMessageResponse`'s rendered Markdown, with copy/download actions. */
@Component({
	selector: 'div[hlm-message-code-block], div[hlmMessageCodeBlock]',
	imports: [NgIcon, HlmButton],
	providers: [provideIcons({ lucideCheck, lucideCopy, lucideDownload })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { 'data-slot': 'message-code-block' },
	template: `
		<div class="bg-muted/80 text-muted-foreground flex items-center justify-between border-b px-3 py-2 text-xs">
			<span>{{ language() || 'text' }}</span>
			<div class="flex items-center gap-0.5">
				<button hlmBtn variant="ghost" size="icon-xs" type="button" (click)="download()" aria-label="Download code">
					<ng-icon name="lucideDownload" />
				</button>
				<button hlmBtn variant="ghost" size="icon-xs" type="button" (click)="copy()" aria-label="Copy code">
					<ng-icon [name]="_copied() ? 'lucideCheck' : 'lucideCopy'" />
				</button>
			</div>
		</div>
		<pre class="spartan-message-code-block-pre bg-background m-0 overflow-x-auto p-4 text-sm"><code
			class="language-{{ language() || 'text' }}"
			[innerHTML]="_highlighted()"
		></code></pre>
	`,
})
export class HlmMessageCodeBlock {
	private readonly _clipboard = inject(Clipboard);

	public readonly code = input.required<string>();
	public readonly language = input<string>();

	protected readonly _copied = signal(false);

	protected readonly _highlighted = computed(() => {
		const lang = this.language() || 'typescript';
		if (!Prism.languages[lang]) {
			return this.code();
		}
		return Prism.highlight(this.code(), Prism.languages[lang], lang);
	});

	constructor() {
		classes(() => 'spartan-message-code-block bg-background block overflow-hidden rounded-lg border');
	}

	copy(): void {
		this._clipboard.copy(this.code());
		this._copied.set(true);
		setTimeout(() => this._copied.set(false), 2000);
	}

	download(): void {
		const extension = EXTENSION_BY_LANGUAGE[this.language() ?? ''] ?? 'txt';
		const blob = new Blob([this.code()], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = `snippet.${extension}`;
		anchor.click();
		URL.revokeObjectURL(url);
	}
}
