<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <CategoryGridCard 
      v-for="category in categories" 
      :key="category.id" 
      :item="category"
      title="id"
      subtitle="slug"
      :fields="[
        
        
        
        
        
        { key: 'image', label: 'Image' },
        
      ]"
      timestamp="createdAt"
      hover
    >
      <template #actions>
        <BaseCrudActions 
          structure="categories"
          :item="category" 
          actions="view,edit,delete"
          @view="$emit('view', $event)"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </template>
      
      <template #footer-actions>
        <UButton
          size="xs"
          color="primary"
          variant="ghost"
          icon="i-heroicons-eye"
          @click="$emit('view', category)"
        >
          View Details
        </UButton>
      </template>
    </CategoryGridCard>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '../stores/category'
import { computed } from 'vue'

const props = defineProps<{
  category: Category[]
}>()

const categories = computed(() => props.category)

defineEmits<{
  (e: 'view', category: Category): void
  (e: 'edit', category: Category): void
  (e: 'delete', category: Category): void
}>()
</script>
