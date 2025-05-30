---
title: Composables
---

# BaseUX Composables

BaseUX uses the Composition API to provide reusable logic through composables. These are located in the `app/composables` directory and provide functionality that can be shared across components.

## Core Composables

### useApi

The `useApi` composable provides a wrapper around Nuxt's `$fetch` with consistent error handling and authentication:

```typescript
// app/composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl
  const authStore = useAuthStore()
  
  const fetchWithAuth = async <T>(
    endpoint: string, 
    options: any = {}
  ): Promise<T> => {
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`
    
    // Add authorization header if user is authenticated
    if (authStore.token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${authStore.token}`
      }
    }
    
    try {
      return await $fetch<T>(url, options)
    } catch (error: any) {
      // Handle authentication errors
      if (error.response?.status === 401) {
        authStore.logout()
      }
      
      throw error
    }
  }
  
  return {
    get: <T>(endpoint: string, params = {}) => 
      fetchWithAuth<T>(endpoint, { method: 'GET', params }),
    
    post: <T>(endpoint: string, data = {}) => 
      fetchWithAuth<T>(endpoint, { method: 'POST', body: data }),
    
    put: <T>(endpoint: string, data = {}) => 
      fetchWithAuth<T>(endpoint, { method: 'PUT', body: data }),
    
    patch: <T>(endpoint: string, data = {}) => 
      fetchWithAuth<T>(endpoint, { method: 'PATCH', body: data }),
    
    delete: <T>(endpoint: string) => 
      fetchWithAuth<T>(endpoint, { method: 'DELETE' })
  }
}
```

### useEntityApi

The `useEntityApi` composable provides a generic pattern for creating entity-specific API composables:

```typescript
// app/composables/useEntityApi.ts
export const useEntityApi = <T extends BaseItem>(entityName: string) => {
  const api = useApi()
  const pluralName = entityName.endsWith('s') ? entityName : `${entityName}s`
  
  return {
    fetch: (page = 1, pageSize = 10) => 
      api.get<{ [key: string]: any[] }>(`/${pluralName}`, { page, per_page: pageSize }),
    
    fetchById: (id: number) => 
      api.get<{ [key: string]: any }>(`/${pluralName}/${id}`),
    
    create: (data: Omit<T, 'id'>) => 
      api.post<{ [key: string]: any }>(`/${pluralName}`, data),
    
    update: (id: number, data: Partial<Omit<T, 'id'>>) => 
      api.put<{ [key: string]: any }>(`/${pluralName}/${id}`, data),
    
    delete: (id: number) => 
      api.delete<void>(`/${pluralName}/${id}`)
  }
}
```

## Entity Composables

Each entity in BaseUX has its own composable for API communication:

```typescript
// structures/posts/composables/usePosts.ts
export const usePosts = () => {
  const api = useApi()
  
  return {
    fetchPosts: (page = 1, pageSize = 10) => 
      api.get<{ posts: Record<string, any>[], pagination: BasePagination }>('/posts', { page, per_page: pageSize }),
    
    fetchPostById: (id: number) => 
      api.get<{ post: Record<string, any> }>(`/posts/${id}`),
    
    createPost: (data: Omit<Post, 'id'>) => 
      api.post<{ post: Record<string, any> }>('/posts', PostModel.toJson(data, true)),
    
    updatePost: (id: number, data: Partial<Omit<Post, 'id'>>) => 
      api.put<{ post: Record<string, any> }>(`/posts/${id}`, PostModel.toJson(data, true)),
    
    deletePost: (id: number) => 
      api.delete<void>(`/posts/${id}`)
  }
}
```

## UI Composables

BaseUX includes several composables for UI functionality:

### useModal

The `useModal` composable provides state management for modals:

```typescript
// app/composables/useModal.ts
export const useModal = (initialState = false) => {
  const isOpen = ref(initialState)
  
  const open = () => {
    isOpen.value = true
  }
  
  const close = () => {
    isOpen.value = false
  }
  
  const toggle = () => {
    isOpen.value = !isOpen.value
  }
  
  return {
    isOpen,
    open,
    close,
    toggle
  }
}
```

### useToast

The `useToast` composable provides a simple toast notification system:

```typescript
// app/composables/useToast.ts
export const useToast = () => {
  const { toast } = useNuxtApp()
  
  return {
    success: (message: string) => {
      toast.add({
        title: 'Success',
        description: message,
        color: 'green'
      })
    },
    
    error: (message: string) => {
      toast.add({
        title: 'Error',
        description: message,
        color: 'red'
      })
    },
    
    info: (message: string) => {
      toast.add({
        title: 'Info',
        description: message,
        color: 'blue'
      })
    },
    
    warning: (message: string) => {
      toast.add({
        title: 'Warning',
        description: message,
        color: 'yellow'
      })
    }
  }
}
```

## Form Composables

BaseUX includes composables for form handling:

### useForm

The `useForm` composable provides form state management and validation:

```typescript
// app/composables/useForm.ts
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: Record<string, any>
) => {
  const values = reactive({ ...initialValues }) as T
  const errors = reactive<Record<string, string>>({})
  const touched = reactive<Record<string, boolean>>({})
  const isSubmitting = ref(false)
  
  // Reset form to initial values
  const reset = () => {
    Object.keys(values).forEach(key => {
      // @ts-ignore
      values[key] = initialValues[key]
    })
    
    Object.keys(errors).forEach(key => {
      delete errors[key]
    })
    
    Object.keys(touched).forEach(key => {
      delete touched[key]
    })
  }
  
  // Validate form values
  const validate = (): boolean => {
    if (!validationSchema) return true
    
    let isValid = true
    Object.keys(validationSchema).forEach(key => {
      const rules = validationSchema[key]
      // @ts-ignore
      const value = values[key]
      
      if (rules.required && !value) {
        errors[key] = rules.message || 'This field is required'
        isValid = false
      }
      
      // Additional validation rules...
    })
    
    return isValid
  }
  
  // Handle field change
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value
    
    // @ts-ignore
    values[name] = value
    touched[name] = true
    
    // Clear error when field is modified
    if (errors[name]) {
      delete errors[name]
    }
  }
  
  // Handle form submission
  const handleSubmit = async (
    onSubmit: (values: T) => Promise<void> | void
  ) => {
    // Mark all fields as touched
    Object.keys(values).forEach(key => {
      touched[key] = true
    })
    
    // Validate form
    const isValid = validate()
    if (!isValid) return
    
    isSubmitting.value = true
    try {
      await onSubmit(values)
    } finally {
      isSubmitting.value = false
    }
  }
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    reset,
    validate,
    handleChange,
    handleSubmit
  }
}
```

## Best Practices

### 1. Composable Organization

- Place global composables in `app/composables`
- Place entity-specific composables in `structures/[entity]/composables`
- Use the `useXxx` naming convention

### 2. Return Object Structure

- Return a plain object from composables, not a reactive object
- Use `ref` and `reactive` for internal state
- Export functions and computed values, not modifiable state

### 3. Error Handling

- Implement consistent error handling in composables
- Provide clear error messages
- Allow the caller to handle errors when appropriate

### 4. Reactivity

- Use `ref` for primitive values
- Use `reactive` for objects
- Use `computed` for derived values
- Be careful with destructuring which can break reactivity

### 5. Composable Composition

- Break down complex composables into smaller, focused composables
- Use composition to combine composables when needed
- Pass dependencies as parameters rather than importing them directly
