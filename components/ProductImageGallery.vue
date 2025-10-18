<template>
  <div class="space-y-4">
    <!-- Main Image Display -->
    <div class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group shadow-lg">
      <img 
        :src="currentImage" 
        :alt="product.name"
        class="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
        @click="openLightbox"
        @load="onImageLoad"
        @error="onImageError"
      />
      
      <!-- Loading spinner -->
      <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      
      <!-- Zoom Icon -->
      <div class="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
        </svg>
      </div>

      <!-- Navigation arrows for main image -->
      <button 
        v-if="allImages.length > 1"
        @click="previousImage"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <button 
        v-if="allImages.length > 1"
        @click="nextImage"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
    
    <!-- Thumbnail Grid -->
    <div v-if="allImages.length > 1" class="grid grid-cols-4 gap-2">
      <div 
        v-for="(image, index) in allImages" 
        :key="index"
        @click="selectImage(index)"
        class="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:opacity-75 hover:scale-105 shadow-sm"
        :class="currentImageIndex === index ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' : 'border-transparent'"
      >
        <img 
          :src="image.src" 
          :alt="product.name"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div 
      v-if="showLightbox" 
      class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      @click="closeLightbox"
    >
      <div class="relative max-w-4xl max-h-full">
        <!-- Close Button -->
        <button 
          @click="closeLightbox"
          class="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <!-- Main Lightbox Image -->
        <div class="relative">
          <img 
            :src="currentImage" 
            :alt="product.name"
            class="max-w-full max-h-[80vh] object-contain mx-auto"
            @click.stop
          />
          
          <!-- Lightbox Navigation -->
          <button 
            v-if="allImages.length > 1"
            @click.stop="previousImage"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button 
            v-if="allImages.length > 1"
            @click.stop="nextImage"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <!-- Lightbox Thumbnails -->
        <div v-if="allImages.length > 1" class="flex justify-center mt-4 space-x-2 overflow-x-auto pb-2">
          <div 
            v-for="(image, index) in allImages" 
            :key="index"
            @click.stop="selectImage(index)"
            class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200"
            :class="currentImageIndex === index ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'"
          >
            <img 
              :src="image.src" 
              :alt="product.name"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Image Counter -->
        <div class="text-center mt-2 text-white text-sm">
          {{ currentImageIndex + 1 }} / {{ allImages.length }}
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
  selectedVariation: {
    type: Object,
    default: null
  }
})

// Reactive data
const currentImageIndex = ref(0)
const showLightbox = ref(false)
const imageLoading = ref(false)

// Computed properties
const allImages = computed(() => {
  const productImages = props.product.images || []
  
  // If there's a selected variation with a specific image, prioritize it
  if (props.selectedVariation?.image?.src) {
    const variationImage = props.selectedVariation.image
    
    // Check if variation image is already in product images
    const existingImageIndex = productImages.findIndex(img => img.src === variationImage.src)
    
    if (existingImageIndex !== -1) {
      // If variation image exists in product images, move it to the front
      const reorderedImages = [...productImages]
      const [existingImage] = reorderedImages.splice(existingImageIndex, 1)
      return [existingImage, ...reorderedImages]
    } else {
      // Add variation image at the beginning if it's not in product images
      return [variationImage, ...productImages]
    }
  }
  
  return productImages
})

const { getPlaceholderImage, handleImageError } = useProductImage()

const currentImage = computed(() => {
  return allImages.value[currentImageIndex.value]?.src || getPlaceholderImage()
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

const openLightbox = () => {
  showLightbox.value = true
  // Prevent body scroll when lightbox is open
  document.body.style.overflow = 'hidden'
}

const onImageLoad = () => {
  imageLoading.value = false
}

const onImageError = (event) => {
  // Fallback to placeholder on error
  handleImageError(event)
  imageLoading.value = false
}

const closeLightbox = () => {
  showLightbox.value = false
  // Restore body scroll
  document.body.style.overflow = ''
}

// Keyboard navigation
const handleKeydown = (event) => {
  if (!showLightbox.value) return
  
  switch (event.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowLeft':
      previousImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

// Watch for variation changes
watch(() => props.selectedVariation, (newVariation, oldVariation) => {
  if (newVariation?.image?.src) {
    // Always switch to the first image when variation changes (variation image will be at index 0)
    currentImageIndex.value = 0
  } else if (!newVariation && oldVariation?.image?.src) {
    // If variation is cleared, reset to first product image
    currentImageIndex.value = 0
  }
}, { immediate: false })

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