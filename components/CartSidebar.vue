<template>
  <!-- Overlay -->
  <div 
    v-if="isCartOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 z-40"
    @click="closeCart"
  ></div>

  <!-- Sidebar -->
  <div 
    :class="[
      'fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50',
      isCartOpen ? 'translate-x-0' : 'translate-x-full'
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-lg font-semibold">Shopping Cart</h2>
        <button @click="closeCart" class="text-gray-400 hover:text-gray-600">
          <Icon name="heroicons:x-mark" class="h-6 w-6" />
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="cartItems.length === 0" class="text-center py-8">
          <Icon name="heroicons:shopping-bag" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">Your cart is empty</p>
          <button @click="closeCart" class="mt-4 text-blue-600 hover:text-blue-800">
            Continue Shopping
          </button>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="item in cartItems" 
            :key="`${item.id}-${JSON.stringify(item.variation)}`"
            class="flex items-center space-x-3 p-3 border rounded-lg"
          >
            <img 
              :src="getCartItemImage(item)" 
              :alt="item.name"
              class="w-16 h-16 object-cover rounded"
              @error="handleImageError"
            >
            
            <div class="flex-1">
              <h4 class="font-medium text-sm">{{ item.name }}</h4>
              
              <!-- Show variation attributes if they exist -->
              <div v-if="item.variation && item.variation.attributes" class="text-xs text-gray-500 mt-1">
                <span v-for="(value, key) in item.variation.attributes" :key="key" class="mr-2">
                  {{ key }}: {{ value }}
                </span>
              </div>
              
              <p class="text-gray-600 text-sm">${{ item.price.toFixed(2) }}</p>
              
              <div class="flex items-center mt-2">
                <button 
                  @click="updateQuantity(item.id, item.quantity - 1, item.variation)"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="heroicons:minus" class="h-4 w-4" />
                </button>
                <span class="mx-3 text-sm">{{ item.quantity }}</span>
                <button 
                  @click="updateQuantity(item.id, item.quantity + 1, item.variation)"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="heroicons:plus" class="h-4 w-4" />
                </button>
                <button 
                  @click="removeFromCart(item.id, item.variation)"
                  class="ml-auto text-red-400 hover:text-red-600"
                >
                  <Icon name="heroicons:trash" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="cartItems.length > 0" class="border-t p-4 space-y-4">
        <div class="flex justify-between items-center">
          <span class="font-semibold">Total:</span>
          <span class="font-bold text-lg">${{ cartTotal.toFixed(2) }}</span>
        </div>
        
        <div class="space-y-2">
          <NuxtLink 
            to="/cart" 
            @click="closeCart"
            class="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-center py-2 px-4 rounded-md font-medium transition-colors duration-200"
          >
            View Cart
          </NuxtLink>
          <NuxtLink 
            to="/checkout" 
            @click="closeCart"
            class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md font-medium transition-colors duration-200"
          >
            Checkout
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { 
  cartItems, 
  isCartOpen, 
  cartTotal, 
  closeCart, 
  updateQuantity, 
  removeFromCart 
} = useCart()

const { getCartItemImage, handleImageError } = useProductImage()
</script>