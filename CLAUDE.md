# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Svelte 5** + PocketBase dashboard application configured for **static site generation** (no SSR). It uses SvelteKit with adapter-static to generate a fully client-side SPA that can be deployed to Cloudflare Pages.

**Key Architecture Principle:** This is a client-side only application. All routes are prerendered as static HTML with client-side hydration. The backend is PocketBase running separately.

## Essential Commands

### Development
```bash
npm run dev              # Start Vite dev server (http://localhost:5173)
pocketbase serve         # Start PocketBase backend (http://localhost:8090)
npm run check            # Run svelte-check for type checking
```

### Building
```bash
npm run build           # Build static site to build/ directory
npm run preview         # Preview production build locally
```

### Adding UI Components
```bash
npx shadcn-svelte@latest add [component-name]
```

## Architecture

### Static Site Generation Setup

- **Adapter:** `@sveltejs/adapter-static` with `fallback: 'index.html'` for SPA routing
- **Prerendering:** Enabled globally in `src/routes/+layout.ts` with `export const prerender = true`
- **SSR:** Disabled globally with `export const ssr = false`
- **Output:** Static files in `build/` directory ready for CDN deployment

### Authentication & State Management

**PocketBase Integration:**
- Singleton PocketBase client in `src/lib/stores/pocketbase.ts`
- URL automatically detected based on protocol in `src/lib/config.ts`:
  - HTTP (`http://`) → Uses `http://localhost:8090` (local development)
  - HTTPS (`https://`) → Uses current domain (assumes PocketBase runs on same domain)
- No `.env` file or runtime config needed

**Auth Store Pattern:**
- `src/lib/stores/auth.ts` exports a Svelte store wrapping PocketBase authentication
- Subscribes to `pb.authStore.onChange()` for reactive updates
- On init, validates existing token with `authRefresh()`
- All auth operations return promises and update store state

**Store Methods:**
- `login(email, password)` - Authenticates and updates store
- `register(data)` - Creates account and auto-logs in
- `logout()` - Clears auth and redirects to `/login`
- `requestPasswordReset(email)` - Sends reset email
- `uploadAvatar(file)` - Uploads to PocketBase users collection
- `updateProfile(data)` - Updates user fields

### Route Groups & Guards

**`(auth)` Route Group (Public):**
- `+layout.ts` sets `ssr = false` and redirects to `/` if already authenticated
- Contains: `/login`, `/register`, `/reset-password`
- Uses shadcn-svelte components: Button, Input, Label, Card, Alert

**`(dashboard)` Route Group (Protected):**
- `+layout.ts` checks `pb.authStore.isValid` and redirects to `/login` if not authenticated
- `+layout.svelte` provides dashboard shell with sidebar, navigation, and mobile menu
- Sidebar includes `<SidebarUser />` component at bottom
- Currently has placeholder pages: `/analytics`, `/documents`, `/settings`

### UI Component Architecture

**⚠️ IMPORTANT: Use shadcn-svelte for ALL UI components**

This project uses **shadcn-svelte exclusively** for all UI components. Do not use other UI libraries or create unstyled components from scratch.

**shadcn-svelte:**
- Built on top of **bits-ui** headless primitives (this is normal and expected)
- Initialized with Tailwind v4 (Vite-based, not PostCSS)
- Components in `src/lib/components/ui/`
- Uses `tw-animate-css` for animations (not `tailwindcss-animate`)
- Dark mode ready with custom variant: `@custom-variant dark (&:is(.dark *))`
- Add new components with: `npx shadcn-svelte@latest add [component-name]`

**Architecture Pattern:**
shadcn-svelte components wrap bits-ui headless primitives with Tailwind styling. This is the correct architecture - you will see `import { Component } from "bits-ui"` in shadcn-svelte component files.

**Custom Components:**
- `user-avatar.svelte` - Avatar with initials fallback and color generation
- `sidebar-user.svelte` - Dropdown menu with avatar upload and logout

### Tailwind v4 Configuration

**Important:** This project uses **Tailwind v4** with Vite plugin (not PostCSS):
- Plugin configured in `vite.config.ts`: `tailwindcss()` BEFORE `sveltekit()`
- CSS import: `@import "tailwindcss";` in `src/app.css`
- No `@tailwind` directives (v3 syntax)
- Minimal `tailwind.config.js` (most config in CSS using `@theme inline`)

### PocketBase Schema

