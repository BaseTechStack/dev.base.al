---
title: Core Features
---

# BaseUX Core Features

BaseUX provides a robust set of core features that serve as the foundation for your application. These core features are located in the `app` directory and include reusable components, services, stores, and utilities that power the entire application.

## Directory Structure

```
app/
├── components/    # Core UI components
│   ├── app/       # Application-specific components
│   └── base/      # Base UI components for reuse
├── composables/   # Reusable composition functions
├── layouts/       # Page layouts
├── middleware/    # Route middleware
├── pages/         # Application routes
├── plugins/       # Nuxt plugins
├── services/      # API services
├── stores/        # Pinia stores
└── types/         # TypeScript type definitions
```

## Core Components

BaseUX provides a set of base components that form the building blocks of your application's UI:

### Base Components

Located in `app/components/base/`, these components provide the foundation for entity-specific components:

- **BaseCrudActions**: Standardized action buttons (view, edit, delete) for entity operations
- **BasePagination**: Pagination component for navigating through data sets
- **BasePerPage**: Component for selecting items per page
- **BaseColorMode**: Toggle between light and dark mode

```vue
<!-- Example usage of BaseCrudActions -->
<BaseCrudActions 
  structure="posts"
  :item="post" 
  actions="view,edit,delete"
  @view="handleView"
  @edit="handleEdit"
  @delete="handleDelete"
/>
```

### App Components

Located in `app/components/app/`, these components provide the application shell:

- **AppTheHeader**: Application header with navigation and user actions
- **AppTheSidebar**: Main navigation sidebar with dynamic menu items
- **AppTheFooter**: Application footer
- **AppUserProfile**: User profile component with authentication actions

## Core Layouts

BaseUX includes two main layouts in `app/layouts/`:

- **default.vue**: Main application layout with sidebar, header, and content area
- **auth.vue**: Simplified layout for authentication pages

```vue
<!-- Default layout structure -->
<div class="h-screen flex overflow-hidden">
  <AppTheSidebar class="h-screen flex-shrink-0" />
  <div class="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 h-screen overflow-hidden">
    <AppTheHeader class="w-full flex-shrink-0" />
    <main class="flex-1 p-4 overflow-y-auto">
      <slot />
    </main>
  </div>
</div>
```

## Authentication System

BaseUX includes a complete authentication system:

- **Auth Middleware**: Route protection based on authentication state
- **Auth Store**: State management for user authentication
- **Auth Pages**: Login, register, and password reset pages

```typescript
// Example of auth middleware
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const { isAuthenticated } = storeToRefs(authStore)
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register']
  const isPublicRoute = publicRoutes.includes(to.path)

  // If not authenticated and trying to access protected route
  if (!isAuthenticated.value && !isPublicRoute) {
    return navigateTo('/auth/login')
  }

  // If authenticated and trying to access auth pages
  if (isAuthenticated.value && isPublicRoute) {
    const redirect = to.query.redirect as string
    if (redirect) {
      return navigateTo(redirect)
    }
    return navigateTo('/app/dashboard')
  }
})
```

## Base Store Pattern

The core of BaseUX's data management is the base store pattern located in `app/stores/baseStore.ts`:

```typescript
// Define base interfaces
export interface BaseItem {
  id: number
}

export interface BasePagination {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface BaseState<T> {
  items: T[]
  loading: boolean
  error: string | null
  viewMode: 'grid' | 'table'
  pagination: BasePagination
}

// Create a factory function for base stores
export function defineBaseStore<T extends BaseItem>(
  name: string, 
  viewModeKey: string,
  service: BaseService<T>
) {
  return defineStore(name, {
    state: (): BaseState<T> => ({
      items: [],
      loading: false,
      error: null,
      viewMode: (typeof window !== 'undefined' ? 
        localStorage.getItem(viewModeKey) as 'grid' | 'table' : null) || 'grid',
      pagination: {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0
      }
    }),
    
    getters: {
      getItemById: (state) => (id: number) => {
        return state.items.find(item => item.id === id)
      }
    },
    
    actions: {
      // UI state management actions
      setLoading(isLoading: boolean) { /* ... */ },
      setItems(items: T[]) { /* ... */ },
      setViewMode(mode: 'grid' | 'table') { /* ... */ },
      setPagination(pagination: Partial<BasePagination>) { /* ... */ },
      
      // CRUD operations
      async fetch(page?: number, pageSize?: number) { /* ... */ },
      async create(data: Omit<T, 'id'>) { /* ... */ },
      async update(id: number, data: Partial<Omit<T, 'id'>>) { /* ... */ },
      async delete(id: number) { /* ... */ }
    }
  })
}
```

## Service Layer

The service layer in `app/services/baseService.ts` provides a standardized interface for API communication:

```typescript
export interface BaseService<T extends BaseItem> {
  fetch(page?: number, pageSize?: number): Promise<{ 
    items: T[], 
    pagination: BasePagination 
  }>
  
  fetchById(id: number): Promise<{ 
    item: T 
  }>
  
  create(data: Omit<T, 'id'>): Promise<{ 
    item: T 
  }>
  
  update(id: number, data: Partial<Omit<T, 'id'>>): Promise<{ 
    item: T 
  }>
  
  delete(id: number): Promise<void>
}
```

## Type System

BaseUX includes a comprehensive type system in `app/types/`:

- **base.ts**: Core type definitions for the application
- **api.ts**: Types for API responses and requests

## Key Benefits of Core Features

1. **Consistent UI**: Standardized components ensure a consistent user experience
2. **Type Safety**: Comprehensive TypeScript types prevent runtime errors
3. **Reusability**: Core components and services can be used across entities
4. **State Management**: Standardized store pattern for all data operations
5. **Authentication**: Ready-to-use authentication system
6. **Theming**: Built-in support for light and dark mode
7. **Responsive Design**: All components are responsive by default
