<template>
    <div class="min-h-screen flex">
        <Teleport v-if="isHydrated" to="body">
            <div class="fixed top-4 right-4 z-50">
                <BaseColorMode />
            </div>
        </Teleport>
        <main class="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <slot />
        </main>
    </div>
</template>

<script setup>
import { Teleport } from 'vue'
import { useNuxtApp } from '#app'

const nuxtApp = useNuxtApp()
const isHydrated = ref(false)

onMounted(() => {
    // Wait for Nuxt hydration to complete
    nuxtApp.hook('app:mounted', () => {
        isHydrated.value = true
    })
})
</script>