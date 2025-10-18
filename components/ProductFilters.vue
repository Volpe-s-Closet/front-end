<template>
  <div class="bg-white p-6 rounded-lg shadow-sm">
    <h3 class="text-lg font-semibold mb-4">Filters</h3>
    
    <!-- Price Range -->
    <div class="mb-6">
      <h4 class="font-medium mb-3">Price Range</h4>
      <div class="space-y-2">
        <div class="flex space-x-2">
          <input
            v-model="filters.minPrice"
            type="number"
            placeholder="Min"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            @input="updateFilters"
          >
          <input
            v-model="filters.maxPrice"
            type="number"
            placeholder="Max"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            @input="updateFilters"
          >
        </div>
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
    <button
      @click="clearFilters"
      class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
    >
      Clear All Filters
    </button>
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

// Expose filters for parent component
defineExpose({
  filters
})
</script>