**Users Collection (Auth Collection):**
- Standard PocketBase auth fields (email, username, verified)
- Custom field: `avatar` (File type, 1 max, 5MB, image/* only)
- Files served via `pb.files.getUrl(user, user.avatar)`

## ⚠️ CRITICAL: Svelte 5 Syntax ONLY

**This project uses Svelte 5 exclusively. DO NOT use Svelte 4 syntax. All code MUST use Svelte 5 patterns.**

### Event Handlers (MANDATORY)
- ❌ **NEVER** use `on:click={handler}` (Svelte 4 - WILL NOT WORK)
- ✅ **ALWAYS** use `onclick={handler}` (Svelte 5)
- ❌ **NEVER** use `on:keypress={handler}` (Svelte 4 - WILL NOT WORK)
- ✅ **ALWAYS** use `onkeypress={handler}` (Svelte 5)
- ❌ **NEVER** use `on:*={handler}` for any event (Svelte 4 - WILL NOT WORK)
- ✅ **ALWAYS** use `on*={handler}` (lowercase, no colon) (Svelte 5)

### Component Children (MANDATORY)
- ❌ **NEVER** use `<slot />` (deprecated in Svelte 5 - WILL NOT WORK)
- ✅ **ALWAYS** use `{@render children()}` in layouts and components
- ✅ For components that accept both text and snippets:
  ```svelte
  let { children } = $props();
  const isSnippet = children && typeof children === 'function';

  {#if isSnippet}
    {@render children()}
  {:else}
    {children}
  {/if}
  ```

### Props (MANDATORY)
- ❌ **NEVER** use `export let prop` (Svelte 4 - WILL NOT WORK)
- ✅ **ALWAYS** use `let { prop1, prop2 } = $props();` (Svelte 5)
- ✅ For two-way binding: `let { value = $bindable() } = $props();`
- ✅ With defaults: `let { prop = 'default' } = $props();`

### Reactive Declarations
- ❌ **NEVER** use `$: value = ...` (Svelte 4 - deprecated)
- ✅ **ALWAYS** use `$derived()` or `$effect()` (Svelte 5)

**If you write Svelte 4 syntax, the code will not work. Always double-check for Svelte 5 patterns.**

## Configuration Files

### PocketBase URL Configuration
The PocketBase URL is automatically determined based on the protocol:
- **Local Development (HTTP):** Automatically uses `http://localhost:8090`
- **Production (HTTPS):** Automatically uses current domain (e.g., if deployed at `https://myapp.com`, PocketBase is assumed to be at `https://myapp.com`)

This assumes PocketBase runs on the same domain as your web app. No environment variables or runtime config files needed.

## Deployment

**Target:** Cloudflare Pages or any static hosting

**Build Process:**
1. Run `npm run build`
2. Deploy `build/` directory to your hosting service
3. Deploy PocketBase to the same domain (or configure reverse proxy)
4. PocketBase URL is automatically detected from the current domain

**Important:** The app assumes PocketBase runs on the same domain as the web app. If using a different domain, update `src/lib/config.ts` to use a different URL for HTTPS connections.

**Build Output:**
- All routes prerendered as static HTML files
- `index.html` as SPA fallback (configured in adapter-static)
- Client-side router handles navigation after initial load

## Common Patterns

### Adding a Protected Dashboard Page
1. Create route in `src/routes/(dashboard)/[page-name]/+page.svelte`
2. Add navigation item to `src/routes/(dashboard)/+layout.svelte` in the `navItems` array
3. No need for individual auth checks - handled by group layout

### Adding a Shadcn Component
1. Run `npx shadcn-svelte@latest add [component-name]`
2. Import from `$lib/components/ui/[component-name]`
3. Use Svelte 5 event syntax (`onclick` not `on:click`)

### Working with PocketBase
```typescript
import { pb } from '$lib/stores/pocketbase';
import { auth } from '$lib/stores/auth';

// Direct PocketBase operations
await pb.collection('users').update(id, data);

// Using auth store
await auth.login(email, password);
$auth.user // Reactive user state
```

## Troubleshooting

**Buttons/Events Not Working:**
- Check you're using Svelte 5 syntax: `onclick` not `on:click`
- Verify event handlers are being spread with `{...restProps}` in components

**CSS Not Loading:**
- Ensure `src/app.css` is imported in root `+layout.svelte`
- Check Tailwind Vite plugin is loaded BEFORE sveltekit in `vite.config.ts`

**Auth Not Persisting:**
- PocketBase stores auth in LocalStorage automatically
- Check `pb.authStore.isValid` to verify token
- Call `pb.collection('users').authRefresh()` to validate/refresh token

**Build Errors:**
- Ensure all routes have `ssr = false` in route groups or root layout
- Check that `prerender = true` is set in root `+layout.ts`
- Verify no server-side code is being used in components
