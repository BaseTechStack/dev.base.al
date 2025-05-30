import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/authStore'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const { isAuthenticated } = storeToRefs(authStore)
  
  console.log('[Auth Middleware] Route:', to.path)
  console.log('[Auth Middleware] Auth state:', isAuthenticated.value)

  // Define public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register']
  const isPublicRoute = publicRoutes.includes(to.path)

  // If not authenticated and trying to access protected route
  if (!isAuthenticated.value && !isPublicRoute) {
    console.log('[Auth Middleware] Redirecting to login - Not authenticated')
    return navigateTo('/auth/login')
  }

  // If authenticated and trying to access auth pages
  if (isAuthenticated.value && isPublicRoute) {
    console.log('[Auth Middleware] Redirecting to dashboard - Already authenticated')
    // Check if there's a redirect path in the query
    const redirect = to.query.redirect as string
    if (redirect) {
      return navigateTo(redirect)
    }
    return navigateTo('/app/dashboard')
  }
})
