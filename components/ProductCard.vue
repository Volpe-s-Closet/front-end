<template>
  <!-- Grid View -->
  <div v-if="viewMode === 'grid'" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
    <div class="relative">
      <img
        :src="getProductImage(product)"
        :alt="product.name"
        class="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
        @error="handleImageError"
        @click="openImageGallery"
      >
      <div v-if="product.on_sale" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
        Sale
      </div>
      <div v-if="product.featured" class="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded">
        Featured
      </div>
      <!-- Zoom icon overlay -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-20 pointer-events-none">
        <div class="bg-white bg-opacity-90 rounded-full p-2">
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Floating Cart Button -->
    <button
      v-if="product.purchasable && product.stock_status === 'instock'"
      @click="hasVariations ? openVariationModal() : handleAddToCart()"
      :disabled="isAdding"
      class="absolute top-4 right-4 z-10 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border"
      :class="{
        'bg-green-500 border-green-500 text-white': isInCart || justAdded,
        'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600': !isInCart && !justAdded,
        'opacity-50 cursor-not-allowed': isAdding,
        'animate-pulse': justAdded
      }"
    >
      <!-- Loading spinner -->
      <svg v-if="isAdding" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      
      <!-- Checkmark when in cart or just added -->
      <svg v-else-if="isInCart || justAdded" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      
      <!-- Cart icon when not in cart -->
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z"></path>
      </svg>
    </button>
    
    <NuxtLink :to="`/product/${product.slug}`" class="block p-4 hover:bg-gray-50 transition-colors cursor-pointer">
      <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
        {{ product.name }}
      </h3>
      
      <!-- Rating -->
      <div class="flex items-center mb-3">
        <div class="flex text-yellow-400">
          <Icon 
            v-for="i in 5" 
            :key="i"
            name="heroicons:star-solid"
            :class="[
              'h-4 w-4',
              i <= Math.floor(product.average_rating || 0) ? 'text-yellow-400' : 'text-gray-300'
            ]"
          />
        </div>
        <span class="text-sm text-gray-600 ml-2">
          <span v-if="product.rating_count > 0">{{ product.average_rating || 0 }} ({{ product.rating_count }} reviews)</span>
          <span v-else class="text-gray-400">No reviews yet</span>
        </span>
      </div>
      
      <!-- Price -->
      <div class="flex items-center mb-3">
        <!-- Use WooCommerce formatted price when available -->
        <div v-if="product.price_html" class="text-lg font-bold" v-html="product.price_html"></div>
        
        <!-- Fallback for products without price_html -->
        <div v-else class="flex items-center space-x-2">
          <span v-if="product.on_sale && product.sale_price" class="text-lg font-bold text-red-600">
            {{ formatPrice(product.sale_price) }}
          </span>
          <span 
            :class="[
              'text-lg font-bold',
              (product.on_sale && product.sale_price) ? 'text-gray-500 line-through text-sm' : 'text-gray-900'
            ]"
          >
            {{ formatPrice(product.regular_price || product.price) }}
          </span>
        </div>
      </div>

      <p v-if="product.short_description" class="text-gray-600 text-sm mb-4 line-clamp-2" v-html="product.short_description"></p>
      <p v-else-if="product.description" class="text-gray-600 text-sm mb-4 line-clamp-2" v-html="product.description"></p>
      <p v-else class="text-gray-500 text-sm mb-4 italic">No description available</p>

      <div v-if="product.stock_status !== 'instock'" class="mt-2">
        <span class="text-red-600 text-sm font-medium">Out of Stock</span>
      </div>
    </NuxtLink>

    <!-- Variation Modal -->
    <ProductVariationModal
      :product="product"
      :is-open="isVariationModalOpen"
      @close="closeVariationModal"
      @added-to-cart="handleVariationAddedToCart"
    />
  </div>

  <!-- List View -->
  <div v-else class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
    <div class="flex flex-col sm:flex-row">
      <!-- Image -->
      <div class="relative sm:w-48 sm:flex-shrink-0">
        <img
          :src="getProductImage(product)"
          :alt="product.name"
          class="w-full h-48 sm:h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          @error="handleImageError"
          @click="openImageGallery"
        >
        <div v-if="product.on_sale" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
          Sale
        </div>
        <div v-if="product.featured" class="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded">
          Featured
        </div>
        <!-- Zoom icon overlay -->
        <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-20 pointer-events-none">
          <div class="bg-white bg-opacity-90 rounded-full p-2">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
            </svg>
          </div>
        </div>
      </div>

    <!-- Floating Cart Button -->
    <button
      v-if="product.purchasable && product.stock_status === 'instock'"
      @click="hasVariations ? openVariationModal() : handleAddToCart()"
      :disabled="isAdding"
      class="absolute top-4 right-4 z-10 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border"
      :class="{
        'bg-green-500 border-green-500 text-white': isInCart || justAdded,
        'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600': !isInCart && !justAdded,
        'opacity-50 cursor-not-allowed': isAdding,
        'animate-pulse': justAdded
      }"
    >
      <!-- Loading spinner -->
      <svg v-if="isAdding" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      
      <!-- Checkmark when in cart or just added -->
      <svg v-else-if="isInCart || justAdded" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      
      <!-- Cart icon when not in cart -->
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z"></path>
      </svg>
    </button>
      
      <!-- Content -->
      <NuxtLink :to="`/product/${product.slug}`" class="flex-1 p-6 block hover:bg-gray-50 transition-colors cursor-pointer">
        <div class="flex flex-col sm:flex-row sm:justify-between h-full">
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
              {{ product.name }}
            </h3>
            
            <!-- Rating -->
            <div class="flex items-center mb-3">
              <div class="flex text-yellow-400">
                <Icon 
                  v-for="i in 5" 
                  :key="i"
                  name="heroicons:star-solid"
                  :class="[
                    'h-4 w-4',
                    i <= Math.floor(product.average_rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                  ]"
                />
              </div>
              <span class="text-sm text-gray-600 ml-2">
                <span v-if="product.rating_count > 0">{{ product.average_rating || 0 }} ({{ product.rating_count }} reviews)</span>
                <span v-else class="text-gray-400">No reviews yet</span>
              </span>
            </div>
            
            <!-- Price -->
            <div class="flex items-center mb-3">
              <!-- Use WooCommerce formatted price when available -->
              <div v-if="product.price_html" class="text-xl font-bold" v-html="product.price_html"></div>
              
              <!-- Fallback for products without price_html -->
              <div v-else class="flex items-center space-x-2">
                <span v-if="product.on_sale && product.sale_price" class="text-xl font-bold text-red-600">
                  {{ formatPrice(product.sale_price) }}
                </span>
                <span 
                  :class="[
                    'text-xl font-bold',
                    (product.on_sale && product.sale_price) ? 'text-gray-500 line-through text-lg' : 'text-gray-900'
                  ]"
                >
                  {{ formatPrice(product.regular_price || product.price) }}
                </span>
              </div>
            </div>

            <p v-if="product.short_description" class="text-gray-600 mb-4 line-clamp-3" v-html="product.short_description"></p>
            <p v-else-if="product.description" class="text-gray-600 mb-4 line-clamp-3" v-html="product.description"></p>
            <p v-else class="text-gray-500 mb-4 italic">No description available</p>

            <div v-if="product.stock_status !== 'instock'" class="mb-4">
              <span class="text-red-600 font-medium">Out of Stock</span>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Variation Modal -->
    <ProductVariationModal
      :product="product"
      :is-open="isVariationModalOpen"
      @close="closeVariationModal"
      @added-to-cart="handleVariationAddedToCart"
    />
  </div>

  <!-- Image Gallery Modal -->
  <div 
    v-if="showImageGallery" 
    class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
    @click="closeImageGallery"
  >
    <div class="relative max-w-4xl max-h-full w-full">
      <!-- Close Button -->
      <button 
        @click="closeImageGallery"
        class="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Gallery Component -->
      <div @click.stop>
        <ProductImageGallery 
          :product="product" 
          :selected-variation="null"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid' // 'grid' or 'list'
  }
})

