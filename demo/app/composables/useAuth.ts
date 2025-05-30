import { useAuthStore } from '../stores/authStore'
import type { LoginRequest, RegisterRequest, AuthResponse, ForgotPasswordRequest, ResetPasswordRequest } from '../types/auth'
import { useRouter, useRoute } from 'vue-router'

const API_URL = 'http://localhost:8001/api'

export const useAuth = () => {
  const store = useAuthStore()
  const router = useRouter()
  const route = useRoute()

  const login = async (credentials: LoginRequest) => {
    store.setLoading(true)
    store.clearError()

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'api'
        },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const data = await response.json() as AuthResponse
      console.log('[Auth Composable] Login response:', data)
      
      // Store user data and token
      if (import.meta.client) {
        localStorage.setItem('auth_token', data.accessToken)
        console.log('[Auth Composable] Stored token in localStorage')
      }
      store.setUser(data)
      
      // Get the redirect path from the route query if it exists
      const redirect = route.query.redirect as string
      
      // Redirect after a short delay to allow state to update
      console.log('[Auth Composable] Preparing to redirect...')
      setTimeout(() => {
        if (redirect) {
          console.log('[Auth Composable] Redirecting to:', redirect)
          router.push(redirect)
        } else {
          console.log('[Auth Composable] Redirecting to dashboard')
          router.push('/app/dashboard')
        }
      }, 100)
      
      return data
    } catch (err: any) {
      store.setError(err.message || 'Failed to login')
      throw err
    } finally {
      store.setLoading(false)
    }
  }

  const register = async (userData: RegisterRequest) => {
    store.setLoading(true)
    store.clearError()

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'api'
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const data = await response.json() as AuthResponse
      // Store user data and token
      if (import.meta.client) {
        localStorage.setItem('auth_token', data.accessToken)
        console.log('[Auth Composable] Stored token in localStorage')
      }
      store.setUser(data)
      
      // Redirect to home page after a short delay to allow state to update
      setTimeout(() => {
        router.push('/')
      }, 100)
      
      return data
    } catch (err: any) {
      store.setError(err.message || 'Failed to register')
      throw err
    } finally {
      store.setLoading(false)
    }
  }

  const logout = async () => {
    store.setLoading(true)
    store.clearError()

    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${store.user?.accessToken}`,
          'X-API-KEY': 'api'
        }
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      store.logout()
      router.push('/auth/login')
    } catch (err: any) {
      store.setError(err.message || 'Failed to logout')
      throw err
    } finally {
      store.setLoading(false)
    }
  }

  const forgotPassword = async (data: ForgotPasswordRequest) => {
    store.setLoading(true)
    store.clearError()

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'api'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to send reset password email')
      }

      return await response.json()
    } catch (err: any) {
      store.setError(err.message || 'Failed to process forgot password request')
      throw err
    } finally {
      store.setLoading(false)
    }
  }

  const resetPassword = async (data: ResetPasswordRequest) => {
    store.setLoading(true)
    store.clearError()

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'api'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to reset password')
      }

      return await response.json()
    } catch (err: any) {
      store.setError(err.message || 'Failed to reset password')
      throw err
    } finally {
      store.setLoading(false)
    }
  }

  return {
    // State
    user: computed(() => store.user),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    isAuthenticated: computed(() => !!store.user?.accessToken),

    // Methods
    login,
    register,
    logout,
    forgotPassword,
    resetPassword
  }
}
