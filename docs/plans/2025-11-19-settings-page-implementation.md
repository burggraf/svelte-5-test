# Settings Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a user settings page where users can view their profile info and edit their name and avatar.

**Architecture:** Three-card layout using shadcn-svelte components. Profile info card (read-only), avatar management card (upload/remove), and profile editing card (name field). All operations use existing auth store pattern with reactive updates.

**Tech Stack:** Svelte 5, PocketBase SDK, shadcn-svelte (Card, Button, Input, Label, Alert), existing UserAvatar component

---

## Task 1: Add removeAvatar Method to Auth Store

**Files:**
- Modify: `src/lib/stores/auth.ts:105-116`

**Step 1: Add removeAvatar method after updateProfile**

In `src/lib/stores/auth.ts`, add this method after the `updateProfile` function (around line 116):

```typescript
async function removeAvatar() {
	update((state) => ({ ...state, isLoading: true, error: null }));
	try {
		const record = await pb.collection('users').update(pb.authStore.model?.id || '', {
			avatar: null
		});
		update((state) => ({ ...state, user: record, isLoading: false }));
		return record;
	} catch (err: any) {
		const errorMessage = err?.response?.message || 'Failed to remove avatar';
		update((state) => ({ ...state, isLoading: false, error: errorMessage }));
		throw err;
	}
}
```

**Step 2: Export removeAvatar in return object**

In the return object (around line 122-129), add `removeAvatar` to the exports:

```typescript
return {
	subscribe,
	login,
	register,
	logout,
	requestPasswordReset,
	uploadAvatar,
	updateProfile,
	removeAvatar
};
```

**Step 3: Verify with type check**

Run: `pnpm run check`
Expected: Pass with 0 errors (may have pre-existing warnings)

**Step 4: Commit**

```bash
git add src/lib/stores/auth.ts
git commit -m "feat(auth): add removeAvatar method to auth store"
```

---

## Task 2: Build Settings Page Component

**Files:**
- Modify: `src/routes/(dashboard)/settings/+page.svelte:1-21`

**Step 1: Replace entire file with base structure**

Replace the entire contents of `src/routes/(dashboard)/settings/+page.svelte`:

```svelte
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
```

**Step 2: Verify with type check**

Run: `pnpm run check`
Expected: Pass with 0 errors

**Step 3: Test in browser**

1. Run: `pnpm run dev` (if not already running)
2. Navigate to `http://localhost:5173/settings`
3. Verify all three cards render
4. Verify profile info displays correctly
5. Verify avatar preview shows

Expected: Page renders without errors, shows user info

**Step 4: Commit**

```bash
git add src/routes/(dashboard)/settings/+page.svelte
git commit -m "feat(settings): implement settings page with profile view and editing"
```

---

## Task 3: Test Avatar Upload Functionality

**Step 1: Manually test avatar upload**

1. Open `http://localhost:5173/settings` in browser
2. Click "Upload New Avatar" button
3. Select a valid image file (< 5MB, image format)
4. Verify success message appears
5. Verify avatar updates in all locations (settings page, sidebar)

Expected: Avatar uploads successfully, reactive updates work

**Step 2: Test invalid file upload**

1. Click "Upload New Avatar"
2. Select a non-image file (e.g., .txt, .pdf)
3. Verify error message: "Please select an image file"

Expected: Validation prevents non-image uploads

**Step 3: Test oversized file upload**

1. Click "Upload New Avatar"
2. Select an image > 5MB
3. Verify error message: "Image must be less than 5MB"

Expected: Validation prevents oversized uploads

**Step 4: Document test results**

If all tests pass, proceed. If any fail, fix before committing.

---

## Task 4: Test Avatar Removal Functionality

**Step 1: Test avatar removal**

1. Ensure an avatar is uploaded (from Task 3)
2. Click "Remove Avatar" button
3. Verify success message appears
4. Verify avatar disappears and initials fallback shows
5. Verify "Remove Avatar" button disappears

