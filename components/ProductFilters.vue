<template>
  <div>
    <!-- Mobile Filter Toggle Button -->
    <BaseButton
      @click="toggleMobileFilters"
      variant="outline"
      full-width
      class="lg:hidden mb-4 justify-between"
    >
      <span class="font-medium text-gray-900">Filters</span>
      <Icon 
        :name="showMobileFilters ? 'heroicons:x-mark' : 'heroicons:funnel'" 
        class="h-5 w-5 text-gray-500" 
      />
    </BaseButton>

    <!-- Overlay for mobile -->
    <div 
      v-if="showMobileFilters"
      @click="closeMobileFilters"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
    ></div>

    <!-- Filters Panel -->
    <Transition 
      enter-active-class="transition-transform duration-300 ease-out" 
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0" 
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0" 
      leave-to-class="translate-x-full"
    >
      <div 
        v-if="showMobileFilters"
        class="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-white shadow-xl z-50 overflow-y-auto"
      >
      <!-- Mobile Header -->
      <div class="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold">Filters</h3>
        <BaseButton
          @click="closeMobileFilters"
          variant="ghost"
          size="sm"
          icon="heroicons:x-mark"
          rounded="full"
        />
      </div>

      <!-- Filter Content -->
      <div class="p-6">
        <!-- Desktop Header -->
        <h3 class="hidden lg:block text-lg font-semibold mb-4">Filters</h3>
    
    <!-- Price Range -->
    <div class="mb-6">
      <h4 class="font-medium mb-3">Price Range</h4>
      <div class="space-y-2">
        <input
          v-model="filters.minPrice"
          type="number"
          placeholder="Min Price"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          @input="updateFilters"
        >
        <input
          v-model="filters.maxPrice"
          type="number"
          placeholder="Max Price"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          @input="updateFilters"
        >
      </div>
    </div>

    <!-- Categories -->
    <div class="mb-6" v-if="categories.length > 0">
      <h4 class="font-medium mb-3">Categories</h4>
      <div class="space-y-2 max-h-40 overflow-y-auto">
        <label 
          v-for="category in categories" 
          :key="category.id"
          class="flex items-center"
        >
          <input
            type="checkbox"
            :value="category.id"
            v-model="filters.categories"
            @change="updateFilters"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-sm">{{ category.name }} ({{ category.count }})</span>
        </label>
      </div>
    </div>

    <!-- Product Attributes -->
    <div v-for="attribute in attributes" :key="attribute.id" class="mb-6">
      <h4 class="font-medium mb-3">{{ attribute.name }}</h4>
      <div class="space-y-2 max-h-40 overflow-y-auto">
        <label 
          v-for="term in attribute.terms" 
          :key="term.id"
          class="flex items-center"
        >
          <input
            type="checkbox"
            :value="term.slug"
            v-model="filters.attributes[attribute.slug]"
            @change="updateFilters"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-sm">{{ term.name }}</span>
        </label>
      </div>
    </div>

    <!-- Stock Status -->
    <div class="mb-6">
      <h4 class="font-medium mb-3">Availability</h4>
      <div class="space-y-2">
        <label class="flex items-center">
          <input
            type="checkbox"
            value="instock"
            v-model="filters.stockStatus"
            @change="updateFilters"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-sm">In Stock</span>
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            value="onbackorder"
            v-model="filters.stockStatus"
            @change="updateFilters"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-sm">On Backorder</span>
        </label>
      </div>
    </div>

    <!-- On Sale -->
    <div class="mb-6">
      <label class="flex items-center">
        <input
          type="checkbox"
          v-model="filters.onSale"
          @change="updateFilters"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        >
        <span class="ml-2 text-sm font-medium">On Sale</span>
      </label>
    </div>

    <!-- Featured -->
    <div class="mb-6">
      <label class="flex items-center">
        <input
          type="checkbox"
          v-model="filters.featured"
          @change="updateFilters"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        >
        <span class="ml-2 text-sm font-medium">Featured Products</span>
      </label>
    </div>

        <!-- Clear Filters -->
        <BaseButton
          @click="clearFilters"
          variant="secondary"
          size="sm"
          text="Clear All Filters"
          full-width
        />

        <!-- Mobile Apply Button -->
        <BaseButton
          @click="applyFiltersAndClose"
          text="Apply Filters"
          full-width
          size="lg"
          class="lg:hidden mt-4"
        />
      </div>
      </div>
    </Transition>

    <!-- Desktop Filters (always visible on lg+) -->
    <div class="hidden lg:block bg-white rounded-lg shadow-sm">
      <!-- Filter Content -->
      <div class="p-6">
        <!-- Desktop Header -->
        <h3 class="text-lg font-semibold mb-4">Filters</h3>
    
    <!-- Price Range -->
    <div class="mb-6">
      <h4 class="font-medium mb-3">Price Range</h4>
      <div class="space-y-2">
        <input
          v-model="filters.minPrice"
          type="number"
          placeholder="Min Price"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          @input="updateFilters"
        >
        <input
          v-model="filters.maxPrice"
          type="number"
          placeholder="Max Price"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          @input="updateFilters"
        >
      </div>
    </div>

    <!-- Categories -->
    <div class="mb-6" v-if="categories.length > 0">
      <h4 class="font-medium mb-3">Categories</h4>
      <div class="space-y-2 max-h-40 overflow-y-auto">
        <label 
          v-for="category in categories" 
          :key="category.id"
          class="flex items-center"
        >
          <input
            type="checkbox"
            :value="category.id"
            v-model="filters.categories"
            @change="updateFilters"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-sm">{{ category.name }} ({{ category.count }})</span>
        </label>
      </div>
    </div>

    <!-- Product Attributes -->
    <div v-for="attribute in attributes" :key="attribute.id" class="mb-6">
      <h4 class="font-medium mb-3">{{ attribute.name }}</h4>
      <div class="space-y-2 max-h-40 overflow-y-auto">
        <label 
          v-for="term in attribute.terms" 
          :key="term.id"
          class="flex items-center"
        >
          <input
            type="checkbox"
            :value="term.slug"
            v-model="filters.attributes[attribute.slug]"
            @change="updateFilters"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-sm">{{ term.name }}</span>
        </label>
      </div>
    </div>

    <!-- Stock Status -->
    <div class="mb-6">
      <h4 class="font-medium mb-3">Availability</h4>
      <div class="space-y-2">
        <label class="flex items-center">
          <input
            type="checkbox"
            value="instock"
            v-model="filters.stockStatus"
            @change="updateFilters"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-sm">In Stock</span>
        </label>
        <label class="flex items-center">
          <input
            type="checkbox"
            value="onbackorder"
            v-model="filters.stockStatus"
            @change="updateFilters"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-sm">On Backorder</span>
        </label>
      </div>
    </div>

    <!-- On Sale -->
    <div class="mb-6">
      <label class="flex items-center">
        <input
          type="checkbox"
          v-model="filters.onSale"
          @change="updateFilters"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        >
        <span class="ml-2 text-sm font-medium">On Sale</span>
      </label>
    </div>

    <!-- Featured -->
    <div class="mb-6">
      <label class="flex items-center">
        <input
          type="checkbox"
          v-model="filters.featured"
          @change="updateFilters"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        >
        <span class="ml-2 text-sm font-medium">Featured Products</span>
      </label>
    </div>

        <!-- Clear Filters -->
        <BaseButton
          @click="clearFilters"
          variant="secondary"
          size="sm"
          text="Clear All Filters"
          full-width
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  attributes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['filtersChanged'])

