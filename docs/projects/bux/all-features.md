---
title: Comprehensive BaseUX Features Guide
---

# BaseUX: Complete Features Guide

BaseUX is a powerful Nuxt-based framework designed to accelerate your web application development with a comprehensive set of features, tools, and patterns. This document serves as a complete reference for all BaseUX capabilities.

## Core Architecture

BaseUX is built on a layered architecture that separates concerns and promotes maintainability:

### Application Structure

```
/
├── app/             # Core framework components
├── structures/      # Entity modules
├── public/          # Static assets
└── nuxt.config.ts   # Nuxt configuration
```

### Layered Design

BaseUX uses Nuxt's layers feature to organize code:

- **Core Layer**: Foundational components, services, and utilities in `app/`
- **Entity Layers**: Self-contained modules in `structures/`
- **App Layer**: Your application-specific code

This layered approach enables clean separation of concerns and makes maintenance easier as your application grows.

## Entity Generation System

The entity generation system is the cornerstone of BaseUX, allowing you to scaffold complete CRUD modules with a single command.

### Command Structure

```bash
bux g EntityName field1:type field2:type ...
```

### Generated Files

For each entity, BaseUX generates:

- **Model**: Type definitions and data transformation utilities
- **Store**: State management with Pinia
- **Service**: API communication layer
- **Components**: Ready-to-use UI components
- **Pages**: Routed pages for listing, viewing, and editing

### Field Types

The generator supports various field types:

- `string`: Text input fields
- `text`: Multi-line text areas
- `number`: Numeric inputs
- `boolean`: Checkbox inputs
- `date`: Date pickers
- `select`: Dropdown selects
- `relation`: Entity relationships

### Complete Example

```bash
bux g Product name:string price:number description:text featured:boolean release_date:date category:select
```

This generates a complete CRUD module for the Product entity with appropriate form inputs for each field type.

## Module System

BaseUX's module system organizes your application into standalone entity modules, each with a consistent structure:

### Module Structure

```
structures/
└── [entity-name]/
    ├── components/    # Entity-specific UI components
    ├── composables/   # Entity-specific composables
    ├── pages/         # Entity-specific pages/routes
    ├── services/      # Entity-specific API services
    ├── stores/        # Entity-specific state management
    └── nuxt.config.ts # Entity layer configuration
```

### Data Flow

1. **Composables**: Entry point for data flow, providing access to API and state
2. **Services**: Handle API communication, transforming JSON to entity models
3. **Stores**: Manage entity state with Pinia, providing CRUD operations
4. **Components**: Display entity data and handle user interactions

### Auto Loading

All entity modules are automatically loaded via Nuxt's auto-import feature, allowing you to import any entity directly.

## Store Pattern

BaseUX implements a sophisticated store pattern using Pinia:

### Base Store

The base store provides common functionality for all entities:

- State management for items collection
- Loading and error states
- Pagination support
- View mode switching (grid/table)
- Generic CRUD operations

### Entity Store

Each entity store extends the base functionality with specialized methods:

```typescript
export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    items: [] as Category[],
    loading: false,
    error: null as string | null,
    viewMode: 'grid',
    pagination: {
      total: 0,
      page: 1,
      pageSize: 12,
      totalPages: 0
    }
  }),
  
  getters: {
    getItemById: (state) => (id: number) => {
      return state.items.find(item => item.id === id)
    }
  },
  
  actions: {
    // Generic CRUD operations
    async fetch(page?: number, pageSize?: number) { /* ... */ },
    async create(data: Omit<Category, 'id'>) { /* ... */ },
    async update(id: number, data: Partial<Omit<Category, 'id'>>) { /* ... */ },
    async delete(id: number) { /* ... */ },
    
    // Entity-specific methods
    async fetchCategories(page?: number, pageSize?: number) { /* ... */ },
    async createCategory(data: Omit<Category, 'id'>) { /* ... */ }
  }
})
```

### Store Composition

The updated store pattern uses Pinia's defineStore with composition, integrating specialized entity methods directly into the store object. This ensures components can use either generic methods or entity-specific methods consistently.

## UI Component Library

BaseUX includes a comprehensive set of UI components built on top of Nuxt UI:

### Core Components

- **BaseCrudActions**: Standardized action buttons for entity operations
- **BasePagination**: Navigation through data sets
- **BasePerPage**: Items per page selection
- **BaseColorMode**: Light/dark mode toggle

### Entity Components

Each entity has its own set of components:

