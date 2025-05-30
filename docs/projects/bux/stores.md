---
title: Store Pattern
---

# BaseUX Store Pattern

BaseUX implements a sophisticated store pattern using Pinia that provides a standardized approach to state management across your application. This guide explains the store architecture and best practices.

## Store Architecture

BaseUX uses a composition-based store pattern with the following key components:

1. **Base Store Pattern**: A template for entity stores with common CRUD operations
2. **Entity-Specific Stores**: Extended stores with specialized methods for each entity
3. **Typed Models**: TypeScript interfaces and classes for data validation

### Base Store Structure

The base store provides a foundation for all entity stores with standardized state, getters, and actions:

```typescript
// app/stores/baseStore.ts
export interface BaseItem {
  id: number;
  [key: string]: any;
}

export interface BasePagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BaseState<T extends BaseItem> {
  items: T[];
  loading: boolean;
  error: string | null;
  viewMode: 'grid' | 'table';
  pagination: BasePagination;
}

export interface BaseService<T extends BaseItem> {
  fetch(page?: number, pageSize?: number): Promise<{ items: T[], pagination: BasePagination }>;
  fetchById(id: number): Promise<{ item: T }>;
  create(data: Omit<T, 'id'>): Promise<{ item: T }>;
  update(id: number, data: Partial<Omit<T, 'id'>>): Promise<{ item: T }>;
  delete(id: number): Promise<void>;
}
```

## Entity Store Implementation

Each entity gets its own store that uses Pinia's `defineStore` pattern:

```typescript
// Example entity store (postsStore.ts)
import { defineStore } from 'pinia'
import type { Post } from './post'
import { usePostService } from '../services/postService'

const VIEW_MODE_KEY = 'posts_view_mode'

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
    setViewMode(mode: 'grid' | 'table') {
      this.viewMode = mode
      if (typeof window !== 'undefined') {
        localStorage.setItem(VIEW_MODE_KEY, mode)
      }
    },
    
    // Generic CRUD operations
    async fetch(page?: number, pageSize?: number) {
      // Implementation...
    },
    
    async fetchById(id: number) {
      // Implementation...
    },
    
    async create(data: Omit<Post, 'id'>) {
      // Implementation...
    },
    
    async update(id: number, data: Partial<Omit<Post, 'id'>>) {
      // Implementation...
    },
    
    async delete(id: number) {
      // Implementation...
    },
    
    // Entity-specific methods
    async fetchPosts(page?: number, pageSize?: number) {
      // Specialized implementation...
    }
  }
})
```

## Key Features of the Store Pattern

### 1. Integrated Entity Methods

Entity stores directly integrate specialized methods for each entity type:

```typescript
// Example of entity-specific methods
async fetchPosts(page?: number, pageSize?: number) {
  return this.fetch(page, pageSize)
}

async createPost(data: Omit<Post, 'id'>) {
  return this.create(data)
}

async updatePost(id: number, data: Partial<Omit<Post, 'id'>>) {
  return this.update(id, data)
}

async deletePost(id: number) {
  return this.delete(id)
}
```

This allows components to use either the generic methods (`fetch`, `create`) or entity-specific methods (`fetchPosts`, `createPost`).

### 2. View Mode Persistence

BaseUX stores persist UI preferences like the current view mode (grid/table) in localStorage:

```typescript
setViewMode(mode: 'grid' | 'table') {
  this.viewMode = mode
  if (typeof window !== 'undefined') {
    localStorage.setItem(VIEW_MODE_KEY, mode)
  }
}
```

### 3. TypeScript Integration

Stores use TypeScript for full type safety:

```typescript
// Type-safe parameter passing
async update(id: number, data: Partial<Omit<Post, 'id'>>) {
  this.loading = true
  try {
    const service = usePostService()
    const { item } = await service.update(id, data)
    
    // Update the item in the local state
    const index = this.items.findIndex(i => i.id === id)
    if (index !== -1) {
      this.items[index] = item
    }
    
    return { item }
  } catch (error: any) {
    this.error = error.message
    throw error
  } finally {
    this.loading = false
  }
}
```

## Best Practices

### Using Stores in Components

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

### Correct Update Method Parameter Structure

When updating entities, always use the correct parameter structure:

```typescript
// Correct way to call update method
postsStore.update(postId, { title: 'Updated Title' })

// Not this way (incorrect)
postsStore.update({ id: postId, title: 'Updated Title' })
```

### Creating Custom Stores

You can create custom stores for non-entity state management:

```typescript
// app/stores/themeStore.ts
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    darkMode: false,
    primaryColor: '#3B82F6'
  }),
  
  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
    },
    
    setPrimaryColor(color: string) {
      this.primaryColor = color
    }
  }
})
```

## Entity Models

BaseUX generates a model class for each entity to handle data transformation:

```typescript
// structures/posts/stores/post.ts
export interface Post extends BaseItem {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export class PostModel {
  static fromJson(json: any): Post {
    return {
      id: json.id,
      title: json.title,
      content: json.content,
      publishedAt: json.published_at,
      createdAt: json.created_at,
      updatedAt: json.updated_at
    }
  }
  
  static fromJsonList(jsonList: any[]): Post[] {
    return jsonList.map(json => this.fromJson(json))
  }
  
  static toJson(post: Post): any {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      published_at: post.publishedAt,
      created_at: post.createdAt,
      updated_at: post.updatedAt
    }
  }
}
```

This model handles converting between API formats (snake_case) and frontend formats (camelCase), as well as any data transformations needed.