const { addToCart } = useCart()
const { getProductImage, handleImageError } = useProductImage()
const { formatPrice } = useCurrency()
const isAdding = ref(false)
const isVariationModalOpen = ref(false)
const showImageGallery = ref(false)
const justAdded = ref(false)

// Check if product has variations
const hasVariations = computed(() => {
  return props.product.type === 'variable' || 
         (props.product.variations && props.product.variations.length > 0) ||
         (props.product.attributes && props.product.attributes.some(attr => attr.variation))
})

// Get minimum price for variable products
const getMinPrice = (product) => {
  if (product.variations && product.variations.length > 0) {
    const prices = product.variations
      .map(v => parseFloat(v.price || v.regular_price || 0))
      .filter(p => p > 0)
    return prices.length > 0 ? Math.min(...prices).toFixed(2) : '0.00'
  }
  return product.regular_price || product.price || '0.00'
}



// Check if product is in cart - simplified for now to avoid cart access issues
const isInCart = computed(() => {
  // For now, we'll just use the justAdded state
  // This can be enhanced later when cart state is properly available
  return false
})

const handleAddToCart = async () => {
  if (!props.product.purchasable || props.product.stock_status !== 'instock') return
  
  isAdding.value = true
  try {
    addToCart(props.product, 1)
    // Show success animation
    justAdded.value = true
    // Reset the animation after 2 seconds
    setTimeout(() => {
      justAdded.value = false
    }, 2000)
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
  // Modal handles the cart addition, we just need to close it and show animation
  closeVariationModal()
  
  // Show success animation like regular add to cart
  justAdded.value = true
  // Reset the animation after 2 seconds
  setTimeout(() => {
    justAdded.value = false
  }, 2000)
}

const openImageGallery = () => {
  showImageGallery.value = true
  // Prevent body scroll when gallery is open
  document.body.style.overflow = 'hidden'
}

const closeImageGallery = () => {
  showImageGallery.value = false
  // Restore body scroll
  document.body.style.overflow = ''
}

// Keyboard navigation for image gallery
const handleKeydown = (event) => {
  if (!showImageGallery.value) return
  
  if (event.key === 'Escape') {
    closeImageGallery()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  // Ensure body scroll is restored
  document.body.style.overflow = ''
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>