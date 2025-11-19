<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/components/ui/page-header.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import { auth } from '$lib/stores/auth';
	import UserAvatar from '$lib/components/user-avatar.svelte';
	import * as Card from '$lib/components/ui/card';
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

<PageHeader title="Settings">
	{#snippet leftActions()}
		<Button variant="ghost" size="icon" onclick={() => goto('/')}>
			<ArrowLeft class="h-5 w-5" />
		</Button>
	{/snippet}
</PageHeader>

<div class="p-6 space-y-6">
	<!-- Profile Information Card -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Profile Information</Card.Title>
			<Card.Description>View your account details</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="flex items-center gap-4">
				<UserAvatar user={$auth.user} size="lg" />
				<div>
					<p class="font-medium">{$auth.user?.name || 'No name set'}</p>
					<p class="text-sm text-gray-500">{$auth.user?.email}</p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Avatar Management Card -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Avatar</Card.Title>
			<Card.Description>Upload or remove your profile picture</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
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
					>
						{isUploading ? 'Uploading...' : 'Upload New Avatar'}
					</Button>
					{#if hasAvatar}
						<Button
							onclick={handleRemoveAvatar}
							disabled={isUploading || isRemoving}
							variant="outline"
						>
							{isRemoving ? 'Removing...' : 'Remove Avatar'}
						</Button>
					{/if}
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Profile Editing Card -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Edit Profile</Card.Title>
			<Card.Description>Update your profile information</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
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
			<Button onclick={handleSaveName} disabled={isSaving}>
				{isSaving ? 'Saving...' : 'Save Changes'}
			</Button>
		</Card.Content>
	</Card.Root>
</div>
