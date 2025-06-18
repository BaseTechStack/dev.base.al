---
title: Module Features
---

# BaseUX Module Features

BaseUX's module system is one of its most powerful features, allowing you to organize your application into standalone entity modules. These modules are located in the `structures` directory and are automatically integrated into your application through Nuxt's layers feature.

## Anatomy of a Module

Each entity module in BaseUX follows a consistent structure:

```
structures/
└── [entity-name]/
    ├── components/    # Entity-specific UI components
    ├── composables/   # Entity-specific composables
    ├── pages/         # Entity-specific pages/routes
    ├── services/      # Entity-specific API services
    ├── stores/        # Entity-specific state management
    └── nuxt.config.ts # Entity layer configuration
```

## Data Flow
Data flows from composables, to services, to stores, to components.

### Composables

Composables are the entry point for data flow. They provide access to the entity's API and state management. They return JSON data from the API.

### Services

Services handle API communication and provide a clean interface for the composables to use. The convert JSON data to the entity's model.

### Stores

Stores manage the entity's state and provide a clean interface for the components to use. They use Pinia as state management.
Provides CRUD operations. Reactivity to fields.

### Components

Components display the entity's data and provide a clean interface for the users to interact with. They use the stores to get the data. We encourage to use the components as much as possible to keep the code DRY. 

### Pages

Pages are the entry point for the entity's data. They use the stores to get the data. All pages are auto routed via Nuxt Pages feature. Pages need to have structre name directory, for example `structures/categories/pages/categories/index.vue` will be auto routed to `/categories`.
 
## Auto Loading

All entities are auto loaded via Nuxt auto import feature. You can import any entity from the `structures` directory. For example, you can import the `Category` entity from `structures/categories/stores/category.ts`.
If Component is in directory, add directory name in front of the component name. For example, `structures/categories/components/category/grid.vue` can be auto imported as `CategoryGrid` from `categories/components/category/grid.vue`.


## Entity Generation System

BaseUX's entity generation system automatically creates a complete CRUD module for each entity. For example, when you run:

```bash
bux g Category title:string slug:string image:string
```

It generates the following files:

### Entity Model

Located in `structures/categories/stores/category.ts`, the model defines the entity's structure and provides utilities for data transformation:

```typescript
export interface Category extends BaseItem {
  title?: string;
  slug?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export class CategoryModel {
  // Factory methods to convert between API and frontend formats
  static fromJson(json: Record<string, any>): Category {
    // Conversion logic from API to frontend format
  }
  
  static fromJsonList(jsonList: Record<string, any>[]): Category[] {
    return jsonList.map(json => this.fromJson(json))
  }
  
  static toJson(entity: Partial<Category>, useSnakeCase: boolean = false): Record<string, any> {
    // Conversion logic from frontend to API format
  }
}
```

### Entity Store

Located in `structures/categories/stores/categoriesStore.ts`, the store manages the entity's state and provides CRUD operations:

```typescript
export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    items: [] as Category[],
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
    // View mode management
    setViewMode(mode: 'grid' | 'table') { /* ... */ },
    
    // CRUD operations
    async fetch(page?: number, pageSize?: number) { /* ... */ },
    async fetchById(id: number) { /* ... */ },
    async create(data: Omit<Category, 'id'>) { /* ... */ },
    async update(id: number, data: Partial<Omit<Category, 'id'>>) { /* ... */ },
    async delete(id: number) { /* ... */ },
    
    // Entity-specific methods
    async fetchCategories(page?: number, pageSize?: number) { /* ... */ },
    async createCategory(data: Omit<Category, 'id'>) { /* ... */ },
    async updateCategory(id: number, data: Partial<Omit<Category, 'id'>>) { /* ... */ },
    async deleteCategory(id: number) { /* ... */ }
  }
})
```

### Entity Service

Located in `structures/categories/services/categoryService.ts`, the service handles API communication:

```typescript
export const useCategoryService = (): BaseService<Category> => {
  const categoriesApi = useCategories()
  
  return {
    async fetch(page = 1, pageSize = 10): Promise<{ items: Category[], pagination: BasePagination }> {
      const result = await categoriesApi.fetchCategories(page, pageSize)
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
```

### Entity Composable

Located in `structures/categories/composables/useCategories.ts`, the composable provides direct API access:

```typescript
export const useCategories = () => {
  const config = useRuntimeConfig()
  
  return {
    async fetchCategories(page = 1, pageSize = 10) {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we return mock data
        return {
          categories: mockCategories,
          pagination: {
            total: mockCategories.length,
            page,
            pageSize,
            totalPages: Math.ceil(mockCategories.length / pageSize)
          }
        }
      } catch (error: any) {
        console.error('Error fetching categories:', error)
        throw error
      }
    },
    
    // Other API methods (fetchCategoryById, createCategory, etc.)
  }
}
```

### Entity Components

BaseUX generates several components for each entity:

1. **List Components**:
   - `CategoryGrid.vue`: Card-based grid view of categories
   - `CategoryTable.vue`: Tabular view of categories with sorting and filtering
   - `CategoryGridCard.vue`: Individual card for the grid view

