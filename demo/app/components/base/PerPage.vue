<script setup lang="ts">
 import { computed } from 'vue'

const props = withDefaults(defineProps<{
  pageSize: number
  options?: number[]
}>(), {
  pageSize: 12,
  options: () => [10, 20, 50, 100]
})

const emit = defineEmits<{
  'update:pageSize': [value: number]
}>()

const items = computed(() => {
  return props.options.map(value => value.toString())
})

const selectedValue = computed({
  get: () => props.pageSize.toString(),
  set: (newValue: string) => {
    const numValue = parseInt(newValue, 10)
    emit('update:pageSize', numValue)
  }
})
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-sm text-gray-600 dark:text-gray-400">Per page:</span>
 
    <USelect
      v-model="selectedValue"
      :items="items"
      size="sm"
      class="w-24"
    />
  </div>
</template>