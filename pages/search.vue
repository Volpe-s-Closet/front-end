<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        <span v-if="searchQuery">Search Results for "{{ searchQuery }}"</span>
        <span v-else>All Products</span>
      </h1>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 lg:gap-8">
      <!-- Filters Sidebar -->
      <div class="w-full lg:w-1/4">
        <div class="lg:sticky lg:top-4">
          <ProductFilters 
            :categories="categories"
            :attributes="attributes"
            @filtersChanged="handleFiltersChanged"
            ref="filtersRef"
          />
        </div>
      </div>

      <!-- Products Grid -->
      <div class="w-full lg:w-3/4">
        <!-- Controls Bar -->
        <div class="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-6">
          <!-- Mobile Layout -->
          <div class="block lg:hidden space-y-4">
            <!-- Top Row: View Mode and Grid Size -->
            <div class="flex flex-col xs:flex-row justify-center items-center gap-3 xs:gap-4">
              <!-- View Mode Toggle -->
              <div class="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  @click="viewMode = 'grid'"
                  :class="[
                    'flex items-center px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors',
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  <Icon name="heroicons:squares-2x2" class="h-4 w-4 mr-1 sm:mr-2" />
                  <span class="hidden xs:inline">Grid</span>
                </button>
                <button
                  @click="viewMode = 'list'"
                  :class="[
                    'flex items-center px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors',
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  <Icon name="heroicons:list-bullet" class="h-4 w-4 mr-1 sm:mr-2" />
                  <span class="hidden xs:inline">List</span>
                </button>
              </div>

              <!-- Grid Size Toggle (only show in grid mode) -->
              <div v-if="viewMode === 'grid'" class="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  @click="gridSize = 1"
                  :class="[
                    'flex items-center px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors',
                    gridSize === 1 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  <Icon name="heroicons:stop" class="h-4 w-4 mr-1 sm:mr-2" />
                  <span class="hidden xs:inline">1</span>
                </button>
                <button
                  @click="gridSize = 2"
                  :class="[
                    'flex items-center px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors',
                    gridSize === 2 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  ]"
                >
                  <Icon name="heroicons:squares-2x2" class="h-4 w-4 mr-1 sm:mr-2" />
                  <span class="hidden xs:inline">2</span>
                </button>
              </div>
            </div>
            
            <!-- Sort -->
            <div class="flex justify-center">
              <div class="relative" ref="dropdownRef">
                <button
                  @click="toggleDropdown"
                  class="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-gray-900 hover:bg-gray-200 transition-colors"
                >
                  <Icon :name="currentSortOption.icon" class="h-4 w-4 text-gray-600" />
                  <span class="hidden xs:inline">{{ currentSortOption.label }}</span>
                  <span class="xs:hidden">Sort</span>
                  <Icon name="heroicons:chevron-down" class="h-4 w-4 text-gray-600" />
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-if="isDropdownOpen"
                  class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                >
                  <div class="py-1">
                    <button
                      v-for="option in sortOptions"
                      :key="option.value"
                      @click="selectSortOption(option)"
                      :class="[
                        'flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors',
                        sortBy === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      ]"
                    >
                      <Icon :name="option.icon" class="h-4 w-4 mr-3 text-gray-500" />
                      {{ option.label }}
                      <Icon 
                        v-if="sortBy === option.value" 
                        name="heroicons:check" 
                        class="h-4 w-4 ml-auto text-blue-600" 
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop Layout -->
          <div class="hidden lg:block">
            <!-- Controls Row -->
            <div class="flex justify-between items-center">
              <!-- Left: View Mode and Grid Size -->
              <div class="flex items-center gap-4">
                <!-- View Mode Toggle -->
                <div class="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    @click="viewMode = 'grid'"
                    :class="[
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      viewMode === 'grid' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    ]"
                  >
                    <Icon name="heroicons:squares-2x2" class="h-4 w-4 mr-2" />
                    Grid
                  </button>
                  <button
                    @click="viewMode = 'list'"
                    :class="[
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      viewMode === 'list' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    ]"
                  >
                    <Icon name="heroicons:list-bullet" class="h-4 w-4 mr-2" />
                    List
                  </button>
                </div>

                <!-- Grid Size Toggle (only show in grid mode) -->
                <div v-if="viewMode === 'grid'" class="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    @click="gridSize = 2"
                    :class="[
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      gridSize === 2 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    ]"
                  >
                    <Icon name="heroicons:squares-2x2" class="h-4 w-4 mr-2" />
                    2
                  </button>
                  <button
                    @click="gridSize = 3"
                    :class="[
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      gridSize === 3 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    ]"
                  >
                    <Icon name="heroicons:view-columns" class="h-4 w-4 mr-2" />
                    3
                  </button>
                  <button
                    @click="gridSize = 4"
                    :class="[
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      gridSize === 4 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    ]"
                  >
                    <Icon name="heroicons:squares-plus" class="h-4 w-4 mr-2" />
                    4
                  </button>
                </div>
              </div>
              
              <!-- Right: Sort -->
              <div class="flex items-center space-x-3">
                <span class="text-sm font-medium text-gray-700">Sort by:</span>
                <div class="relative" ref="dropdownRef">
                  <button
                    @click="toggleDropdown"
                    class="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 transition-colors"
                  >
                    <Icon :name="currentSortOption.icon" class="h-4 w-4 text-gray-600" />
                    <span>{{ currentSortOption.label }}</span>
                    <Icon name="heroicons:chevron-down" class="h-4 w-4 text-gray-600" />
                  </button>

                  <!-- Dropdown Menu -->
                  <div
                    v-if="isDropdownOpen"
                    class="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    <div class="py-1">
                      <button
                        v-for="option in sortOptions"
                        :key="option.value"
                        @click="selectSortOption(option)"
                        :class="[
                          'flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors',
                          sortBy === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        ]"
                      >
                        <Icon :name="option.icon" class="h-4 w-4 mr-3 text-gray-500" />
                        {{ option.label }}
                        <Icon 
                          v-if="sortBy === option.value" 
                          name="heroicons:check" 
                          class="h-4 w-4 ml-auto text-blue-600" 
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" :class="getGridClasses()">
          <div v-for="i in perPage" :key="i" class="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div class="bg-gray-300 h-48 rounded mb-4"></div>
            <div class="bg-gray-300 h-4 rounded mb-2"></div>
            <div class="bg-gray-300 h-4 rounded w-2/3"></div>
          </div>
        </div>

        <!-- Products Display -->
        <div v-else-if="products.length > 0">
          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" :class="getGridClasses()">
            <ProductCard 
              v-for="product in products" 
              :key="product.id" 
              :product="product" 
            />
          </div>

          <!-- List View -->
          <div v-else class="space-y-4">
            <ProductCard 
              v-for="product in products" 
              :key="product.id" 
              :product="product" 
              :view-mode="'list'"
            />
          </div>
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

        <!-- Pagination and Controls -->
        <div v-if="products.length > 0" class="mt-6 sm:mt-8">
          <div class="border-t border-gray-200 bg-white px-3 py-4 sm:px-6 rounded-lg space-y-4">
            
            <!-- Items per page and Results Info -->
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
              <!-- Items per page -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Show:</label>
                <select 
                  v-model="perPage"
                  @change="handlePerPageChange"
                  class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option :value="6">6</option>
                  <option :value="12">12</option>
                  <option :value="24">24</option>
                  <option :value="36">36</option>
                  <option :value="48">48</option>
                </select>
                <span class="text-sm text-gray-600">per page</span>
              </div>

              <!-- Results Info -->
              <div class="text-sm text-gray-700 text-center sm:text-right">
                <span v-if="!loading">
                  Showing <span class="font-medium">{{ startItem }}</span> to <span class="font-medium">{{ endItem }}</span> of 
                  <span class="font-medium">{{ totalProducts }}</span> results
                </span>
              </div>
            </div>

            <!-- Pagination (only show if more than 1 page) -->
            <div v-if="totalPages > 1">
              <!-- Mobile Pagination -->
              <div class="flex flex-1 justify-between items-center sm:hidden">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage <= 1"
                  class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="heroicons:chevron-left" class="h-4 w-4 mr-1" />
                  Prev
                </button>
                
                <span class="text-sm text-gray-700">
                  Page {{ currentPage }} of {{ totalPages }}
                </span>
                
                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage >= totalPages"
                  class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <Icon name="heroicons:chevron-right" class="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <!-- Desktop Pagination -->
              <div class="hidden sm:flex sm:justify-center">
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <!-- Previous button -->
                  <button
                    @click="goToPage(currentPage - 1)"
                    :disabled="currentPage <= 1"
                    class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="heroicons:chevron-left" class="h-5 w-5" />
                  </button>

                  <!-- Page numbers -->
                  <template v-for="page in visiblePages" :key="page">
                    <button
                      v-if="page !== '...'"
                      @click="goToPage(page)"
                      :class="[
                        'relative inline-flex items-center px-3 lg:px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
                        page === currentPage 
                          ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600' 
                          : 'text-gray-900'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <span
                      v-else
                      class="relative inline-flex items-center px-3 lg:px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                    >
                      ...
                    </span>
                  </template>

                  <!-- Next button -->
                  <button
                    @click="goToPage(currentPage + 1)"
                    :disabled="currentPage >= totalPages"
                    class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="heroicons:chevron-right" class="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
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
const perPage = ref(12)
const totalPages = ref(0)

