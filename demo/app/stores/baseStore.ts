import { defineStore, getActivePinia, type StoreDefinition } from 'pinia'
import type { BasePagination } from '../types/base'
import type { BaseService } from '../services/baseService'
 
export type ViewMode = 'grid' | 'table'

export interface BaseState<T> {
  items: T[]
  loading: boolean
  error: string | null
  viewMode: ViewMode
  pagination: BasePagination
}

export interface BaseItem {
  id: number
}

export type BaseStoreDefinition<T extends BaseItem> = StoreDefinition<
  string,
  BaseState<T>,
  {
    getItemById: (id: number) => T | undefined
  },
  {
    // Basic state mutation actions
    setLoading(isLoading: boolean): void
    setItems(items: T[]): void
    setViewMode(mode: ViewMode): void
    setPagination(pagination: Partial<BasePagination>): void
    setPageSize(pageSize: number): Promise<void>
    reset(): void
    
    // CRUD operations
    fetch(page?: number, pageSize?: number): Promise<void>
    create(data: Omit<T, 'id'>): Promise<T>
    update(id: number, data: Partial<Omit<T, 'id'>>): Promise<T>
    delete(id: number): Promise<void>
  }
>

export function defineBaseStore<T extends BaseItem>(
  name: string, 
  viewModeKey: string,
  service: BaseService<T>
) {
  // Ensure we have a valid Pinia instance
  if (process.client && !getActivePinia()) {
    console.warn(`No active Pinia instance found when creating store '${name}'. This may cause issues.`)
  }
  return defineStore(name, {
    state: (): BaseState<T> => ({
      items: [],
      loading: false,
      error: null,
      viewMode: (typeof window !== 'undefined' ? localStorage.getItem(viewModeKey) as ViewMode : null) || 'grid',
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
      setLoading(isLoading: boolean) {
        this.loading = isLoading
      },

      setItems(items: T[]) {
        this.items = items as any
      },

      setViewMode(mode: ViewMode) {
        this.viewMode = mode
        if (typeof window !== 'undefined') {
          localStorage.setItem(viewModeKey, mode)
        }
      },

      setPagination(pagination: Partial<BasePagination>) {
        // Make sure totalPages is correctly calculated if pageSize changes
        if (pagination.pageSize && !pagination.totalPages) {
          const total = pagination.total !== undefined ? pagination.total : this.pagination.total
          pagination.totalPages = Math.max(1, Math.ceil(total / pagination.pageSize))
        }
        this.pagination = { ...this.pagination, ...pagination }
      },

      async setPageSize(pageSize: number) {
        // Calculate new total pages
        const total = this.pagination.total
        const newTotalPages = Math.max(1, Math.ceil(total / pageSize))
        
        // Reset to page 1 by default
        this.setPagination({
          pageSize,
          page: 1,
          totalPages: newTotalPages
        })
        
        // Automatically fetch with the new page size
        await this.fetch(1, pageSize)
      },

      reset() {
        this.items = [] as any
        this.loading = false
        this.error = null
        this.pagination = {
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0
        }
      },

      // Generic CRUD operations
      async fetch(page = 1, pageSize?: number) {
        console.log('baseStore fetch called with page:', page, 'pageSize:', pageSize)
        this.setLoading(true)
        try {
          // Update pagination with the requested page before fetching
          this.setPagination({ page })
          console.log('Store pagination after page update:', this.pagination)
          
          // Use the store's pageSize if none provided
          const effectivePageSize = pageSize || this.pagination.pageSize
          
          console.log('Calling service.fetch with page:', page, 'effectivePageSize:', effectivePageSize)
          const { items, pagination } = await service.fetch(page, effectivePageSize)
          console.log('API response received, items:', items.length, 'pagination:', pagination)
          
          this.setItems(items)
          this.setPagination(pagination)
          console.log('Store updated, final pagination:', this.pagination)
        } catch (error: any) {
          console.error('Error in fetch:', error.message)
          this.error = error.message
        } finally {
          this.setLoading(false)
        }
      },

      async create(data: Omit<T, 'id'>) {
        this.setLoading(true)
        try {
          const { item } = await service.create(data)
          this.items.push(item as any)
          return item
        } catch (error: any) {
          this.error = error.message
          throw error
        } finally {
          this.setLoading(false)
        }
      },

      async update(id: number, data: Partial<Omit<T, 'id'>>) {
        this.setLoading(true)
        try {
          const { item } = await service.update(id, data)
          const index = this.items.findIndex(i => i.id === id)
          if (index !== -1) {
            this.items[index] = item as any
          }
          return item
        } catch (error: any) {
          this.error = error.message
          throw error
        } finally {
          this.setLoading(false)
        }
      },

      async delete(id: number) {
        this.setLoading(true)
        try {
          await service.delete(id)
          const index = this.items.findIndex(i => i.id === id)
          if (index !== -1) {
            this.items.splice(index, 1)
          }
        } catch (error: any) {
          this.error = error.message
          throw error
        } finally {
          this.setLoading(false)
        }
      }
    }
  })
}
