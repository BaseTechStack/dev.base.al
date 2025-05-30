<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your new password below
        </p>
      </div>

      <UCard class="dark:border-gray-700">
        <form class="space-y-6" @submit.prevent="handleResetPassword">
          <UFormField label="New Password" required>
            <UInput
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              required
            />
          </UFormField>

          <UFormField label="Confirm New Password" required>
            <UInput
              v-model="form.confirmPassword"
              type="password"
              autocomplete="new-password"
              required
            />
          </UFormField>

          <div>
            <UButton
              type="submit"
              color="primary"
              block
              :loading="loading"
              :disabled="!isFormValid"
            >
              Reset Password
            </UButton>
          </div>

          <div class="text-center">
            <NuxtLink
              to="/auth/login"
              class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Back to login
            </NuxtLink>
          </div>
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'
import type { ResetPasswordRequest } from '../../types/auth'

const route = useRoute()
const { resetPassword } = useAuth()
const toast = useToast()
const loading = ref(false)

const form = reactive<ResetPasswordRequest>({
  token: route.query.token as string,
  password: '',
  confirmPassword: ''
})

const isFormValid = computed(() => {
  return (
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword &&
    form.password.length >= 8
  )
})

const handleResetPassword = async () => {
  if (!form.token) {
    toast.add({
      title: 'Error',
      description: 'Reset token is missing',
      color: 'error'
    })
    return
  }

  if (!isFormValid.value) {
    toast.add({
      title: 'Error',
      description: form.password.length < 8
        ? 'Password must be at least 8 characters long'
        : 'Please fill in all fields and ensure passwords match',
      color: 'error'
    })
    return
  }

  try {
    loading.value = true
    await resetPassword(form)
    toast.add({
      title: 'Success',
      description: 'Password has been reset successfully',
      color: 'success'
    })
    // Clear the form
    form.password = ''
    form.confirmPassword = ''
    // Redirect to login
    navigateTo('/auth/login')
  } catch (err) {
    toast.add({
      title: 'Error',
      description: err instanceof Error ? err.message : 'Failed to reset password',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>