// View settings
const viewMode = ref('grid') // 'grid' or 'list'
const gridSize = ref(2) // Default to 2 columns for better mobile experience

// Search and filters
const searchQuery = ref(route.query.q || '')
const sortBy = ref('menu_order')
const activeFilters = ref({})

// Sort options with icons
const sortOptions = [
  { value: 'menu_order', label: 'Default', icon: 'heroicons:bars-3' },
  { value: 'popularity', label: 'Popularity', icon: 'heroicons:fire' },
  { value: 'rating', label: 'Average Rating', icon: 'heroicons:star' },
  { value: 'date', label: 'Latest', icon: 'heroicons:clock' },
  { value: 'price', label: 'Price: Low to High', icon: 'heroicons:arrow-up' },
  { value: 'price-desc', label: 'Price: High to Low', icon: 'heroicons:arrow-down' }
]

// Custom dropdown state
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

// Get current sort option
const currentSortOption = computed(() => {
  return sortOptions.find(option => option.value === sortBy.value) || sortOptions[0]
})

// Toggle dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// Select sort option
const selectSortOption = (option) => {
  sortBy.value = option.value
  isDropdownOpen.value = false
  handleSortChange()
}

// Close dropdown when clicking outside
const closeDropdown = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

// Loading states
const loading = ref(true)
const loadingMore = ref(false)

