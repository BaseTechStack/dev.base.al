import { useAuthStore } from '../stores/authStore'

// Ensure Pinia is properly initialized
export default defineNuxtPlugin(() => {
  console.log('[Plugin] Pinia initialization plugin running')
  
  // Initialize any stores that need to be available throughout the app
  if (import.meta.client) {
    // Initialize auth store
    const authStore = useAuthStore()
    authStore.init()
    
    console.log('[Plugin] Pinia stores initialized')
  }
  
  // No need to provide $pinia as it's already provided by the Nuxt Pinia module
  return {}
})
