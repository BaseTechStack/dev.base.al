---
title: Layouts
---

# BaseUX Layouts

BaseUX provides a flexible layout system that allows you to define different page layouts for different sections of your application. Layouts are located in the `app/layouts` directory and are automatically registered by Nuxt.

## Available Layouts

BaseUX includes two main layouts:

### Default Layout

The default layout is used for the main application and includes the sidebar, header, and content area:

```vue
<!-- app/layouts/default.vue -->
<template>
  <div class="h-screen flex overflow-hidden">
    <ClientOnly>
      <!-- Sidebar -->
      <AppTheSidebar class="h-screen flex-shrink-0" />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 h-screen overflow-hidden">
        <AppTheHeader class="w-full flex-shrink-0" />
        <main class="flex-1 p-4 overflow-y-auto">
          <slot />
        </main>
      </div>
    </ClientOnly>
  </div>
</template>
```

This layout provides:
- A responsive sidebar for navigation
- A header with user controls and actions
- A main content area for page content
- Dark/light mode support via CSS classes

### Auth Layout

The auth layout is used for authentication pages (login, register, password reset) and provides a simplified layout without the sidebar:

```vue
<!-- app/layouts/auth.vue -->
<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <div class="flex-1 flex flex-col items-center justify-center p-4">
      <!-- Logo -->
      <div class="mb-8">
        <NuxtLink to="/" class="flex items-center">
          <img src="/logo.svg" alt="Logo" class="h-12 w-auto" />
        </NuxtLink>
      </div>
      
      <!-- Content -->
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>
  </div>
</template>
```

This layout provides:
- A centered content area for auth forms
- Logo display
- Dark/light mode support
- Minimal distractions for authentication flow

## Using Layouts

You can specify which layout to use for a page in two ways:

### Option 1: definePageMeta

```vue
<!-- pages/auth/login.vue -->
<script setup>
definePageMeta({
  layout: 'auth'
})
</script>
```

### Option 2: NuxtLayout Component

```vue
<!-- pages/custom-page.vue -->
<template>
  <NuxtLayout name="custom">
    <template #default>
      <!-- Page content -->
    </template>
  </NuxtLayout>
</template>
```

## Creating Custom Layouts

You can create custom layouts by adding new `.vue` files to the `app/layouts` directory:

```vue
<!-- app/layouts/dashboard.vue -->
<template>
  <div class="dashboard-layout">
    <header class="dashboard-header">
      <!-- Custom header content -->
    </header>
    <div class="dashboard-content">
      <slot />
    </div>
    <footer class="dashboard-footer">
      <!-- Custom footer content -->
    </footer>
  </div>
</template>
```

## Layout Components

BaseUX layouts are composed of several key components:

### AppTheSidebar

The sidebar component provides navigation and is included in the default layout:

```vue
<AppTheSidebar class="h-screen flex-shrink-0" />
```

Key features:
- Dynamic navigation menu based on available entities
- Collapsible sections
- Active route highlighting
- User profile section

### AppTheHeader

The header component provides user controls and is included in the default layout:

```vue
<AppTheHeader class="w-full flex-shrink-0" />
```

Key features:
- Search functionality
- User profile dropdown
- Notifications
- Quick actions

## Responsive Behavior

BaseUX layouts are designed to be responsive:

- On mobile devices, the sidebar can be toggled on/off
- The header adapts to smaller screens with a mobile menu
- Content areas adjust to available space
- Touch-friendly interactions for mobile users

## Theme Support

All layouts support both light and dark themes through CSS classes:

```html
<div class="bg-gray-50 dark:bg-gray-900">
  <!-- Content -->
</div>
```

The theme is controlled by the ColorMode component and persisted in local storage.

## Best Practices

### 1. Layout Selection

- Use the default layout for authenticated, main application pages
- Use the auth layout for login, register, and password reset pages
- Create custom layouts only when significantly different structure is needed

### 2. Layout Consistency

- Keep navigation consistent across layouts
- Maintain the same theme and color scheme
- Provide clear visual cues for different sections

### 3. Performance

- Use ClientOnly for components that access the window object
- Avoid heavy computations in layout components
- Lazy-load components that aren't immediately visible

### 4. Accessibility

- Ensure layouts have proper heading structure
- Maintain sufficient color contrast for all themes
- Include skip-to-content links for keyboard navigation
