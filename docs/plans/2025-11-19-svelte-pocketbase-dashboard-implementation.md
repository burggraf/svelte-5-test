# Svelte 5 + PocketBase Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a client-side only Svelte 5 dashboard application with PocketBase authentication, user profiles, and avatar management.

**Architecture:** SvelteKit with adapter-static for static site generation, shadcn-svelte dashboard-07 template, custom Svelte stores wrapping PocketBase SDK for reactive auth state, runtime configuration for PocketBase URL.

**Tech Stack:** SvelteKit, Svelte 5, PocketBase SDK, shadcn-svelte, TailwindCSS, TypeScript, Vite

---

## Task 1: Initialize SvelteKit Project

**Files:**
- Create: `package.json`, `svelte.config.js`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`
- Create: `src/app.html`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`

**Step 1: Create SvelteKit project**

```bash
npm create svelte@latest . -- --template skeleton --types typescript --no-prettier --no-eslint --no-playwright --no-vitest
```

Expected: Project scaffolded with TypeScript support

**Step 2: Install dependencies**

```bash
npm install
```

Expected: Dependencies installed successfully

**Step 3: Install adapter-static**

```bash
npm install -D @sveltejs/adapter-static
```

Expected: adapter-static installed

**Step 4: Configure adapter-static**

Modify `svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: false
		})
	}
};

export default config;
```

**Step 5: Create .gitignore**

```bash
cat > .gitignore << 'EOF'
.DS_Store
node_modules
/build
/.svelte-kit
/package
.env
.env.*
!.env.example
vite.config.js.timestamp-*
vite.config.ts.timestamp-*
pb_data
EOF
```

**Step 6: Test dev server**

```bash
npm run dev
```

Expected: Dev server starts on port 5173, no errors

**Step 7: Commit**

```bash
git init
git add .
git commit -m "chore: initialize SvelteKit project with adapter-static"
```

---

## Task 2: Install and Configure TailwindCSS

**Files:**
- Create: `tailwind.config.js`, `src/app.css`
- Modify: `src/routes/+layout.svelte`

**Step 1: Install TailwindCSS**

```bash
npm install -D tailwindcss postcss autoprefixer tailwindcss-animate
npx tailwindcss init -p
```

Expected: tailwind.config.js and postcss.config.js created

**Step 2: Configure Tailwind**

Modify `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('tailwindcss-animate')]
};
```

**Step 3: Create global CSS file**

Create `src/app.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 4: Import CSS in root layout**

Modify `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
	import '../app.css';
</script>

<slot />
```

**Step 5: Test Tailwind**

Modify `src/routes/+page.svelte`:

```svelte
<div class="flex h-screen items-center justify-center">
	<h1 class="text-4xl font-bold text-blue-600">Tailwind Works!</h1>
