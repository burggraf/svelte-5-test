# Page Header Bar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a reusable PageHeader component with centered title and optional action buttons for all dashboard pages.

**Architecture:** Self-contained approach where each page imports and renders its own PageHeader component, passing title and optional Svelte 5 snippets for left/right action buttons.

**Tech Stack:** Svelte 5, shadcn-svelte (Button), lucide-svelte (icons), Tailwind v4

---

## Task 1: Create PageHeader Component

**Files:**
- Create: `src/lib/components/ui/page-header.svelte`

**Step 1: Create the PageHeader component**

Create `src/lib/components/ui/page-header.svelte` with the following content:

```svelte
<script lang="ts">
	let { title, leftActions, rightActions } = $props<{
		title: string;
		leftActions?: any;
		rightActions?: any;
	}>();

	const hasLeftActions = leftActions && typeof leftActions === 'function';
	const hasRightActions = rightActions && typeof rightActions === 'function';
</script>

<header class="sticky top-0 z-50 bg-background border-b">
	<div class="flex items-center justify-between h-16 px-4">
		<div class="flex items-center gap-2">
			{#if hasLeftActions}
				{@render leftActions()}
			{/if}
		</div>

		<h1 class="text-lg md:text-xl font-semibold absolute left-1/2 -translate-x-1/2">
			{title}
		</h1>

		<div class="flex items-center gap-2">
			{#if hasRightActions}
				{@render rightActions()}
			{/if}
		</div>
	</div>
</header>
```

**Step 2: Verify component syntax**

Run: `pnpm run check`

Expected: No new errors (baseline has 2 warnings in dashboard layout)

**Step 3: Commit**

```bash
git add src/lib/components/ui/page-header.svelte
git commit -m "feat(ui): add PageHeader component with snippet support

- Centered title with absolute positioning
- Optional left/right action areas via Svelte 5 snippets
- Sticky positioning with z-50
- Responsive text sizing (text-lg md:text-xl)"
```

---

## Task 2: Update Dashboard Home Page

**Files:**
- Modify: `src/routes/(dashboard)/+page.svelte`

**Step 1: Add PageHeader to home page**

Replace the content of `src/routes/(dashboard)/+page.svelte` with:

```svelte
<script lang="ts">
	import PageHeader from '$lib/components/ui/page-header.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Users, FileText, BarChart3, Settings } from 'lucide-svelte';
</script>

<PageHeader title="Dashboard" />

<div class="p-6 space-y-6">
	<div>
		<h2 class="text-3xl font-bold tracking-tight">Welcome back!</h2>
		<p class="text-gray-500">Here's what's happening with your account today.</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Users</Card.Title>
				<Users class="h-4 w-4 text-gray-500" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">2,350</div>
				<p class="text-xs text-gray-500">+180 from last month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Documents</Card.Title>
				<FileText class="h-4 w-4 text-gray-500" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">1,234</div>
				<p class="text-xs text-gray-500">+50 from last month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Analytics</Card.Title>
				<BarChart3 class="h-4 w-4 text-gray-500" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">89%</div>
				<p class="text-xs text-gray-500">+2% from last month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Active Now</Card.Title>
				<Settings class="h-4 w-4 text-gray-500" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">573</div>
				<p class="text-xs text-gray-500">+201 since last hour</p>
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
			<p class="text-gray-500">No recent activity to display.</p>
		</Card.Content>
	</Card.Root>
</div>
```

**Step 2: Verify changes**

Run: `pnpm run check`

Expected: No new errors

**Step 3: Test manually**

Run: `pnpm run dev`

1. Navigate to `http://localhost:5173/`
2. Verify PageHeader appears with "Dashboard" title centered
3. Verify content has proper padding (24px / p-6)
4. Scroll down and verify header stays sticky at top

**Step 4: Commit**

```bash
git add src/routes/(dashboard)/+page.svelte
git commit -m "feat(dashboard): add PageHeader to home page

- Add PageHeader component with 'Dashboard' title
- Wrap content in p-6 container for consistent spacing
- Maintain existing stats grid and activity card layout"
```

---

## Task 3: Update Analytics Page

**Files:**
- Modify: `src/routes/(dashboard)/analytics/+page.svelte`

**Step 1: Add PageHeader to analytics page**

Replace the content of `src/routes/(dashboard)/analytics/+page.svelte` with:

```svelte
<script lang="ts">
	import PageHeader from '$lib/components/ui/page-header.svelte';
</script>

<PageHeader title="Analytics" />

<div class="p-6">
	<p class="text-gray-500">Analytics page content coming soon...</p>
</div>
```

**Step 2: Verify changes**

Run: `pnpm run check`

Expected: No new errors

**Step 3: Commit**

```bash
git add src/routes/(dashboard)/analytics/+page.svelte
git commit -m "feat(analytics): add PageHeader to analytics page

- Add PageHeader component with 'Analytics' title
- Wrap content in p-6 container"
```

