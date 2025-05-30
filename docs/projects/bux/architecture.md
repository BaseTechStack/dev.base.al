---
title: BaseUX Architecture
---

# BaseUX Architecture

BaseUX implements a layered, modular architecture that leverages Nuxt's extensibility features. This document explains the key architectural concepts and patterns used throughout BaseUX.

## Layers-Based Structure

BaseUX uses Nuxt's [layers feature](https://nuxt.com/docs/getting-started/layers) to organize entities as standalone, extendable modules:

```
demo/
├── app/             # Core application code
│   ├── components/  # Global components
│   ├── composables/ # Global composables
│   ├── layouts/     # Application layouts
│   ├── pages/       # Application routes
│   ├── plugins/     # Nuxt plugins
│   ├── services/    # API services
│   ├── stores/      # Pinia stores
│   └── types/       # TypeScript types
├── structures/      # Generated entity structures
│   └── posts/       # Example entity
│       ├── components/    # Entity-specific components
│       ├── composables/   # Entity-specific composables
│       ├── pages/         # Entity-specific pages
│       ├── services/      # Entity-specific services
│       ├── stores/        # Entity-specific stores
│       └── nuxt.config.ts # Entity layer configuration
└── nuxt.config.ts   # Main Nuxt configuration that extends entity layers
```

The main `nuxt.config.ts` file extends these entity structures with the `extends` array:

```typescript
export default defineNuxtConfig({
  // ...
  extends: ['./structures/posts'],
  // ...
})
```

This architecture allows:
- Clean separation of concerns
- Modular development
- Standardized entity structure
- Easy maintenance and testing

## Entity Generation System

BaseUX provides a sophisticated code generation system for creating complete entity modules. When you run `bux g entity [fields]`, it:

1. Creates a directory structure in `structures/[entity]`
2. Generates all necessary components, services, and stores
3. Updates the main `nuxt.config.ts` to extend the new entity

Each generated entity includes:

### Entity Components

- **Grid View**: Responsive card-based view (`EntityGrid.vue` and `EntityGridCard.vue`)
- **Table View**: Filterable, sortable table (`EntityTable.vue`)
- **CRUD Modals**: Add, Edit, View, and Delete modals for entity operations

### Entity Services

Services act as adapters between components and API endpoints, handling data transformation and API communication:

```typescript
// Example generated service
export const useEntityService = (): BaseService<Entity> => {
  const entityApi = useEntities()
  
  return {
    async fetch(page = 1, pageSize = 10): Promise<{ items: Entity[], pagination: BasePagination }> {
      const result = await entityApi.fetchEntities(page, pageSize)
      return {
        items: EntityModel.fromJsonList(result.entities),
        pagination: result.pagination
      }
    },
    // Other CRUD methods...
  }
}
```

### Entity Stores

BaseUX implements a standardized store pattern with Pinia that combines:

1. Generic base store functionality for common CRUD operations
2. Entity-specific methods for specialized operations

```typescript
// Example generated store
export const useEntitiesStore = defineStore('entities', {
  state: () => ({
    items: [] as Entity[],
    loading: false,
    error: null as string | null,
    viewMode: (typeof window !== 'undefined' ? 
      localStorage.getItem(VIEW_MODE_KEY) as 'grid' | 'table' : null) || 'grid',
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
    // CRUD operations and UI state management
    // ...
  }
})
```

## Component Reusability

BaseUX components support flexible prop naming to enhance reusability across entities:

- Components accept props named after their specific entity (`:post` for posts)
- Optional generic props (`:item`) are supported for cross-entity usage
- This prevents "Missing required prop" warnings while maintaining the expected interface

## Base Store Pattern

The BaseUX store architecture was designed for:

1. **Consistent State Management**: All entities follow the same pattern
2. **Type Safety**: Full TypeScript support for all store operations
3. **Composition**: Using Pinia's defineStore with specialized entity methods
4. **Flexibility**: Components can use either generic methods (fetch, create) or entity-specific methods (fetchPosts, createPost)

This architecture ensures a consistent development experience while maintaining flexibility for customization.
