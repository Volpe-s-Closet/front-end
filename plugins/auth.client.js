export default defineNuxtPlugin(() => {
  const { initAuth } = useAuth()
  
  // Initialize auth on client side after DOM is ready
  if (process.client) {
    console.log('Auth plugin running on client')
    initAuth()
  }
})