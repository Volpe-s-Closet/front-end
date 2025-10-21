<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section with Featured Products Slider -->
    <section class="relative bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <!-- Hero Content -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
           Hola mundo
          </h1>
          <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Curated collection of premium products designed to elevate your lifestyle
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/search"
              class="bg-gray-900 text-white hover:bg-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Explore Collection
            </NuxtLink>
            <NuxtLink to="/categories"
              class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Browse Categories
            </NuxtLink>
          </div>
        </div>

        <!-- Featured Products Slider -->
        <div class="relative">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p class="text-gray-600">Handpicked selections just for you</p>
          </div>

          <div v-if="featuredLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
              <div class="bg-gray-100 h-48 rounded-lg mb-4"></div>
              <div class="bg-gray-200 h-4 rounded mb-2"></div>
              <div class="bg-gray-200 h-4 rounded w-2/3"></div>
            </div>
          </div>

          <div v-else-if="featuredProducts.length > 0" class="relative">
            <!-- Slider Container -->
            <div class="overflow-hidden">
              <div class="flex transition-transform duration-500 ease-in-out"
                :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                <div v-for="(slide, index) in productSlides" :key="index" class="w-full flex-shrink-0">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                    <NuxtLink v-for="product in slide" :key="product.id" :to="`/product/${product.slug}`"
                      class="group bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer block">
                      <div class="aspect-square overflow-hidden rounded-lg mb-4 bg-gray-50">
                        <img :src="getProductImage(product)" :alt="product.name"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                      </div>
                      <h3 class="text-gray-900 font-semibold text-lg mb-2 line-clamp-2" v-html="product.name"></h3>
                      <div class="flex items-center justify-between">
                        <span class="text-xl font-bold text-gray-900" v-html="product.price_html"></span>
                        <span
                          class="bg-gray-900 group-hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                          View Details
                        </span>
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slider Controls -->
            <div v-if="productSlides.length > 1" class="flex justify-center mt-8 space-x-2">
              <button v-for="(slide, index) in productSlides" :key="index" @click="currentSlide = index" :class="[
                'w-3 h-3 rounded-full transition-all duration-200',
                currentSlide === index ? 'bg-gray-900' : 'bg-gray-300 hover:bg-gray-400'
              ]"></button>
            </div>

            <!-- Navigation Arrows -->
            <button v-if="productSlides.length > 1" @click="previousSlide"
              class="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 hover:bg-gray-50 rounded-full p-3 transition-all duration-200 shadow-sm">
              <Icon name="heroicons:chevron-left" class="h-6 w-6 text-gray-600" />
            </button>
            <button v-if="productSlides.length > 1" @click="nextSlide"
              class="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 hover:bg-gray-50 rounded-full p-3 transition-all duration-200 shadow-sm">
              <Icon name="heroicons:chevron-right" class="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Most Sold Products -->
    <section class="py-16 bg-gray-50 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Best Sellers</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Products loved by thousands of customers worldwide
          </p>
        </div>

        <div v-if="bestSellersLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
            <div class="bg-gray-100 h-48 rounded-lg mb-4"></div>
            <div class="bg-gray-200 h-4 rounded mb-2"></div>
            <div class="bg-gray-200 h-4 rounded w-2/3"></div>
          </div>
        </div>

        <div v-else-if="bestSellers.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink v-for="(product, index) in bestSellers" :key="product.id" :to="`/product/${product.slug}`"
            class="group relative bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer block">
            <!-- Bestseller Badge -->
            <div class="absolute -top-2 -right-2 z-10 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-full">
              #{{ index + 1 }}
            </div>

            <div class="p-5">
              <div class="aspect-square overflow-hidden rounded-lg mb-4 bg-gray-50">
                <img :src="getProductImage(product)" :alt="product.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
              </div>
              <h3 class="text-gray-900 font-semibold text-lg mb-2 line-clamp-2" v-html="product.name"></h3>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-gray-900" v-html="product.price_html"></span>
                <span
                  class="bg-gray-900 group-hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  View Details
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="text-center mt-10">
          <NuxtLink to="/search?orderby=popularity"
            class="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
            View All Best Sellers
            <Icon name="heroicons:arrow-right" class="ml-2 h-4 w-4" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Products -->
    <section class="py-16 bg-white border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Fresh additions to our collection, just for you
          </p>
        </div>

        <div v-if="latestLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
            <div class="bg-gray-100 h-48 rounded-lg mb-4"></div>
            <div class="bg-gray-200 h-4 rounded mb-2"></div>
            <div class="bg-gray-200 h-4 rounded w-2/3"></div>
          </div>
        </div>

        <div v-else-if="latestProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink v-for="product in latestProducts" :key="product.id" :to="`/product/${product.slug}`"
            class="group bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden cursor-pointer block">
            <!-- New Badge -->
            <div class="absolute top-3 left-3 z-10 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-full">
              NEW
            </div>

            <div class="p-5">
              <div class="aspect-square overflow-hidden rounded-lg mb-4 bg-gray-50">
                <img :src="getProductImage(product)" :alt="product.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
              </div>
              <h3 class="text-gray-900 font-semibold text-lg mb-2 line-clamp-2" v-html="product.name"></h3>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-gray-900" v-html="product.price_html"></span>
                <span
                  class="bg-gray-900 group-hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  View Details
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="text-center mt-10">
          <NuxtLink to="/search?orderby=date"
            class="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
            View All New Arrivals
            <Icon name="heroicons:arrow-right" class="ml-2 h-4 w-4" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Popular Blog Posts -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Latest Stories</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Insights, tips, and inspiration from our community
          </p>
        </div>

        <div v-if="blogLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
            <div class="bg-gray-100 h-48"></div>
            <div class="p-5">
              <div class="bg-gray-200 h-4 rounded mb-2"></div>
              <div class="bg-gray-200 h-4 rounded w-2/3 mb-4"></div>
              <div class="bg-gray-200 h-3 rounded mb-2"></div>
              <div class="bg-gray-200 h-3 rounded mb-2"></div>
              <div class="bg-gray-200 h-3 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <div v-else-if="blogPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article v-for="post in blogPosts" :key="post.id"
            class="group bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <!-- Featured Image -->
            <div v-if="getFeaturedImageUrl(post)" class="aspect-video overflow-hidden">
              <img :src="getFeaturedImageUrl(post)" :alt="post.title.rendered"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
            </div>

            <div class="p-6">
              <!-- Post Meta -->
              <div class="flex items-center text-sm text-gray-500 mb-3">
                <time :datetime="post.date">{{ formatPostDate(post.date) }}</time>
                <span class="mx-2">•</span>
                <span class="text-purple-600 font-medium">{{ getReadTime(post) }} min read</span>
              </div>

              <!-- Post Title -->
              <h3
                class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                <NuxtLink :to="`/blog/${post.slug}`" v-html="post.title.rendered"></NuxtLink>
              </h3>

              <!-- Post Excerpt -->
              <p class="text-gray-600 mb-4 line-clamp-3">
                {{ formatExcerpt(post.excerpt) }}
              </p>

              <!-- Read More -->
              <NuxtLink :to="`/blog/${post.slug}`"
                class="inline-flex items-center text-gray-700 hover:text-gray-900 font-semibold group-hover:translate-x-1 transition-all duration-200">
                Read Article
                <Icon name="heroicons:arrow-right" class="ml-2 h-4 w-4" />
              </NuxtLink>
            </div>
          </article>
        </div>

        <div class="text-center mt-10">
          <NuxtLink to="/blog"
            class="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
            View All Articles
            <Icon name="heroicons:arrow-right" class="ml-2 h-4 w-4" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// SEO
