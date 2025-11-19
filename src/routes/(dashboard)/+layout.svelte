<script lang="ts">
	import SidebarUser from '$lib/components/sidebar-user.svelte';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
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
</script>

<Toaster />

<div class="flex h-screen overflow-hidden bg-gray-50">
	<!-- Desktop Sidebar -->
	<aside class="hidden md:flex md:w-64 md:flex-col bg-white dark:bg-gray-900 border-r dark:border-gray-800">
		<!-- Logo -->
		<div class="flex h-16 items-center border-b dark:border-gray-800 px-6">
			<h1 class="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors {isActive(
						item.href
					)
						? 'bg-blue-50 text-blue-600 font-medium dark:bg-blue-950 dark:text-blue-400'
						: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}"
				>
					<svelte:component this={item.icon} class="h-5 w-5" />
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- Theme Toggle Footer -->
		<div class="border-t dark:border-gray-800 p-3">
			<ThemeToggle />
		</div>

		<!-- User Component -->
		<div class="border-t dark:border-gray-800 p-3">
			<SidebarUser />
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- Top Bar (Mobile) -->
		<header class="flex h-16 items-center border-b dark:border-gray-800 bg-white dark:bg-gray-900 px-4 md:hidden">
			<Button variant="ghost" size="icon" onclick={() => (mobileMenuOpen = true)}>
				<Menu class="h-6 w-6" />
			</Button>
			<h1 class="ml-4 text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h1>
		</header>

		<!-- Content Area -->
		<main class="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-950">
			{@render children()}
		</main>
	</div>
</div>

<!-- Mobile Sidebar -->
<Sheet.Root bind:open={mobileMenuOpen}>
	<Sheet.Content side="left" class="w-64 p-0 bg-white dark:bg-gray-900">
		<div class="flex h-full flex-col">
			<!-- Logo -->
			<div class="flex h-16 items-center border-b dark:border-gray-800 px-6">
				<h1 class="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
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
							? 'bg-blue-50 text-blue-600 font-medium dark:bg-blue-950 dark:text-blue-400'
							: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}"
					>
						<svelte:component this={item.icon} class="h-5 w-5" />
						{item.label}
					</a>
				{/each}
			</nav>

			<!-- Theme Toggle Footer -->
			<div class="border-t dark:border-gray-800 p-3">
				<ThemeToggle />
			</div>

			<!-- User Component -->
			<div class="border-t dark:border-gray-800 p-3">
				<SidebarUser />
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
