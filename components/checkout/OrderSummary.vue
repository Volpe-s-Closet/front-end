<template>
  <div class="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8">
    <h2 class="text-xl font-semibold mb-6">{{ $t('checkout.summary.title') }}</h2>

    <template v-if="isMounted">
      <div class="space-y-4 mb-6">
        <div v-for="item in cartItems" :key="`${item.id}-${JSON.stringify(item.variation)}`"
          class="flex items-center space-x-3">
          <img :src="getCartItemImage(item)" :alt="item.name" class="w-16 h-16 object-cover rounded"
            @error="handleImageError">
          <div class="flex-1">
            <h4 class="font-medium">{{ item.name }}</h4>
            <p class="text-gray-600 text-sm">{{ $t('checkout.summary.qty', { count: item.quantity }) }}</p>
          </div>
          <div class="text-right">
            <p class="font-medium">{{ formatPrice(item.price * item.quantity) }}</p>
          </div>
        </div>
      </div>

      <div class="border-t pt-4 space-y-2">
        <div class="flex justify-between">
          <span>{{ $t('cart.subtotalLabel') }}</span>
          <span>{{ formatPrice(cartSubtotal) }}</span>
        </div>
        <div class="flex justify-between">
          <span>{{ $t('cart.shipping') }}</span>
          <span>{{ formatPrice(shippingCost) }}</span>
        </div>
        <div class="flex justify-between">
          <span>{{ $t('cart.tax') }}</span>
          <span>{{ formatPrice(taxAmount) }}</span>
        </div>
        <div class="border-t pt-2">
          <div class="flex justify-between text-lg font-semibold">
            <span>{{ $t('cart.total') }}</span>
            <span>{{ formatPrice(orderTotal) }}</span>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="space-y-4 mb-6">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
const { cartItems, cartSubtotal, formatPrice } = useCart()
const { getCartItemImage, handleImageError } = useProducts()

defineProps({
  shippingCost: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    required: true
  },
  orderTotal: {
    type: Number,
    required: true
  },
  isMounted: {
    type: Boolean,
    default: false
  }
})
</script>
