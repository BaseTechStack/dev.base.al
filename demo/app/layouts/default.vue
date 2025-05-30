<template>
  <div class="h-screen flex overflow-hidden">
    <ClientOnly>
      <!-- Sidebar -->
      <AppTheSidebar class="h-screen flex-shrink-0" />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 h-screen overflow-hidden">
        <AppTheHeader class="w-full flex-shrink-0" />
        <main class="flex-1 p-4 overflow-y-auto">
          <slot />
        </main>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// No script needed for basic layout
</script>