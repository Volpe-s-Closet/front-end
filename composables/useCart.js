export const useCart = () => {
  // Use Nuxt's useState for global state management
  const cartItems = useState('cart.items', () => [])
  const isCartOpen = useState('cart.isOpen', () => false)

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
      // Determine the best image to use
      let itemImage = ''
      
      // If it's a variation with an image, use that
      if (product.image?.src) {
        itemImage = product.image.src
      }
      // Otherwise, try the product's images array
      else if (product.images?.[0]?.src) {
        itemImage = product.images[0].src
      }
      // If product has a parent product stored, use its image
      else if (product.product?.images?.[0]?.src) {
        itemImage = product.product.images[0].src
      }

      const newItem = {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price || product.regular_price || 0),
        quantity,
        image: itemImage,
        variation,
        product
      }
      cartItems.value.push(newItem)
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

  // Initialize cart on client side
  if (process.client) {
    // Only initialize if cart is empty (to avoid re-initializing on every call)
    if (cartItems.value.length === 0) {
      initCart()
    }
  }

  return {
    cartItems,
    isCartOpen,
    cartTotal,
    cartItemCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    initCart
  }
}