</div>
```

**Step 6: Run dev server and verify**

```bash
npm run dev
```

Expected: Blue text "Tailwind Works!" centered on page

**Step 7: Commit**

```bash
git add .
git commit -m "chore: configure TailwindCSS with animate plugin"
```

---

## Task 3: Install and Initialize shadcn-svelte

**Files:**
- Create: `components.json`, `src/lib/components/ui/*`
- Modify: `tailwind.config.js`, `src/app.css`

**Step 1: Initialize shadcn-svelte**

```bash
npx shadcn-svelte@latest init
```

**When prompted:**
- Which style would you like to use? → **Default**
- Which color would you like to use as base color? → **Slate**
- Where is your global CSS file? → **src/app.css**
- Where is your tailwind.config.js located? → **tailwind.config.js**
- Configure the import alias for components? → **$lib/components**
- Configure the import alias for utils? → **$lib/utils**
- Are you using React Server Components? → **no**

Expected: components.json created, tailwind config updated

**Step 2: Verify configuration**

Check that `components.json` exists and contains correct paths

**Step 3: Commit**

```bash
git add .
git commit -m "chore: initialize shadcn-svelte with default theme"
```

---

## Task 4: Install PocketBase SDK and Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install PocketBase SDK**

```bash
npm install pocketbase
```

Expected: pocketbase ^0.21.0 installed

**Step 2: Install additional UI dependencies**

```bash
npm install bits-ui lucide-svelte
```

Expected: bits-ui and lucide-svelte installed

**Step 3: Verify installations**

```bash
npm list pocketbase bits-ui lucide-svelte
```

Expected: All packages listed with versions

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install PocketBase SDK and UI dependencies"
```

---

## Task 5: Create PocketBase Client Singleton

**Files:**
- Create: `src/lib/stores/pocketbase.ts`
- Create: `src/lib/config.ts`

**Step 1: Create config loader**

Create `src/lib/config.ts`:

```typescript
// Runtime configuration loader
export function getPocketBaseUrl(): string {
	// Check for runtime config (production)
	if (typeof window !== 'undefined' && (window as any).__APP_CONFIG__) {
		return (window as any).__APP_CONFIG__.pocketbaseUrl;
	}

	// Fallback to environment variable (development)
	return import.meta.env.PUBLIC_POCKETBASE_URL || 'http://localhost:8090';
}
```

**Step 2: Create PocketBase client singleton**

Create `src/lib/stores/pocketbase.ts`:

```typescript
import PocketBase from 'pocketbase';
import { getPocketBaseUrl } from '$lib/config';

// Singleton instance
export const pb = new PocketBase(getPocketBaseUrl());

// Enable auto-cancellation for request deduplication
pb.autoCancellation(false);
```

**Step 3: Create .env file**

```bash
cat > .env << 'EOF'
PUBLIC_POCKETBASE_URL=http://localhost:8090
EOF
```

**Step 4: Commit**

```bash
git add src/lib/stores/pocketbase.ts src/lib/config.ts .env
git commit -m "feat: create PocketBase client singleton with runtime config"
```

---

## Task 6: Create Authentication Store

**Files:**
- Create: `src/lib/stores/auth.ts`

**Step 1: Create auth store with types**

Create `src/lib/stores/auth.ts`:

```typescript
import { writable, type Writable } from 'svelte/store';
import { pb } from './pocketbase';
import type { RecordModel } from 'pocketbase';
import { goto } from '$app/navigation';

interface AuthState {
	user: RecordModel | null;
	isLoading: boolean;
	error: string | null;
}

function createAuthStore() {
	const { subscribe, set, update }: Writable<AuthState> = writable({
		user: pb.authStore.model,
		isLoading: false,
		error: null
	});

	// Subscribe to PocketBase auth changes
	pb.authStore.onChange((token, model) => {
		update((state) => ({ ...state, user: model, error: null }));
	});

	// Initialize: validate existing auth
	async function init() {
		if (pb.authStore.isValid) {
			try {
				// Verify token is still valid
				await pb.collection('users').authRefresh();
			} catch (err) {
				// Token expired or invalid, clear it
				pb.authStore.clear();
			}
		}
		update((state) => ({ ...state, user: pb.authStore.model }));
	}

	async function login(email: string, password: string) {
		update((state) => ({ ...state, isLoading: true, error: null }));
		try {
			const authData = await pb.collection('users').authWithPassword(email, password);
			update((state) => ({ ...state, user: authData.record, isLoading: false }));
			return authData.record;
		} catch (err: any) {
			const errorMessage = err?.response?.message || 'Login failed';
			update((state) => ({ ...state, isLoading: false, error: errorMessage }));
			throw err;
		}
	}

	async function register(data: {
		email: string;
		password: string;
		passwordConfirm: string;
		username?: string;
		name?: string;
	}) {
		update((state) => ({ ...state, isLoading: true, error: null }));
		try {
			const record = await pb.collection('users').create(data);
			// Auto-login after registration
			await login(data.email, data.password);
			return record;
		} catch (err: any) {
			const errorMessage = err?.response?.message || 'Registration failed';
			update((state) => ({ ...state, isLoading: false, error: errorMessage }));
			throw err;
		}
	}

	async function logout() {
		pb.authStore.clear();
		update((state) => ({ ...state, user: null, error: null }));
		goto('/login', { replaceState: true });
	}

	async function requestPasswordReset(email: string) {
		update((state) => ({ ...state, isLoading: true, error: null }));
		try {
			await pb.collection('users').requestPasswordReset(email);
			update((state) => ({ ...state, isLoading: false }));
		} catch (err: any) {
			const errorMessage = err?.response?.message || 'Failed to send reset email';
			update((state) => ({ ...state, isLoading: false, error: errorMessage }));
			throw err;
		}
	}

	async function uploadAvatar(file: File) {
		update((state) => ({ ...state, isLoading: true, error: null }));
		try {
			const formData = new FormData();
			formData.append('avatar', file);

			const record = await pb.collection('users').update(pb.authStore.model?.id || '', formData);
			update((state) => ({ ...state, user: record, isLoading: false }));
			return record;
		} catch (err: any) {
			const errorMessage = err?.response?.message || 'Failed to upload avatar';
			update((state) => ({ ...state, isLoading: false, error: errorMessage }));
			throw err;
		}
	}

	async function updateProfile(data: { name?: string; username?: string }) {
		update((state) => ({ ...state, isLoading: true, error: null }));
		try {
			const record = await pb.collection('users').update(pb.authStore.model?.id || '', data);
			update((state) => ({ ...state, user: record, isLoading: false }));
			return record;
		} catch (err: any) {
			const errorMessage = err?.response?.message || 'Failed to update profile';
			update((state) => ({ ...state, isLoading: false, error: errorMessage }));
			throw err;
		}
	}

	// Initialize on load
	init();

	return {
		subscribe,
		login,
		register,
		logout,
		requestPasswordReset,
		uploadAvatar,
		updateProfile
	};
}

export const auth = createAuthStore();
```

**Step 2: Commit**

```bash
git add src/lib/stores/auth.ts
git commit -m "feat: create authentication store with login, register, logout, password reset, avatar upload"
```

---

## Task 7: Create Runtime Config File

**Files:**
- Create: `static/config.js`
- Modify: `src/app.html`

**Step 1: Create static config file**

```bash
mkdir -p static
cat > static/config.js << 'EOF'
// Runtime configuration
// Update this file with your production PocketBase URL before deployment
window.__APP_CONFIG__ = {
	pocketbaseUrl: 'http://localhost:8090'
};
EOF
```

**Step 2: Load config in app.html**

Modify `src/app.html`:

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<script src="/config.js"></script>
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

**Step 3: Commit**

```bash
git add static/config.js src/app.html
git commit -m "feat: add runtime configuration for PocketBase URL"
```

---

## Task 8: Add shadcn Components for Auth Pages

**Files:**
- Create: `src/lib/components/ui/button.svelte`, `src/lib/components/ui/input.svelte`, `src/lib/components/ui/label.svelte`, `src/lib/components/ui/card.svelte`, `src/lib/components/ui/alert.svelte`

**Step 1: Add Button component**

```bash
npx shadcn-svelte@latest add button
```

Expected: Button component added to `src/lib/components/ui/`

**Step 2: Add Input component**

```bash
npx shadcn-svelte@latest add input
```

Expected: Input component added

**Step 3: Add Label component**

```bash
npx shadcn-svelte@latest add label
```

Expected: Label component added

**Step 4: Add Card component**

```bash
npx shadcn-svelte@latest add card
```

Expected: Card component added

**Step 5: Add Alert component**

```bash
npx shadcn-svelte@latest add alert
```

Expected: Alert component added

**Step 6: Commit**

```bash
git add src/lib/components/ui/
git commit -m "chore: add shadcn components for auth pages (button, input, label, card, alert)"
```

---

## Task 9: Create Login Page

**Files:**
- Create: `src/routes/(auth)/login/+page.svelte`
- Create: `src/routes/(auth)/+layout.ts`

**Step 1: Create auth route group layout**

Create `src/routes/(auth)/+layout.ts`:

```typescript
import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/stores/pocketbase';

export const ssr = false;

export async function load() {
	// Redirect to dashboard if already authenticated
	if (pb.authStore.isValid) {
		throw redirect(303, '/');
	}
	return {};
}
```

**Step 2: Create login page**

Create `src/routes/(auth)/login/+page.svelte`:

```svelte
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
						on:keypress={handleKeyPress}
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
						on:keypress={handleKeyPress}
						disabled={isLoading}
					/>
				</div>

				<Button class="w-full" on:click={handleLogin} disabled={isLoading}>
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
```

**Step 3: Test login page**

```bash
npm run dev
```

Navigate to http://localhost:5173/login

Expected: Login form displayed with email, password fields, and links

**Step 4: Commit**

```bash
git add src/routes/\(auth\)/
git commit -m "feat: create login page with form validation and error handling"
```

---

## Task 10: Create Register Page

**Files:**
- Create: `src/routes/(auth)/register/+page.svelte`

**Step 1: Create register page**

Create `src/routes/(auth)/register/+page.svelte`:

```svelte
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
```

**Step 2: Test register page**

```bash
npm run dev
```

Navigate to http://localhost:5173/register

Expected: Registration form with all fields displayed

**Step 3: Commit**

```bash
git add src/routes/\(auth\)/register/
git commit -m "feat: create register page with password validation"
```

---

## Task 11: Create Password Reset Page

**Files:**
- Create: `src/routes/(auth)/reset-password/+page.svelte`

**Step 1: Create password reset page**

Create `src/routes/(auth)/reset-password/+page.svelte`:

```svelte
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

<div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
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
						on:keypress={handleKeyPress}
						disabled={isLoading || success}
					/>
				</div>

				<Button class="w-full" on:click={handleReset} disabled={isLoading || success}>
					{isLoading ? 'Sending...' : 'Send Reset Link'}
				</Button>

				<div class="text-center text-sm">
					<a href="/login" class="text-blue-600 hover:underline">Back to Login</a>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
```

**Step 2: Test password reset page**

```bash
npm run dev
```

Navigate to http://localhost:5173/reset-password

Expected: Password reset form displayed

**Step 3: Commit**

```bash
git add src/routes/\(auth\)/reset-password/
git commit -m "feat: create password reset page"
```

---

## Task 12: Install Dashboard Components

**Files:**
- Create: Multiple shadcn components for dashboard

**Step 1: Add Dropdown Menu component**

```bash
npx shadcn-svelte@latest add dropdown-menu
```

Expected: DropdownMenu component added

**Step 2: Add Avatar component**

```bash
npx shadcn-svelte@latest add avatar
```

Expected: Avatar component added

**Step 3: Add Badge component**

```bash
npx shadcn-svelte@latest add badge
```

Expected: Badge component added

**Step 4: Add Separator component**

```bash
npx shadcn-svelte@latest add separator
```

Expected: Separator component added

**Step 5: Add Sheet component (for mobile sidebar)**

```bash
npx shadcn-svelte@latest add sheet
```

Expected: Sheet component added

**Step 6: Add Toast/Sonner for notifications**

```bash
npx shadcn-svelte@latest add sonner
```

Expected: Sonner toast component added

**Step 7: Commit**

```bash
git add src/lib/components/ui/
git commit -m "chore: add dashboard UI components (dropdown, avatar, badge, separator, sheet, sonner)"
```

---

## Task 13: Create User Avatar Component

**Files:**
- Create: `src/lib/components/user-avatar.svelte`

**Step 1: Create user avatar component**

Create `src/lib/components/user-avatar.svelte`:

```svelte
<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { pb } from '$lib/stores/pocketbase';
	import type { RecordModel } from 'pocketbase';

	export let user: RecordModel | null;
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const sizeClasses = {
		sm: 'h-8 w-8 text-sm',
		md: 'h-10 w-10 text-base',
		lg: 'h-16 w-16 text-2xl'
	};

	function getAvatarUrl(user: RecordModel | null): string | null {
		if (!user?.avatar) return null;
		return pb.files.getUrl(user, user.avatar, { thumb: '100x100' });
	}

	function getInitials(user: RecordModel | null): string {
		if (!user) return '?';

		if (user.name) {
			const parts = user.name.split(' ');
			if (parts.length >= 2) {
				return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
			}
			return user.name.substring(0, 2).toUpperCase();
		}

		if (user.username) {
			return user.username.substring(0, 2).toUpperCase();
		}

		if (user.email) {
			return user.email.substring(0, 2).toUpperCase();
		}

		return '?';
	}

	function getBackgroundColor(user: RecordModel | null): string {
		if (!user?.email) return 'bg-gray-500';

		// Generate consistent color from email hash
		let hash = 0;
		for (let i = 0; i < user.email.length; i++) {
			hash = user.email.charCodeAt(i) + ((hash << 5) - hash);
		}

		const colors = [
			'bg-blue-500',
			'bg-green-500',
			'bg-yellow-500',
			'bg-purple-500',
			'bg-pink-500',
			'bg-indigo-500',
			'bg-red-500',
			'bg-orange-500'
		];

		return colors[Math.abs(hash) % colors.length];
	}

	$: avatarUrl = getAvatarUrl(user);
	$: initials = getInitials(user);
	$: bgColor = getBackgroundColor(user);
</script>

<Avatar.Root class={sizeClasses[size]}>
	{#if avatarUrl}
		<Avatar.Image src={avatarUrl} alt={user?.name || user?.username || 'User avatar'} />
	{/if}
	<Avatar.Fallback class={`${bgColor} text-white`}>
		{initials}
	</Avatar.Fallback>
</Avatar.Root>
```

**Step 2: Commit**

```bash
git add src/lib/components/user-avatar.svelte
git commit -m "feat: create user avatar component with initials fallback"
```

---

## Task 14: Create Sidebar User Component

**Files:**
- Create: `src/lib/components/sidebar-user.svelte`

**Step 1: Create sidebar user component**

Create `src/lib/components/sidebar-user.svelte`:

```svelte
<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import UserAvatar from './user-avatar.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { LogOut, Upload, User } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

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

	function handleLogout() {
		auth.logout();
	}
</script>

<input
	type="file"
	accept="image/*"
	bind:this={fileInput}
	on:change={handleAvatarUpload}
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
		<DropdownMenu.Item on:click={openFileDialog} disabled={isUploading}>
			<Upload class="mr-2 h-4 w-4" />
			<span>{isUploading ? 'Uploading...' : 'Upload Avatar'}</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<User class="mr-2 h-4 w-4" />
			<span>Profile Settings</span>
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={handleLogout}>
			<LogOut class="mr-2 h-4 w-4" />
			<span>Logout</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
```

**Step 2: Commit**

```bash
git add src/lib/components/sidebar-user.svelte
git commit -m "feat: create sidebar user component with avatar upload and logout"
```

---

## Task 15: Create Dashboard Layout

**Files:**
- Create: `src/routes/(dashboard)/+layout.ts`
- Create: `src/routes/(dashboard)/+layout.svelte`

**Step 1: Create dashboard layout guard**

Create `src/routes/(dashboard)/+layout.ts`:

```typescript
import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/stores/pocketbase';

export const ssr = false;

export async function load() {
	// Redirect to login if not authenticated
	if (!pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	return {
		user: pb.authStore.model
	};
}
```

**Step 2: Create dashboard layout structure**

Create `src/routes/(dashboard)/+layout.svelte`:

```svelte
<script lang="ts">
	import SidebarUser from '$lib/components/sidebar-user.svelte';
	import { page } from '$app/stores';
	import * as Sheet from '$lib/components/ui/sheet';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Menu, Home, BarChart3, Settings, FileText } from 'lucide-svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	let mobileMenuOpen = false;

	const navItems = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/analytics', label: 'Analytics', icon: BarChart3 },
		{ href: '/documents', label: 'Documents', icon: FileText },
		{ href: '/settings', label: 'Settings', icon: Settings }
	];

	function isActive(href: string): boolean {
		return $page.url.pathname === href;
	}
</script>

<Toaster />

<div class="flex h-screen overflow-hidden bg-gray-50">
	<!-- Desktop Sidebar -->
	<aside class="hidden md:flex md:w-64 md:flex-col bg-white border-r">
		<!-- Logo -->
		<div class="flex h-16 items-center border-b px-6">
			<h1 class="text-xl font-bold">Dashboard</h1>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors {isActive(
						item.href
					)
						? 'bg-blue-50 text-blue-600 font-medium'
						: 'text-gray-700 hover:bg-gray-100'}"
				>
					<svelte:component this={item.icon} class="h-5 w-5" />
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- User Component -->
		<div class="border-t p-3">
			<SidebarUser />
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- Top Bar (Mobile) -->
		<header class="flex h-16 items-center border-b bg-white px-4 md:hidden">
			<Button variant="ghost" size="icon" on:click={() => (mobileMenuOpen = true)}>
				<Menu class="h-6 w-6" />
			</Button>
			<h1 class="ml-4 text-lg font-semibold">Dashboard</h1>
		</header>

		<!-- Content Area -->
		<main class="flex-1 overflow-y-auto p-4 md:p-6">
			<slot />
		</main>
	</div>
</div>

<!-- Mobile Sidebar -->
<Sheet.Root bind:open={mobileMenuOpen}>
	<Sheet.Content side="left" class="w-64 p-0">
		<div class="flex h-full flex-col">
			<!-- Logo -->
			<div class="flex h-16 items-center border-b px-6">
				<h1 class="text-xl font-bold">Dashboard</h1>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
				{#each navItems as item}
					<a
						href={item.href}
						on:click={() => (mobileMenuOpen = false)}
						class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors {isActive(
							item.href
						)
							? 'bg-blue-50 text-blue-600 font-medium'
							: 'text-gray-700 hover:bg-gray-100'}"
					>
						<svelte:component this={item.icon} class="h-5 w-5" />
						{item.label}
					</a>
				{/each}
			</nav>

			<!-- User Component -->
			<div class="border-t p-3">
				<SidebarUser />
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
```

**Step 3: Create dashboard home page**

Create `src/routes/(dashboard)/+page.svelte`:

```svelte
<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Users, FileText, BarChart3, Settings } from 'lucide-svelte';
</script>

<div class="space-y-6">
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

**Step 4: Test dashboard**

```bash
npm run dev
```

Navigate to http://localhost:5173 (should redirect to login if not authenticated)

Expected: After login, dashboard with sidebar and stats displayed

**Step 5: Commit**

```bash
git add src/routes/\(dashboard\)/
git commit -m "feat: create dashboard layout with sidebar, navigation, and home page"
```

---

## Task 16: Initialize PocketBase and Create Collections

**Files:**
- PocketBase database (pb_data/)

**Step 1: Start PocketBase server**

```bash
pocketbase serve
```

Expected: PocketBase starts on http://localhost:8090

**Step 2: Open admin UI**

Navigate to http://localhost:8090/_/

Expected: Admin setup page displayed

**Step 3: Create superuser account**

- Email: admin@example.com
- Password: (choose a secure password)

Expected: Admin account created, logged into dashboard

**Step 4: Configure users collection for avatars**

1. Go to Collections → users
2. Click on Schema
3. Find the "avatar" field (or create it if not exists)
4. Configure:
   - Type: File
   - Max Select: 1
   - Max Size: 5242880 (5MB)
   - Mime Types: image/jpeg, image/png, image/gif, image/webp
5. Save changes

Expected: Users collection configured for avatar uploads

**Step 5: Enable file serving**

Settings should already enable file serving by default. Verify:
1. Go to Settings → Files
2. Ensure "Max file size" is at least 5MB

Expected: File settings configured

**Step 6: Test complete flow**

1. Stop PocketBase (`Ctrl+C`)
2. Restart: `pocketbase serve`
3. Navigate to http://localhost:5173
4. Register a new user account
5. Upload an avatar
6. Verify avatar appears in sidebar

Expected: Complete auth flow works, avatar uploads successfully

**Step 7: Document PocketBase setup**

Create a README note (no commit needed, just verification step):

```bash
echo "PocketBase initialized with superuser. Run 'pocketbase serve' to start."
```

Expected: PocketBase fully configured and tested

---

## Task 17: Configure Build for Static Export

**Files:**
- Modify: `src/routes/+layout.ts`

**Step 1: Enable prerendering globally**

Create `src/routes/+layout.ts`:

```typescript
export const prerender = true;
export const ssr = false;
```

**Step 2: Test build**

```bash
npm run build
```

Expected: Build completes without errors, outputs to `build/`

**Step 3: Preview production build**

```bash
npm run preview
```

Expected: Production preview runs, app works correctly

**Step 4: Test auth flow in preview**

1. Navigate to preview URL
2. Test login/register
3. Verify dashboard loads

Expected: All functionality works in production build

**Step 5: Commit**

```bash
git add src/routes/+layout.ts
git commit -m "feat: configure static export with prerendering"
```

---

## Task 18: Create Placeholder Pages

**Files:**
- Create: `src/routes/(dashboard)/analytics/+page.svelte`
- Create: `src/routes/(dashboard)/documents/+page.svelte`
- Create: `src/routes/(dashboard)/settings/+page.svelte`

**Step 1: Create analytics page**

Create `src/routes/(dashboard)/analytics/+page.svelte`:

```svelte
<script lang="ts">
	import * as Card from '$lib/components/ui/card';
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-3xl font-bold tracking-tight">Analytics</h2>
		<p class="text-gray-500">View your analytics and insights</p>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Coming Soon</Card.Title>
			<Card.Description>Analytics features will be available here</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-gray-500">This page is under construction.</p>
		</Card.Content>
	</Card.Root>
</div>
```

**Step 2: Create documents page**

Create `src/routes/(dashboard)/documents/+page.svelte`:

```svelte
<script lang="ts">
	import * as Card from '$lib/components/ui/card';
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-3xl font-bold tracking-tight">Documents</h2>
		<p class="text-gray-500">Manage your documents</p>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Coming Soon</Card.Title>
			<Card.Description>Document management features will be available here</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-gray-500">This page is under construction.</p>
		</Card.Content>
	</Card.Root>
</div>
```

**Step 3: Create settings page**

Create `src/routes/(dashboard)/settings/+page.svelte`:

```svelte
<script lang="ts">
	import * as Card from '$lib/components/ui/card';
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-3xl font-bold tracking-tight">Settings</h2>
		<p class="text-gray-500">Manage your account settings</p>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Coming Soon</Card.Title>
			<Card.Description>Settings features will be available here</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-gray-500">This page is under construction.</p>
		</Card.Content>
	</Card.Root>
</div>
```

**Step 4: Test navigation**

```bash
npm run dev
```

Click through all navigation items in sidebar

Expected: All pages load without errors

**Step 5: Commit**

```bash
git add src/routes/\(dashboard\)/analytics/ src/routes/\(dashboard\)/documents/ src/routes/\(dashboard\)/settings/
git commit -m "feat: create placeholder pages for analytics, documents, and settings"
```

---

## Task 19: Add Favicon and App Metadata

**Files:**
- Create: `static/favicon.png`
- Modify: `src/app.html`

**Step 1: Update app.html with metadata**

Modify `src/app.html`:

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="description" content="Dashboard application with PocketBase authentication" />
		<meta name="theme-color" content="#ffffff" />
		<script src="/config.js"></script>
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

**Step 2: Add a placeholder favicon (if not exists)**

If you don't have a favicon.png, create a simple text note for now:

```bash
echo "Add favicon.png to static/ directory" > static/favicon-note.txt
```

**Step 3: Commit**

```bash
git add src/app.html static/
git commit -m "chore: add app metadata and favicon configuration"
```

---

## Task 20: Final Testing and Documentation

**Files:**
- Create: `README.md`

**Step 1: Create comprehensive README**

Create `README.md`:

```markdown
# Svelte 5 + PocketBase Dashboard

A client-side only dashboard application built with Svelte 5, SvelteKit, and PocketBase for authentication and data management.

## Features

- 🔐 Complete authentication system (login, register, password reset)
- 👤 User profiles with avatar upload
- 📊 Dashboard with sidebar navigation
- 📱 Responsive design (mobile + desktop)
- 🎨 shadcn-svelte UI components
- ⚡ Static site generation for Cloudflare Pages

## Tech Stack

- **Framework:** SvelteKit with adapter-static
- **UI Library:** shadcn-svelte (dashboard-07 template)
- **Backend:** PocketBase 0.31.0
- **Styling:** TailwindCSS + tailwindcss-animate
- **Icons:** lucide-svelte
- **Language:** TypeScript

## Prerequisites

- Node.js 18+
- PocketBase 0.31.0

## Getting Started

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Start PocketBase

\`\`\`bash
pocketbase serve
\`\`\`

First time setup:
1. Navigate to http://localhost:8090/_/
2. Create superuser account
3. Configure users collection for avatars (already done if following setup)

### 3. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Navigate to http://localhost:5173

## Project Structure

\`\`\`
src/
  lib/
    components/
      ui/              # shadcn-svelte components
      sidebar-user.svelte
      user-avatar.svelte
    stores/
      auth.ts          # Authentication store
      pocketbase.ts    # PocketBase client
    config.ts          # Runtime config loader
  routes/
    (auth)/            # Public auth pages
      login/
      register/
      reset-password/
    (dashboard)/       # Protected dashboard pages
      +layout.svelte   # Dashboard shell
      +page.svelte     # Home
      analytics/
      documents/
      settings/
static/
  config.js            # Runtime PocketBase URL
\`\`\`

## Configuration

### Development

Create \`.env\`:

\`\`\`bash
PUBLIC_POCKETBASE_URL=http://localhost:8090
\`\`\`

### Production

Edit \`static/config.js\`:

\`\`\`javascript
window.__APP_CONFIG__ = {
  pocketbaseUrl: 'https://your-production-pb.com'
};
\`\`\`

## Building for Production

\`\`\`bash
npm run build
\`\`\`

Output: \`build/\` directory (static files)

## Deployment (Cloudflare Pages)

1. Build command: \`npm run build\`
2. Build output directory: \`build\`
3. Update \`static/config.js\` with production PocketBase URL before building

## PocketBase Setup

### Users Collection Configuration

The users collection (auth collection) needs avatar field configured:
- Type: File
- Max Select: 1
- Max Size: 5MB
- Mime Types: image/jpeg, image/png, image/gif, image/webp

### CORS Configuration

For production, configure PocketBase CORS to allow your domain:

\`\`\`
Settings → Application → CORS
\`\`\`

## Features Implemented

- ✅ User registration with email/password
- ✅ User login
- ✅ Password reset flow
- ✅ Avatar upload (5MB max, images only)
- ✅ Protected dashboard routes
- ✅ Responsive sidebar navigation
- ✅ User dropdown menu
- ✅ Toast notifications
- ✅ Static site generation

## Features To Add

- [ ] Profile settings page
- [ ] Email verification flow
- [ ] Multi-factor authentication
- [ ] Dark mode toggle
- [ ] Data tables/CRUD operations
- [ ] Real analytics
- [ ] Document management

## Development

### Adding shadcn Components

\`\`\`bash
npx shadcn-svelte@latest add [component-name]
\`\`\`

### Project Scripts

- \`npm run dev\` - Start dev server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run check\` - Run svelte-check

## License

MIT
\`\`\`

**Step 2: Final build test**

```bash
npm run build && npm run preview
```

Expected: Build succeeds, preview works, all features functional

**Step 3: Test complete user flow**

1. Register new account
2. Login
3. Upload avatar
4. Navigate between pages
5. Logout
6. Login again (verify avatar persists)

Expected: All features work end-to-end

**Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add comprehensive README with setup and deployment instructions"
```

**Step 5: Final commit**

```bash
git add .
git commit -m "chore: final implementation complete"
```

---

## Summary

This implementation plan creates a complete Svelte 5 + PocketBase dashboard application with:

1. ✅ SvelteKit with static adapter
2. ✅ TailwindCSS + shadcn-svelte UI
3. ✅ PocketBase authentication (login, register, password reset)
4. ✅ User avatars with upload
5. ✅ Protected dashboard with sidebar
6. ✅ Responsive design (mobile + desktop)
7. ✅ Toast notifications
8. ✅ Runtime configuration for deployment
9. ✅ Complete documentation

**Total Tasks:** 20
**Estimated Time:** 3-4 hours for experienced developer

## Next Steps After Implementation

1. Deploy PocketBase to production (PocketHost, Fly.io, etc.)
2. Update `static/config.js` with production URL
3. Build and deploy to Cloudflare Pages
4. Test production deployment
5. Add additional features as needed
