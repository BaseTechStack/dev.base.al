---
title: Middleware
---

# BaseUX Middleware

BaseUX uses Nuxt's middleware system to handle routing logic such as authentication, permissions, and data prefetching. Middleware runs before rendering a page and can redirect or modify the route.

## Authentication Middleware

The most important middleware in BaseUX is the authentication middleware, which protects routes and ensures users are authenticated when required.

### Global Auth Middleware

BaseUX includes a global authentication middleware in `app/middleware/auth.global.ts`:

```typescript
// app/middleware/auth.global.ts
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/authStore'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const { isAuthenticated } = storeToRefs(authStore)
  
  console.log('[Auth Middleware] Route:', to.path)
  console.log('[Auth Middleware] Auth state:', isAuthenticated.value)

  // Define public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password']
  const isPublicRoute = publicRoutes.includes(to.path)

  // If not authenticated and trying to access protected route
  if (!isAuthenticated.value && !isPublicRoute) {
    console.log('[Auth Middleware] Redirecting to login - Not authenticated')
    return navigateTo('/auth/login')
  }

  // If authenticated and trying to access auth pages
  if (isAuthenticated.value && isPublicRoute) {
    console.log('[Auth Middleware] Redirecting to dashboard - Already authenticated')
    // Check if there's a redirect path in the query
    const redirect = to.query.redirect as string
    if (redirect) {
      return navigateTo(redirect)
    }
    return navigateTo('/app/dashboard')
  }
})
```

This middleware:
1. Checks if the user is authenticated using the auth store
2. Defines public routes that don't require authentication
3. Redirects unauthenticated users to the login page
4. Redirects authenticated users away from auth pages

## Route-Specific Middleware

In addition to global middleware, BaseUX allows you to create route-specific middleware:

### Role-Based Access Control

```typescript
// app/middleware/admin.ts
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  
  if (!authStore.user || authStore.user.role !== 'admin') {
    return navigateTo('/app/dashboard')
  }
})
```

You can apply this middleware to specific pages:

```vue
<script setup>
definePageMeta({
  middleware: ['admin']
})
</script>
```

### Entity Access Control

BaseUX also provides middleware for controlling access to entity pages:

```typescript
// structures/posts/middleware/postAccess.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const postsStore = usePostsStore()
  
  // Get post ID from route params
  const postId = parseInt(to.params.id as string)
  
  try {
    // Try to fetch the post
    await postsStore.fetchById(postId)
    const post = postsStore.getItemById(postId)
    
    // Check if post exists and user has access
    if (!post) {
      return navigateTo('/app/posts')
    }
    
    // Check if user has permission to access this post
    if (post.authorId !== authStore.user?.id && authStore.user?.role !== 'admin') {
      return navigateTo('/app/posts')
    }
  } catch (error) {
    // Handle fetch error
    return navigateTo('/app/posts')
  }
})
```

## Data Prefetching Middleware

BaseUX uses middleware for data prefetching to ensure data is loaded before the page renders:

```typescript
// structures/posts/middleware/loadPosts.ts
export default defineNuxtRouteMiddleware(async () => {
  const postsStore = usePostsStore()
  
  // Load posts if not already loaded
  if (postsStore.items.length === 0 && !postsStore.loading) {
    try {
      await postsStore.fetch()
    } catch (error) {
      console.error('Error loading posts:', error)
    }
  }
})
```

Apply this middleware to the posts index page:

```vue
<script setup>
definePageMeta({
  middleware: ['loadPosts']
})
</script>
```

## Creating Custom Middleware

You can create custom middleware for specific needs:

### Example: Analytics Middleware

```typescript
// app/middleware/analytics.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Skip analytics in development
  if (process.dev) return
  
  // Wait until client-side to access window
  if (process.client) {
    setTimeout(() => {
      // Track page view
      if (window.gtag) {
        window.gtag('config', 'UA-XXXXXXXX-X', {
          page_path: to.fullPath
        })
      }
    }, 0)
  }
})
```

## Middleware Order

Middleware in BaseUX runs in the following order:

1. Global middleware defined in `app/middleware/*.global.ts`
2. Layout middleware defined in layout components
3. Route middleware defined in page components

## Best Practices

### 1. Keep Middleware Focused

- Each middleware should have a single responsibility
- Complex logic should be moved to composables or services
- Middleware should be small and focused on routing concerns

### 2. Error Handling

- Implement proper error handling in middleware
- Provide fallback routes for error cases
- Log errors for debugging purposes

### 3. Performance

- Minimize async operations in middleware
- Consider caching data to avoid repeated fetches
- Use client-side middleware for browser-specific operations

### 4. Authentication

- Keep authentication logic in a dedicated middleware
- Use the auth store for authentication state
- Provide clear feedback for authentication errors

### 5. Route Protection

- Define clear rules for route access
- Implement role-based access control
- Protect sensitive routes and operations
