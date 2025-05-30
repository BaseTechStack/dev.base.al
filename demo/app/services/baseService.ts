import type { BaseItem } from '../stores/baseStore'
import type { BasePagination } from '../types/base'

/**
 * Generic service interface for CRUD operations
 * This interface should be implemented by specific services (e.g., ClientService)
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
   * @param data Partial item data for updating
   * @returns Promise with the updated item
   */
  update(id: number, data: Partial<Omit<T, 'id'>>): Promise<{ 
    item: T 
  }>

  /**
   * Delete an item
   * @param id ID of the item to delete
   */
  delete(id: number): Promise<void>
}
