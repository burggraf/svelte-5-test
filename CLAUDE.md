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
- Runtime configuration via `static/config.js` (loaded in `app.html`)
- Development: Uses `PUBLIC_POCKETBASE_URL` from `.env`
- Production: Uses `window.__APP_CONFIG__.pocketbaseUrl` from `static/config.js`

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

**shadcn-svelte:**
- Initialized with Tailwind v4 (Vite-based, not PostCSS)
- Components in `src/lib/components/ui/`
- Uses `tw-animate-css` for animations (not `tailwindcss-animate`)
- Dark mode ready with custom variant: `@custom-variant dark (&:is(.dark *))`

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

## Svelte 5 Syntax

**This project uses Svelte 5, not Svelte 4. Key differences:**

### Event Handlers
- ❌ `on:click={handler}` (Svelte 4)
- ✅ `onclick={handler}` (Svelte 5)
- ❌ `on:keypress={handler}` (Svelte 4)
- ✅ `onkeypress={handler}` (Svelte 5)

### Component Children
- ❌ `<slot />` (deprecated in Svelte 5 for components)
- ✅ `{@render children()}` for snippet children OR `{children}` for text children
- ✅ `<slot />` still works in layouts but prefer Svelte 5 patterns

### Props
- Use `$props()` rune: `let { prop1, prop2 } = $props();`
- Use `$bindable()` for two-way binding: `let { value = $bindable() } = $props();`

## Configuration Files

### Environment Variables
```bash
# .env (development only)
PUBLIC_POCKETBASE_URL=http://localhost:8090
```

### Runtime Config
```javascript
// static/config.js (for production)
window.__APP_CONFIG__ = {
  pocketbaseUrl: 'https://your-production-pb.com'
};
```

This file is loaded in `app.html` before SvelteKit initializes, allowing runtime configuration without rebuilding.

## Deployment

**Target:** Cloudflare Pages or any static hosting

**Build Process:**
1. Update `static/config.js` with production PocketBase URL
2. Run `npm run build`
3. Deploy `build/` directory
4. Deploy PocketBase separately (PocketHost, Fly.io, VPS, etc.)
5. Configure CORS in PocketBase to allow your domain

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
