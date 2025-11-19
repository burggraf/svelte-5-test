<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import UserAvatar from './user-avatar.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { LogOut, Upload, User } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let fileInput: HTMLInputElement;
	let isUploading = false;

	$: user = $auth.user;
	$: displayName = user?.name || user?.username || 'User';
	$: displayEmail = user?.email || '';

	async function handleAvatarUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		// Validate file
		if (!file.type.startsWith('image/')) {
			toast.error('Please select an image file');
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			toast.error('Image must be less than 5MB');
			return;
		}

		isUploading = true;

		try {
			await auth.uploadAvatar(file);
			toast.success('Avatar updated successfully');
		} catch (err) {
			toast.error('Failed to upload avatar');
		} finally {
			isUploading = false;
			target.value = ''; // Reset input
		}
	}

	function openFileDialog() {
		fileInput?.click();
	}

	function handleProfileSettings() {
		goto('/settings');
	}

	function handleLogout() {
		auth.logout();
	}
</script>

<input
	type="file"
	accept="image/*"
	bind:this={fileInput}
	onchange={handleAvatarUpload}
	class="hidden"
/>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="w-full">
		<div
			class="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-gray-100 transition-colors"
		>
			<UserAvatar {user} size="md" />
			<div class="flex-1 text-left overflow-hidden">
				<p class="text-sm font-medium truncate">{displayName}</p>
				<p class="text-xs text-gray-500 truncate">{displayEmail}</p>
			</div>
		</div>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label>My Account</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={openFileDialog} disabled={isUploading}>
			<Upload class="mr-2 h-4 w-4" />
			<span>{isUploading ? 'Uploading...' : 'Upload Avatar'}</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={handleProfileSettings}>
			<User class="mr-2 h-4 w-4" />
			<span>Profile Settings</span>
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={handleLogout}>
			<LogOut class="mr-2 h-4 w-4" />
			<span>Logout</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
