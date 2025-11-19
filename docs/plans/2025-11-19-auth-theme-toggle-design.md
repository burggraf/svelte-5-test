# Auth Pages Theme Toggle Design

**Date:** 2025-11-19
**Status:** Approved
**Author:** Claude Code

## Overview

Add light/dark/system theme toggle to authentication pages (login, register, reset-password) by enhancing the existing theme system with an icon-only variant suitable for auth page layouts.

## Requirements

- **Position:** Top-right corner of auth pages
- **Persistence:** Save to localStorage (already implemented)
- **Scope:** Global theme across auth and dashboard (already working)
- **Style:** Icon-only cycling button (light → dark → system)
- **Pages:** All auth pages (login, register, reset-password)

## Existing System

The application already has a complete theme management system:

### Theme Store (`src/lib/stores/theme.ts`)
- **Type:** `ThemeMode = 'light' | 'dark' | 'system'`
- **State:** `{ mode: ThemeMode, isDark: boolean }`
- **Storage:** localStorage key `theme-preference`
- **Features:**
  - System preference detection via `matchMedia('(prefers-color-scheme: dark)')`
  - Automatic DOM updates (adds/removes `dark` class on `documentElement`)
  - Media query listener for system theme changes
  - Methods: `setMode(mode)`, `toggleMode()` (cycles through modes)

### Current Theme Toggle Component (`src/lib/components/theme-toggle.svelte`)
- **Current Usage:** Dashboard sidebar (full-width button)
- **Display:** Icon + text label ("Light mode", "Dark mode", "System mode")
- **Icons:** Sun (light), Moon (dark), Monitor (system) from lucide-svelte
- **Behavior:** Cycles through modes on click via `theme.toggleMode()`
- **Styling:** Ghost variant with full width, styled for sidebar context

## Design Solution

### Component Enhancement

Modify `src/lib/components/theme-toggle.svelte` to support two variants:

**Props:**
```typescript
let {
  variant = 'sidebar' as 'sidebar' | 'icon',
  class: className = ''
} = $props();
```

**Variant Behaviors:**

1. **'sidebar'** (default):
   - Current behavior unchanged
   - Full-width button with icon + text label
   - Styled: `w-full justify-start gap-2`
   - Used in: Dashboard sidebar

2. **'icon'**:
   - Icon-only button
   - No text label (ARIA label only)
   - Button `size="icon"` for square dimensions
   - Accepts positioning via className prop
   - Used in: Auth pages

**Shared Logic:**
- Both variants use same theme store subscription
- Both use same `handleToggle()` → `theme.toggleMode()`
- Both show appropriate icon for current mode
- Both use Svelte 5 syntax (`onclick`, `$effect`)

### Auth Pages Integration

**Pattern for all auth pages:**
```svelte
<script lang="ts">
  import ThemeToggle from '$lib/components/theme-toggle.svelte';
  // ... existing imports
</script>

<div class="relative flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
  <ThemeToggle variant="icon" class="absolute top-4 right-4" />
  <Card.Root class="w-full max-w-md">
    <!-- existing card content -->
  </Card.Root>
</div>
```

**Files to Update:**
1. `src/routes/(auth)/login/+page.svelte`
2. `src/routes/(auth)/register/+page.svelte`
3. `src/routes/(auth)/reset-password/+page.svelte`

**Layout Changes:**
- Wrap existing content in `relative` container
- Add `ThemeToggle` with `absolute top-4 right-4` positioning
- Maintain existing responsive padding and centering

## Implementation Details

### Component Code Structure

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
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'system': return Monitor;
    }
  }

  function getLabel() {
    switch (themeState.mode) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
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

### Accessibility

- ARIA label describes current mode and action
- Keyboard accessible (Button component handles focus/activation)
- Visual icon changes clearly communicate state
- High contrast in both light and dark modes

### Responsive Behavior

- Icon button maintains consistent size across breakpoints
- Absolute positioning keeps it in top-right regardless of card size
- Touch-friendly size (44x44px minimum via shadcn size="icon")

## User Flow

1. User lands on auth page (login/register/reset-password)
2. Theme toggle visible in top-right corner
3. Click cycles: light → dark → system → light
4. Theme applies immediately to entire page
5. Preference saved to localStorage
6. After login, theme persists to dashboard
7. Dashboard sidebar toggle and auth toggle stay in sync (shared store)

## Benefits of This Design

1. **Minimal Code Changes:** Only one component modified, three pages updated
2. **DRY Principle:** Reuses existing theme store and logic
3. **Consistency:** Same theme system across auth and dashboard
4. **Flexibility:** Variant pattern allows future UI variations
5. **Accessibility:** Proper ARIA labels and keyboard navigation
6. **Performance:** No additional stores or watchers needed

## Testing Considerations

1. **Visual:** Verify button appears in top-right corner of all auth pages
2. **Functionality:** Test cycling through all three modes
3. **Persistence:** Verify theme survives page refresh and logout
4. **System Sync:** Test system theme changes while mode is "system"
5. **Cross-Page:** Verify theme stays consistent when navigating between auth pages
6. **Dashboard Integration:** Verify theme persists after login
7. **Mobile:** Test on small screens for positioning and touch targets

## Future Enhancements

- Add theme toggle to dashboard header/settings
- Add tooltip showing current mode on hover
- Animate icon transitions
- Add keyboard shortcut for power users
