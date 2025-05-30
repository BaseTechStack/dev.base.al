import { defineStore } from 'pinia'
import type { AuthResponse } from '../types/auth'

interface AuthState {
  user: AuthResponse | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated(state: AuthState): boolean {
      const isAuth = !!state.user?.accessToken
      console.log('[Auth Store] isAuthenticated:', isAuth, 'user:', state.user)
      return isAuth
    },
    getUser(state: AuthState): AuthResponse | null {
      return state.user
    }
  },

  actions: {
    setUser(user: AuthResponse | null) {
      console.log('[Auth Store] Setting user:', user)
      this.user = user
      if (import.meta.client && user) {
        localStorage.setItem('auth_token', user.accessToken)
        // Store user data without the token to avoid duplication
        const { accessToken, ...userData } = user
        localStorage.setItem('auth_user', JSON.stringify(userData))
      }
    },

    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    clearError() {
      this.error = null
    },

    async logout() {
      console.log('[Auth Store] Logging out')
      if (import.meta.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
      this.user = null
      this.error = null
      this.loading = false
      
      // Force reset auth state
      const router = useRouter()
      await router.push('/auth/login')
      await navigateTo('/auth/login', { replace: true })
    },

    // Initialize auth state from localStorage
    init() {
      console.log('[Auth Store] Initializing auth state')
      if (import.meta.client) {
        const token = localStorage.getItem('auth_token')
        const userJson = localStorage.getItem('auth_user')
        console.log('[Auth Store] Found token:', token)
        console.log('[Auth Store] Found user:', userJson)
        
        if (token && userJson) {
          try {
            const userData = JSON.parse(userJson)
            this.user = {
              ...userData,
              accessToken: token
            } as AuthResponse
            console.log('[Auth Store] Restored user state:', this.user)
          } catch (error) {
            console.error('[Auth Store] Failed to parse user data:', error)
            this.logout() // Clean up invalid state
          }
        } else {
          this.user = null
          console.log('[Auth Store] No valid auth data found, user is null')
        }
      }
    }
  }
})
