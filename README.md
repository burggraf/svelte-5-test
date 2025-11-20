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

```bash
pnpm install
```

### 2. Start PocketBase

```bash
pocketbase serve
```

First time setup:
1. Navigate to http://localhost:8090/_/
2. Create superuser account
3. Configure users collection for avatars (already done if following setup)

### 3. Start Development Server

```bash
pnpm run dev
```

Navigate to http://localhost:5173

## Project Structure

```
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
```

## Configuration

### Development

Create `.env`:

```bash
PUBLIC_POCKETBASE_URL=http://localhost:8090
```

### Production

Edit `static/config.js`:

```javascript
window.__APP_CONFIG__ = {
  pocketbaseUrl: 'https://your-production-pb.com'
};
```

## Building for Production

```bash
pnpm run build
```

Output: `build/` directory (static files)

## Deployment (Cloudflare Pages)

1. Build command: `pnpm run build`
2. Build output directory: `build`
3. Update `static/config.js` with production PocketBase URL before building

## PocketBase Setup

### Users Collection Configuration

The users collection (auth collection) needs avatar field configured:
- Type: File
- Max Select: 1
- Max Size: 5MB
- Mime Types: image/jpeg, image/png, image/gif, image/webp

### CORS Configuration

For production, configure PocketBase CORS to allow your domain:

```
Settings → Application → CORS
```

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

```bash
npx shadcn-svelte@latest add [component-name]
```

### Project Scripts

- `pnpm run dev` - Start dev server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run check` - Run svelte-check

## License

MIT
