import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { getColorScheme, defaultSchemeId, type ColorScheme } from '$lib/config/color-schemes';

const SCHEME_STORAGE_KEY = 'color-scheme-preference';

function getInitialScheme(): string {
	if (!browser) return defaultSchemeId;
	const stored = localStorage.getItem(SCHEME_STORAGE_KEY);
	return stored || defaultSchemeId;
}

function createColorSchemeStore() {
	const initialSchemeId = getInitialScheme();
	const initialScheme = getColorScheme(initialSchemeId);

	const { subscribe, set } = writable<ColorScheme>(initialScheme);

	return {
		subscribe,
		setScheme: (schemeId: string) => {
			if (!browser) return;

			const scheme = getColorScheme(schemeId);
			localStorage.setItem(SCHEME_STORAGE_KEY, schemeId);
			set(scheme);
		},
		getSchemeId: (): string => {
			if (!browser) return defaultSchemeId;
			return localStorage.getItem(SCHEME_STORAGE_KEY) || defaultSchemeId;
		}
	};
}

export const colorScheme = createColorSchemeStore();
