<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';

	let email = '';
	let password = '';
	let error = '';
	let isLoading = false;

	async function handleLogin() {
		error = '';
		isLoading = true;

		try {
			await auth.login(email, password);
			goto('/', { replaceState: true });
		} catch (err: any) {
			error = err?.response?.message || 'Login failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleLogin();
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title class="text-2xl">Login</Card.Title>
			<Card.Description>Enter your credentials to access your account</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if error}
				<Alert.Root variant="destructive" class="mb-4">
					<Alert.Description>{error}</Alert.Description>
				</Alert.Root>
			{/if}

			<div class="space-y-4">
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="you@example.com"
						bind:value={email}
						onkeypress={handleKeyPress}
						disabled={isLoading}
					/>
				</div>

				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						bind:value={password}
						onkeypress={handleKeyPress}
						disabled={isLoading}
					/>
				</div>

				<Button class="w-full" onclick={handleLogin} disabled={isLoading}>
					{isLoading ? 'Logging in...' : 'Login'}
				</Button>

				<div class="text-center text-sm">
					<a href="/reset-password" class="text-blue-600 hover:underline">
						Forgot password?
					</a>
				</div>

				<div class="text-center text-sm">
					Don't have an account?
					<a href="/register" class="text-blue-600 hover:underline">Register</a>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