2. **CRUD Modal Components**:
   - `AddCategoryModal.vue`: Modal for creating new categories
   - `EditCategoryModal.vue`: Modal for editing existing categories
   - `ViewCategoryModal.vue`: Modal for viewing category details
   - `DeleteCategoryModal.vue`: Confirmation modal for deleting categories

### Entity Pages

Located in `structures/categories/pages/categories/index.vue`, the main page for the entity provides a complete UI:

```vue
<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Categories</h1>
      
      <div class="flex items-center space-x-2">
        <!-- View mode toggle -->
        <UButtonGroup size="sm">
          <UButton 
            :color="categoriesStore.viewMode === 'grid' ? 'primary' : 'gray'" 
            @click="categoriesStore.setViewMode('grid')"
            icon="i-heroicons-squares-2x2"
          />
          <UButton 
            :color="categoriesStore.viewMode === 'table' ? 'primary' : 'gray'" 
            @click="categoriesStore.setViewMode('table')"
            icon="i-heroicons-table-cells"
          />
        </UButtonGroup>
        
        <!-- Add button -->
        <UButton 
          color="primary"
          icon="i-heroicons-plus"
          @click="showAddModal = true"
        >
          Add Category
        </UButton>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <ULoader v-if="categoriesStore.loading" class="my-8" />
    
    <!-- Grid or Table view based on viewMode -->
    <ClientOnly>
      <template v-if="!categoriesStore.loading">
        <CategoryGrid
          v-if="categoriesStore.viewMode === 'grid'"
          @view="openViewModal"
          @edit="openEditModal"
          @delete="openDeleteModal"
        />
        
        <CategoryTable
          v-else
          :actions="['view', 'edit', 'delete']"
          @view="openViewModal"
          @edit="openEditModal"
          @delete="openDeleteModal"
        />
      </template>
    </ClientOnly>
    
    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center">
      <BasePerPage
        :page-size="categoriesStore.pagination.pageSize"
        @update:page-size="categoriesStore.setPageSize($event)"
      />
      
      <BasePagination
        v-model:page="categoriesStore.pagination.page"
        :total-pages="categoriesStore.pagination.totalPages"
        @update:page="categoriesStore.fetch($event)"
      />
    </div>
    
    <!-- CRUD Modals -->
    <AddCategoryModal
      v-model:open="showAddModal"
      @created="handleCreated"
    />
    
    <EditCategoryModal
      v-model:open="showEditModal"
      :category-id="selectedCategoryId"
      @updated="handleUpdated"
    />
    
    <ViewCategoryModal
      v-model:open="showViewModal"
      :category-id="selectedCategoryId"
    />
    
    <DeleteCategoryModal
      v-model:open="showDeleteModal"
      :category-id="selectedCategoryId"
      @deleted="handleDeleted"
    />
  </div>
</template>

<script setup>
// Script setup with component logic
</script>
```

## Nuxt Layer Configuration

Each entity module includes its own `nuxt.config.ts` file that configures it as a Nuxt layer:

```typescript
// structures/categories/nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
})
```

The main `nuxt.config.ts` file extends these entity layers:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // ...
  extends: ['./structures/posts', './structures/categories'],
  // ...
})
```

## Component Reusability Across Entities

BaseUX implements a flexible prop naming convention to enhance component reusability:

- Components accept entity-specific props (e.g., `:category` for categories)
- They also support generic props (e.g., `:item`) for cross-entity usage
- This prevents "Missing required prop" warnings while maintaining expected interfaces

For example, a component can be used in multiple contexts:

```vue
<!-- When used specifically with categories -->
<CategoryGrid :category="selectedCategory" />

<!-- When used in a generic context -->
<CategoryGrid :item="selectedItem" />
```

## Key Benefits of Module Features

1. **Code Organization**: Each entity lives in its own directory
2. **Standardization**: All entities follow the same structure
3. **Rapid Development**: Generate complete CRUD functionality with a single command
4. **Isolation**: Changes to one entity don't affect others
5. **Extensibility**: Easily extend or override generated code
6. **Maintenance**: Clear separation makes maintenance easier
7. **Scalability**: Add new entities without bloating existing code

## Customizing Generated Entities

While BaseUX generates complete entity modules, you can customize them to fit your specific needs:

1. **Modify Components**: Edit generated components to add custom UI elements
2. **Extend Store Actions**: Add custom actions to the entity store
3. **Customize API Integration**: Modify the service layer to match your API
4. **Add Custom Fields**: Update the entity model with additional fields
5. **Create Custom Pages**: Add additional pages beyond the default index page

## Best Practices for Working with Modules

1. **Use the CLI**: Always use the CLI to generate entities to ensure consistency
2. **Keep Entities Focused**: Each entity should represent a single business object
3. **Reuse Components**: Create shared components for common patterns
4. **Type Everything**: Maintain TypeScript types for all entity properties
5. **Document Customizations**: Add comments for any customizations you make
