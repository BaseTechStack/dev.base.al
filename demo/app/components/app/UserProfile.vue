<template>
    <div v-if="user" class="flex items-center gap-3">
        <UPopover>
            <UButton
                color="neutral"
                variant="ghost"
                class="flex items-center gap-3"
            >
                <UAvatar :src="user.avatar_url" size="sm" />
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user.email }}</p>
                </div>
                <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 ml-2" />
            </UButton>

            <template #content>
                <div class="p-1 min-w-48">
                    <UButton
                        to="/app/settings"
                        variant="ghost"
                        color="neutral"
                        class="justify-start w-full mb-1"
                    >
                        <template #leading>
                            <UIcon name="i-heroicons-cog-6-tooth" />
                        </template>
                        Settings
                    </UButton>
                    <UButton
                        @click="handleLogout"
                        variant="ghost"
                        color="error"
                        class="justify-start w-full"
                    >
                        <template #leading>
                            <UIcon name="i-heroicons-arrow-left-on-rectangle" />
                        </template>
                        Logout
                    </UButton>
                </div>
            </template>
        </UPopover>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'
 
const authStore = useAuthStore()
const toast = useToast()
 
const user = computed(() => authStore.getUser)

const handleLogout = async () => {
    try {
        await authStore.logout()
        toast.add({
            title: 'Success',
            description: 'Successfully logged out',
            color: 'success'
        })
    } catch (error) {
        toast.add({
            title: 'Error',
            description: 'Failed to logout',
            color: 'error'
        })
        console.error('Logout error:', error)
    }
}

</script>