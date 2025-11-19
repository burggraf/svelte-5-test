# Auth Pages Theme Toggle Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add light/dark/system theme toggle to all authentication pages (login, register, reset-password) by enhancing the existing theme-toggle component with an icon-only variant.

**Architecture:** Modify existing theme-toggle.svelte to support two variants ('sidebar' and 'icon'). The sidebar variant maintains current behavior for dashboard use. The icon variant provides an icon-only button for auth pages positioned in the top-right corner. Both variants share the same theme store logic.

**Tech Stack:** Svelte 5, TypeScript, shadcn-svelte, Tailwind v4, lucide-svelte icons

---

## Task 1: Enhance Theme Toggle Component

**Goal:** Add variant prop to support both sidebar (full-width with text) and icon (icon-only) display modes.

**Files:**
- Modify: `src/lib/components/theme-toggle.svelte` (entire file)

### Step 1: Update theme-toggle component with variant support

Replace the entire contents of `src/lib/components/theme-toggle.svelte` with:

```svelte
<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { Sun, Moon, Monitor } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let {
		variant = 'sidebar' as 'sidebar' | 'icon',
		class: className = ''
	} = $props();

	let themeState = $state($theme);

	$effect(() => {
		themeState = $theme;
	});

	function getIcon() {
		switch (themeState.mode) {
			case 'light':
				return Sun;
			case 'dark':
				return Moon;
			case 'system':
				return Monitor;
		}
	}

	function getLabel() {
		switch (themeState.mode) {
			case 'light':
				return 'Light';
			case 'dark':
				return 'Dark';
			case 'system':
				return 'System';
		}
	}

	function handleToggle() {
		theme.toggleMode();
	}
</script>

{#if variant === 'icon'}
	<Button
		variant="ghost"
		size="icon"
		onclick={handleToggle}
		class={className}
		aria-label="Toggle theme (currently {getLabel()} mode)"
	>
		<svelte:component this={getIcon()} class="h-5 w-5" />
	</Button>
{:else}
	<Button
		variant="ghost"
		size="sm"
		onclick={handleToggle}
		class="w-full justify-start gap-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 {className}"
		aria-label="Toggle theme"
	>
		<svelte:component this={getIcon()} class="h-4 w-4" />
		<span>{getLabel()} mode</span>
	</Button>
{/if}
```

**Key Changes:**
- Added `variant` prop with type `'sidebar' | 'icon'`
- Added `class: className` prop for custom positioning
- Conditional rendering based on variant
- Icon variant: `size="icon"` for square button, no text label, enhanced ARIA label
- Sidebar variant: maintains existing full-width styling

### Step 2: Verify component still works in dashboard

Run: `npm run check`

Expected: No new errors (existing warnings about `<svelte:component>` are OK)

### Step 3: Commit the component enhancement

```bash
git add src/lib/components/theme-toggle.svelte
git commit -m "feat(theme): add icon variant to theme toggle component

Add variant prop to support both sidebar (full-width) and icon (icon-only)
display modes. Icon variant includes enhanced ARIA label with current mode.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 2: Add Theme Toggle to Login Page

**Goal:** Add theme toggle in top-right corner of login page.

**Files:**
- Modify: `src/routes/(auth)/login/+page.svelte:1-3` (add import)
- Modify: `src/routes/(auth)/login/+page.svelte:36` (wrap in relative container and add toggle)

### Step 1: Add ThemeToggle import to login page

In `src/routes/(auth)/login/+page.svelte`, modify the import section (lines 1-8) to add the ThemeToggle import:

```svelte
<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
```

### Step 2: Update login page layout with theme toggle

Replace line 36 in `src/routes/(auth)/login/+page.svelte` (the outer `<div>`) with:

```svelte
<div class="relative flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
	<ThemeToggle variant="icon" class="absolute top-4 right-4 z-10" />
	<Card.Root class="w-full max-w-md">
```

**Note:** The closing `</div>` at the end of the file (line 91) remains unchanged.

**Key Changes:**
- Added `relative` to outer container for absolute positioning context
- Added `ThemeToggle` with `variant="icon"` positioned absolutely top-right
- Added `z-10` to ensure toggle stays above card

### Step 3: Verify no type errors

Run: `npm run check`

Expected: No new errors

### Step 4: Commit login page changes

```bash
git add src/routes/\(auth\)/login/+page.svelte
git commit -m "feat(auth): add theme toggle to login page

Add theme toggle button in top-right corner of login page using icon
variant. Button allows cycling between light/dark/system themes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: Add Theme Toggle to Register Page

**Goal:** Add theme toggle in top-right corner of register page.

**Files:**
- Modify: `src/routes/(auth)/register/+page.svelte:1-8` (add import)
- Modify: `src/routes/(auth)/register/+page.svelte:55` (wrap in relative container and add toggle)

### Step 1: Add ThemeToggle import to register page

In `src/routes/(auth)/register/+page.svelte`, modify the import section (lines 1-8) to add the ThemeToggle import:

```svelte
<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
```

### Step 2: Update register page layout with theme toggle

Replace line 55 in `src/routes/(auth)/register/+page.svelte` (the outer `<div>`) with:

```svelte
<div class="relative flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
	<ThemeToggle variant="icon" class="absolute top-4 right-4 z-10" />
	<Card.Root class="w-full max-w-md">
```

**Note:** The closing `</div>` at the end of the file (line 131) remains unchanged.

### Step 3: Verify no type errors

