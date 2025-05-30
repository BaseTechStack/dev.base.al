<template>
  <footer class="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 h-16 flex-shrink-0 z-10">
    <div class="h-full flex items-center justify-between px-6">
      <!-- Left side: Copyright -->
      <div class="text-sm text-gray-500 dark:text-gray-400">
        &copy; {{ new Date().getFullYear() }} demo. All rights reserved.
      </div>
      
      <!-- Right side: Dynamic content -->
      <div class="flex items-center">
        <slot name="content">
          <!-- Default footer content if no dynamic content is provided -->
        </slot>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// The footer is designed to be dynamic based on the current route
// Components using this footer can provide content via the "content" slot
</script>