- **Grid**: Card-based layout for visual representation
- **Table**: Tabular layout with sortable columns
- **Form**: Dynamic form generation based on entity fields
- **View**: Detailed view of an entity instance
- **Modals**: Create, edit, and delete modals

### Flexible Prop Naming

Components support flexible prop naming to enhance reusability across entities, preventing "Missing required prop" warnings while maintaining the expected interface.

## Service Layer

The service layer serves as an adapter between components and API endpoints:

### Base Service Interface

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

### Entity Service Implementation

Each entity service implements this interface:

```typescript
export const useCategoryService = (): BaseService<Category> => {
  const categoriesApi = useCategories()
  
  return {
    async fetch(page = 1, pageSize = 10) {
      const result = await categoriesApi.fetchCategories(page, pageSize)
      return {
        items: CategoryModel.fromJsonList(result.categories),
        pagination: result.pagination
      }
    },
    
    // Other methods implemented similarly
  }
}
```

## Authentication System

BaseUX includes a complete authentication system:

### Features

- User registration and login
- Password reset
- JWT token management
- Route protection with middleware
- Persistent authentication state

### Auth Store

```typescript
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },
  
  actions: {
    async login(email: string, password: string) { /* ... */ },
    async register(userData: RegisterData) { /* ... */ },
    async logout() { /* ... */ },
    async fetchCurrentUser() { /* ... */ }
  }
})
```

### Auth Middleware

```typescript
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const { isAuthenticated } = storeToRefs(authStore)
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register']
  const isPublicRoute = publicRoutes.includes(to.path)

  // Redirect logic based on authentication state and route
  if (!isAuthenticated.value && !isPublicRoute) {
    return navigateTo('/auth/login')
  }

  if (isAuthenticated.value && isPublicRoute) {
    return navigateTo('/dashboard')
  }
})
```

## Entity Lifecycle Management

BaseUX provides complete entity lifecycle management:

### Entity Generation

- `UpdateSidebar` function automatically adds new entities to navigation
- Uses entity's plural name for better UX
- Ensures new entities are immediately accessible

### Entity Destruction

- `RemoveFromSidebar` function removes entities from navigation
- Uses regex pattern matching for precise removal
- Cleans up any formatting issues during removal

### Nuxt Configuration Management

- Updates `nuxt.config.ts` to reference new entities
- Removes entity references during destruction
- Maintains configuration integrity throughout lifecycle

## Multi-Language Support

BaseUX makes it easy to implement internationalization:

### i18n Integration

- Built-in support for multiple languages
- Translation key management
- Language switching at runtime

### Implementation

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n'
  ],
  
  i18n: {
    locales: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default'
  }
})
```

## Responsive Design

All BaseUX components are responsive by default:

### Features

- Mobile-first approach
- Adaptive layouts based on screen size
- Touch support for mobile devices
- Consistent experience across devices

### Implementation

BaseUX uses Tailwind CSS for responsive design:

```vue
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div v-for="item in items" :key="item.id" class="p-4 border rounded">
    <!-- Item content -->
  </div>
</div>
```

## Theme Support

BaseUX includes comprehensive theme support:

### Light/Dark Mode

- Built-in toggle for light and dark themes
- Persisted theme preference
- System preference detection

### Color Customization

- Tailwind CSS configuration for colors
- CSS variables for consistent theming
- Theme extension via Nuxt configuration

## Development Tools

BaseUX provides a rich set of development tools:

### Hot Module Replacement

- Instant updates during development
- State preservation during reloads
- Fast feedback loop

### TypeScript Integration

- Full TypeScript support throughout
- Type checking during development
- Type definitions for all components

### ESLint and Prettier

- Code quality enforcement
- Consistent code style
- Automatic formatting

## Best Practices

When working with BaseUX, follow these best practices:

1. **Use the CLI**: Always use the CLI to generate entities for consistency
2. **Keep Entities Focused**: Each entity should represent a single business object
3. **Reuse Components**: Create shared components for common patterns
4. **Type Everything**: Maintain TypeScript types for all entity properties
5. **Document Customizations**: Add comments for any customizations you make
6. **Follow Data Flow**: Maintain the composable → service → store → component flow
7. **Use Flexible Props**: Implement optional props for cross-entity component reuse

## Conclusion

BaseUX provides a comprehensive framework for building modern web applications with Nuxt. By leveraging its entity generation system, module architecture, and integrated features, you can develop robust applications quickly and maintain them efficiently as they grow.

For specific feature details, refer to the focused documentation sections:
- [Module Features](/projects/bux/module-features.html)
- [Core Features](/projects/bux/core-features.html)
- [Commands](/projects/bux/commands.html)