Run: `npm run check`

Expected: No new errors

### Step 4: Commit register page changes

```bash
git add src/routes/\(auth\)/register/+page.svelte
git commit -m "feat(auth): add theme toggle to register page

Add theme toggle button in top-right corner of register page using icon
variant. Consistent with login page implementation.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: Add Theme Toggle to Reset Password Page

**Goal:** Add theme toggle in top-right corner of reset password page.

**Files:**
- Modify: `src/routes/(auth)/reset-password/+page.svelte:1-7` (add import)
- Modify: `src/routes/(auth)/reset-password/+page.svelte:36` (wrap in relative container and add toggle)

### Step 1: Add ThemeToggle import to reset-password page

In `src/routes/(auth)/reset-password/+page.svelte`, modify the import section (lines 1-7) to add the ThemeToggle import:

```svelte
<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
```

### Step 2: Update reset-password page layout with theme toggle

Replace line 36 in `src/routes/(auth)/reset-password/+page.svelte` (the outer `<div>`) with:

```svelte
<div class="relative flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
	<ThemeToggle variant="icon" class="absolute top-4 right-4 z-10" />
	<Card.Root class="w-full max-w-md">
```

**Note:** The closing `</div>` at the end of the file (line 82) remains unchanged.

### Step 3: Verify no type errors

Run: `npm run check`

Expected: No new errors, all auth pages now have theme toggle

### Step 4: Commit reset-password page changes

```bash
git add src/routes/\(auth\)/reset-password/+page.svelte
git commit -m "feat(auth): add theme toggle to reset-password page

Add theme toggle button in top-right corner of reset-password page using
icon variant. Completes theme toggle implementation across all auth pages.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: Manual Testing & Verification

**Goal:** Verify theme toggle works correctly across all auth pages and persists to dashboard.

**Files:** None (testing only)

### Step 1: Start dev server

Run: `npm run dev`

Expected: Dev server starts on http://localhost:5173

### Step 2: Test login page theme toggle

1. Navigate to http://localhost:5173/login
2. Verify theme toggle button appears in top-right corner
3. Click theme toggle - should cycle: light → dark → system → light
4. Verify page theme changes immediately with each click
5. Verify appropriate icon shows: Sun (light), Moon (dark), Monitor (system)

### Step 3: Test theme persistence across auth pages

1. Set theme to dark mode on login page
2. Navigate to /register - verify dark theme persists
3. Navigate to /reset-password - verify dark theme persists
4. Navigate back to /login - verify dark theme persists

### Step 4: Test theme persistence to dashboard

1. On login page, set theme to dark mode
2. Log in with valid credentials
3. Verify dashboard loads in dark mode
4. Verify dashboard sidebar theme toggle shows dark mode

### Step 5: Test system theme mode

1. Log out and return to login page
2. Click theme toggle until "Monitor" icon shows (system mode)
3. Open browser DevTools and toggle OS dark mode preference:
   - Chrome: Cmd+Shift+P → "Rendering" → "Emulate CSS prefers-color-scheme"
   - Firefox: about:config → ui.systemUsesDarkTheme toggle
4. Verify page theme updates automatically when OS preference changes

### Step 6: Test localStorage persistence

1. Set theme to light mode on login page
2. Refresh the page (Cmd+R)
3. Verify theme remains light mode after refresh
4. Check localStorage in DevTools Console:
   ```javascript
   localStorage.getItem('theme-preference')
   ```
5. Expected: Returns "light" (or "dark"/"system" depending on selection)

### Step 7: Test responsive behavior

1. Resize browser window to mobile width (< 768px)
2. Verify theme toggle remains visible and clickable in top-right
3. Verify toggle doesn't overlap with card content
4. Test on actual mobile device if available

### Step 8: Test accessibility

1. Tab through the page using keyboard
2. Verify theme toggle receives focus (visible focus ring)
3. Press Enter/Space when focused on toggle
4. Verify theme changes
5. Use screen reader (VoiceOver on Mac: Cmd+F5) if available
6. Verify ARIA label announces: "Toggle theme (currently [Mode] mode)"

### Step 9: Document testing results

Create a brief summary of testing results:

**Testing Summary:**
- ✅ Theme toggle appears on all auth pages (login, register, reset-password)
- ✅ Theme cycles correctly: light → dark → system → light
- ✅ Theme persists across page navigation
- ✅ Theme persists after login to dashboard
- ✅ System mode responds to OS preference changes
- ✅ localStorage persistence works across browser sessions
- ✅ Responsive layout works on mobile
- ✅ Keyboard accessible and focus visible
- ✅ ARIA labels announce current mode

### Step 10: Final commit (if any fixes needed)

If any issues were discovered and fixed during testing:

```bash
git add .
git commit -m "fix(auth): address theme toggle issues found in testing

[Describe any fixes made]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Implementation Complete

**Summary:**
- Modified 1 component: `theme-toggle.svelte`
- Modified 3 auth pages: `login`, `register`, `reset-password`
- Total commits: 4 (component + 3 pages) + optional test fixes
- Total time estimate: 20-30 minutes

**Key Features Delivered:**
- Icon-only theme toggle in top-right of all auth pages
- Theme persists across auth pages and into dashboard
- System theme mode with OS preference detection
- localStorage persistence across sessions
- Fully accessible with ARIA labels and keyboard navigation
- Responsive on all screen sizes

**Next Steps:**
None required - feature is complete and tested.
