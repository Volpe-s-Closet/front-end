export default defineNuxtPlugin(() => {
  // Initialize auth on client side only
  const { initAuth } = useAuth()
  
  // Initialize auth when the plugin loads
  initAuth()
})