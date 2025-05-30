//pinia store for Posts

// Add TypeScript declaration for import.meta.client
declare global {
  interface ImportMeta {
    client: boolean
  }
}

import type { Post } from './post'
import { PostModel } from './post'
import { defineStore } from 'pinia'
import { defineBaseStore, type BaseItem } from '@@/app/stores/baseStore'
import { usePostService } from '../services/postService'

const VIEW_MODE_KEY = 'posts_view_mode'

// Create the Posts store using defineStore directly
export const usePostsStore = defineStore('posts', {
  state: () => ({
    items: [] as Post[],
    loading: false,
    error: null as string | null,
    viewMode: (typeof window !== 'undefined' ? localStorage.getItem(VIEW_MODE_KEY) as 'grid' | 'table' : null) || 'grid',
    pagination: {
      total: 0,
      page: 1,
      pageSize: 12, // Changed from 10 to 12 to be consistent with our pagination options
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
    
    async fetch(page?: number, pageSize?: number) {
      // Use the provided page or the current page from state
      const currentPage = page !== undefined ? page : this.pagination.page
      console.log('postsStore fetch called with page:', currentPage, 'pageSize:', pageSize)
      this.loading = true
      try {
        const postService = usePostService()
        const { items, pagination } = await postService.fetch(currentPage, pageSize || this.pagination.pageSize)
        this.items = items
        this.pagination = { ...this.pagination, ...pagination }
        console.log('Updated pagination state:', this.pagination)
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    async create(data: Omit<Post, 'id'>): Promise<Post> {
      this.loading = true
      try {
        const postService = usePostService()
        // Convert data to snake_case for API if needed
        const apiData = PostModel.toJson(data, true)
        const { item } = await postService.create(apiData as any)
        this.items.push(item)
        return item
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async update(id: number, data: Partial<Omit<Post, 'id'>>): Promise<Post> {
      this.loading = true
      try {
        const postService = usePostService()
        // Convert data to snake_case for API if needed
        const apiData = PostModel.toJson(data, true)
        const { item } = await postService.update(id, apiData as any)
        const index = this.items.findIndex(i => i.id === id)
        if (index !== -1) {
          this.items[index] = item
        }
        return item
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async delete(id: number): Promise<void> {
      this.loading = true
      try {
        const postService = usePostService()
        await postService.delete(id)
        const index = this.items.findIndex(i => i.id === id)
        if (index !== -1) {
          this.items.splice(index, 1)
        }
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

// Adding specialized methods to the store
// Instead of extending, we'll use the store object directly
// and add our specialized methods that call the base methods

// Add these helper methods to provide more descriptive names
// These functions should only be called from within components or other composables
// where Pinia is properly initialized
export function fetchPosts(page = 1, pageSize?: number): Promise<void> {
  console.log('fetchPosts called with page:', page, 'pageSize:', pageSize)
  const store = usePostsStore()
  return store.fetch(page, pageSize)
}

export function createPost(postData: Omit<Post, 'id'>): Promise<Post> {
  const store = usePostsStore()
  return store.create(postData)
}

export function updatePostById(id: number, postData: Partial<Omit<Post, 'id'>>): Promise<Post> {
  const store = usePostsStore()
  return store.update(id, postData)
}

export function deletePost(id: number): Promise<void> {
  const store = usePostsStore()
  return store.delete(id)
}
