<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Category Header -->
    <div class="mb-8">
      <nav class="flex mb-4" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <NuxtLink to="/" class="text-gray-500 hover:text-gray-700">Home</NuxtLink>
          </li>
          <Icon name="heroicons:chevron-right" class="h-4 w-4 text-gray-400" />
          <li>
            <NuxtLink to="/categories" class="text-gray-500 hover:text-gray-700">Categories</NuxtLink>
          </li>
          <Icon name="heroicons:chevron-right" class="h-4 w-4 text-gray-400" />
          <li class="text-gray-900 font-medium">{{ category?.name }}</li>
        </ol>
      </nav>

      <div v-if="category" class="flex flex-col md:flex-row md:items-center gap-6">
        <div v-if="category.image?.src" class="flex-shrink-0">
          <img 
            :src="category.image.src" 
            :alt="category.name"
            class="w-24 h-24 object-cover rounded-lg"
          >
        </div>
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ category.name }}</h1>
          <p v-if="category.description" class="text-gray-600 mb-4" v-html="category.description"></p>
          <p class="text-sm text-gray-500">{{ category.count }} products available</p>
        </div>
      </div>

      <div v-else class="animate-pulse">
        <div class="bg-gray-300 h-8 rounded w-1/3 mb-4"></div>
        <div class="bg-gray-300 h-4 rounded w-2/3"></div>
      </div>
    </div>

    <!-- Subcategories -->
    <div v-if="subcategories.length > 0" class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Subcategories</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <NuxtLink 
          v-for="subcategory in subcategories" 
          :key="subcategory.id"
          :to="`/category/${subcategory.slug}`"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 text-center"
        >
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="heroicons:tag" class="h-6 w-6 text-blue-600" />
          </div>
          <h3 class="font-medium text-sm">{{ subcategory.name }}</h3>
          <p class="text-xs text-gray-600 mt-1">{{ subcategory.count }} items</p>
        </NuxtLink>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Filters Sidebar -->
      <div class="lg:w-1/4">
        <ProductFilters 
          :categories="[category].filter(Boolean)"
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
          <p class="text-gray-600 mb-4">No products match your current filters in this category.</p>
          <BaseButton 
            @click="clearAllFilters"
            text="Clear All Filters"
          />
        </div>

        <!-- Load More Button -->
        <div v-if="products.length > 0 && products.length < totalProducts" class="text-center mt-8">
          <BaseButton 
            @click="loadMore"
            :loading="loadingMore"
            :disabled="loadingMore"
            text="Load More Products"
            variant="secondary"
            size="lg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { getProducts, getProductAttributes, getAttributeTerms } = useProducts()
const { getCategories, getCategory } = useCategories()

// SEO
const category = ref(null)
useHead(() => ({
  title: category.value ? `${category.value.name} - Your Store` : 'Category - Your Store',
  meta: [
    { 
      name: 'description', 
      content: category.value?.description || `Browse products in the ${category.value?.name} category.`
    }
  ]
}))

// Data
const products = ref([])
const subcategories = ref([])
const attributes = ref([])
const totalProducts = ref(0)
const currentPage = ref(1)
const perPage = 12

// Search and filters
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

  // Add category filter
  if (category.value) {
    params.category = category.value.id
  }

  // Apply additional filters
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
const fetchCategory = async () => {
  try {
    // First try to find category by slug in the categories list
    const categories = await getCategories({ slug: route.params.slug })
    if (categories.length > 0) {
      category.value = categories[0]
    }
  } catch (error) {
    console.error('Error fetching category:', error)
    // Handle 404 - category not found
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }
}

const fetchSubcategories = async () => {
  if (!category.value) return
  
  try {
    subcategories.value = await getCategories({ 
      parent: category.value.id,
      hide_empty: true
    })
  } catch (error) {
    console.error('Error fetching subcategories:', error)
  }
}

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

    // Estimate total products (WooCommerce doesn't always return total count)
    totalProducts.value = response.length < perPage ? products.value.length : products.value.length + 1

  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
    loadingMore.value = false
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
  if (filtersRef.value) {
    filtersRef.value.clearFilters()
  }
  fetchProducts()
}

// Initialize
onMounted(async () => {
  await fetchCategory()
  if (category.value) {
    await Promise.all([
      fetchSubcategories(),
      fetchProducts(),
      fetchAttributes()
    ])
  }
})

// Watch for route changes
watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) {
    await fetchCategory()
    if (category.value) {
      await Promise.all([
        fetchSubcategories(),
        fetchProducts(),
        fetchAttributes()
      ])
    }
  }
})
</script>