const filters = ref({
  minPrice: '',
  maxPrice: '',
  categories: [],
  attributes: {},
  stockStatus: [],
  onSale: false,
  featured: false
})

// Mobile filters state
const showMobileFilters = ref(false)

// Initialize attribute filters
watch(() => props.attributes, (newAttributes) => {
  newAttributes.forEach(attr => {
    if (!filters.value.attributes[attr.slug]) {
      filters.value.attributes[attr.slug] = []
    }
  })
}, { immediate: true })

const updateFilters = () => {
  emit('filtersChanged', { ...filters.value })
}

const clearFilters = () => {
  filters.value = {
    minPrice: '',
    maxPrice: '',
    categories: [],
    attributes: {},
    stockStatus: [],
    onSale: false,
    featured: false
  }
  
  // Reinitialize attribute filters
  props.attributes.forEach(attr => {
    filters.value.attributes[attr.slug] = []
  })
  
  updateFilters()
}

// Mobile filter methods
const toggleMobileFilters = () => {
  showMobileFilters.value = !showMobileFilters.value
  // Prevent body scroll when mobile filters are open
  if (showMobileFilters.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileFilters = () => {
  showMobileFilters.value = false
  document.body.style.overflow = ''
}

const applyFiltersAndClose = () => {
  updateFilters()
  closeMobileFilters()
}

// Close mobile filters when clicking outside or pressing escape
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeMobileFilters()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    // Clean up body overflow style
    document.body.style.overflow = ''
  })
})

// Expose filters and methods for parent component
defineExpose({
  filters,
  clearFilters,
  closeMobileFilters
})
</script>