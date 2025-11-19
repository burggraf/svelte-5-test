# Svelte 5 + PocketBase Dashboard Application Design

**Date:** 2025-11-19
**Status:** Approved
**Target:** Static web app deployed on Cloudflare Pages

## Overview

A client-side only Svelte 5 application with PocketBase backend, featuring a complex dashboard UI with authentication, user profiles, and avatar management.

## Technology Stack

- **Framework:** SvelteKit with `adapter-static`
- **UI Library:** shadcn-svelte (dashboard-07 template)
- **Backend:** PocketBase 0.31.0
- **Styling:** TailwindCSS + tailwindcss-animate
- **Icons:** lucide-svelte
- **Build Tool:** Vite
- **Deployment:** Cloudflare Pages (static)

## Architecture

### State Management Approach
**Svelte stores with PocketBase SDK wrapper** - Custom Svelte stores wrap the PocketBase client for reactive auth state throughout the app. Approximately 200 lines of auth code.

### Key Design Decisions

1. **Build Setup:** SvelteKit with adapter-static for full static site generation
2. **PocketBase URL:** Runtime configuration via `static/config.js`
3. **Auth Storage:** LocalStorage (persists across sessions, PocketBase SDK default)
4. **Session Expiry:** Automatic redirect to login on invalid/expired sessions

## Project Structure

```
src/
  lib/
    components/
      ui/              # shadcn-svelte components
    stores/
      auth.ts          # PocketBase auth store wrapper
      pocketbase.ts    # PB client singleton
    config.ts          # Runtime config loader
  routes/
    (auth)/
      login/+page.svelte
      register/+page.svelte
      reset-password/+page.svelte
      +layout.ts       # Redirect to dashboard if authenticated
    (dashboard)/
      +layout.svelte   # Dashboard shell with sidebar
      +layout.ts       # Auth guard, redirect to login if not authenticated
      +page.svelte     # Home/dashboard content
static/
  config.js            # Runtime PocketBase URL configuration
```

## PocketBase Integration

### Client Setup
- Singleton instance in `src/lib/stores/pocketbase.ts`
- Initialize with runtime config from `window.__APP_CONFIG__` or `PUBLIC_POCKETBASE_URL`
- Enable auto-cancellation for request deduplication
- LocalStorage auth store (handled automatically by PocketBase SDK)

### Runtime Configuration
```javascript
// static/config.js
window.__APP_CONFIG__ = {
  pocketbaseUrl: 'https://your-pb-instance.com'
}
```

Loaded via `<script src="/config.js">` in `app.html`. Falls back to `import.meta.env.PUBLIC_POCKETBASE_URL` for development.

### Collections Schema

```
users (auth collection - built-in)
  - email: text, required
  - username: text, unique
  - avatar: file, single, maxSize: 5MB, types: image/*
  - name: text
  - verified: bool
```

### Authentication Store

**Location:** `src/lib/stores/auth.ts`

**Exported State:**
```typescript
{
  user: Record | null
  isLoading: boolean
  error: string | null
}
```

**Methods:**
- `login(email, password)` - Authenticate user
- `register({ email, password, passwordConfirm, username })` - Create account
- `logout()` - Clear auth and redirect
- `requestPasswordReset(email)` - Send reset email
- `updateProfile(data)` - Update user fields
- `uploadAvatar(file)` - Upload avatar image

**Implementation Details:**
- Subscribe to PocketBase `authStore.onChange()` for reactivity
- On init, validate existing auth (clear if expired)
- Auto-redirect to `/login` on 401/403 errors

