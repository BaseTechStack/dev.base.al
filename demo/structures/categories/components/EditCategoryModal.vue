<template>
  <UModal 
    v-model:open="isOpen" 
    :title="title || 'Edit Category'"
    :description="description || 'Update this category'"
  >
    <template #body>
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          
          <UFormField label="Title" >
            
            <UInput 
              v-model="formData.title" 
              
              
                
                
                
                
              
              
            />
            
          </UFormField>
          
          <UFormField label="Slug" >
            
            <UInput 
              v-model="formData.slug" 
              
              
                
                
                
                
              
              
            />
            
          </UFormField>
          
          <UFormField label="Image" >
            
            <UInput 
              v-model="formData.image" 
              
              
                
                
                
                
              
              
            />
            
          </UFormField>
          
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          @click="closeModal"
        >
          Cancel
        </UButton>
        <UButton
          color="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          Update
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import type { Category } from '../stores/category'

const props = defineProps<{
  open?: boolean
  category?: Category
  title?: string
  description?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', id: number, data: Partial<Category>): void
}>()

const isOpen = computed({
  get() {
    return props.open
  },
  set(value) {
    emit('update:open', value)
  }
})

const formData = reactive<Partial<Category>>({
  
  title: '',
  
  slug: '',
  
  image: '',
  
})

// Watch for changes to the category prop and update form data
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    
    formData.title = newCategory.title || ''
    
    formData.slug = newCategory.slug || ''
    
    formData.image = newCategory.image || ''
    
  }
}, { immediate: true })

function closeModal() {
  isOpen.value = false
}

function handleSubmit() {
  if (props.category?.id) {
    emit('submit', props.category.id, { ...formData })
  }
  closeModal()
}
</script>
