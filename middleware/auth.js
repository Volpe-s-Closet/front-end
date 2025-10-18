export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side to avoid hydration issues
  if (process.client) {
    const { isAuthenticated, isInitialized, initAuth } = useAuth()
    
    // Ensure auth is initialized
    if (!isInitialized.value) {
      initAuth()
      // Wait a tick for the state to update
      await nextTick()
    }
    
    if (!isAuthenticated.value) {
      return navigateTo('/login?return=' + encodeURIComponent(to.fullPath))
    }
  }
})