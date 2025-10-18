export const useCart = () => {
  // Cart state stored in localStorage for static site
  const cartItems = ref([])
  const isCartOpen = ref(false)

  // Initialize cart from localStorage
  const initCart = () => {
    if (process.client) {
      const stored = localStorage.getItem('cart')
      if (stored) {
        cartItems.value = JSON.parse(stored)
      }
    }
  }

  // Save cart to localStorage
  const saveCart = () => {
    if (process.client) {
      localStorage.setItem('cart', JSON.stringify(cartItems.value))
    }
  }

  // Add item to cart
  const addToCart = (product, quantity = 1, variation = null) => {
    const existingItem = cartItems.value.find(item => 
      item.id === product.id && 
      JSON.stringify(item.variation) === JSON.stringify(variation)
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity,
        image: product.images[0]?.src || '',
        variation,
        product
      })
    }
    
    saveCart()
  }

  // Remove item from cart
  const removeFromCart = (itemId, variation = null) => {
    const index = cartItems.value.findIndex(item => 
      item.id === itemId && 
      JSON.stringify(item.variation) === JSON.stringify(variation)
    )
    
    if (index > -1) {
      cartItems.value.splice(index, 1)
      saveCart()
    }
  }

  // Update item quantity
  const updateQuantity = (itemId, quantity, variation = null) => {
    const item = cartItems.value.find(item => 
      item.id === itemId && 
      JSON.stringify(item.variation) === JSON.stringify(variation)
    )
    
    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId, variation)
      } else {
        item.quantity = quantity
        saveCart()
      }
    }
  }

  // Clear cart
  const clearCart = () => {
    cartItems.value = []
    saveCart()
  }

  // Cart totals
  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  const cartItemCount = computed(() => {
    return cartItems.value.reduce((count, item) => count + item.quantity, 0)
  })

  const cartSubtotal = computed(() => cartTotal.value)

  // Toggle cart sidebar
  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }

  const openCart = () => {
    isCartOpen.value = true
  }

  const closeCart = () => {
    isCartOpen.value = false
  }

  // Initialize cart on composable creation
  onMounted(() => {
    initCart()
  })

  return {
    cartItems: readonly(cartItems),
    isCartOpen: readonly(isCartOpen),
    cartTotal,
    cartItemCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart
  }
}