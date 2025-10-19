<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Our Store
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-blue-100">
            Discover amazing products at unbeatable prices
          </p>
          <div class="space-x-4">
            <NuxtLink to="/search"
              class="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200">
              Shop Now
            </NuxtLink>
            <NuxtLink to="/categories"
              class="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200">
              Browse Categories
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Check out our handpicked selection of the best products
          </p>
        </div>

        <div v-if="featuredLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div class="bg-gray-300 h-48 rounded mb-4"></div>
            <div class="bg-gray-300 h-4 rounded mb-2"></div>
            <div class="bg-gray-300 h-4 rounded w-2/3"></div>
          </div>
        </div>

        <div v-else-if="featuredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-500">No featured products available at the moment.</p>
        </div>
      </div>
    </section>

    <!-- Categories Preview -->
    <section class="bg-gray-100 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of product categories
          </p>
        </div>

        <div v-if="categoriesLoading" class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-white rounded-lg shadow-md p-6 text-center animate-pulse">
            <div class="bg-gray-300 h-16 w-16 rounded-full mx-auto mb-4"></div>
            <div class="bg-gray-300 h-4 rounded"></div>
          </div>
        </div>

        <div v-else-if="categories.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <NuxtLink v-for="category in categories.slice(0, 8)" :key="category.id" :to="`/category/${category.slug}`"
            class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:tag" class="h-8 w-8 text-blue-600" />
            </div>
            <h3 class="font-semibold text-gray-900">{{ category.name }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ category.count }} products</p>
          </NuxtLink>
        </div>

        <div class="text-center mt-8">
          <NuxtLink to="/categories"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            View All Categories
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Products -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Latest Products</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Discover our newest arrivals
          </p>
        </div>

        <div v-if="latestLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div class="bg-gray-300 h-48 rounded mb-4"></div>
            <div class="bg-gray-300 h-4 rounded mb-2"></div>
            <div class="bg-gray-300 h-4 rounded w-2/3"></div>
          </div>
        </div>

        <div v-else-if="latestProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard v-for="product in latestProducts" :key="product.id" :product="product" />
        </div>

        <div class="text-center mt-8">
          <NuxtLink to="/search"
            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            View All Products
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// SEO
useHead({
  title: 'Home - Your Store',
  meta: [
    { name: 'description', content: 'Welcome to our online store. Discover amazing products at unbeatable prices.' }
  ]
})

const { getProducts } = useProducts()
const { categories, categoriesLoading, fetchCategories } = useCategories()

// Data
const featuredProducts = ref([])
const latestProducts = ref([])

// Loading states
const featuredLoading = ref(true)
const latestLoading = ref(true)

// Fetch data
const fetchFeaturedProducts = async () => {
  try {
    featuredLoading.value = true
    const products = await getProducts({
      featured: true,
      per_page: 8,
      status: 'publish'
    })
    featuredProducts.value = products
  } catch (error) {
    console.error('Error fetching featured products:', error)
    featuredProducts.value = []
  } finally {
    featuredLoading.value = false
  }
}

const fetchLatestProducts = async () => {
  try {
    latestLoading.value = true
    const products = await getProducts({
      orderby: 'date',
      order: 'desc',
      per_page: 8,
      status: 'publish'
    })
    latestProducts.value = products
  } catch (error) {
    console.error('Error fetching latest products:', error)
    latestProducts.value = []
  } finally {
    latestLoading.value = false
  }
}



// Initialize data on mount
onMounted(() => {
  fetchFeaturedProducts()
  fetchLatestProducts()
  fetchCategories()
})
</script>