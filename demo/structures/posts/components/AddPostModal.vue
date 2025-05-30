<template>
  <UModal 
    v-model:open="isOpen" 
    :title="title || 'New Post'"
    :description="description || 'Add a new post to your system'"
  >
    <template #body>
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          
          <UFormField label="Title" >
            
            <UInput 
              v-model="formData.title" 
               
              type="text"
            />
            
          </UFormField>
          
          <UFormField label="Content" >
            
            <UInput 
              v-model="formData.content" 
               
              type="text"
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
          Save
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import type { Post } from '../stores/post'

const props = defineProps<{
  modelValue?: boolean
  title?: string
  description?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: Partial<Post>): void
  (e: 'post-added', data: Partial<Post>): void
}>()

const isOpen = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const formData = reactive<Partial<Post>>({
  
  title: '',
  
  content: '',
  
})

function closeModal() {
  isOpen.value = false
  
  // Reset form data
  
  formData.title = ''
  
  formData.content = ''
  
}

function handleSubmit() {
  emit('post-added', { ...formData })
  closeModal()
}
</script>
