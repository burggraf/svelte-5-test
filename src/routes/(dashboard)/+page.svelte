<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Users, FileText, BarChart3, Settings } from 'lucide-svelte';
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome back!</h2>
		<p class="text-gray-500 dark:text-gray-400">Here's what's happening with your account today.</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Users</Card.Title>
				<Users class="h-4 w-4 text-gray-500 dark:text-gray-400" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">2,350</div>
				<p class="text-xs text-gray-500 dark:text-gray-400">+180 from last month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Documents</Card.Title>
				<FileText class="h-4 w-4 text-gray-500 dark:text-gray-400" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">1,234</div>
				<p class="text-xs text-gray-500 dark:text-gray-400">+50 from last month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Analytics</Card.Title>
				<BarChart3 class="h-4 w-4 text-gray-500 dark:text-gray-400" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">89%</div>
				<p class="text-xs text-gray-500 dark:text-gray-400">+2% from last month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Active Now</Card.Title>
				<Settings class="h-4 w-4 text-gray-500 dark:text-gray-400" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">573</div>
				<p class="text-xs text-gray-500 dark:text-gray-400">+201 since last hour</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Recent Activity -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Recent Activity</Card.Title>
			<Card.Description>Your recent actions and updates</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-gray-500 dark:text-gray-400">No recent activity to display.</p>
		</Card.Content>
	</Card.Root>
</div>
