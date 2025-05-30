<template>
  <USlideover
    v-model:open="isOpen"
    title="View Category"
    description="View the details of this Category."
  >

    <template #body>
      <div class="space-y-6 p-4">
        <div v-for="field in fields" :key="field.label" class="space-y-1">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ field.label }}</div>
          <div>{{ field.value }}</div>
        </div>
        
        <div v-if="item" class="space-y-1">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Created</div>
          <div>{{ formatDate(item.createdAt) }}</div>
        </div>
        
        <div v-if="item" class="space-y-1">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Updated</div>
          <div>{{ formatDate(item.updatedAt) }}</div>
        </div>
      </div>
    </template>
    
    <template #footer>
      <div class="flex justify-end p-4">
        <UButton
          variant="soft"
          color="neutral"
          @click="isOpen = false"
        >
          Close
        </UButton>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { format } from 'date-fns'
import { useCategoriesStore } from '../stores/categoriesStore'
import type { Category } from '../stores/category'
import { CategoryModel } from '../stores/category'

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  try {
    return format(new Date(dateString), 'PPP')
  } catch (e) {
    return dateString
  }
}

const categoriesStore = useCategoriesStore()

const props = defineProps<{
  open?: boolean
  category?: Category
  title?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

// Create a computed property for v-model binding with USlideover
const isOpen = computed({
  get() {
    return props.open
  },
  set(value) {
    emit('update:open', value)
  }
})

// No need for a computed title as we're using a hardcoded one

const item = ref<Category | null>(null)
const fields = ref<{label: string, value: any}[]>([])

const populateFields = () => {
  if (!item.value) return
  
  fields.value = [
    
    { 
      label: 'Title', 
      value: item.value.title
    },
    
    { 
      label: 'Slug', 
      value: item.value.slug
    },
    
    { 
      label: 'Image', 
      value: item.value.image
    },
    
  ]
}

const fetchData = () => {
  if (props.category) {
    // Convert the raw data to a proper model instance if needed
    if (props.category.created_at && !props.category.createdAt) {
      item.value = CategoryModel.fromJson(props.category as any)
    } else {
      item.value = props.category
    }
    populateFields()
  }
}

watch(isOpen, (newVal) => {
  if (newVal && props.category) {
    fetchData()
  } else {
    item.value = null
    fields.value = []
  }
})

watch(() => props.category, (newVal) => {
  if (isOpen.value && newVal) {
    fetchData()
  }
})
</script>
