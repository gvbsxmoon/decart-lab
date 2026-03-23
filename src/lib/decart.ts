import { createDecartClient, models } from '@decartai/sdk';

export const LUCY_2_RT = models.realtime('lucy_2_rt');
export const COST_PER_SECOND = 0.02;
export const DEFAULT_PROMPT = 'Transform the person to Alan Turing';

const API_KEY_STORAGE_KEY = 'decart_api_key';

export function getStoredApiKey(): string | null {
	try {
		return sessionStorage.getItem(API_KEY_STORAGE_KEY);
	} catch {
		return null;
	}
}

export function storeApiKey(key: string): void {
	try {
		sessionStorage.setItem(API_KEY_STORAGE_KEY, key);
	} catch {
		// silent fail — sessionStorage unavailable
	}
}

export function clearApiKey(): void {
	try {
		sessionStorage.removeItem(API_KEY_STORAGE_KEY);
	} catch {
		// silent fail
	}
}

export function createClient(apiKey: string) {
	return createDecartClient({ apiKey });
}