Expected: Avatar removes successfully, UI updates reactively

**Step 2: Test removal with no avatar**

1. With no avatar uploaded, verify "Remove Avatar" button is hidden
2. Verify initials fallback displays correctly

Expected: Button conditionally hidden when no avatar exists

---

## Task 5: Test Name Editing Functionality

**Step 1: Test name update**

1. Open `http://localhost:5173/settings`
2. Change the name in the input field
3. Click "Save Changes"
4. Verify success message appears
5. Verify name updates in profile info card
6. Verify name updates in sidebar user component

Expected: Name saves successfully, reactive updates work

**Step 2: Test empty name**

1. Clear the name field (empty string)
2. Click "Save Changes"
3. Verify save succeeds (PocketBase allows empty names)
4. Verify "No name set" displays in profile info card

Expected: Empty names are allowed and handled gracefully

**Step 3: Test loading states**

1. While saving, verify "Save Changes" button shows "Saving..."
2. Verify button is disabled during save
3. Verify input field is disabled during save

Expected: Loading states prevent double-submission

---

## Task 6: Test Error Handling

**Step 1: Test network error simulation**

1. Stop PocketBase server (`pocketbase serve`)
2. Try to upload avatar
3. Verify error message displays
4. Try to update name
5. Verify error message displays
6. Restart PocketBase server

Expected: Errors display gracefully, app doesn't crash

**Step 2: Test success message auto-dismiss**

1. Perform any successful operation (avatar upload, name save)
2. Verify success message appears
3. Wait 3 seconds
4. Verify success message automatically disappears

Expected: Success messages auto-dismiss after 3 seconds

---

## Task 7: Verify Svelte 5 Compliance

**Step 1: Review component for Svelte 5 syntax**

Check `src/routes/(dashboard)/settings/+page.svelte`:

- ✅ All event handlers use `onclick`, `onchange` (not `on:click`, `on:change`)
- ✅ Props use `let { } = $props()` pattern
- ✅ State uses `$state()` runes
- ✅ Derived values use `$derived()` runes
- ✅ Effects use `$effect()` runes
- ✅ No `export let` syntax
- ✅ No `$:` reactive declarations

Expected: All Svelte 5 patterns correctly used

**Step 2: Run type check**

Run: `pnpm run check`
Expected: Pass with 0 errors (pre-existing warnings okay)

---

## Task 8: Final Integration Test

**Step 1: Test complete workflow**

1. Navigate to `/settings`
2. Upload avatar
3. Verify it appears in settings and sidebar
4. Update name
5. Verify it appears in settings and sidebar
6. Remove avatar
7. Verify initials fallback appears everywhere
8. Update name again
9. Verify initials update to match new name

Expected: All features work together seamlessly

**Step 2: Verify responsive design**

1. Resize browser to mobile width
2. Verify cards stack properly
3. Verify buttons remain accessible
4. Verify avatar previews remain visible

Expected: Layout responsive on mobile

**Step 3: Final commit**

If all tests pass:

```bash
git add -A
git commit -m "test: verify settings page functionality and Svelte 5 compliance"
```

---

## Implementation Complete

**Verification Checklist:**
- [ ] Auth store has `removeAvatar` method
- [ ] Settings page renders three cards correctly
- [ ] Profile info displays email, name, avatar
- [ ] Avatar upload works with validation
- [ ] Avatar removal works and hides button when no avatar
- [ ] Name editing saves successfully
- [ ] Empty names are allowed
- [ ] Success messages auto-dismiss after 3 seconds
- [ ] Error messages display correctly
- [ ] Loading states prevent double-submission
- [ ] All Svelte 5 syntax used correctly
- [ ] Type check passes
- [ ] Manual testing confirms all features work

**Next Steps:**
After all tasks complete and verification passes, ready to merge feature branch into main.
