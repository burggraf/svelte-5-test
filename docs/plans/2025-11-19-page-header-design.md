# Page Header Bar Design

**Date:** 2025-11-19
**Status:** Approved
**Context:** Dashboard pages need a consistent header bar with centered titles and optional action buttons

## Overview

This design introduces a reusable PageHeader component that provides a sticky header bar for all dashboard pages. The header features a centered page title with optional left and right action button areas, enabling consistent navigation patterns (like back buttons) while maintaining visual hierarchy.

## Requirements

1. **Centered title** - Page title should remain centered in the header bar
2. **Action button areas** - Support for icon buttons on left and/or right sides
3. **Sticky positioning** - Header stays visible when scrolling page content
4. **Flexible per page** - Each page controls its own title and buttons
5. **Svelte 5 patterns** - Use modern Svelte 5 syntax (snippets, not slots)

## Architecture

### Self-Contained Page Headers

**Selected Approach:** Each page imports and renders its own PageHeader component, passing title and optional action snippets as props.

**Rationale:**
- Explicit and easy to understand
- Type-safe props with Svelte 5
- No hidden state management layer
- Clear data flow from page to header

**Rejected Alternatives:**
1. **Layout Header with Page Store** - Adds unnecessary indirection with store management
2. **Layout Header with Route Data** - Can't pass Svelte snippets through serializable page data

## Component Design

### PageHeader Component

**Location:** `src/lib/components/ui/page-header.svelte`

**Props:**
- `title: string` - Page title (required)
- `leftActions?: Snippet` - Optional snippet for left-side buttons
- `rightActions?: Snippet` - Optional snippet for right-side buttons

**Structure:**
```svelte
<script>
  let { title, leftActions, rightActions } = $props();

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

    <h1 class="text-xl font-semibold absolute left-1/2 -translate-x-1/2">
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

**Key Implementation Details:**
- **Svelte 5 props:** Uses `$props()` destructuring
- **Snippet detection:** Checks if actions are functions before rendering
- **Absolute centering:** Title uses `absolute left-1/2 -translate-x-1/2` for perfect center alignment
- **Dynamic button areas:** Left/right containers only render content when snippets provided
- **Sticky behavior:** `sticky top-0` keeps header visible during scroll
- **Z-index:** `z-50` ensures header stays above page content

## Usage Pattern

### Basic Header (Title Only)

```svelte
<script>
  import PageHeader from '$lib/components/ui/page-header.svelte';
</script>

<PageHeader title="Analytics" />

<div class="p-6">
  <!-- Page content -->
</div>
```

### Header with Actions

```svelte
<script>
  import PageHeader from '$lib/components/ui/page-header.svelte';
  import { Button } from '$lib/components/ui/button';
  import { ArrowLeft, Settings, Download } from 'lucide-svelte';
  import { goto } from '$app/navigation';
</script>

<PageHeader title="Analytics">
  {#snippet leftActions()}
    <Button variant="ghost" size="icon" onclick={() => goto('/dashboard')}>
      <ArrowLeft class="h-5 w-5" />
    </Button>
  {/snippet}

  {#snippet rightActions()}
    <Button variant="ghost" size="icon" onclick={handleSettings}>
      <Settings class="h-5 w-5" />
    </Button>
    <Button variant="ghost" size="icon" onclick={handleDownload}>
      <Download class="h-5 w-5" />
    </Button>
  {/snippet}
</PageHeader>

<div class="p-6">
  <!-- Page content -->
</div>
```

**Pattern Notes:**
- Snippets are optional - omit for title-only headers
- Use shadcn-svelte Button component with `variant="ghost" size="icon"`
- Use lucide-svelte for icons (already in project)
- Each page controls button behavior via event handlers

## Styling & Theming

### Visual Design
- **Height:** Fixed at `h-16` (64px) for consistency
- **Background:** `bg-background` for theme compatibility
- **Border:** `border-b` for subtle separation from content
- **Title:** `text-xl font-semibold` for prominence
- **Spacing:** `gap-2` between multiple buttons, `px-4` horizontal padding

### Responsive Considerations
- Title size: Consider `text-lg md:text-xl` for smaller mobile screens
- Padding: Consider `px-2 md:px-4` for tighter mobile spacing
- Buttons already use compact `size="icon"` variant

### Theme Integration
- Uses shadcn-svelte theme variables (`bg-background`)
- Supports dark mode automatically via Tailwind custom variant
- Maintains visual consistency with existing dashboard components

## Integration with Dashboard Layout

### Layout Structure
```
(dashboard)/+layout.svelte
├─ Sidebar (left, fixed width)
└─ Main content area (flex-1)
   └─ Individual pages (+page.svelte)
      ├─ <PageHeader /> (sticky at top of content area)
      └─ <div class="p-6">Page content</div>
```

### Key Points
- **PageHeader lives in pages, not layout** - Each page component renders its own header
- **Sidebar unchanged** - Dashboard layout sidebar remains as-is
- **Content padding** - Pages use `<div class="p-6">` below PageHeader for consistent spacing
- **Sticky context** - Header sticks to top of main content area, not viewport (sidebar always visible)

## Migration Strategy

### New Pages
1. Import PageHeader component
2. Add PageHeader with title at top of page
3. Add action snippets if needed
4. Wrap remaining content in `<div class="p-6">`

### Existing Pages
1. Add PageHeader import to existing pages
2. Insert PageHeader above existing content
3. Ensure existing content is wrapped in `<div class="p-6">` container
4. Test scroll behavior and mobile responsiveness

## Examples

### Dashboard Home
```svelte
<PageHeader title="Dashboard" />
```

### Settings Page with Back Button
```svelte
<PageHeader title="Settings">
  {#snippet leftActions()}
    <Button variant="ghost" size="icon" onclick={() => goto('/')}>
      <ArrowLeft class="h-5 w-5" />
    </Button>
  {/snippet}
</PageHeader>
```

### Document Viewer with Multiple Actions
```svelte
<PageHeader title="Document Details">
  {#snippet leftActions()}
    <Button variant="ghost" size="icon" onclick={goBack}>
      <ArrowLeft class="h-5 w-5" />
    </Button>
  {/snippet}

  {#snippet rightActions()}
    <Button variant="ghost" size="icon" onclick={handleShare}>
      <Share class="h-5 w-5" />
    </Button>
    <Button variant="ghost" size="icon" onclick={handleDownload}>
      <Download class="h-5 w-5" />
    </Button>
    <Button variant="ghost" size="icon" onclick={handleDelete}>
      <Trash class="h-5 w-5" />
    </Button>
  {/snippet}
</PageHeader>
```

## Technical Constraints

### Svelte 5 Requirements
- **Must use `$props()`** for component props (not `export let`)
- **Must use `{@render snippet()}`** for rendering snippets (not `<slot>`)
- **Must use `onclick={handler}`** for events (not `on:click={handler}`)

### Static Site Generation
- Component is fully client-side compatible
- No SSR concerns (project uses adapter-static with SSR disabled)
- Works with prerendering enabled

## Open Questions

None - design approved and ready for implementation.
