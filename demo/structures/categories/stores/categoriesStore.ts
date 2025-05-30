//pinia store for Categories

// Add TypeScript declaration for import.meta.client
declare global {
  interface ImportMeta {
    client: boolean
  }
}

import type { Category } from './category'
import { CategoryModel } from './category'
import { defineStore } from 'pinia'
import { defineBaseStore, type BaseItem } from '@@/app/stores/baseStore'
import { useCategoryService } from '../services/categoryService'

const VIEW_MODE_KEY = 'categories_view_mode'

// Create the Categories store using defineStore directly
export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    items: [] as Category[],
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
      console.log('categoriesStore fetch called with page:', currentPage, 'pageSize:', pageSize)
      this.loading = true
      try {
        const categoryService = useCategoryService()
        const { items, pagination } = await categoryService.fetch(currentPage, pageSize || this.pagination.pageSize)
        this.items = items
        this.pagination = { ...this.pagination, ...pagination }
        console.log('Updated pagination state:', this.pagination)
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    async create(data: Omit<Category, 'id'>): Promise<Category> {
      this.loading = true
      try {
        const categoryService = useCategoryService()
        // Convert data to snake_case for API if needed
        const apiData = CategoryModel.toJson(data, true)
        const { item } = await categoryService.create(apiData as any)
        this.items.push(item)
        return item
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async update(id: number, data: Partial<Omit<Category, 'id'>>): Promise<Category> {
      this.loading = true
      try {
        const categoryService = useCategoryService()
        // Convert data to snake_case for API if needed
        const apiData = CategoryModel.toJson(data, true)
        const { item } = await categoryService.update(id, apiData as any)
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
        const categoryService = useCategoryService()
        await categoryService.delete(id)
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
export function fetchCategories(page = 1, pageSize?: number): Promise<void> {
  console.log('fetchCategories called with page:', page, 'pageSize:', pageSize)
  const store = useCategoriesStore()
  return store.fetch(page, pageSize)
}

export function createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
  const store = useCategoriesStore()
  return store.create(categoryData)
}

export function updateCategoryById(id: number, categoryData: Partial<Omit<Category, 'id'>>): Promise<Category> {
  const store = useCategoriesStore()
  return store.update(id, categoryData)
}

export function deleteCategory(id: number): Promise<void> {
  const store = useCategoriesStore()
  return store.delete(id)
}
