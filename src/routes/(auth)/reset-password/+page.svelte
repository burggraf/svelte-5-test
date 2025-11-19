<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';

	let email = '';
	let error = '';
	let success = false;
	let isLoading = false;

	async function handleReset() {
		error = '';
		success = false;
		isLoading = true;

		try {
			await auth.requestPasswordReset(email);
			success = true;
		} catch (err: any) {
			error = err?.response?.message || 'Failed to send reset email. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleReset();
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title class="text-2xl">Reset Password</Card.Title>
			<Card.Description>
				Enter your email address and we'll send you a link to reset your password
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if error}
				<Alert.Root variant="destructive" class="mb-4">
					<Alert.Description>{error}</Alert.Description>
				</Alert.Root>
			{/if}

			{#if success}
				<Alert.Root class="mb-4">
					<Alert.Description>
						If an account exists with that email, you will receive a password reset link shortly.
					</Alert.Description>
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
						disabled={isLoading || success}
					/>
				</div>

				<Button class="w-full" onclick={handleReset} disabled={isLoading || success}>
					{isLoading ? 'Sending...' : 'Send Reset Link'}
				</Button>

				<div class="text-center text-sm text-gray-700 dark:text-gray-300">
					<a href="/login" class="text-blue-600 dark:text-blue-400 hover:underline">Back to Login</a>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
