<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      <p class="text-gray-600 mt-2">Review your items before checkout</p>
    </div>

    <!-- Empty Cart -->
    <div v-if="cartItems.length === 0" class="text-center py-16">
      <Icon name="heroicons:shopping-bag" class="h-24 w-24 text-gray-300 mx-auto mb-6" />
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
      <p class="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
      <BaseButton 
        to="/search" 
        text="Start Shopping"
        size="lg"
      />
    </div>

    <!-- Cart Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6 border-b">
            <h2 class="text-lg font-semibold">Cart Items ({{ cartItemCount }})</h2>
          </div>
          
          <div class="divide-y">
            <div 
              v-for="item in cartItems" 
              :key="`${item.id}-${JSON.stringify(item.variation)}`"
              class="p-6 flex items-center space-x-4"
            >
              <!-- Product Image -->
              <div class="flex-shrink-0">
                <img 
                  :src="getCartItemImage(item)" 
                  :alt="item.name"
                  class="w-20 h-20 object-cover rounded-lg"
                  @error="handleImageError"
                >
              </div>

              <!-- Product Details -->
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-medium text-gray-900 mb-1">{{ item.name }}</h3>
                
                <!-- Variation details -->
                <div v-if="item.variation && item.variation.attributes" class="text-sm text-gray-600 mb-2">
                  <span v-for="(value, key) in item.variation.attributes" :key="key" class="mr-3">
                    {{ key }}: {{ value }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="text-lg font-semibold text-gray-900">
                    {{ formatPrice(item.price) }}
                  </div>
                  
                  <!-- Quantity Controls -->
                  <div class="flex items-center space-x-3">
                    <BaseButton
                      action="decrease"
                      :product="item"
                      :quantity="item.quantity"
                      :variation="item.variation"
                      size="sm"
                    />
                    
                    <span class="text-lg font-medium min-w-[2rem] text-center">{{ item.quantity }}</span>
                    
                    <BaseButton
                      action="increase"
                      :product="item"
                      :quantity="item.quantity"
                      :variation="item.variation"
                      size="sm"
                    />
                  </div>
                </div>

                <!-- Item Total -->
                <div class="mt-2 text-right">
                  <span class="text-sm text-gray-600">Subtotal: </span>
                  <span class="font-semibold">{{ formatPrice(item.price * item.quantity) }}</span>
                </div>
              </div>

              <!-- Remove Button -->
              <div class="flex-shrink-0">
                <BaseButton
                  action="remove"
                  :product="item"
                  :variation="item.variation"
                  size="sm"
                  title="Remove item"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Continue Shopping -->
        <div class="mt-6">
          <NuxtLink 
            to="/search" 
            class="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <Icon name="heroicons:arrow-left" class="h-5 w-5 mr-2" />
            Continue Shopping
          </NuxtLink>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm p-6 sticky top-8">
          <h2 class="text-lg font-semibold mb-4">Order Summary</h2>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium">{{ formatPrice(cartSubtotal) }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">Shipping</span>
              <span class="font-medium">Calculated at checkout</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">Tax</span>
              <span class="font-medium">Calculated at checkout</span>
            </div>
            
            <div class="border-t pt-3">
              <div class="flex justify-between">
                <span class="text-lg font-semibold">Total</span>
                <span class="text-lg font-bold">{{ formatPrice(cartTotal) }}</span>
              </div>
            </div>
          </div>

          <!-- Checkout Button -->
          <BaseButton 
            to="/checkout" 
            text="Proceed to Checkout"
            full-width
            size="lg"
            class="mb-4"
          />

          <!-- Security Badge -->
          <div class="text-center text-sm text-gray-600">
            <Icon name="heroicons:lock-closed" class="h-4 w-4 inline mr-1" />
            Secure checkout with SSL encryption
          </div>

          <!-- Clear Cart -->
          <BaseButton
            action="clear"
            @click="confirmClearCart"
            full-width
            size="sm"
            class="mt-4"
          />
        </div>

        <!-- Recommended Products -->
        <div v-if="recommendedProducts.length > 0" class="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">You might also like</h3>
          <div class="space-y-4">
            <div 
              v-for="product in recommendedProducts.slice(0, 3)" 
              :key="product.id"
              class="flex items-center space-x-3"
            >
              <img 
                :src="getProductImage(product)" 
                :alt="product.name"
                class="w-16 h-16 object-cover rounded"
                @error="handleImageError"
              >
              <div class="flex-1">
                <h4 class="font-medium text-sm">{{ product.name }}</h4>
                <p class="text-gray-600 text-sm">{{ formatPrice(product.price) }}</p>
                <button 
                  @click="addToCart(product, 1)"
                  class="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { 
  cartItems, 
  cartItemCount, 
  cartTotal, 
  cartSubtotal, 
  updateQuantity, 
  removeFromCart, 
  clearCart,
  addToCart,
  formatPrice 
} = useCart()

const { getCartItemImage, getProductImage, handleImageError } = useProductImage()

const { getProducts } = useWooCommerce()

// SEO
useHead({
  title: 'Shopping Cart - Your Store',
  meta: [
    { name: 'description', content: 'Review your cart items before checkout.' }
  ]
})

// Data
const recommendedProducts = ref([])

// Methods
const confirmClearCart = () => {
  if (confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
    clearCart()
  }
}

const fetchRecommendedProducts = async () => {
  try {
    // Get random products or products from same categories
    const products = await getProducts({ 
      per_page: 6,
      orderby: 'rand',
      status: 'publish'
    })
    recommendedProducts.value = products
  } catch (error) {
    console.error('Error fetching recommended products:', error)
  }
}

// Initialize
onMounted(() => {
  fetchRecommendedProducts()
})
</script>