### Avatar Upload Flow
1. User selects file via file picker
2. Create FormData and send to PocketBase
3. PocketBase stores file and returns updated record
4. Display via `pb.files.getUrl(user, user.avatar)`
5. Max 5MB, image/* only

## Authentication Flow

### Route Protection

**Public Routes: `(auth)/`**
- `export const ssr = false` in group `+layout.ts`
- Redirect to dashboard if already authenticated

**Protected Routes: `(dashboard)/`**
- Check auth in `+layout.ts`
- Redirect to `/login` if not authenticated
- Load user data for sidebar display

### Login Page
- Email/password form with shadcn Input, Button, Label
- Call `auth.login(email, password)`
- Navigate to `/` on success
- Display errors via shadcn Alert
- Links to register and reset-password

### Register Page
- Email, password, password confirmation, optional username
- Call `auth.register({ ... })`
- Auto-login after successful registration
- Email verification handled by PocketBase

### Password Reset
- Request page: enter email, call `auth.requestPasswordReset(email)`
- Show success message (doesn't reveal if email exists)
- PocketBase sends email with reset link
- Reset confirmation via PocketBase hosted page

### Session Management
- PocketBase SDK auto-includes auth token in requests
- On 401 response: clear auth, redirect to `/login`
- No automatic token refresh
- Token validity: 14 days (PocketBase default)

### Navigation Guards
- Implemented in route group `+layout.ts` files
- Use `goto()` with `replaceState: true` to avoid back-button issues

## Dashboard Layout

### Structure (dashboard-07 template)

**Left Sidebar:**
- App logo/branding at top
- Collapsible navigation sections (Home, Analytics, Settings, etc.)
- User component pinned at bottom (sticky)

**Main Content Area:**
- Top bar: breadcrumbs, search, notifications
- Scrollable content region

### Sidebar User Component

**Display:**
- Avatar: circular image (40px diameter)
- User name (from `user.name` or `user.username`)
- User email (truncated if long)

**Avatar Display Logic:**
- If `user.avatar` exists: display `pb.files.getUrl(user, user.avatar)`
- Fallback: initials from `user.name` or `user.email`
- Circular with colored background (hash email for consistent color)

**Dropdown Menu:**
- Profile/Settings
- Upload Avatar (opens file picker)
- Logout

Uses shadcn DropdownMenu component.

### Avatar Upload UX
1. Click "Upload Avatar" → file picker
2. Show loading state during upload
3. Optimistic update: preview selected file immediately
4. On success: refresh user data
5. Error: show toast notification

### Responsive Behavior
- Mobile (<768px): sidebar collapses to hamburger menu
- Tablet/Desktop: sidebar visible, can be collapsed via toggle
- Handled by shadcn dashboard template

## Error Handling

- **Global errors:** Root `+error.svelte` boundary
- **Network errors:** Toast notifications (shadcn Sonner/Toast)
- **Auth errors (401/403):** Auto-redirect to login, clear auth state
- **Form validation:** Inline errors below inputs using shadcn patterns
- **PocketBase errors:** Extract from `error.response.data`, display user-friendly messages

## Development Workflow

### 1. Initialize PocketBase Locally
```bash
pocketbase serve
```
- Creates `pb_data/` directory
- Access admin UI at `http://localhost:8090/_/`
- Create superuser account
- Configure email settings (optional, for testing password reset)
- Enable file storage for avatars

### 2. Development Server
```bash
npm run dev
```
- SvelteKit dev server on port 5173
- Config points to `http://localhost:8090`
- Hot reload for all changes

### 3. Environment Variables
```bash
# .env
PUBLIC_POCKETBASE_URL=http://localhost:8090
```

## Build & Deployment

### Build Process
```bash
npm run build
```
- Outputs to `build/` directory
- All routes prerendered as static HTML
- Auth routes use client-side hydration

### Cloudflare Pages Configuration
- **Build command:** `npm run build`
- **Build output directory:** `build`
- **Environment variables:** Not required (uses runtime config)

### Pre-Deployment
Edit `static/config.js` with production PocketBase URL:
```javascript
window.__APP_CONFIG__ = {
  pocketbaseUrl: 'https://your-production-pb.com'
}
```

### Production PocketBase Setup
- Host PocketBase separately (PocketHost, Fly.io, VPS, etc.)
- Configure CORS to allow Cloudflare Pages domain
- Set up email provider for password resets
- Enable SSL/TLS

## Dependencies

```json
{
  "dependencies": {
    "pocketbase": "^0.21.0",
    "bits-ui": "latest",
    "lucide-svelte": "latest"
  },
  "devDependencies": {
    "@sveltejs/adapter-static": "latest",
    "@sveltejs/kit": "latest",
    "svelte": "^5.0.0",
    "tailwindcss": "latest",
    "tailwindcss-animate": "latest",
    "typescript": "latest",
    "vite": "latest"
  }
}
```

Install shadcn-svelte via CLI:
```bash
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add dashboard-07
```

## Testing Considerations

### Manual Testing
- Create test accounts
- Upload avatars (test file size limits, file types)
- Test password reset flow (requires email configuration)
- Test session expiry (modify token manually)
- Test responsive layout on mobile/tablet/desktop

### Future E2E Testing
- Can add Playwright for automated testing later if needed

## Security Considerations

- Auth tokens stored in LocalStorage (XSS risk - ensure no user-generated HTML rendered)
- CORS properly configured on PocketBase
- File upload validation (size, type) enforced server-side by PocketBase
- Password reset tokens expire (handled by PocketBase)
- No sensitive data in client-side code

## Performance Considerations

- Static prerendering for fast initial loads
- PocketBase auto-cancellation prevents duplicate requests
- Avatar images served directly by PocketBase (consider CDN for production)
- Lazy load dashboard components if needed

## Future Enhancements

- Email verification flow
- Profile settings page
- Multi-factor authentication
- Remember me functionality
- Refresh token implementation
- PWA capabilities
- Dark mode toggle
