<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  total: number
  pageCount?: number
  itemsPerPage?: number
  totalPages?: number // Add support for directly passing totalPages
}>()

const emit = defineEmits<{
  'update:page': [page: number]
}>()

// For debugging
function onPageChange(newPage: number) {
   emit('update:page', newPage)
}

// Calculate page count from total and page size, or use totalPages directly
const computedPageCount = computed(() => {
  if (props.totalPages) {
    return props.totalPages
  }
  if (props.pageCount) {
    return props.pageCount
  }
  if (props.total && props.itemsPerPage) {
    return Math.max(1, Math.ceil(props.total / props.itemsPerPage))
  }
  return 1
})

// This is equivalent to the example in the docs: v-model="page"
const modelValue = computed({
  get: () => props.page,
  set: (value: number) => onPageChange(value)
})
</script>

<template>
  <div>
    
    <UPagination
    v-model:page="modelValue"
      :total="total"
      :items-per-page="itemsPerPage"
      :page-count="computedPageCount"
    />
  </div>
</template>
