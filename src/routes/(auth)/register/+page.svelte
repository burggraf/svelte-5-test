<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';

	let email = '';
	let username = '';
	let password = '';
	let passwordConfirm = '';
	let error = '';
	let isLoading = false;

	async function handleRegister() {
		error = '';

		// Client-side validation
		if (password !== passwordConfirm) {
			error = 'Passwords do not match';
			return;
		}

		if (password.length < 8) {
			error = 'Password must be at least 8 characters';
			return;
		}

		isLoading = true;

		try {
			await auth.register({
				email,
				username,
				password,
				passwordConfirm
			});
			goto('/', { replaceState: true });
		} catch (err: any) {
			error = err?.response?.message || 'Registration failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleRegister();
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title class="text-2xl">Create Account</Card.Title>
			<Card.Description>Register for a new account</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if error}
				<Alert.Root variant="destructive" class="mb-4">
					<Alert.Description>{error}</Alert.Description>
				</Alert.Root>
			{/if}

			<div class="space-y-4">
				<div class="space-y-2">
					<Label for="email">Email *</Label>
					<Input
						id="email"
						type="email"
						placeholder="you@example.com"
						bind:value={email}
						on:keypress={handleKeyPress}
						disabled={isLoading}
						required
					/>
				</div>

				<div class="space-y-2">
					<Label for="username">Username (optional)</Label>
					<Input
						id="username"
						type="text"
						placeholder="johndoe"
						bind:value={username}
						on:keypress={handleKeyPress}
						disabled={isLoading}
					/>
				</div>

				<div class="space-y-2">
					<Label for="password">Password *</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						bind:value={password}
						on:keypress={handleKeyPress}
						disabled={isLoading}
						required
					/>
				</div>

				<div class="space-y-2">
					<Label for="passwordConfirm">Confirm Password *</Label>
					<Input
						id="passwordConfirm"
						type="password"
						placeholder="••••••••"
						bind:value={passwordConfirm}
						on:keypress={handleKeyPress}
						disabled={isLoading}
						required
					/>
				</div>

				<Button class="w-full" on:click={handleRegister} disabled={isLoading}>
					{isLoading ? 'Creating account...' : 'Register'}
				</Button>

				<div class="text-center text-sm">
					Already have an account?
					<a href="/login" class="text-blue-600 hover:underline">Login</a>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
