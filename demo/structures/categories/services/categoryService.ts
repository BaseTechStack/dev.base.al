import type { Category } from '../stores/category'
import { CategoryModel } from '../stores/category'
import type { BaseService } from '@@/app/services/baseService'
import { useCategories } from '../composables/useCategories'
import type { BasePagination } from '@@/app/types/base'

// Use a composable pattern to ensure Pinia is initialized before using the store
export const useCategoryService = (): BaseService<Category> => {
  // Only create useCategories() when the composable is called, not at module level
  const categoriesApi = useCategories()
  
  return {
    async fetch(page = 1, pageSize = 10): Promise<{ items: Category[], pagination: BasePagination }> {
      console.log('CategoryService.fetch called with page:', page, 'pageSize:', pageSize)
      const result = await categoriesApi.fetchCategories(page, pageSize)
      console.log('CategoryService API response:', result)
      return {
        items: CategoryModel.fromJsonList(result.categories),
        pagination: result.pagination
      }
    },
    async fetchById(id: number): Promise<{ item: Category }> {
      const result = await categoriesApi.fetchCategoryById(id)
      return {
        item: CategoryModel.fromJson(result.category)
      }
    },
    async create(data: Omit<Category, 'id'>): Promise<{ item: Category }> {
      const result = await categoriesApi.createCategory(data)
      return {
        item: CategoryModel.fromJson(result.category)
      }
    },

    async update(id: number, data: Partial<Omit<Category, 'id'>>): Promise<{ item: Category }> {
      const result = await categoriesApi.updateCategory(id, data)
      return {
        item: CategoryModel.fromJson(result.category)
      }
    },

    async delete(id: number): Promise<void> {
      await categoriesApi.deleteCategory(id)
    }
  }
}
