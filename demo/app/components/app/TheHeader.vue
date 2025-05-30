<template>
  <header class="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 relative z-10 h-16 flex-shrink-0">
    <div class="px-4 flex h-full items-center justify-between">
      <div class="flex-1">
        <h1 class="text-lg uppercase font-semibold text-gray-900 dark:text-white">
          <slot name="title">Dashboard</slot>
        </h1>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Notification Button -->
        <UButton
          icon="i-heroicons-bell"
          color="primary"
          variant="ghost"
          class="relative"
        >
          <span
            class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"
          />
        </UButton>

        <!-- Color Mode -->
        <BaseColorMode />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Components are auto-imported by Nuxt
</script>