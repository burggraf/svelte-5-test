<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';

	let { children } = $props();

	// Initialize theme on mount
	$effect(() => {
		// Subscribe to theme to ensure it initializes
		const unsubscribe = theme.subscribe(() => {});
		return unsubscribe;
	});
</script>

{@render children()}
