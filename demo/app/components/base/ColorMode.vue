
<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UButton
      :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
      color="primary"
      variant="ghost"
      aria-label="Toggle color mode"
      @click="toggleColorMode"
    />

    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>
<script setup lang="ts">
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
