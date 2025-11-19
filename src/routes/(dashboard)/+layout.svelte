<script lang="ts">
	import SidebarUser from '$lib/components/sidebar-user.svelte';
	import { page } from '$app/stores';
	import * as Sheet from '$lib/components/ui/sheet';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Menu, Home, BarChart3, Settings, FileText } from 'lucide-svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	let mobileMenuOpen = false;

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
	<aside class="hidden md:flex md:w-64 md:flex-col bg-white border-r">
		<!-- Logo -->
		<div class="flex h-16 items-center border-b px-6">
			<h1 class="text-xl font-bold">Dashboard</h1>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors {isActive(
						item.href
					)
						? 'bg-blue-50 text-blue-600 font-medium'
						: 'text-gray-700 hover:bg-gray-100'}"
				>
					<svelte:component this={item.icon} class="h-5 w-5" />
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- User Component -->
		<div class="border-t p-3">
			<SidebarUser />
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- Top Bar (Mobile) -->
		<header class="flex h-16 items-center border-b bg-white px-4 md:hidden">
			<Button variant="ghost" size="icon" on:click={() => (mobileMenuOpen = true)}>
				<Menu class="h-6 w-6" />
			</Button>
			<h1 class="ml-4 text-lg font-semibold">Dashboard</h1>
		</header>

		<!-- Content Area -->
		<main class="flex-1 overflow-y-auto p-4 md:p-6">
			<slot />
		</main>
	</div>
</div>

<!-- Mobile Sidebar -->
<Sheet.Root bind:open={mobileMenuOpen}>
	<Sheet.Content side="left" class="w-64 p-0">
		<div class="flex h-full flex-col">
			<!-- Logo -->
			<div class="flex h-16 items-center border-b px-6">
				<h1 class="text-xl font-bold">Dashboard</h1>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
				{#each navItems as item}
					<a
						href={item.href}
						on:click={() => (mobileMenuOpen = false)}
						class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors {isActive(
							item.href
						)
							? 'bg-blue-50 text-blue-600 font-medium'
							: 'text-gray-700 hover:bg-gray-100'}"
					>
						<svelte:component this={item.icon} class="h-5 w-5" />
						{item.label}
					</a>
				{/each}
			</nav>

			<!-- User Component -->
			<div class="border-t p-3">
				<SidebarUser />
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
