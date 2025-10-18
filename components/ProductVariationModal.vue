<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="closeModal"
    ></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold text-gray-900">
            Choose Options for {{ product.name }}
          </h3>
          <BaseButton
            @click="closeModal"
            variant="ghost"
            size="sm"
            icon="heroicons:x-mark"
          />
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Product Image and Basic Info -->
          <div class="flex gap-4 mb-6">
            <img
              :src="selectedVariationImage || getProductImage(product)"
              :alt="product.name"
              class="w-24 h-24 object-cover rounded-lg"
              @error="handleImageError"
            >
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">{{ product.name }}</h4>
              <div class="mt-1">
                <span class="text-lg font-bold text-gray-900">
                  {{ formatPrice(selectedVariationPrice || product.price || product.regular_price) }}
                </span>
                <span v-if="product.on_sale && !selectedVariation" class="text-sm text-gray-500 line-through ml-2">
                  {{ formatPrice(product.regular_price) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoadingVariations" class="mb-6 text-center py-4">
            <Icon name="heroicons:arrow-path" class="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
            <p class="text-gray-600">Loading variations...</p>
          </div>

          <!-- Variation Attributes -->
          <div v-else-if="variationAttributes.length > 0" class="space-y-4 mb-6">
            <div v-for="attribute in variationAttributes" :key="attribute.id" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                {{ attribute.name }}
              </label>
              <select
                v-model="selectedAttributes[attribute.name]"
                @change="updateSelectedVariation"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose {{ attribute.name }}</option>
                <option 
                  v-for="option in attribute.options" 
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </div>
          </div>

          <!-- No Variations Message -->
          <div v-else class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p class="text-yellow-800 text-sm">This product doesn't have any variations available.</p>
          </div>

          <!-- Quantity -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div class="flex items-center space-x-3">
              <BaseButton
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
                variant="outline"
                size="xs"
                icon="heroicons:minus"
                rounded="full"
                class="w-8 h-8"
              />
              <span class="text-lg font-medium min-w-[2rem] text-center">{{ quantity }}</span>
              <BaseButton
                @click="increaseQuantity"
                variant="outline"
                size="xs"
                icon="heroicons:plus"
                rounded="full"
                class="w-8 h-8"
              />
            </div>
          </div>

          <!-- Stock Status -->
          <div v-if="selectedVariation && selectedVariation.stock_status !== 'instock'" class="mb-4">
            <span class="text-red-600 text-sm font-medium">
              {{ selectedVariation.stock_status === 'outofstock' ? 'Out of Stock' : 'Limited Stock' }}
            </span>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-600 text-sm">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between p-6 border-t bg-gray-50">
          <BaseButton
            action="cancel"
            @click="closeModal"
          />
          <BaseButton
            @click="handleAddToCart"
            :disabled="!canAddToCart || isAdding"
            :loading="isAdding"
            text="Add to Cart"
          />
        </div>
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
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'added-to-cart'])

const { addToCart, openCart, formatPrice } = useCart()
const { getProductImage, handleImageError } = useProductImage()
const { getProductVariations } = useWooCommerce()

// Reactive state
const selectedAttributes = ref({})
const selectedVariation = ref(null)
const availableVariations = ref([])
const quantity = ref(1)
const isAdding = ref(false)
const errorMessage = ref('')
const isLoadingVariations = ref(false)

// Computed properties
const variationAttributes = computed(() => {
  return props.product.attributes?.filter(attr => attr.variation) || []
})

const selectedVariationImage = computed(() => {
  return selectedVariation.value?.image?.src || ''
})

const selectedVariationPrice = computed(() => {
  return selectedVariation.value?.price || selectedVariation.value?.regular_price || ''
})

const canAddToCart = computed(() => {
  // Check if all required attributes are selected
  const allAttributesSelected = variationAttributes.value.every(attr => 
    selectedAttributes.value[attr.name]
  )
  
  // Check if variation is in stock
  const inStock = !selectedVariation.value || selectedVariation.value.stock_status === 'instock'
  
  return allAttributesSelected && inStock && quantity.value > 0
})

// Methods
const closeModal = () => {
  emit('close')
  resetModal()
}

const resetModal = () => {
  selectedAttributes.value = {}
  selectedVariation.value = null
  quantity.value = 1
  errorMessage.value = ''
}

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const loadVariations = async () => {
  if (!props.product.variations || props.product.variations.length === 0) return
  
  isLoadingVariations.value = true
  try {
    availableVariations.value = await getProductVariations(props.product.id)
  } catch (error) {
    console.error('Error loading variations:', error)
    errorMessage.value = 'Unable to load product variations.'
  } finally {
    isLoadingVariations.value = false
  }
}

const updateSelectedVariation = () => {
  errorMessage.value = ''
  
  // Check if all attributes are selected
  const allSelected = variationAttributes.value.every(attr => 
    selectedAttributes.value[attr.name]
  )
  
  if (!allSelected) {
    selectedVariation.value = null
    return
  }

  // Find matching variation from available variations
  const matchingVariation = availableVariations.value.find(variation => {
    return variation.attributes.every(attr => {
      const selectedValue = selectedAttributes.value[attr.name]
      return attr.option === selectedValue || attr.option === ''
    })
  })

  if (matchingVariation) {
    selectedVariation.value = matchingVariation
  } else {
    selectedVariation.value = null
    errorMessage.value = 'This combination is not available.'
  }
}

const handleAddToCart = async () => {
  if (!canAddToCart.value) return
  
  isAdding.value = true
  errorMessage.value = ''
  
  try {
    // Create variation object for cart
    const variation = {
      attributes: selectedAttributes.value,
      variation_id: selectedVariation.value?.id,
      variation_data: selectedVariation.value
    }
    
    // Create a product object with variation details for the cart
    const productForCart = {
      ...props.product,
      id: selectedVariation.value?.id || props.product.id,
      price: selectedVariation.value?.price || props.product.price,
      regular_price: selectedVariation.value?.regular_price || props.product.regular_price,
      sale_price: selectedVariation.value?.sale_price || props.product.sale_price,
      image: selectedVariation.value?.image || props.product.images?.[0],
      stock_status: selectedVariation.value?.stock_status || props.product.stock_status
    }
    
    // Add to cart with variation
    addToCart(productForCart, quantity.value, variation)
    
    // Emit success event
    emit('added-to-cart', {
      product: productForCart,
      quantity: quantity.value,
      variation
    })
    
    // Close modal
    closeModal()
  } catch (error) {
    console.error('Error adding to cart:', error)
    errorMessage.value = 'Failed to add item to cart. Please try again.'
  } finally {
    isAdding.value = false
  }
}

// Watch for modal open/close to reset state and load variations
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    loadVariations()
  } else {
    resetModal()
  }
})

// Load variations when component is mounted if modal is already open
onMounted(() => {
  if (props.isOpen) {
    loadVariations()
  }
})
</script>