---

## Task 4: Update Documents Page

**Files:**
- Modify: `src/routes/(dashboard)/documents/+page.svelte`

**Step 1: Add PageHeader to documents page**

Replace the content of `src/routes/(dashboard)/documents/+page.svelte` with:

```svelte
<script lang="ts">
	import PageHeader from '$lib/components/ui/page-header.svelte';
</script>

<PageHeader title="Documents" />

<div class="p-6">
	<p class="text-gray-500">Documents page content coming soon...</p>
</div>
```

**Step 2: Verify changes**

Run: `pnpm run check`

Expected: No new errors

**Step 3: Commit**

```bash
git add src/routes/(dashboard)/documents/+page.svelte
git commit -m "feat(documents): add PageHeader to documents page

- Add PageHeader component with 'Documents' title
- Wrap content in p-6 container"
```

---

## Task 5: Update Settings Page with Back Button Example

**Files:**
- Modify: `src/routes/(dashboard)/settings/+page.svelte`

**Step 1: Add PageHeader with back button to settings page**

Replace the content of `src/routes/(dashboard)/settings/+page.svelte` with:

```svelte
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
```

**Step 2: Verify changes**

Run: `pnpm run check`

Expected: No new errors

**Step 3: Test manually**

Run: `pnpm run dev` (if not already running)

1. Navigate to `http://localhost:5173/settings`
2. Verify PageHeader appears with "Settings" title centered
3. Verify back button (arrow icon) appears in left area
4. Click back button and verify navigation to home page works
5. Return to settings and verify header stays sticky when scrolling

**Step 4: Commit**

```bash
git add src/routes/(dashboard)/settings/+page.svelte
git commit -m "feat(settings): add PageHeader with back button

- Add PageHeader component with 'Settings' title
- Include back button in leftActions snippet
- Wrap content in p-6 container
- Demonstrates action button usage pattern"
```

---

## Task 6: Final Verification

**Files:**
- All modified files

**Step 1: Run type checking**

Run: `pnpm run check`

Expected: 0 errors, 2 pre-existing warnings (svelte:component deprecation in dashboard layout)

**Step 2: Manual testing - All pages**

Run: `pnpm run dev`

Test each page:

1. **Dashboard (/):**
   - Header shows "Dashboard" title centered
   - No action buttons
   - Stats cards display correctly with proper spacing
   - Header is sticky when scrolling

2. **Analytics (/analytics):**
   - Header shows "Analytics" title centered
   - No action buttons
   - Content has proper padding

3. **Documents (/documents):**
   - Header shows "Documents" title centered
   - No action buttons
   - Content has proper padding

4. **Settings (/settings):**
   - Header shows "Settings" title centered
   - Back button appears in left area
   - Back button navigates to home page
   - Settings cards display correctly
   - Header is sticky when scrolling

**Step 3: Test mobile responsiveness**

In dev tools, switch to mobile viewport (e.g., iPhone SE):

1. Verify title text size is smaller (text-lg) on mobile
2. Verify header doesn't overflow
3. Verify icon buttons are properly sized
4. Test across all 4 pages

**Step 4: Verify clean git status**

Run: `git status`

Expected: Working tree clean (all changes committed)

**Step 5: Document completion**

All tasks complete! PageHeader component implemented and integrated across all dashboard pages.

---

## Testing Checklist

- [ ] PageHeader component created with Svelte 5 syntax
- [ ] Title is centered using absolute positioning
- [ ] Header is sticky at top of content area
- [ ] Dashboard home page shows header
- [ ] Analytics page shows header
- [ ] Documents page shows header
- [ ] Settings page shows header with back button
- [ ] Back button navigation works
- [ ] All pages have consistent p-6 padding on content
- [ ] Header stays visible when scrolling
- [ ] Mobile responsive (text-lg on small screens)
- [ ] No TypeScript errors
- [ ] All changes committed with descriptive messages

## DRY / YAGNI Notes

**Followed:**
- Single PageHeader component reused across all pages (DRY)
- No premature abstraction of button configurations (YAGNI)
- No unnecessary state management layer (YAGNI)
- Simple snippet-based approach for actions (YAGNI)

**Avoided:**
- Creating separate header components per page
- Building a complex header configuration system
- Adding unused features like breadcrumbs, search, notifications
- Over-engineering the button layout system

## Common Pitfalls

1. **Using Svelte 4 syntax:** Always use `onclick` not `on:click`, `$props()` not `export let`
2. **Forgetting p-6 wrapper:** Content needs padding container below PageHeader
3. **Wrong positioning for title:** Must use `absolute left-1/2 -translate-x-1/2` for centering
4. **Missing z-index:** Header needs `z-50` to stay above page content
5. **Not testing sticky behavior:** Must scroll to verify sticky positioning works
6. **Forgetting responsive text:** Use `text-lg md:text-xl` for mobile-friendly sizing
