<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import { colorScheme } from '$lib/stores/color-scheme';
	import { browser } from '$app/environment';

	let { children } = $props();

	// Initialize theme on mount
	$effect(() => {
		// Subscribe to theme to ensure it initializes
		const unsubscribe = theme.subscribe(() => {});
		return unsubscribe;
	});

	// Apply color scheme CSS variables dynamically
	$effect(() => {
		if (!browser) return;

		const themeState = $theme;
		const scheme = $colorScheme;
		const isDark = themeState.isDark;

		// Select the appropriate color set based on current theme mode
		const colors = isDark ? scheme.dark : scheme.light;

		// Apply CSS variables to document root
		const root = document.documentElement;
		root.style.setProperty('--background', colors.background);
		root.style.setProperty('--foreground', colors.foreground);
		root.style.setProperty('--card', colors.card);
		root.style.setProperty('--card-foreground', colors.cardForeground);
		root.style.setProperty('--popover', colors.popover);
		root.style.setProperty('--popover-foreground', colors.popoverForeground);
		root.style.setProperty('--primary', colors.primary);
		root.style.setProperty('--primary-foreground', colors.primaryForeground);
		root.style.setProperty('--secondary', colors.secondary);
		root.style.setProperty('--secondary-foreground', colors.secondaryForeground);
		root.style.setProperty('--muted', colors.muted);
		root.style.setProperty('--muted-foreground', colors.mutedForeground);
		root.style.setProperty('--accent', colors.accent);
		root.style.setProperty('--accent-foreground', colors.accentForeground);
		root.style.setProperty('--destructive', colors.destructive);
		root.style.setProperty('--border', colors.border);
		root.style.setProperty('--input', colors.input);
		root.style.setProperty('--ring', colors.ring);
	});
</script>

{@render children()}
