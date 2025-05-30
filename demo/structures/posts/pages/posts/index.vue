<template>
  <div>
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Posts</h1>
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
            Add Post
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
      <PostGrid 
        v-if="store.viewMode === 'grid' && store.items.length > 0" 
        :post="store.items" 
        @edit="editPost" 
        @delete="deletePost" 
        @view="viewPost"
        :current-page="store.pagination.page"
        :page-size="store.pagination.pageSize"
      />
      <PostTable 
        v-else-if="store.viewMode === 'table' && store.items.length > 0"
        :post="store.items" 
        @edit="editPost" 
        @delete="deletePost" 
        @view="viewPost"
        :current-page="store.pagination.page"
        :page-size="store.pagination.pageSize"
      />

      <!-- Empty State -->
      <div v-if="store.items.length === 0" class="text-center py-12">
        <h3 class="mt-4 text-lg font-medium text-gray-900">No Posts</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
        <div class="mt-6">
          <UButton color="primary" @click="modalState.add.isOpen = true">
            Add Post
          </UButton>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AddPostModal
      v-model="modalState.add.isOpen" 
      @post-added="handlePostAdded"
    />
    
    <EditPostModal
      v-model:open="modalState.edit.isOpen" 
      :post="modalState.edit.post"
      :loading="modalState.edit.loading"
      @submit="handleEditSubmit"
    />
    
    <ViewPostModal
      v-model:open="modalState.view.isOpen" 
      :post="modalState.view.post"
    />
    
    <DeletePostModal
      v-model:open="modalState.delete.isOpen" 
      :post="modalState.delete.post"
      :loading="modalState.delete.loading"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePostsStore } from '../../stores/postsStore'
import type { Post } from '../../stores/post'
import { format } from 'date-fns'

interface ModalState {
  add: {
    isOpen: boolean
    loading?: boolean
  }
  edit: {
    isOpen: boolean
    post?: Post
    loading?: boolean
  }
  view: {
    isOpen: boolean
    post?: Post
  }
  delete: {
    isOpen: boolean
    post?: Post
    loading?: boolean
  }
}

const store = usePostsStore()

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

function editPost(post: Post) {
  modalState.value.edit.post = post
  modalState.value.edit.isOpen = true
}

function viewPost(post: Post) {
  modalState.value.view.post = post
  modalState.value.view.isOpen = true
}

function deletePost(post: Post) {
  modalState.value.delete.post = post
  modalState.value.delete.isOpen = true
}

function switchViewToEdit() {
  const post = modalState.value.view.post
  closeModal('view')
  if (post) {
    editPost(post)
  }
}

function closeModal(type: 'add' | 'edit' | 'view') {
  modalState.value[type].isOpen = false
  if (type === 'edit' || type === 'view') {
    modalState.value[type].post = undefined
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

async function handlePostAdded(data: Partial<Post>) {
  modalState.value.add.loading = true
  try {
    await store.create(data as Omit<Post, 'id'>)
    modalState.value.add.isOpen = false
  } catch (error) {
    console.error('Error adding post:', error)
  } finally {
    modalState.value.add.loading = false
  }
}

async function handleEditSubmit(id: number, data: Partial<Post>) {
  modalState.value.edit.loading = true
  try {
    await store.update(id, data)
    modalState.value.edit.isOpen = false
  } catch (error) {
    console.error('Error updating post:', error)
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
    console.error('Error deleting post:', error)
  } finally {
    modalState.value.delete.loading = false
  }
}
</script>