// Refs
const filtersRef = ref(null)

// Computed
const searchParams = computed(() => {
  const params = {
    per_page: perPage.value,
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

const startItem = computed(() => {
  return totalProducts.value > 0 ? (currentPage.value - 1) * perPage.value + 1 : 0
})

const endItem = computed(() => {
  return Math.min(currentPage.value * perPage.value, totalProducts.value)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    if (current > 4) {
      pages.push('...')
    }
    
    // Show pages around current page
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (current < total - 3) {
      pages.push('...')
    }
    
    // Always show last page
    if (total > 1) {
      pages.push(total)
    }
  }
  
  return pages
})

// Watchers
// Ensure grid size is valid for current screen size
watch(gridSize, (newSize) => {
  // On mobile (when we only show 1-2 column options), ensure grid size is valid
  if (process.client) {
    const isMobile = window.innerWidth < 1024 // lg breakpoint
    if (isMobile && newSize > 2) {
      gridSize.value = 2
    }
  }
})

// Methods
// Reactive screen size tracking
const isMobile = ref(false)

const getGridClasses = () => {
  const baseClasses = 'grid gap-4 sm:gap-6'
  
  if (viewMode.value === 'list') {
    return `${baseClasses} grid-cols-1`
  }
  
  switch (gridSize.value) {
    case 1:
      return `${baseClasses} grid-cols-1`
    case 2:
      // On mobile, show 2 columns immediately if user selected 2
      // On desktop, use responsive classes for better breakpoint handling
      return isMobile.value 
        ? `${baseClasses} grid-cols-2`
        : `${baseClasses} grid-cols-1 sm:grid-cols-2`
    case 3:
      return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
    case 4:
      return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
    default:
      return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
  }
}

const fetchProducts = async (resetPage = true) => {
  try {
    if (resetPage) {
      currentPage.value = 1
    }
    
    loading.value = true

    // Get actual products
    const response = await getProducts(searchParams.value)
    products.value = response
    
    // For pagination, we need to estimate total count
    // WooCommerce API might not always provide exact totals
    if (response.length < perPage.value) {
      // If we got less than a full page, we're at the end
      totalProducts.value = (currentPage.value - 1) * perPage.value + response.length
    } else {
      // If we got a full page, assume there might be more
      // This is an estimation - for exact counts, you'd need to configure WooCommerce to return totals
      totalProducts.value = Math.max(
        totalProducts.value,
        currentPage.value * perPage.value + 1
      )
    }
    
    totalPages.value = Math.ceil(totalProducts.value / perPage.value)

  } catch (error) {
    console.error('Error fetching products:', error)
    products.value = []
    totalProducts.value = 0
    totalPages.value = 0
  } finally {
    loading.value = false
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

const handlePerPageChange = () => {
  fetchProducts()
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProducts(false)
    // Scroll to top of products
    document.querySelector('.lg\\:w-3\\/4')?.scrollIntoView({ behavior: 'smooth' })
  }
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

// Handle responsive grid size adjustment
let resizeTimeout = null
const handleResize = () => {
  // Debounce resize events for better performance
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
  
  resizeTimeout = setTimeout(() => {
    const currentIsMobile = window.innerWidth < 1024 // lg breakpoint
    isMobile.value = currentIsMobile
    
    if (currentIsMobile) {
      // On mobile, limit to max 2 columns
      // If user had 3 or 4 columns selected, change to 2
      // If user had 1 or 2 columns, keep their selection
      if (gridSize.value > 2) {
        gridSize.value = 2
      }
    }
    // On desktop, no automatic changes needed - user can select any option
  }, 150) // 150ms debounce
}

// Initialize
onMounted(() => {
  // Initial screen size detection and grid size validation
  isMobile.value = window.innerWidth < 1024
  handleResize()
  
  // Add resize listener
  window.addEventListener('resize', handleResize)
  
  // Add click outside listener for dropdown
  document.addEventListener('click', closeDropdown)
  
  fetchProducts()
  fetchCategories()
  fetchAttributes()
})

// Cleanup
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', closeDropdown)
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
})
</script>