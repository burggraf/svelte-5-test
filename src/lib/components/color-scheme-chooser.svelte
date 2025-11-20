<script lang="ts">
	import { colorScheme } from '$lib/stores/color-scheme';
	import { getAllColorSchemes } from '$lib/config/color-schemes';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Palette, Check } from 'lucide-svelte';

	let {
		variant = 'sidebar' as 'sidebar' | 'icon',
		class: className = ''
	} = $props();

	const schemes = getAllColorSchemes();
	let selectedSchemeId = $state(colorScheme.getSchemeId());

	// Subscribe to colorScheme changes
	$effect(() => {
		const unsubscribe = colorScheme.subscribe(() => {
			selectedSchemeId = colorScheme.getSchemeId();
		});
		return unsubscribe;
	});

	function handleSchemeChange(schemeId: string) {
		colorScheme.setScheme(schemeId);
		selectedSchemeId = schemeId;
	}
</script>

{#if variant === 'icon'}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="ghost"
				size="icon"
				class={className}
				aria-label="Choose color scheme"
			>
				<Palette class="h-5 w-5" />
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-56">
			<DropdownMenu.Label>Color Scheme</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.RadioGroup value={selectedSchemeId}>
				{#each schemes as scheme}
					<DropdownMenu.RadioItem
						value={scheme.id}
						onclick={() => handleSchemeChange(scheme.id)}
					>
						<div class="flex flex-col">
							<span class="font-medium">{scheme.name}</span>
							<span class="text-xs text-muted-foreground">{scheme.description}</span>
						</div>
					</DropdownMenu.RadioItem>
				{/each}
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{:else}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="ghost"
				size="sm"
				class="w-full justify-start gap-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 {className}"
				aria-label="Choose color scheme"
			>
				<Palette class="h-4 w-4" />
				<span>
					{schemes.find((s) => s.id === selectedSchemeId)?.name || 'Color Scheme'}
				</span>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="start" class="w-64">
			<DropdownMenu.Label>Color Scheme</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.RadioGroup value={selectedSchemeId}>
				{#each schemes as scheme}
					<DropdownMenu.RadioItem
						value={scheme.id}
						onclick={() => handleSchemeChange(scheme.id)}
						class="cursor-pointer"
					>
						<div class="flex items-start gap-2 w-full">
							<div class="flex-1 min-w-0">
								<div class="font-medium">{scheme.name}</div>
								<div class="text-xs text-muted-foreground">{scheme.description}</div>
							</div>
							{#if scheme.id === selectedSchemeId}
								<Check class="h-4 w-4 shrink-0" />
							{/if}
						</div>
					</DropdownMenu.RadioItem>
				{/each}
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
