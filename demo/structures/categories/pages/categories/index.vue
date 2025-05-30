<template>
  <div>
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Categories</h1>
        <div class="flex items-center gap-4">
          <div class="flex items-center space-x-2">
            <UButtonGroup size="xl" class="border border-gray-200 dark:border-gray-800 rounded-md">
              <UButton
                :color="store.viewMode === 'grid' ? 'primary' : 'neutral'"
                @click="store.setViewMode('grid')"
                icon="i-heroicons-squares-2x2"
                variant="ghost"
                size="sm"
              />
              <UButton
                :color="store.viewMode === 'table' ? 'primary' : 'neutral'"
                @click="store.setViewMode('table')"
                icon="i-heroicons-table-cells"
                variant="ghost"
                size="sm"
              />
            </UButtonGroup>
          </div>
        
          <UButton
            color="primary"
            icon="i-heroicons-plus"
            @click="modalState.add.isOpen = true"
          >
            Add Category
          </UButton>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="mt-6 flex py-5 justify-between items-center">
        <BasePerPage
          :pageSize="store.pagination.pageSize"
          @update:pageSize="handlePageSizeChange"
          :options="getPageSizeOptions()"
        />
      
        <BasePagination
          :total="store.pagination.total"
          :page="store.pagination.page"
          :items-per-page="store.pagination.pageSize"
          :total-pages="store.pagination.totalPages"
          @update:page="handlePageChange"
        />
      </div>
      <!-- Page Content -->
      <CategoryGrid 
        v-if="store.viewMode === 'grid' && store.items.length > 0" 
        :category="store.items" 
        @edit="editCategory" 
        @delete="deleteCategory" 
        @view="viewCategory"
        :current-page="store.pagination.page"
        :page-size="store.pagination.pageSize"
      />
      <CategoryTable 
        v-else-if="store.viewMode === 'table' && store.items.length > 0"
        :category="store.items" 
        @edit="editCategory" 
        @delete="deleteCategory" 
        @view="viewCategory"
        :current-page="store.pagination.page"
        :page-size="store.pagination.pageSize"
      />

      <!-- Empty State -->
      <div v-if="store.items.length === 0" class="text-center py-12">
        <h3 class="mt-4 text-lg font-medium text-gray-900">No Categories</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
        <div class="mt-6">
          <UButton color="primary" @click="modalState.add.isOpen = true">
            Add Category
          </UButton>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AddCategoryModal
      v-model="modalState.add.isOpen" 
      @category-added="handleCategoryAdded"
    />
    
    <EditCategoryModal
      v-model:open="modalState.edit.isOpen" 
      :category="modalState.edit.category"
      :loading="modalState.edit.loading"
      @submit="handleEditSubmit"
    />
    
    <ViewCategoryModal
      v-model:open="modalState.view.isOpen" 
      :category="modalState.view.category"
    />
    
    <DeleteCategoryModal
      v-model:open="modalState.delete.isOpen" 
      :category="modalState.delete.category"
      :loading="modalState.delete.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCategoriesStore } from '../../stores/categoriesStore'
import type { Category } from '../../stores/category'
import { format } from 'date-fns'

interface ModalState {
  add: {
    isOpen: boolean
    loading?: boolean
  }
  edit: {
    isOpen: boolean
    category?: Category
    loading?: boolean
  }
  view: {
    isOpen: boolean
    category?: Category
  }
  delete: {
    isOpen: boolean
    category?: Category
    loading?: boolean
  }
}

const store = useCategoriesStore()

const modalState = ref<ModalState>({
  add: { isOpen: false },
  edit: { isOpen: false },
  view: { isOpen: false },
  delete: { isOpen: false }
})


onMounted(async () => {
  await store.fetch()
})

function formatDate(dateString: string) {
  try {
    return format(new Date(dateString), 'PPP')
  } catch (e) {
    return dateString
  }
} 

function editCategory(category: Category) {
  modalState.value.edit.category = category
  modalState.value.edit.isOpen = true
}

function viewCategory(category: Category) {
  modalState.value.view.category = category
  modalState.value.view.isOpen = true
}

function deleteCategory(category: Category) {
  modalState.value.delete.category = category
  modalState.value.delete.isOpen = true
}

function switchViewToEdit() {
  const category = modalState.value.view.category
  closeModal('view')
  if (category) {
    editCategory(category)
  }
}

function closeModal(type: 'add' | 'edit' | 'view') {
  modalState.value[type].isOpen = false
  if (type === 'edit' || type === 'view') {
    modalState.value[type].category = undefined
  }
}

function handlePageChange(page: number) {
  console.log('handlePageChange called with page:', page)
  store.pagination.page = page
  store.fetch(page) // Explicitly pass the page parameter
}

function handlePageSizeChange(size: number) {
  store.pagination.pageSize = size
  store.pagination.page = 1
  store.fetch()
}

function getPageSizeOptions() {
  // Common options that work for both grid and table views
  const commonOptions = [12, 24, 36, 48, 60, 100]
  
  // If the current pageSize isn't in our options, add it to ensure it's always available
  if (!commonOptions.includes(store.pagination.pageSize)) {
    return [store.pagination.pageSize, ...commonOptions].sort((a, b) => a - b)
  }
  
  return commonOptions
}

async function handleCategoryAdded(data: Partial<Category>) {
  modalState.value.add.loading = true
  try {
    await store.create(data)
    modalState.value.add.isOpen = false
  } catch (error) {
    console.error('Error adding category:', error)
  } finally {
    modalState.value.add.loading = false
  }
}

async function handleEditSubmit(id: number, data: Partial<Category>) {
  modalState.value.edit.loading = true
  try {
    await store.update(id, data)
    modalState.value.edit.isOpen = false
  } catch (error) {
    console.error('Error updating category:', error)
  } finally {
    modalState.value.edit.loading = false
  }
}

async function confirmDelete(id: number) {
  modalState.value.delete.loading = true
  try {
    await store.delete(id)
    modalState.value.delete.isOpen = false
  } catch (error) {
    console.error('Error deleting category:', error)
  } finally {
    modalState.value.delete.loading = false
  }
}
</script>
