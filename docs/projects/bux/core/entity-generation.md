---
title: Entity Generation
---

# BaseUX Entity Generation

The entity generation system is one of the most powerful features of BaseUX. It allows you to scaffold complete CRUD modules with a single command, accelerating development and ensuring consistency across your application.

## Entity Generation Command

To generate a new entity, use the `bux g` (or `bux generate`) command:

```bash
bux g Entity field1:type field2:type field3:type
```

For example, to generate a Products entity:

```bash
bux g Product name:string description:text price:number category:string:required
```

This command will generate a complete set of files for the Products entity, including:

- Models and types
- Store for state management
- Services for API communication
- Components for UI
- Pages for routing

## Generated Structure

When you generate an entity, BaseUX creates a new directory in the `structures` folder with the following structure:

```
structures/
└── products/
    ├── components/
    │   ├── AddProductModal.vue
    │   ├── DeleteProductModal.vue
    │   ├── EditProductModal.vue
    │   ├── ProductGrid.vue
    │   ├── ProductGridCard.vue
    │   ├── ProductTable.vue
    │   └── ViewProductModal.vue
    ├── composables/
    │   └── useProducts.ts
    ├── pages/
    │   └── products/
    │       └── index.vue
    ├── services/
    │   └── productService.ts
    ├── stores/
    │   ├── product.ts
    │   └── productsStore.ts
    └── nuxt.config.ts
```

## Entity Model

The entity model is defined in `structures/products/stores/product.ts` and includes:

- TypeScript interface for the entity
- Model class for data transformation

```typescript
// structures/products/stores/product.ts
import type { BaseItem } from '@@/app/stores/baseStore'

/**
 * Product entity interface
 */
export interface Product extends BaseItem {
  id: number
  name: string
  description?: string
  price: number
  category?: string
  createdAt: string
  updatedAt: string
}

/**
 * Utility functions for Product entity
 */
export class ProductModel {
  /**
   * Factory method to create a Product from JSON data
   * Handles conversion from snake_case to camelCase
   */
  static fromJson(json: Record<string, any>): Product {
    return {
      id: Number(json.id),
      name: json.name,
      description: json.description,
      price: Number(json.price),
      category: json.category,
      createdAt: json.created_at || json.createdAt,
      updatedAt: json.updated_at || json.updatedAt
    }
  }
  
  static fromJsonList(jsonList: Record<string, any>[]): Product[] {
    return jsonList.map(json => this.fromJson(json))
  }
  
  static toJson(product: Partial<Product>, useSnakeCase: boolean = true): Record<string, any> {
    if (!useSnakeCase) {
      return { ...product }
    }
    
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      created_at: product.createdAt,
      updated_at: product.updatedAt
    }
  }
}
```

## Entity Store

The entity store is defined in `structures/products/stores/productsStore.ts` and includes:

- State management
- CRUD operations
- UI state (view mode, pagination)

```typescript
// structures/products/stores/productsStore.ts
import type { Product } from './product'
import { ProductModel } from './product'
import { defineStore } from 'pinia'
import { useProductService } from '../services/productService'

const VIEW_MODE_KEY = 'products_view_mode'

export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [] as Product[],
    loading: false,
    error: null as string | null,
    viewMode: (typeof window !== 'undefined' ? 
      localStorage.getItem(VIEW_MODE_KEY) as 'grid' | 'table' : null) || 'grid',
    pagination: {
      total: 0,
      page: 1,
      pageSize: 12,
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
    
    // CRUD operations
    async fetch(page?: number, pageSize?: number) {
      this.loading = true
      try {
        const service = useProductService()
        const { items, pagination } = await service.fetch(page, pageSize)
        this.items = items
        this.setPagination(pagination)
        return { items, pagination }
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // Other CRUD actions...
    
    // Entity-specific methods
    async fetchProducts(page?: number, pageSize?: number) {
      return this.fetch(page, pageSize)
    },
    
    async createProduct(data: Omit<Product, 'id'>) {
      return this.create(data)
    },
    
    async updateProduct(id: number, data: Partial<Omit<Product, 'id'>>) {
      return this.update(id, data)
    },
    
    async deleteProduct(id: number) {
      return this.delete(id)
    }
  }
})
```

## Entity Service

The entity service is defined in `structures/products/services/productService.ts` and includes:

- API communication
- Data transformation

```typescript
// structures/products/services/productService.ts
import type { Product } from '../stores/product'
import { ProductModel } from '../stores/product'
import type { BaseService } from '@@/app/services/baseService'
import { useProducts } from '../composables/useProducts'
import type { BasePagination } from '@@/app/types/base'

export const useProductService = (): BaseService<Product> => {
  const productsApi = useProducts()
  
  return {
    async fetch(page = 1, pageSize = 10): Promise<{ items: Product[], pagination: BasePagination }> {
      const result = await productsApi.fetchProducts(page, pageSize)
      return {
        items: ProductModel.fromJsonList(result.products),
        pagination: result.pagination
      }
    },
    
    // Other CRUD methods...
  }
}
```

## Entity Components

BaseUX generates several UI components for each entity:

### List Views

- `ProductGrid.vue`: Card-based grid view
- `ProductTable.vue`: Table view with sorting and filtering

### CRUD Modals

- `AddProductModal.vue`: Form for creating new products
- `EditProductModal.vue`: Form for editing existing products
- `ViewProductModal.vue`: Detailed view of a product
- `DeleteProductModal.vue`: Confirmation dialog for deletion

### Main Page

The main entity page at `structures/products/pages/products/index.vue` includes:

- Toggle between grid and table view
- Add button
- Pagination
- CRUD modal management

## Field Types

BaseUX supports various field types when generating entities:

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text field | `name:string` |
| `text` | Longer text field | `description:text` |
| `number` | Numeric field | `price:number` |
| `boolean` | True/false field | `inStock:boolean` |
| `date` | Date field | `releaseDate:date` |
| `datetime` | Date with time | `createdAt:datetime` |
| `email` | Email field | `contact:email` |
| `select` | Dropdown selection | `status:select:draft,published,archived` |
| `relation` | Entity relation | `author:relation:users` |

## Field Options

You can add options to fields using the following syntax:

```bash
fieldName:type:option1,option2
```

Common options include:

- `required`: Field is required
- `unique`: Field must be unique
- `min:X`: Minimum value/length
- `max:X`: Maximum value/length
- `default:X`: Default value

Example:

```bash
bux g Product name:string:required,min:3 price:number:required,min:0 category:select:electronics,clothing,food:default:electronics
```

## Customizing Generated Entities

After generation, you can customize the generated files to match your specific requirements:

1. **Add Custom Fields**: Modify the entity interface and model
2. **Customize UI**: Edit the component templates
3. **Add Business Logic**: Enhance the store with custom actions
4. **Implement Validation**: Add validation rules to forms

## Best Practices

### 1. Plan Your Entity Structure

- Determine the fields and relationships before generation
- Use appropriate field types and options
- Consider how entities relate to each other

### 2. Use Descriptive Field Names

- Use clear, descriptive field names
- Follow a consistent naming convention
- Consider how fields will be displayed in the UI

### 3. Generate Early

- Generate entities early in the development process
- Customize as needed after generation
- Regenerate if significant changes are needed

### 4. Customize Thoughtfully

- Make targeted customizations to generated code
- Document any significant changes
- Consider creating custom templates for repeated patterns

### 5. Test Generated Code

- Verify that generated CRUD operations work correctly
- Test validation rules and error handling
- Ensure responsive behavior of UI components
