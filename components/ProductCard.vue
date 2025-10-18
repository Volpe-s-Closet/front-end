<template>
  <!-- Grid View -->
  <div v-if="viewMode === 'grid'" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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

      <div class="flex items-center justify-between">
        <NuxtLink 
          :to="`/product/${product.slug}`"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </NuxtLink>
        
        <!-- Show "Choose Options" for variable products, "Add to Cart" for simple products -->
        <BaseButton
          v-if="hasVariations"
          @click="openVariationModal"
          :disabled="!product.purchasable"
          text="Choose Options"
          size="sm"
        />
        
        <BaseButton
          v-else
          action="add"
          :product="product"
          :quantity="1"
          :loading="isAdding"
          :disabled="!product.purchasable || product.stock_status !== 'instock'"
          size="sm"
          @click="handleAddToCart"
        />
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

  <!-- List View -->
  <div v-else class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="flex flex-col sm:flex-row">
      <!-- Image -->
      <div class="relative sm:w-48 sm:flex-shrink-0">
        <img
          :src="getProductImage(product)"
          :alt="product.name"
          class="w-full h-48 sm:h-full object-cover"
          @error="handleImageError"
        >
        <div v-if="product.on_sale" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
          Sale
        </div>
        <div v-if="product.featured" class="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded">
          Featured
        </div>
      </div>
      
      <!-- Content -->
      <div class="flex-1 p-6">
        <div class="flex flex-col sm:flex-row sm:justify-between h-full">
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
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

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row sm:items-end gap-3 mt-4 sm:mt-0 sm:ml-6">
            <NuxtLink 
              :to="`/product/${product.slug}`"
              class="text-blue-600 hover:text-blue-800 font-medium text-center sm:text-left"
            >
              View Details
            </NuxtLink>
            
            <!-- Show "Choose Options" for variable products, "Add to Cart" for simple products -->
            <BaseButton
              v-if="hasVariations"
              @click="openVariationModal"
              :disabled="!product.purchasable"
              text="Choose Options"
            />
            
            <BaseButton
              v-else
              action="add"
              :product="product"
              :quantity="1"
              :loading="isAdding"
              :disabled="!product.purchasable || product.stock_status !== 'instock'"
              @click="handleAddToCart"
            />
          </div>
        </div>
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
  },
  viewMode: {
    type: String,
    default: 'grid' // 'grid' or 'list'
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

// Format price with proper currency symbol
const formatPrice = (price) => {
  if (!price) return ''
  
  const numericPrice = parseFloat(price)
  if (isNaN(numericPrice)) return price
  
  // Check if we have currency info from WooCommerce price_html of other products
  // This is a fallback approach - WooCommerce should provide price_html for proper formatting
  
  // Simple currency detection from runtime config or default to USD
  const config = useRuntimeConfig()
  const currency = config.public.currency || 'USD'
  const locale = config.public.locale || 'en-US'
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(numericPrice)
  } catch (error) {
    // Fallback to simple format if Intl fails
    return `$${numericPrice.toFixed(2)}`
  }
}

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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>