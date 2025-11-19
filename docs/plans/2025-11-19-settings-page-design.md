# Settings Page Design

**Date:** 2025-11-19
**Feature:** User settings page with profile viewing and editing

## Overview

Update the settings route (`/settings`) to allow users to:
- View their email address, avatar, and name
- Update or remove their avatar
- Change their name

## Architecture

### Component Structure

The settings page uses **three separate cards** for clear organization:

1. **Profile Information Card (Read-only)**
   - Displays email address (non-editable - from PocketBase auth)
   - Shows current name
   - Shows avatar using existing `UserAvatar` component

2. **Avatar Management Card**
   - Shows current avatar (larger preview)
   - File upload input (hidden, triggered by button)
   - "Upload New Avatar" button
   - "Remove Avatar" button (conditionally shown if avatar exists)
   - Shows loading state during upload/removal

3. **Profile Editing Card**
   - Input field for name
   - "Save Changes" button
   - Shows loading state during save
   - Success/error feedback

### Data Flow

- Component subscribes to `$auth` store for reactive user data
- All updates use existing auth store methods: `auth.uploadAvatar()`, `auth.updateProfile()`
- Avatar removal requires new `auth.removeAvatar()` method that updates with `{avatar: null}`
- Form submissions are async with proper error handling
- Success shows temporary feedback message (3 seconds)

## UI Components

### Required shadcn-svelte Components
- Card (already used)
- Button
- Input (for name field)
- Label (for form fields)
- Alert (for success/error messages)

### Avatar Management Interaction
1. User clicks "Upload New Avatar" → triggers hidden file input
2. File input accepts only `image/*` files, 5MB max (matches PocketBase schema)
3. On file select → immediately calls `auth.uploadAvatar(file)`
4. Shows loading spinner on avatar preview during upload
5. On success → avatar updates reactively via `$auth.user`
6. On error → shows Alert with error message

**For removal:**
1. User clicks "Remove Avatar" button
2. Calls new `auth.removeAvatar()` method
3. Shows loading state
4. On success → avatar disappears, shows initials fallback

### Name Editing Interaction
1. Input field pre-filled with current `$auth.user.name`
2. User modifies name, clicks "Save Changes"
3. Button shows loading state during save
4. Calls `auth.updateProfile({ name: newName })`
5. On success → shows green success Alert for 3 seconds
6. On error → shows red error Alert with message

## State Management

### Component State
```typescript
let nameInput = $state($auth.user?.name || '');
let isUploading = $state(false);
let isRemoving = $state(false);
let isSaving = $state(false);
let successMessage = $state('');
let errorMessage = $state('');
```

### Error Handling Strategy
- Each operation (upload, remove, save) has try-catch blocks
- Errors display in Alert components at top of relevant cards
- Success messages auto-dismiss after 3 seconds
- Loading states disable buttons to prevent double-submission
- File validation before upload (size, type)

### Edge Cases
1. **No user data:** Show loading skeleton or redirect (shouldn't happen in protected route)
2. **Upload fails:** Show specific error from PocketBase response
3. **No name provided:** Allow empty name (PocketBase schema permits it)
4. **Network timeout:** PocketBase SDK handles timeouts, we catch and display
5. **No avatar to remove:** Button is conditionally hidden when `!user.avatar`

## Implementation Requirements

### Auth Store Addition
Add `removeAvatar()` method to `src/lib/stores/auth.ts`:

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

Export in return object: `removeAvatar`

### Svelte 5 Compliance
- Use `onclick={handler}` (not `on:click`)
- Use `oninput={handler}` (not `on:input`)
- Use `onchange={handler}` for file input
- Use `$state()` for local reactive state
- Use `$derived()` for computed values if needed

## Testing Considerations

### Manual Testing Checklist
- [ ] Profile info displays correctly (email, name, avatar)
- [ ] Avatar upload with valid image works
- [ ] Avatar upload with invalid file shows error
- [ ] Avatar upload with oversized file shows error
- [ ] Avatar removal works and shows initials fallback
- [ ] Name update saves successfully
- [ ] Empty name is allowed
- [ ] Success messages appear and auto-dismiss
- [ ] Error messages display correctly
- [ ] Loading states prevent double-submission
- [ ] All buttons use Svelte 5 `onclick` syntax
