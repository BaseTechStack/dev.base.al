<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
      </div>

      <UCard class="mt-8 dark:border-gray-700">
        <UForm
          :state="state"
          class="space-y-6"
          method="POST"
          @submit="onSubmit"
        >
          <UFormField
            label="Email address"
            name="email"
            required
          >
            <UInput
              v-model="state.email"
              type="email"
              autocomplete="email"
              class="w-full"
              required
            />
          </UFormField>

          <UFormField
            label="Password"
            name="password"
            required
          >
            <UInput
              v-model="state.password"
              type="password"
              autocomplete="current-password"
              class="w-full"
              required
            />
          </UFormField>

          <div class="flex items-center justify-between">
            <UCheckbox label="Remember me" name="remember" />
            <NuxtLink
              to="/auth/forgot-password"
              class="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot your password?
            </NuxtLink>
          </div>

          <div>
            <UButton
              type="submit"
              block
              :loading="loading"
            >
              Sign in
            </UButton>
          </div>

          <div class="text-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Don't have an account?</span>
            <NuxtLink
              to="/auth/register"
              class="ml-1 text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Sign up
            </NuxtLink>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { useAuth } from '../../composables/useAuth'
import type { LoginRequest } from '../../types/auth'

const { login } = useAuth()
const toast = useToast()
const loading = ref(false)

definePageMeta({
  title: 'Login',
  layout: 'auth'
})


const state = reactive<LoginRequest>({
  email: '',
  password: ''
})

async function onSubmit(event: FormSubmitEvent<LoginRequest>) {
  try {
    loading.value = true
    await login(state)
    
    toast.add({
      title: 'Success',
      description: 'Successfully logged in',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Authentication failed',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>
