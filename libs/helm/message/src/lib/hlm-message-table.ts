import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy, lucideDownload, lucideMaximize2, lucideMinimize2 } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import {
	HlmCaption,
	HlmTable,
	HlmTableContainer,
	HlmTBody,
	HlmTd,
	HlmTh,
	HlmTHead,
	HlmTr,
} from '@spartan-ng/helm/table';
import { classes } from '@spartan-ng/helm/utils';

export interface MessageTableData {
	header: string[];
	rows: string[][];
}

/** A GFM table within `HlmMessageResponse`'s rendered Markdown, with copy/download/fullscreen actions. */
@Component({
	selector: 'div[hlm-message-table], div[hlmMessageTable]',
	imports: [NgIcon, HlmButton, HlmTableContainer, HlmTable, HlmTHead, HlmTBody, HlmTr, HlmTh, HlmTd, HlmCaption],
	providers: [provideIcons({ lucideCheck, lucideCopy, lucideDownload, lucideMaximize2, lucideMinimize2 })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'message-table',
		'[class.fixed]': '_fullscreen()',
		'[class.inset-4]': '_fullscreen()',
		'[class.z-50]': '_fullscreen()',
		'[class.overflow-auto]': '_fullscreen()',
		'[class.bg-background]': '_fullscreen()',
		'[class.p-4]': '_fullscreen()',
	},
	template: `
		<div class="flex items-center justify-end gap-0.5 pb-2">
			<button
				hlmBtn
				variant="ghost"
				size="icon-xs"
				type="button"
				(click)="download()"
				aria-label="Download table as CSV"
			>
				<ng-icon name="lucideDownload" />
			</button>
			<button hlmBtn variant="ghost" size="icon-xs" type="button" (click)="copy()" aria-label="Copy table">
				<ng-icon [name]="_copied() ? 'lucideCheck' : 'lucideCopy'" />
			</button>
			<button
				hlmBtn
				variant="ghost"
				size="icon-xs"
				type="button"
				(click)="toggleFullscreen()"
				[attr.aria-label]="_fullscreen() ? 'Exit fullscreen' : 'View fullscreen'"
			>
				<ng-icon [name]="_fullscreen() ? 'lucideMinimize2' : 'lucideMaximize2'" />
			</button>
		</div>
		<div hlmTableContainer class="rounded-md border">
			<table hlmTable>
				<thead hlmTHead>
					<tr hlmTr class="bg-muted/50">
						@for (cell of data().header; track $index) {
							<th hlmTh>{{ cell }}</th>
						}
					</tr>
				</thead>
				<tbody hlmTBody>
					@for (row of data().rows; track $index) {
						<tr hlmTr>
							@for (cell of row; track $index) {
								<td hlmTd>{{ cell }}</td>
							}
						</tr>
					}
				</tbody>
			</table>
		</div>
	`,
})
export class HlmMessageTable {
	private readonly _clipboard = inject(Clipboard);

	public readonly data = input.required<MessageTableData>();

	protected readonly _copied = signal(false);
	protected readonly _fullscreen = signal(false);

	constructor() {
		classes(() => 'spartan-message-table bg-background block rounded-lg border p-2');
	}

	toggleFullscreen(): void {
		this._fullscreen.update((value) => !value);
	}

	copy(): void {
		this._clipboard.copy(this._toDelimited('\t'));
		this._copied.set(true);
		setTimeout(() => this._copied.set(false), 2000);
	}

	download(): void {
		const blob = new Blob([this._toDelimited(',')], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = 'table.csv';
		anchor.click();
		URL.revokeObjectURL(url);
	}

	private _toDelimited(delimiter: string): string {
		const { header, rows } = this.data();
		return [header, ...rows].map((row) => row.join(delimiter)).join('\n');
	}
}
