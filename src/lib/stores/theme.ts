import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
	mode: ThemeMode;
	isDark: boolean;
}

const THEME_STORAGE_KEY = 'theme-preference';

function getSystemPreference(): boolean {
	if (!browser) return false;
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getInitialTheme(): ThemeMode {
	if (!browser) return 'system';
	const stored = localStorage.getItem(THEME_STORAGE_KEY);
	if (stored === 'light' || stored === 'dark' || stored === 'system') {
		return stored as ThemeMode;
	}
	return 'system';
}

function calculateIsDark(mode: ThemeMode): boolean {
	if (mode === 'system') {
		return getSystemPreference();
	}
	return mode === 'dark';
}

function createThemeStore() {
	const initialMode = getInitialTheme();
	const initialIsDark = calculateIsDark(initialMode);

	const { subscribe, set, update } = writable<ThemeStore>({
		mode: initialMode,
		isDark: initialIsDark
	});

	// Apply theme to document
	function applyTheme(isDark: boolean) {
		if (!browser) return;

		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	// Listen to system preference changes
	if (browser) {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', (e) => {
			update((state) => {
				if (state.mode === 'system') {
					const isDark = e.matches;
					applyTheme(isDark);
					return { ...state, isDark };
				}
				return state;
			});
		});

		// Apply initial theme
		applyTheme(initialIsDark);
	}

	return {
		subscribe,
		setMode: (mode: ThemeMode) => {
			if (!browser) return;

			localStorage.setItem(THEME_STORAGE_KEY, mode);
			const isDark = calculateIsDark(mode);
			applyTheme(isDark);
			set({ mode, isDark });
		},
		toggleMode: () => {
			update((state) => {
				let newMode: ThemeMode;
				if (state.mode === 'light') {
					newMode = 'dark';
				} else if (state.mode === 'dark') {
					newMode = 'system';
				} else {
					newMode = 'light';
				}

				localStorage.setItem(THEME_STORAGE_KEY, newMode);
				const isDark = calculateIsDark(newMode);
				applyTheme(isDark);
				return { mode: newMode, isDark };
			});
		}
	};
}

export const theme = createThemeStore();
