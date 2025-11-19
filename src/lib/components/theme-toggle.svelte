<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { Sun, Moon, Monitor } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let themeState = $state($theme);

	$effect(() => {
		themeState = $theme;
	});

	function getIcon() {
		switch (themeState.mode) {
			case 'light':
				return Sun;
			case 'dark':
				return Moon;
			case 'system':
				return Monitor;
		}
	}

	function getLabel() {
		switch (themeState.mode) {
			case 'light':
				return 'Light';
			case 'dark':
				return 'Dark';
			case 'system':
				return 'System';
		}
	}

	function handleToggle() {
		theme.toggleMode();
	}
</script>

<Button
	variant="ghost"
	size="sm"
	onclick={handleToggle}
	class="w-full justify-start gap-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
	aria-label="Toggle theme"
>
	<svelte:component this={getIcon()} class="h-4 w-4" />
	<span>{getLabel()} mode</span>
</Button>
