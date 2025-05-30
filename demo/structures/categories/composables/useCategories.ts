import type { Category } from '../stores/Category'
import type { BasePagination } from '@@/app/types/base'
import { useApi } from '@@/app/composables/useApi'

export const useCategories = () => {
  const api = useApi()

  const fetchCategories = async (page = 1, pageSize = 10) => {
    console.log('useCategories.fetchCategories called with page:', page, 'pageSize:', pageSize)
    const result = await api.get(`/categories?page=${page}&limit=${pageSize}`)
    console.log('useCategories API response:', result)
    const total = result.pagination?.total || 0
    const pagination: BasePagination = {
      total: total,
      page: result.pagination?.page || 1,
      pageSize: pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize))
    }
    console.log('useCategories returning pagination:', pagination)
    return { categories: result.data, pagination }
  }

  const fetchCategoryById = async (id: number) => {
    const result = await api.get(`/categories/${id}`)
    return { category: result.data }
  }

  const createCategory = async (categoryData: Omit<Category, 'id'>) => {
    const result = await api.post('/categories', categoryData)
    return { category: result.data }
  }

  const updateCategory = async (id: number, categoryData: Partial<Omit<Category, 'id'>>) => {
    const result = await api.put(`/categories/${id}`, categoryData)
    return { category: result.data }
  }

  const deleteCategory = async (id: number) => {
    await api.delete(`/categories/${id}`)
  }

  return {
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
