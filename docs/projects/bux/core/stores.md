---
title: Stores
---

# BaseUX Store System

BaseUX provides a powerful state management system built on Pinia. The core of this system is the base store pattern located in `app/stores/baseStore.ts`, which serves as a foundation for all entity-specific stores.

## Base Store Pattern

The base store pattern is a template for creating consistent stores for all entities in your application:

```typescript
// app/stores/baseStore.ts
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
      // UI state management
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

## Key Features

### 1. Consistent State Structure

All stores have the same base state structure:

- `items`: Array of entity objects
- `loading`: Loading state flag
- `error`: Error message or null
- `viewMode`: Current view mode (grid or table)
- `pagination`: Pagination state (page, pageSize, total, totalPages)

### 2. Standard CRUD Actions

Every store provides the same set of CRUD operations:

- `fetch(page?, pageSize?)`: Load items with pagination
- `create(data)`: Create a new item
- `update(id, data)`: Update an existing item
- `delete(id)`: Delete an item

### 3. UI State Management

The store includes actions for managing UI state:

- `setViewMode(mode)`: Change and persist the view mode
- `setPagination(pagination)`: Update pagination state
- `setPageSize(pageSize)`: Change the number of items per page

### 4. View Mode Persistence

The view mode preference (grid or table) is automatically persisted in localStorage:

```typescript
setViewMode(mode: 'grid' | 'table') {
  this.viewMode = mode
  if (typeof window !== 'undefined') {
    localStorage.setItem(viewModeKey, mode)
  }
}
```

## Entity-Specific Stores

Each entity in BaseUX has its own store that extends the base store pattern:

```typescript
// Example: structures/posts/stores/postsStore.ts
export const usePostsStore = defineStore('posts', {
  state: () => ({
    items: [] as Post[],
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
    // Standard base actions...
    
    // Entity-specific methods
    async fetchPosts(page?: number, pageSize?: number) {
      return this.fetch(page, pageSize)
    },
    
    async createPost(data: Omit<Post, 'id'>) {
      return this.create(data)
    }
  }
})
```

## Authentication Store

BaseUX includes an authentication store for managing user authentication:

```typescript
// app/stores/authStore.ts
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user
  },
  
  actions: {
    async login(credentials: { email: string, password: string }) {
      // Implementation...
    },
    
    async register(userData: RegisterUserData) {
      // Implementation...
    },
    
    async logout() {
      // Implementation...
    },
    
    async fetchCurrentUser() {
      // Implementation...
    }
  }
})
```

## Using Stores in Components

```vue
<script setup>
import { usePostsStore } from '~/structures/posts/stores/postsStore'

const postsStore = usePostsStore()

// Load posts when the component mounts
onMounted(async () => {
  await postsStore.fetch()
})

// Access state from the store
const posts = computed(() => postsStore.items)
const loading = computed(() => postsStore.loading)
const viewMode = computed(() => postsStore.viewMode)

// Call store actions
const toggleViewMode = () => {
  postsStore.setViewMode(viewMode.value === 'grid' ? 'table' : 'grid')
}

const createPost = async (postData) => {
  await postsStore.create(postData)
}
</script>
```

## Best Practices

### 1. Store Organization

- Place global stores in `app/stores`
- Place entity-specific stores in `structures/[entity]/stores`
- Use the `useXxxStore` naming convention

### 2. Action Naming

- Use descriptive action names that reflect their purpose
- For entity-specific methods, include the entity name (e.g., `fetchPosts`, `createPost`)

### 3. Error Handling

- Always handle errors in store actions
- Set the error state when an action fails
- Reset the error state when starting a new action

### 4. Type Safety

- Use TypeScript interfaces for all state and parameters
- Leverage generics to create type-safe stores
- Validate data before committing to state

### 5. Store Composition

- Share common functionality through composition
- Use the `defineBaseStore` helper for standard CRUD operations
- Extract complex logic into separate composables when needed
