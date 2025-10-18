export default defineNuxtPlugin(() => {
  // Initialize cart on client side only
  const { initCart } = useCart()
  
  // Initialize cart when the plugin loads
  initCart()
})