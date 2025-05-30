---
title: Services
---

# BaseUX Service Layer

BaseUX implements a service layer that acts as an adapter between components and API endpoints. This abstraction ensures a clean separation of concerns and provides a consistent interface for data operations.

## Base Service Interface

The core of the service layer is the `BaseService` interface defined in `app/services/baseService.ts`:

```typescript
import type { BaseItem } from '../stores/baseStore'
import type { BasePagination } from '../types/base'

/**
 * Generic service interface for CRUD operations
 * This interface should be implemented by specific services (e.g., PostService)
 */
export interface BaseService<T extends BaseItem> {
  /**
   * Fetch items with pagination
   * @param page Page number (1-based)
   * @param pageSize Number of items per page
   * @returns Promise with items array and pagination information
   */
  fetch(page?: number, pageSize?: number): Promise<{ 
    items: T[], 
    pagination: BasePagination 
  }>

  /**
   * Fetch a single item by ID
   * @param id Item ID
   * @returns Promise with the item
   */
  fetchById(id: number): Promise<{ 
    item: T 
  }>

  /**
   * Create a new item
   * @param data Item data without ID
   * @returns Promise with the created item
   */
  create(data: Omit<T, 'id'>): Promise<{ 
    item: T 
  }>

  /**
   * Update an existing item
   * @param id ID of the item to update
   * @param data Partial item data
   * @returns Promise with the updated item
   */
  update(id: number, data: Partial<Omit<T, 'id'>>): Promise<{ 
    item: T 
  }>

  /**
   * Delete an item
   * @param id ID of the item to delete
   * @returns Promise that resolves when the item is deleted
   */
  delete(id: number): Promise<void>
}
```

## Entity Service Implementation

Each entity in BaseUX has its own service implementation that follows the `BaseService` interface:

```typescript
// Example: structures/posts/services/postService.ts
import type { Post } from '../stores/post'
import { PostModel } from '../stores/post'
import type { BaseService } from '@@/app/services/baseService'
import { usePosts } from '../composables/usePosts'
import type { BasePagination } from '@@/app/types/base'

export const usePostService = (): BaseService<Post> => {
  // Only create usePosts() when the composable is called, not at module level
  const postsApi = usePosts()
  
  return {
    async fetch(page = 1, pageSize = 10): Promise<{ items: Post[], pagination: BasePagination }> {
      const result = await postsApi.fetchPosts(page, pageSize)
      return {
        items: PostModel.fromJsonList(result.posts),
        pagination: result.pagination
      }
    },
    
    async fetchById(id: number): Promise<{ item: Post }> {
      const result = await postsApi.fetchPostById(id)
      return {
        item: PostModel.fromJson(result.post)
      }
    },
    
    async create(data: Omit<Post, 'id'>): Promise<{ item: Post }> {
      const result = await postsApi.createPost(data)
      return {
        item: PostModel.fromJson(result.post)
      }
    },

    async update(id: number, data: Partial<Omit<Post, 'id'>>): Promise<{ item: Post }> {
      const result = await postsApi.updatePost(id, data)
      return {
        item: PostModel.fromJson(result.post)
      }
    },

    async delete(id: number): Promise<void> {
      await postsApi.deletePost(id)
    }
  }
}
```

## Data Transformation

The service layer handles data transformation between API formats and frontend formats:

1. **API to Frontend**: Converts snake_case properties to camelCase
2. **Frontend to API**: Converts camelCase properties to snake_case
3. **Type Conversion**: Handles date formatting, number parsing, etc.

This transformation is typically handled by the entity model class:

```typescript
// Example: structures/posts/stores/post.ts
export class PostModel {
  static fromJson(json: Record<string, any>): Post {
    // Convert from API format (snake_case) to frontend format (camelCase)
    return {
      id: Number(json.id),
      title: json.title || json.title,
      content: json.content || json.content,
      publishedAt: json.published_at || json.publishedAt,
      createdAt: json.created_at || json.createdAt,
      updatedAt: json.updated_at || json.updatedAt
    }
  }
  
  static toJson(post: Partial<Post>, useSnakeCase: boolean = true): Record<string, any> {
    if (!useSnakeCase) {
      return { ...post }
    }
    
    // Convert from frontend format (camelCase) to API format (snake_case)
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

## API Integration via Composables

BaseUX uses composables to handle the actual API communication:

```typescript
// Example: structures/posts/composables/usePosts.ts
export const usePosts = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl
  
  return {
    async fetchPosts(page = 1, pageSize = 10) {
      try {
        const response = await $fetch(`${apiUrl}/posts`, {
          method: 'GET',
          params: { page, per_page: pageSize }
        })
        return response
      } catch (error) {
        console.error('Error fetching posts:', error)
        throw error
      }
    },
    
    async fetchPostById(id: number) {
      try {
        const response = await $fetch(`${apiUrl}/posts/${id}`, {
          method: 'GET'
        })
        return response
      } catch (error) {
        console.error(`Error fetching post ${id}:`, error)
        throw error
      }
    },
    
    // Other API methods...
  }
}
```

## Authentication Service

BaseUX includes an authentication service for managing user authentication:

```typescript
// app/services/authService.ts
export const useAuthService = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl
  
  return {
    async login(credentials: { email: string, password: string }) {
      try {
        const response = await $fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          body: credentials
        })
        return response
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    
    async register(userData: RegisterUserData) {
      try {
        const response = await $fetch(`${apiUrl}/auth/register`, {
          method: 'POST',
          body: userData
        })
        return response
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      }
    },
    
    // Other auth methods...
  }
}
```

## Using Services in Stores

Services are primarily used within stores to handle API communication:

```typescript
// Example store using a service
export const usePostsStore = defineStore('posts', {
  // State, getters...
  
  actions: {
    async fetch(page?: number, pageSize?: number) {
      this.loading = true
      try {
        const service = usePostService()
        const { items, pagination } = await service.fetch(page, pageSize)
        this.items = items
        this.setPagination(pagination)
        return { items, pagination }
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
    
    // Other actions...
  }
})
```

## Mock Services for Development

BaseUX makes it easy to create mock services for development and testing:

```typescript
// Mock service implementation
export const usePostService = (): BaseService<Post> => {
  // Use mock data instead of real API calls
  return {
    async fetch(page = 1, pageSize = 10): Promise<{ items: Post[], pagination: BasePagination }> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Return mock data
      return {
        items: mockPosts.slice((page - 1) * pageSize, page * pageSize),
        pagination: {
          total: mockPosts.length,
          page,
          pageSize,
          totalPages: Math.ceil(mockPosts.length / pageSize)
        }
      }
    },
    
    // Other methods with mock implementations...
  }
}
```

## Best Practices

### 1. Service Organization

- Place global services in `app/services`
- Place entity-specific services in `structures/[entity]/services`
- Use the `useXxxService` naming convention

### 2. Error Handling

- Implement consistent error handling across all services
- Use try/catch blocks to handle and transform API errors
- Log errors for debugging but throw them for the caller to handle

### 3. Data Transformation

- Always transform data between API and frontend formats
- Use entity model classes for consistent transformation
- Handle special cases like date formatting and number parsing

### 4. API Configuration

- Use the runtime configuration for API URLs
- Support different environments (development, production)
- Implement request interceptors for adding auth tokens, etc.

### 5. Service Composition

- Break down complex services into smaller, focused services
- Use composition to combine services when needed
- Leverage dependency injection for testing