useHead({
  title: 'Home - Premium Products & Latest Stories',
  meta: [
    { name: 'description', content: 'Discover our curated collection of premium products, best sellers, and latest arrivals. Read inspiring stories from our community.' }
  ]
})

const { getProducts, getProductImage } = useProducts()
const { getPosts, formatExcerpt, formatPostDate, getFeaturedImageUrl } = useBlog()

// Data
const featuredProducts = ref([])
const latestProducts = ref([])
const bestSellers = ref([])
const blogPosts = ref([])

// Loading states
const featuredLoading = ref(true)
const latestLoading = ref(true)
const bestSellersLoading = ref(true)
const blogLoading = ref(true)

// Slider state
const currentSlide = ref(0)
const slideInterval = ref(null)

// Computed properties
const productSlides = computed(() => {
  if (featuredProducts.value.length === 0) return []

  const slides = []
  const itemsPerSlide = 6 // 3 columns on desktop, 2 on tablet, 1 on mobile

  for (let i = 0; i < featuredProducts.value.length; i += itemsPerSlide) {
    slides.push(featuredProducts.value.slice(i, i + itemsPerSlide))
  }

  return slides
})

// Slider methods
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % productSlides.value.length
}

const previousSlide = () => {
  currentSlide.value = currentSlide.value === 0
    ? productSlides.value.length - 1
    : currentSlide.value - 1
}

const startAutoSlide = () => {
  if (productSlides.value.length > 1) {
    slideInterval.value = setInterval(nextSlide, 5000) // Auto-advance every 5 seconds
  }
}

const stopAutoSlide = () => {
  if (slideInterval.value) {
    clearInterval(slideInterval.value)
    slideInterval.value = null
  }
}

// Utility functions
const getReadTime = (post) => {
  const content = post.content?.rendered || post.excerpt?.rendered || ''
  const wordsPerMinute = 200
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

// Fetch data functions
const fetchFeaturedProducts = async () => {
  try {
    featuredLoading.value = true
    const products = await getProducts({
      featured: true,
      per_page: 12,
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

const fetchBestSellers = async () => {
  try {
    bestSellersLoading.value = true
    const products = await getProducts({
      orderby: 'popularity',
      order: 'desc',
      per_page: 8,
      status: 'publish'
    })
    bestSellers.value = products
  } catch (error) {
    console.error('Error fetching best sellers:', error)
    bestSellers.value = []
  } finally {
    bestSellersLoading.value = false
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

const fetchBlogPosts = async () => {
  try {
    blogLoading.value = true
    const posts = await getPosts({
      per_page: 6,
      status: 'publish',
      orderby: 'date',
      order: 'desc',
      _embed: true
    })
    blogPosts.value = posts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    blogPosts.value = []
  } finally {
    blogLoading.value = false
  }
}

// Watch for slide changes to restart auto-advance
watch(productSlides, () => {
  stopAutoSlide()
  nextTick(() => {
    startAutoSlide()
  })
})

// Initialize data on mount
onMounted(() => {
  fetchFeaturedProducts()
  fetchBestSellers()
  fetchLatestProducts()
  fetchBlogPosts()
})

// Cleanup on unmount
onUnmounted(() => {
  stopAutoSlide()
})
</script>

