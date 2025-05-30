<template>
  <UModal 
    v-model:open="isOpen" 
    :title="title || 'Edit Post'"
    :description="description || 'Update this post'"
  >
    <template #body>
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          
          <UFormField label="Title" >
            
            <UInput 
              v-model="formData.title" 
              
              
                
                
                
                
              
              
            />
            
          </UFormField>
          
          <UFormField label="Content" >
            
            <UInput 
              v-model="formData.content" 
              
              
              
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
import type { Post } from '../stores/post'

const props = defineProps<{
  open?: boolean
  post?: Post
  title?: string
  description?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', id: number, data: Partial<Post>): void
}>()

const isOpen = computed({
  get() {
    return props.open
  },
  set(value) {
    emit('update:open', value)
  }
})

const formData = reactive<Partial<Post>>({
  
  title: '',
  
  content: '',
  
})

// Watch for changes to the post prop and update form data
watch(() => props.post, (newPost) => {
  if (newPost) {
    
    formData.title = newPost.title || ''
    
    formData.content = newPost.content || ''
    
  }
}, { immediate: true })

function closeModal() {
  isOpen.value = false
}

function handleSubmit() {
  if (props.post?.id) {
    emit('submit', props.post.id, { ...formData })
  }
  closeModal()
}
</script>
