import type { BaseItem } from '@@/app/stores/baseStore'

/**
 * Category entity interface
 */
export interface Category extends BaseItem {
  title?: string;
  slug?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Utility functions for Category entity
 */
export class CategoryModel {
  /**
   * Factory method to create a Category from JSON data
   * Handles conversion from snake_case to camelCase
   */
  static fromJson(json: Record<string, any>): Category {
    // Helper function to convert camelCase to snake_case
    const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    
    // Helper function to get value from either camelCase or snake_case key
    const getValue = (obj: Record<string, any>, camelKey: string) => {
      if (obj[camelKey] !== undefined) return obj[camelKey]
      const snakeKey = toSnakeCase(camelKey)
      return obj[snakeKey]
    }
    
    return {
      id: Number(json.id),
      title: getValue(json, 'title'),
      slug: getValue(json, 'slug'),
      image: getValue(json, 'image'),
      createdAt: getValue(json, 'createdAt'),
      updatedAt: getValue(json, 'updatedAt')
    }
  }

  /**
   * Factory method to create a list of Category from JSON data
   */
  static fromJsonList(jsonList: Record<string, any>[]): Category[] {
    return jsonList.map(json => this.fromJson(json))
  }

  /**
   * Convert Category to JSON format (for API requests)
   * Optionally converts camelCase to snake_case
   */
  static toJson(entity: Partial<Category>, useSnakeCase: boolean = false): Record<string, any> {
    if (!useSnakeCase) {
      return { ...entity }
    }
    
    // Convert to snake_case for API
    const result: Record<string, any> = {}
    
    Object.entries(entity).forEach(([key, value]) => {
      // Convert camelCase to snake_case
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      result[snakeKey] = value
    })
    
    return result
  }
}
