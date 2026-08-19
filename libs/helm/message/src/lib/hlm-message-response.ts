import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';
import { marked, type Token, type Tokens } from 'marked';
import { HlmMessageCodeBlock } from './hlm-message-code-block';
import { HlmMessageTable, type MessageTableData } from './hlm-message-table';

interface RenderableBlock {
	kind: 'html' | 'code' | 'table';
	html?: string;
	code?: string;
	language?: string;
	table?: MessageTableData;
}

function toRenderableBlocks(markdown: string): RenderableBlock[] {
	const tokens = marked.lexer(markdown, { gfm: true, breaks: false });

	return tokens.map((token: Token): RenderableBlock => {
		if (token.type === 'code') {
			const codeToken = token as Tokens.Code;
			return { kind: 'code', code: codeToken.text, language: codeToken.lang };
		}

		if (token.type === 'table') {
			const tableToken = token as Tokens.Table;
			return {
				kind: 'table',
				table: {
					header: tableToken.header.map((cell) => cell.text),
					rows: tableToken.rows.map((row) => row.map((cell) => cell.text)),
				},
			};
		}

		return { kind: 'html', html: marked.parser([token], { gfm: true, breaks: false }) };
	});
}

/**
 * Angular port of AI Elements' `MessageResponse`. Renders Markdown (headings, lists, inline
 * formatting, GFM tables, and syntax-highlighted fenced code blocks) using `marked` +
 * `prismjs` - the same Markdown/highlighting stack already used by this repo's own docs site
 * (see `apps/app/src/app/shared/code/code.ts`) - rather than adding a new dependency.
 *
 * Not yet ported from Streamdown: math (KaTeX) and Mermaid diagram rendering. Flagged as a
 * follow-up rather than a silent omission; open an issue/discussion before adding those
 * dependencies to the whole design system.
 */
@Component({
	selector: 'div[hlm-message-response], div[hlmMessageResponse]',
	imports: [HlmMessageCodeBlock, HlmMessageTable],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { 'data-slot': 'message-response' },
	template: `
		@for (block of _blocks(); track $index) {
			@switch (block.kind) {
				@case ('code') {
					<div hlmMessageCodeBlock [code]="block.code!" [language]="block.language" class="my-4"></div>
				}
				@case ('table') {
					<div hlmMessageTable [data]="block.table!" class="my-4"></div>
				}
				@default {
					<div [innerHTML]="block.html"></div>
				}
			}
		}
	`,
})
export class HlmMessageResponse {
	public readonly content = input.required<string>();

	protected readonly _blocks = computed(() => toRenderableBlocks(this.content()));

	constructor() {
		classes(
			() =>
				// Mirrors this repo's typography primitives (`libs/helm/typography`) inline, since a
				// component can't easily apply per-descendant-tag directives to markup rendered from a
				// dynamic `[innerHTML]` string.
				'spartan-message-response flex flex-col gap-4 text-sm ' +
				'[&_h1]:scroll-m-20 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight ' +
				'[&_h2]:scroll-m-20 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight ' +
				'[&_h3]:scroll-m-20 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-tight ' +
				'[&_a]:text-primary [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_p]:leading-7 ' +
				'[&_li]:mt-1 [&_ol]:ml-6 [&_ol]:list-decimal [&_ul]:ml-6 [&_ul]:list-disc ' +
				'[&_blockquote]:border-border [&_blockquote]:border-s-2 [&_blockquote]:ps-4 [&_blockquote]:italic ' +
				'[&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:rounded [&_:not(pre)>code]:px-[0.3rem] [&_:not(pre)>code]:py-[0.2rem] [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-sm [&_:not(pre)>code]:font-semibold ' +
				'[&_hr]:border-border [&_hr]:my-0',
		);
	}
}
