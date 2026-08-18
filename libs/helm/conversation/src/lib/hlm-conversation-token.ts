import { inject, InjectionToken, type ExistingProvider, type Type } from '@angular/core';
import type { HlmConversation } from './hlm-conversation';

export const HlmConversationToken = new InjectionToken<HlmConversation>('HlmConversationToken');

export function injectHlmConversation() {
	return inject(HlmConversationToken, { optional: true });
}

export function provideHlmConversation(conversation: Type<HlmConversation>): ExistingProvider {
	return { provide: HlmConversationToken, useExisting: conversation };
}
