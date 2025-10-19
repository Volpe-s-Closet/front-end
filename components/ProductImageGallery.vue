<template>
  <div class="flex gap-4">
    <!-- Main Image Display -->
    <div class="flex-1">
      <div class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group shadow-lg"
        @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
        <img :src="currentImage" :alt="product.name"
          class="w-full h-full object-cover transition-transform duration-300" :style="imageTransformStyle"
          @load="onImageLoad" @error="onImageError" />

        <!-- Loading spinner -->
        <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- Navigation arrows for main image -->
        <button v-if="allImages.length > 1" @click="previousImage"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <button v-if="allImages.length > 1" @click="nextImage"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Thumbnail Column -->
    <div v-if="allImages.length > 1" class="w-20 flex flex-col gap-2">
      <div v-for="(image, index) in allImages" :key="index" @click="selectImage(index)"
        class="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:opacity-75 hover:scale-105 shadow-sm"
        :class="currentImageIndex === index ? 'border-gray-900 ring-2 ring-gray-200 shadow-md' : 'border-transparent'">
        <img :src="image.src" :alt="product.name" class="w-full h-full object-cover" />
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
  selectedVariation: {
    type: Object,
    default: null
  }
})

// Reactive data
const currentImageIndex = ref(0)
const imageLoading = ref(false)
const mousePosition = ref({ x: 50, y: 50 })
const isHovering = ref(false)

// Reactive data for fetched variations
const fetchedVariations = ref([])
const isLoadingVariations = ref(false)

// Computed properties
const allImages = computed(() => {
  const productImages = props.product.images || []
  // Prioritize fetched variations if they have image data, otherwise use props variations
  const variations = (fetchedVariations.value.length > 0 && fetchedVariations.value.some(v => v.image))
    ? fetchedVariations.value
    : (props.product.variations || [])
  const allCollectedImages = []
  const seenImageSrcs = new Set()



  // First, add all product images
  productImages.forEach((img, index) => {
    if (img.src && !seenImageSrcs.has(img.src)) {
      allCollectedImages.push(img)
      seenImageSrcs.add(img.src)

    }
  })

  // Then add all variation images (avoiding duplicates)
  if (variations.length > 0) {

    variations.forEach((variation, index) => {
      // Handle both data structures: { image: { src: "url" } } and { image: "url" }
      const imageUrl = variation.image?.src || variation.image



      if (imageUrl && !seenImageSrcs.has(imageUrl)) {
        // Create consistent image object structure
        const imageObj = typeof variation.image === 'string'
          ? { src: variation.image, alt: props.product.name }
          : variation.image

        allCollectedImages.push(imageObj)
        seenImageSrcs.add(imageUrl)

      }
    })
  } else {

  }

  // If we have a selected variation with an image that's not already included, add it
  if (props.selectedVariation?.image?.src && !seenImageSrcs.has(props.selectedVariation.image.src)) {
    allCollectedImages.push(props.selectedVariation.image)
    seenImageSrcs.add(props.selectedVariation.image.src)

  }



  return allCollectedImages.length > 0 ? allCollectedImages : productImages
})

const { getPlaceholderImage, handleImageError } = useProducts()

const currentImage = computed(() => {
  return allImages.value[currentImageIndex.value]?.src || getPlaceholderImage()
})

const imageTransformStyle = computed(() => {
  if (!isHovering.value) {
    return {
      transform: 'scale(1)',
      transformOrigin: 'center center'
    }
  }

  return {
    transform: 'scale(1.2)',
    transformOrigin: `${mousePosition.value.x}% ${mousePosition.value.y}%`
  }
})

// Methods
const selectImage = (index) => {
  currentImageIndex.value = index
}

const previousImage = () => {
  currentImageIndex.value = currentImageIndex.value > 0
    ? currentImageIndex.value - 1
    : allImages.value.length - 1
}

const nextImage = () => {
  currentImageIndex.value = currentImageIndex.value < allImages.value.length - 1
    ? currentImageIndex.value + 1
    : 0
}

const onImageLoad = () => {
  imageLoading.value = false
}

const onImageError = (event) => {
  // Fallback to placeholder on error
  handleImageError(event)
  imageLoading.value = false
}

const handleMouseMove = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  mousePosition.value = { x, y }
  isHovering.value = true
}

const handleMouseLeave = () => {
  isHovering.value = false
}

// Methods for fetching variations
const fetchVariations = async () => {
  if (!props.product.id || isLoadingVariations.value) return

  try {
    isLoadingVariations.value = true
    const { getProductVariations } = useProducts()
    const variations = await getProductVariations(props.product.id)



    fetchedVariations.value = variations || []
  } catch (error) {
    console.error('Error fetching variations:', error)
    fetchedVariations.value = []
  } finally {
    isLoadingVariations.value = false
  }
}

// Check if we need to fetch variations - be more aggressive
const shouldFetchVariations = computed(() => {
  return (
    props.product.id &&
    (props.product.type === 'variable' ||
      (props.product.attributes && props.product.attributes.some(attr => attr.variation))) &&
    fetchedVariations.value.length === 0 &&
    !isLoadingVariations.value
  )
})

// Watch for variation changes
watch(() => props.selectedVariation, (newVariation, oldVariation) => {
  // Only switch to variation image if it exists in our gallery and user wants to see it
  if (newVariation?.image?.src) {
    const variationImageIndex = allImages.value.findIndex(img => img.src === newVariation.image.src)
    if (variationImageIndex !== -1) {
      // Only switch if we're currently showing the first image or if this is a new variation selection
      if (currentImageIndex.value === 0 || (oldVariation && oldVariation.image?.src !== newVariation.image.src)) {
        currentImageIndex.value = variationImageIndex
      }
    }
  }
}, { immediate: false })

// Watch for product changes and fetch variations if needed
watch(() => props.product, (newProduct, oldProduct) => {
  // Reset fetched variations when product changes
  if (newProduct && newProduct.id !== oldProduct?.id) {
    fetchedVariations.value = []
    currentImageIndex.value = 0
  }

  // Always fetch variations for variable products
  if (newProduct && shouldFetchVariations.value) {
    fetchVariations()
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  // Always try to fetch variations on mount for variable products
  if (props.product.id && (props.product.type === 'variable' ||
    (props.product.attributes && props.product.attributes.some(attr => attr.variation)))) {
    fetchVariations()
  }
})


</script>