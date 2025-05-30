<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Forgot your password?
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <UCard class="dark:border-gray-700">
        <form class="space-y-6" @submit.prevent="handleForgotPassword">
          <UFormField label="Email" required>
            <UInput
              v-model="email"
              type="email"
              autocomplete="email"
              required
            />
          </UFormField>

          <div class="flex items-center justify-between">
            <NuxtLink
              to="/auth/login"
              class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Back to login
            </NuxtLink>
          </div>

          <div>
            <UButton
              type="submit"
              color="primary"
              block
              :loading="loading"
            >
              Send Reset Link
            </UButton>
          </div>
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'



const { forgotPassword } = useAuth()
const loading = ref(false)
const email = ref('')
const toast = useToast()

definePageMeta({
  layout: 'auth'
})

const handleForgotPassword = async () => {
  if (!email.value) {
    toast.add({
      title: 'Error',
      description: 'Please enter your email address',
      color: 'error'
    })
    return
  }

  try {
    loading.value = true
    await forgotPassword({ email: email.value })
    toast.add({
      title: 'Success',
      description: 'Reset password link has been sent to your email',
      color: 'success'
    })
    email.value = ''
  } catch (err) {
    toast.add({
      title: 'Error',
      description: err instanceof Error ? err.message : 'Failed to send reset link',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>
