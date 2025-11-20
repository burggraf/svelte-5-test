<script lang="ts">
	import SidebarUser from '$lib/components/sidebar-user.svelte';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
	import ColorSchemeChooser from '$lib/components/color-scheme-chooser.svelte';
	import { page } from '$app/stores';
	import * as Sheet from '$lib/components/ui/sheet';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Menu, Home, BarChart3, Settings, FileText } from 'lucide-svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();
	let mobileMenuOpen = $state(false);

	const navItems = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/analytics', label: 'Analytics', icon: BarChart3 },
		{ href: '/documents', label: 'Documents', icon: FileText },
		{ href: '/settings', label: 'Settings', icon: Settings }
	];

	function isActive(href: string): boolean {
		return $page.url.pathname === href;
	}

	// Get current page title for mobile header
	let currentPageTitle = $derived(() => {
		const currentItem = navItems.find((item) => item.href === $page.url.pathname);
		return currentItem?.label || 'Dashboard';
	});
</script>

<Toaster />

<div class="flex h-screen overflow-hidden bg-background">
	<!-- Desktop Sidebar -->
	<aside class="hidden md:flex md:w-64 md:flex-col bg-card border-r border-border">
		<!-- Logo -->
		<div class="flex h-11 items-center border-b border-border px-6">
			<h1 class="text-lg font-semibold text-foreground">Dashboard</h1>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors {isActive(
						item.href
					)
						? 'bg-primary text-primary-foreground font-medium'
						: 'text-foreground/70 hover:bg-accent hover:text-accent-foreground'}"
				>
					<svelte:component this={item.icon} class="h-5 w-5" />
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- Theme Settings Footer -->
		<div class="border-t border-border p-3 space-y-1">
			<ColorSchemeChooser />
			<ThemeToggle />
		</div>

		<!-- User Component -->
		<div class="border-t border-border p-3">
			<SidebarUser />
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- Top Bar (Mobile) -->
		<header class="flex h-11 items-center border-b border-border bg-card px-4 md:hidden">
			<Button variant="ghost" size="icon" onclick={() => (mobileMenuOpen = true)}>
				<Menu class="h-5 w-5" />
			</Button>
			<h1 class="ml-3 text-base font-semibold text-foreground">{currentPageTitle()}</h1>
		</header>

		<!-- Content Area -->
		<main class="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
			{@render children()}
		</main>
	</div>
</div>

<!-- Mobile Sidebar -->
<Sheet.Root bind:open={mobileMenuOpen}>
	<Sheet.Content side="left" class="w-64 p-0 bg-card">
		<div class="flex h-full flex-col">
			<!-- Logo -->
			<div class="flex h-11 items-center border-b border-border px-6">
				<h1 class="text-lg font-semibold text-foreground">Dashboard</h1>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
				{#each navItems as item}
					<a
						href={item.href}
						onclick={() => (mobileMenuOpen = false)}
						class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors {isActive(
							item.href
						)
							? 'bg-primary text-primary-foreground font-medium'
							: 'text-foreground/70 hover:bg-accent hover:text-accent-foreground'}"
					>
						<svelte:component this={item.icon} class="h-5 w-5" />
						{item.label}
					</a>
				{/each}
			</nav>

			<!-- Theme Settings Footer -->
			<div class="border-t border-border p-3 space-y-1">
				<ColorSchemeChooser />
				<ThemeToggle />
			</div>

			<!-- User Component -->
			<div class="border-t border-border p-3">
				<SidebarUser />
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
