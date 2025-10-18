<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        <span v-if="searchQuery">Search Results for "{{ searchQuery }}"</span>
        <span v-else>All Products</span>
      </h1>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Filters Sidebar -->
      <div class="lg:w-1/4">
        <ProductFilters 
          :categories="categories"
          :attributes="attributes"
          @filtersChanged="handleFiltersChanged"
          ref="filtersRef"
        />
      </div>

      <!-- Products Grid -->
      <div class="lg:w-3/4">
        <!-- Sort and Results Info -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div class="text-gray-600">
            <span v-if="!loading">
              Showing {{ products.length }} of {{ totalProducts }} products
            </span>
          </div>
          
          <div class="flex items-center space-x-4">
            <label class="text-sm font-medium text-gray-700">Sort by:</label>
            <select 
              v-model="sortBy"
              @change="handleSortChange"
              class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="menu_order">Default</option>
              <option value="popularity">Popularity</option>
              <option value="rating">Average Rating</option>
              <option value="date">Latest</option>
              <option value="price">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 9" :key="i" class="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div class="bg-gray-300 h-48 rounded mb-4"></div>
            <div class="bg-gray-300 h-4 rounded mb-2"></div>
            <div class="bg-gray-300 h-4 rounded w-2/3"></div>
          </div>
        </div>

        <!-- Products Grid -->
        <div v-else-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard 
            v-for="product in products" 
            :key="product.id" 
            :product="product" 
          />
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-12">
          <Icon name="heroicons:magnifying-glass" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p class="text-gray-600 mb-4">
            <span v-if="searchQuery">Try adjusting your search terms or filters.</span>
            <span v-else>No products match your current filters.</span>
          </p>
          <button 
            @click="clearAllFilters"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Clear All Filters
          </button>
        </div>

        <!-- Load More Button -->
        <div v-if="products.length > 0 && products.length < totalProducts" class="text-center mt-8">
          <button 
            @click="loadMore"
            :disabled="loadingMore"
            class="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <Icon v-if="loadingMore" name="heroicons:arrow-path" class="h-5 w-5 animate-spin inline mr-2" />
            <span v-if="loadingMore">Loading...</span>
            <span v-else>Load More Products</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { getProducts, getCategories, getProductAttributes, getAttributeTerms } = useWooCommerce()

// SEO
useHead({
  title: 'All Products - Your Store',
  meta: [
    { name: 'description', content: 'Browse all products in our online store.' }
  ]
})

// Data
const products = ref([])
const categories = ref([])
const attributes = ref([])
const totalProducts = ref(0)
const currentPage = ref(1)
const perPage = 12

// Search and filters
const searchQuery = ref(route.query.q || '')
const sortBy = ref('menu_order')
const activeFilters = ref({})

// Loading states
const loading = ref(true)
const loadingMore = ref(false)

// Refs
const filtersRef = ref(null)

// Computed
const searchParams = computed(() => {
  const params = {
    per_page: perPage,
    page: currentPage.value,
    orderby: sortBy.value.includes('price') ? 'price' : sortBy.value,
    order: sortBy.value === 'price-desc' ? 'desc' : 'asc',
    status: 'publish'
  }

  if (searchQuery.value) {
    params.search = searchQuery.value
  }

  // Apply filters
  if (activeFilters.value.categories?.length > 0) {
    params.category = activeFilters.value.categories.join(',')
  }

  if (activeFilters.value.minPrice) {
    params.min_price = activeFilters.value.minPrice
  }

  if (activeFilters.value.maxPrice) {
    params.max_price = activeFilters.value.maxPrice
  }

  if (activeFilters.value.onSale) {
    params.on_sale = true
  }

  if (activeFilters.value.featured) {
    params.featured = true
  }

  if (activeFilters.value.stockStatus?.length > 0) {
    params.stock_status = activeFilters.value.stockStatus.join(',')
  }

  // Handle attribute filters
  Object.keys(activeFilters.value.attributes || {}).forEach(attrSlug => {
    const values = activeFilters.value.attributes[attrSlug]
    if (values?.length > 0) {
      params[`attribute_${attrSlug}`] = values.join(',')
    }
  })

  return params
})

// Methods
const fetchProducts = async (append = false) => {
  try {
    if (!append) {
      loading.value = true
      currentPage.value = 1
    } else {
      loadingMore.value = true
      currentPage.value++
    }

    const response = await getProducts(searchParams.value)
    
    if (append) {
      products.value = [...products.value, ...response]
    } else {
      products.value = response
    }

    // Note: WooCommerce doesn't return total count in headers by default
    // You might need to make a separate count request or use X-WP-Total header
    totalProducts.value = response.length < perPage ? products.value.length : products.value.length + 1

  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const fetchCategories = async () => {
  try {
    categories.value = await getCategories({ 
      per_page: 100,
      hide_empty: true
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const fetchAttributes = async () => {
  try {
    const attrs = await getProductAttributes()
    
    // Fetch terms for each attribute
    for (const attr of attrs) {
      try {
        const terms = await getAttributeTerms(attr.id)
        attr.terms = terms
        attr.slug = attr.slug || attr.name.toLowerCase().replace(/\s+/g, '-')
      } catch (error) {
        console.error(`Error fetching terms for attribute ${attr.name}:`, error)
        attr.terms = []
      }
    }
    
    attributes.value = attrs
  } catch (error) {
    console.error('Error fetching attributes:', error)
  }
}



const handleFiltersChanged = (filters) => {
  activeFilters.value = filters
  fetchProducts()
}

const handleSortChange = () => {
  fetchProducts()
}

const loadMore = () => {
  fetchProducts(true)
}

const clearAllFilters = () => {
  searchQuery.value = ''
  if (filtersRef.value) {
    filtersRef.value.clearFilters()
  }
  updateURL()
  fetchProducts()
}

const updateURL = () => {
  const query = {}
  if (searchQuery.value) {
    query.q = searchQuery.value
  }
  
  router.push({ 
    path: '/search', 
    query 
  })
}

// Watch for route changes
watch(() => route.query.q, (newQuery) => {
  searchQuery.value = newQuery || ''
  fetchProducts()
})

// Initialize
onMounted(() => {
  fetchProducts()
  fetchCategories()
  fetchAttributes()
})
</script>