---
title: Components
---

# BaseUX Components

BaseUX provides a comprehensive set of core components that serve as the building blocks for your application. These components are located in the `app/components` directory and are organized into logical categories.

## Base Components

Located in `app/components/base/`, these components provide the foundation for entity-specific components:

### BaseCrudActions

A reusable component for rendering consistent CRUD action buttons across your application:

```vue
<BaseCrudActions 
  structure="posts"
  :item="post" 
  actions="view,edit,delete"
  @view="$emit('view', $event)"
  @edit="$emit('edit', $event)"
  @delete="$emit('delete', $event)"
/>
```

**Props:**
- `structure`: The name of the entity structure
- `item`: The entity object
- `actions`: Comma-separated list of allowed actions

### BasePagination

A consistent pagination component for navigating through data sets:

```vue
<BasePagination
  v-model:page="currentPage"
  :total-pages="totalPages"
  @update:page="fetchData($event)"
/>
```

**Props:**
- `page`: Current page number (v-model supported)
- `totalPages`: Total number of pages
- `size`: Size of the pagination component (sm, md, lg)

### BasePerPage

Component for selecting the number of items to display per page:

```vue
<BasePerPage
  :page-size="pageSize"
  @update:page-size="updatePageSize($event)"
/>
```

**Props:**
- `pageSize`: Current page size
- `options`: Array of available page size options (defaults to [10, 25, 50, 100])

### BaseColorMode

Toggle between light and dark mode:

```vue
<BaseColorMode />
```

## App Components

Located in `app/components/app/`, these components provide the application shell:

### AppTheHeader

Application header with navigation and user actions:

```vue
<AppTheHeader class="w-full flex-shrink-0" />
```

The header includes:
- Application title and logo
- Navigation menu
- User profile dropdown
- Notification center
- Search bar

### AppTheSidebar

Main navigation sidebar with dynamic menu items:

```vue
<AppTheSidebar class="h-screen flex-shrink-0" />
```

The sidebar is dynamically generated based on your application's modules and includes:
- Application logo and title
- Primary navigation
- Secondary actions
- User profile summary

### AppTheFooter

Application footer with copyright and links:

```vue
<AppTheFooter />
```

### AppUserProfile

User profile component with authentication actions:

```vue
<AppUserProfile />
```

## Component Organization

BaseUX follows a consistent pattern for component organization:

1. **Base Components**: Reusable, generic components
2. **App Components**: Application shell components
3. **Entity Components**: Entity-specific components (in structures directory)

## Component Props and Events

All BaseUX components follow a consistent pattern for props and events:

- Props use kebab-case in templates and camelCase in scripts
- Events use kebab-case and follow the pattern `update:propName` for v-model compatibility
- All components support standard HTML attributes like class, style, etc.

## Best Practices

When working with BaseUX components:

1. **Use Base Components**: Prefer using base components over custom implementations
2. **Consistent Events**: Follow the `update:propName` pattern for two-way binding
3. **Prop Validation**: Always include prop validation in your components
4. **Composition API**: Use the Composition API with `<script setup>` for component logic
5. **TypeScript**: Leverage TypeScript for type safety in component props and events
