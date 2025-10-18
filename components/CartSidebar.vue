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
        <BaseButton 
          @click="closeCart" 
          variant="ghost" 
          size="sm"
          icon="heroicons:x-mark"
        />
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-4">
        <ClientOnly>
          <div v-if="!isHydrated" class="text-center py-8">
            <div class="h-16 w-16 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <p class="text-gray-500">Loading cart...</p>
          </div>
          
          <div v-else-if="cartItems.length === 0" class="text-center py-8">
            <ClientOnly>
              <Icon name="heroicons:shopping-bag" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <template #fallback>
                <div class="h-16 w-16 bg-gray-200 rounded mx-auto mb-4"></div>
              </template>
            </ClientOnly>
            <p class="text-gray-500">Your cart is empty</p>
            <BaseButton 
              @click="closeCart" 
              variant="link" 
              text="Continue Shopping"
              class="mt-4"
            />
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
                
                <p class="text-gray-600 text-sm">{{ formatPrice(item.price) }}</p>
                
                <div class="flex items-center mt-2">
                  <BaseButton
                    action="decrease"
                    :product="item"
                    :quantity="item.quantity"
                    :variation="item.variation"
                    size="xs"
                  />
                  <span class="mx-3 text-sm">{{ item.quantity }}</span>
                  <BaseButton
                    action="increase"
                    :product="item"
                    :quantity="item.quantity"
                    :variation="item.variation"
                    size="xs"
                  />
                  <BaseButton
                    action="remove"
                    :product="item"
                    :variation="item.variation"
                    size="xs"
                    class="ml-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </ClientOnly>
      </div>

      <!-- Footer -->
      <ClientOnly>
        <div v-if="isHydrated && cartItems.length > 0" class="border-t p-4 space-y-4">
          <div class="flex justify-between items-center">
            <span class="font-semibold">Total:</span>
            <span class="font-bold text-lg">{{ formatPrice(cartTotal) }}</span>
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
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
const { 
  cartItems, 
  isCartOpen, 
  cartTotal, 
  isHydrated,
  closeCart, 
  updateQuantity, 
  removeFromCart,
  formatPrice 
} = useCart()

const { getCartItemImage, handleImageError } = useProductImage()
</script>