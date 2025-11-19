<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import UserAvatar from '$lib/components/user-avatar.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Alert from '$lib/components/ui/alert';
	import { pb } from '$lib/stores/pocketbase';

	let nameInput = $state($auth.user?.name || '');
	let isUploading = $state(false);
	let isRemoving = $state(false);
	let isSaving = $state(false);
	let successMessage = $state('');
	let errorMessage = $state('');
	let fileInput: HTMLInputElement;

	// Update nameInput when user changes (e.g., after save)
	$effect(() => {
		nameInput = $auth.user?.name || '';
	});

	function clearMessages() {
		successMessage = '';
		errorMessage = '';
	}

	function showSuccess(message: string) {
		clearMessages();
		successMessage = message;
		setTimeout(() => {
			successMessage = '';
		}, 3000);
	}

	function showError(message: string) {
		clearMessages();
		errorMessage = message;
	}

	async function handleAvatarUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		// Validate file
		if (!file.type.startsWith('image/')) {
			showError('Please select an image file');
			target.value = '';
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			showError('Image must be less than 5MB');
			target.value = '';
			return;
		}

		isUploading = true;
		clearMessages();

		try {
			await auth.uploadAvatar(file);
			showSuccess('Avatar updated successfully');
		} catch (err: any) {
			showError(err?.message || 'Failed to upload avatar');
		} finally {
			isUploading = false;
			target.value = '';
		}
	}

	async function handleRemoveAvatar() {
		isRemoving = true;
		clearMessages();

		try {
			await auth.removeAvatar();
			showSuccess('Avatar removed successfully');
		} catch (err: any) {
			showError(err?.message || 'Failed to remove avatar');
		} finally {
			isRemoving = false;
		}
	}

	async function handleSaveName() {
		isSaving = true;
		clearMessages();

		try {
			await auth.updateProfile({ name: nameInput });
			showSuccess('Name updated successfully');
		} catch (err: any) {
			showError(err?.message || 'Failed to update name');
		} finally {
			isSaving = false;
		}
	}

	function getAvatarUrl(): string | null {
		if (!$auth.user?.avatar) return null;
		return pb.files.getUrl($auth.user, $auth.user.avatar, { thumb: '200x200' });
	}

	let avatarUrl = $derived(getAvatarUrl());
	let hasAvatar = $derived(!!$auth.user?.avatar);
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-3xl font-bold tracking-tight">Settings</h2>
		<p class="text-gray-500">Manage your account settings</p>
	</div>

	<!-- Profile Card -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Profile</Card.Title>
			<Card.Description>Manage your profile information and avatar</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-6">
			{#if errorMessage}
				<Alert.Root variant="destructive">
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>{errorMessage}</Alert.Description>
				</Alert.Root>
			{/if}
			{#if successMessage}
				<Alert.Root>
					<Alert.Title>Success</Alert.Title>
					<Alert.Description>{successMessage}</Alert.Description>
				</Alert.Root>
			{/if}

			<!-- Avatar Section -->
			<div class="space-y-2">
				<Label>Profile Picture</Label>
				<div class="flex items-center gap-4">
					{#if avatarUrl}
						<img src={avatarUrl} alt="Avatar preview" class="h-24 w-24 rounded-full object-cover" />
					{:else}
						<UserAvatar user={$auth.user} size="lg" />
					{/if}

					<div class="flex flex-col gap-2">
						<input
							type="file"
							accept="image/*"
							class="hidden"
							bind:this={fileInput}
							onchange={handleAvatarUpload}
						/>
						<Button
							onclick={() => fileInput?.click()}
							disabled={isUploading || isRemoving}
							variant="outline"
							size="sm"
						>
							{isUploading ? 'Uploading...' : 'Upload New Avatar'}
						</Button>
						{#if hasAvatar}
							<Button
								onclick={handleRemoveAvatar}
								disabled={isUploading || isRemoving}
								variant="outline"
								size="sm"
							>
								{isRemoving ? 'Removing...' : 'Remove Avatar'}
							</Button>
						{/if}
					</div>
				</div>
				<p class="text-sm text-gray-500">Upload an image up to 5MB</p>
			</div>

			<!-- Email (Read-only) -->
			<div class="space-y-2">
				<Label for="email">Email</Label>
				<Input
					id="email"
					type="email"
					value={$auth.user?.email}
					disabled
					class="bg-gray-50"
				/>
			</div>

			<!-- Name Input -->
			<div class="space-y-2">
				<Label for="name">Name</Label>
				<Input
					id="name"
					type="text"
					bind:value={nameInput}
					placeholder="Enter your name"
					disabled={isSaving}
				/>
			</div>

			<!-- Save Button -->
			<Button onclick={handleSaveName} disabled={isSaving}>
				{isSaving ? 'Saving...' : 'Save Changes'}
			</Button>
		</Card.Content>
	</Card.Root>
</div>
