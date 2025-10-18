<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="relative">
      <img
        :src="getProductImage(product)"
        :alt="product.name"
        class="w-full h-64 object-cover"
        @error="handleImageError"
      >
      <div v-if="product.on_sale" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
        Sale
      </div>
      <div v-if="product.featured" class="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded">
        Featured
      </div>
    </div>
    
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {{ product.name }}
      </h3>
      
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-2">
          <span v-if="product.on_sale" class="text-lg font-bold text-red-600">
            ${{ product.sale_price }}
          </span>
          <span 
            :class="[
              'text-lg font-bold',
              product.on_sale ? 'text-gray-500 line-through text-sm' : 'text-gray-900'
            ]"
          >
            ${{ product.regular_price }}
          </span>
        </div>
        
        <div v-if="product.average_rating > 0" class="flex items-center">
          <div class="flex text-yellow-400">
            <Icon 
              v-for="i in 5" 
              :key="i"
              name="heroicons:star-solid"
              :class="[
                'h-4 w-4',
                i <= Math.floor(product.average_rating) ? 'text-yellow-400' : 'text-gray-300'
              ]"
            />
          </div>
          <span class="text-sm text-gray-600 ml-1">({{ product.rating_count }})</span>
        </div>
      </div>

      <p class="text-gray-600 text-sm mb-4 line-clamp-2" v-html="product.short_description"></p>

      <div class="flex items-center justify-between">
        <NuxtLink 
          :to="`/product/${product.slug}`"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </NuxtLink>
        
        <!-- Show "Choose Options" for variable products, "Add to Cart" for simple products -->
        <button
          v-if="hasVariations"
          @click="openVariationModal"
          :disabled="!product.purchasable"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Choose Options
        </button>
        
        <button
          v-else
          @click="handleAddToCart"
          :disabled="!product.purchasable || product.stock_status !== 'instock'"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          <Icon v-if="isAdding" name="heroicons:arrow-path" class="h-4 w-4 animate-spin" />
          <span v-else>Add to Cart</span>
        </button>
      </div>

      <div v-if="product.stock_status !== 'instock'" class="mt-2">
        <span class="text-red-600 text-sm font-medium">Out of Stock</span>
      </div>
    </div>

    <!-- Variation Modal -->
    <ProductVariationModal
      :product="product"
      :is-open="isVariationModalOpen"
      @close="closeVariationModal"
      @added-to-cart="handleVariationAddedToCart"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const { addToCart, openCart } = useCart()
const { getProductImage, handleImageError } = useProductImage()
const isAdding = ref(false)
const isVariationModalOpen = ref(false)

// Check if product has variations
const hasVariations = computed(() => {
  return props.product.type === 'variable' || 
         (props.product.variations && props.product.variations.length > 0) ||
         (props.product.attributes && props.product.attributes.some(attr => attr.variation))
})

const handleAddToCart = async () => {
  if (!props.product.purchasable || props.product.stock_status !== 'instock') return
  
  isAdding.value = true
  try {
    addToCart(props.product, 1)
    // Show cart sidebar after adding
    openCart()
  } catch (error) {
    console.error('Error adding to cart:', error)
  } finally {
    isAdding.value = false
  }
}

const openVariationModal = () => {
  isVariationModalOpen.value = true
}

const closeVariationModal = () => {
  isVariationModalOpen.value = false
}

const handleVariationAddedToCart = (data) => {
  // Modal handles the cart addition, we just need to close it
  closeVariationModal()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>