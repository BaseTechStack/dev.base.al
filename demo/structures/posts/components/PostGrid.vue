<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <PostGridCard 
      v-for="post in posts" 
      :key="post.id" 
      :item="post"
      title="id"
      subtitle="content"
      :fields="[
        
        
        
        
        
      ]"
      timestamp="createdAt"
      hover
    >
      <template #actions>
        <BaseCrudActions 
          structure="posts"
          :item="post" 
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
          @click="$emit('view', post)"
        >
          View Details
        </UButton>
      </template>
    </PostGridCard>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '../stores/post'
import { computed } from 'vue'

const props = defineProps<{
  post: Post[]
}>()

const posts = computed(() => props.post)

defineEmits<{
  (e: 'view', post: Post): void
  (e: 'edit', post: Post): void
  (e: 'delete', post: Post): void
}>()
</script>
