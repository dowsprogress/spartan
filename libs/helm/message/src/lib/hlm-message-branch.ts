import { Directive, computed, input, output, signal } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmMessageBranch],hlm-message-branch',
	host: { 'data-slot': 'message-branch' },
})
export class HlmMessageBranch {
	/** Total number of branches available for this message. */
	public readonly totalBranches = input<number>(1);
	/** 0-based index of the branch shown by default. */
	public readonly defaultBranch = input<number>(0);
	/** Emits the 0-based index of the newly active branch whenever it changes. */
	public readonly branchChange = output<number>();

	private readonly _currentBranch = signal(this.defaultBranch());

	public readonly currentBranch = computed(() => this._currentBranch());

	constructor() {
		classes(() => 'spartan-message-branch grid w-full gap-2');
	}

	goToPrevious(): void {
		this._setBranch((this.currentBranch() - 1 + this.totalBranches()) % this.totalBranches());
	}

	goToNext(): void {
		this._setBranch((this.currentBranch() + 1) % this.totalBranches());
	}

	private _setBranch(index: number): void {
		this._currentBranch.set(index);
		this.branchChange.emit(index);
	}
}
