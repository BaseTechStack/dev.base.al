---
title: Types
---

# BaseUX Type System

BaseUX is built with TypeScript from the ground up, providing a robust type system that enhances developer experience, catches errors early, and improves code quality. The core types are defined in `app/types` and used throughout the application.

## Core Types

### Base Types

The fundamental types that are used throughout the application are defined in `app/types/base.ts`:

```typescript
// app/types/base.ts

/**
 * Basic pagination structure returned by API endpoints
 */
export interface BasePagination {
  /** Total number of items across all pages */
  total: number
  /** Current page number (1-based) */
  page: number
  /** Number of items per page */
  pageSize: number
  /** Total number of pages */
  totalPages: number
}

/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
  /** Success status */
  success: boolean
  /** Response data */
  data?: T
  /** Error message if success is false */
  message?: string
  /** HTTP status code */
  status?: number
}

/**
 * View mode options for entity listings
 */
export type ViewMode = 'grid' | 'table'

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc'

/**
 * Sort specification
 */
export interface SortSpec {
  /** Field to sort by */
  field: string
  /** Sort direction */
  direction: SortDirection
}

/**
 * Filter specification
 */
export interface FilterSpec {
  /** Field to filter on */
  field: string
  /** Filter operator (eq, neq, gt, lt, etc.) */
  operator: string
  /** Filter value */
  value: any
}
```

### API Types

Types for API requests and responses are defined in `app/types/api.ts`:

```typescript
// app/types/api.ts
import type { BasePagination } from './base'

/**
 * Standard paginated response from API
 */
export interface PaginatedResponse<T> {
  /** Array of items */
  items: T[]
  /** Pagination information */
  pagination: BasePagination
}

/**
 * Error response from API
 */
export interface ApiError {
  /** Error message */
  message: string
  /** Error code */
  code?: string
  /** Validation errors by field */
  errors?: Record<string, string[]>
}

/**
 * Parameters for paginated requests
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page?: number
  /** Items per page */
  per_page?: number
  /** Sort field */
  sort_by?: string
  /** Sort direction */
  sort_dir?: 'asc' | 'desc'
}
```

### User and Authentication Types

Types for users and authentication are defined in `app/types/auth.ts`:

```typescript
// app/types/auth.ts

/**
 * User model
 */
export interface User {
  /** User ID */
  id: number
  /** User's email address */
  email: string
  /** User's display name */
  name: string
  /** User's role */
  role: 'user' | 'admin' | 'editor'
  /** User's avatar URL */
  avatar?: string
  /** When the user was created */
  createdAt: string
  /** When the user was last updated */
  updatedAt: string
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  /** User's email */
  email: string
  /** User's password */
  password: string
  /** Remember user */
  remember?: boolean
}

/**
 * Registration data
 */
export interface RegisterData {
  /** User's name */
  name: string
  /** User's email */
  email: string
  /** User's password */
  password: string
  /** Password confirmation */
  passwordConfirmation: string
}

/**
 * Authentication response
 */
export interface AuthResponse {
  /** User data */
  user: User
  /** JWT token */
  token: string
  /** Token expiration timestamp */
  expiresAt?: number
}
```

## Entity Types

Each entity in BaseUX has its own type definition in its respective module:

```typescript
// structures/posts/stores/post.ts
import type { BaseItem } from '@@/app/stores/baseStore'

/**
 * Post entity interface
 */
export interface Post extends BaseItem {
  /** Post ID */
  id: number
  /** Post title */
  title: string
  /** Post content */
  content: string
  /** When the post was published */
  publishedAt: string
  /** When the post was created */
  createdAt: string
  /** When the post was last updated */
  updatedAt: string
}
```

## Component Props

BaseUX defines types for component props to ensure proper usage:

```typescript
// structures/posts/components/PostGrid.vue
<script setup lang="ts">
import type { Post } from '../stores/post'
import type { PropType } from 'vue'

// Define props with types
const props = defineProps({
  posts: {
    type: Array as PropType<Post[]>,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Posts'
  }
})
</script>
```

## Type Utilities

BaseUX includes several type utilities to enhance type safety:

### Typed Store Definition

```typescript
// app/types/store.ts
import type { StoreDefinition } from 'pinia'

/**
 * Type-safe store definition with standard state structure
 */
export type TypedStore<
  Id extends string,
  S,
  G,
  A
> = StoreDefinition<Id, S, G, A>

/**
 * Extract the state type from a store
 */
export type StoreState<T> = T extends TypedStore<any, infer S, any, any> ? S : never

/**
 * Extract the getters type from a store
 */
export type StoreGetters<T> = T extends TypedStore<any, any, infer G, any> ? G : never

/**
 * Extract the actions type from a store
 */
export type StoreActions<T> = T extends TypedStore<any, any, any, infer A> ? A : never
```

### Form Types

```typescript
// app/types/form.ts

/**
 * Form field definition
 */
export interface FormField {
  /** Field name/key */
  name: string
  /** Field label */
  label: string
  /** Field type */
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'radio' | 'date'
  /** Field placeholder */
  placeholder?: string
  /** Whether the field is required */
  required?: boolean
  /** Default value */
  default?: any
  /** Options for select, checkbox group, and radio group */
  options?: { label: string; value: any }[]
  /** Validation rules */
  rules?: Record<string, any>
}

/**
 * Form schema definition
 */
export interface FormSchema {
  /** Form fields */
  fields: FormField[]
  /** Form submission URL */
  submitUrl?: string
  /** Form submit button text */
  submitText?: string
}
```

## Type Augmentation

BaseUX extends existing types to add additional functionality:

```typescript
// app/types/augmentations.ts

// Extend the Nuxt runtime config
declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    apiUrl: string
    appName: string
    appVersion: string
  }
}

// Extend process.env with our custom environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      API_URL?: string
    }
  }
}
```

## Best Practices

### 1. Type Organization

- Place global types in `app/types`
- Place entity-specific types with their respective entities
- Use consistent naming patterns for all types

### 2. Type Exports

- Export types from a central location for each module
- Use barrel exports to simplify imports
- Only export what's needed by other modules

### 3. Type Safety

- Use strict type checking (`"strict": true` in tsconfig.json)
- Avoid using `any` whenever possible
- Use generics to create reusable type patterns

### 4. Type Documentation

- Document types with JSDoc comments
- Include descriptions for all properties
- Document generic type parameters

### 5. Type Composition

- Break down complex types into smaller, reusable types
- Use type composition (`&`) and union types (`|`) for flexibility
- Use conditional types for advanced type logic
