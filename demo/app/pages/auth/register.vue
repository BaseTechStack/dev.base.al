<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or
          <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            sign in to your existing account
          </NuxtLink>
        </p>
      </div>

      <UCard class="dark:border-gray-700">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <UFormField label="Full Name" required>
            <UInput
              v-model="form.name"
              type="text"
              autocomplete="name"
              required
            />
          </UFormField>

          <UFormField label="Username" required>
            <UInput
              v-model="form.username"
              type="text"
              autocomplete="username"
              required
            />
          </UFormField>

          <UFormField label="Email" required>
            <UInput
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
            />
          </UFormField>

          <UFormField label="Password" required>
            <UInput
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              required
            />
          </UFormField>

          <UFormField label="Confirm Password" required>
            <UInput
              v-model="confirmPassword"
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
              Create Account
            </UButton>
          </div>
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'
import type { RegisterRequest } from '../../types/auth'

const { register } = useAuth()
const toast = useToast()
const loading = ref(false)
const confirmPassword = ref('')

const form = reactive<RegisterRequest>({
  name: '',
  username: '',
  email: '',
  password: ''
})

const isFormValid = computed(() => {
  return (
    form.name &&
    form.username &&
    form.email &&
    form.password &&
    form.password === confirmPassword.value
  )
})

const handleRegister = async () => {
  if (!isFormValid.value) {
    toast.add({
      title: 'Error',
      description: 'Please fill in all required fields and ensure passwords match',
      color: 'error'
    })
    return
  }

  try {
    loading.value = true
    await register(form)
    toast.add({
      title: 'Success',
      description: 'Account created successfully',
      color: 'success'
    })
    navigateTo('/auth/login')
  } catch (err) {
    toast.add({
      title: 'Error',
      description: err instanceof Error ? err.message : 'Registration failed',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>
