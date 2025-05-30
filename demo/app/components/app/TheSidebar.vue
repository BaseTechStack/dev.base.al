<template>
<aside class="h-screen w-64 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
    <div class="p-4 h-16 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">demo</h1>
    </div>
    <div class="flex-1 overflow-y-auto py-4">
        <ClientOnly>
            <UNavigationMenu
                color="neutral"
                orientation="vertical"
                :items="mainNavItems"
                class="w-full"
            />
        </ClientOnly>
    </div>
    <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <ClientOnly>
            <UNavigationMenu
                color="neutral"
                orientation="vertical"
                :items="bottomNavItems"
                class="w-full"
            />
            <AppUserProfile class="mt-4" />
        </ClientOnly>
    </div>
</aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const mainNavItems = ref([
    {
        label: 'Dashboard',
        icon: 'i-heroicons-home',
        to: '/app/dashboard'
    }
,
    {
        label: 'Posts',
        icon: 'i-heroicons-document-text',
        to: '/posts'
    },
    {
        label: 'Categories',
        icon: 'i-heroicons-document-text',
        to: '/categories'
    }])

const bottomNavItems = ref([
    {
        label: 'Settings',
        icon: 'i-heroicons-cog-6-tooth',
        to: '/app/settings'
    }
])
</script>