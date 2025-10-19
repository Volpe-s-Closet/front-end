<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section with Featured Products Slider -->
    <section class="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-pattern opacity-20"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <!-- Hero Content -->
        <div class="text-center mb-16">
          <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Discover
            <span class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Excellence
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Curated collection of premium products designed to elevate your lifestyle
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/search"
              class="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Explore Collection
            </NuxtLink>
            <NuxtLink to="/categories"
              class="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              Browse Categories
            </NuxtLink>
          </div>
        </div>

        <!-- Featured Products Slider -->
        <div class="relative">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-white mb-2">Featured Products</h2>
            <p class="text-gray-300">Handpicked selections just for you</p>
          </div>

          <div v-if="featuredLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
              <div class="bg-white/20 h-48 rounded-xl mb-4"></div>
              <div class="bg-white/20 h-4 rounded mb-2"></div>
              <div class="bg-white/20 h-4 rounded w-2/3"></div>
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
                      class="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20 cursor-pointer block">
                      <div class="aspect-square overflow-hidden rounded-xl mb-4 bg-white">
                        <img :src="getProductImage(product)" :alt="product.name"
                          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                      </div>
                      <h3 class="text-white font-semibold text-lg mb-2 line-clamp-2" v-html="product.name"></h3>
                      <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-purple-300" v-html="product.price_html"></span>
                        <span
                          class="bg-purple-500 group-hover:bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200">
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
                currentSlide === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
              ]"></button>
            </div>

            <!-- Navigation Arrows -->
            <button v-if="productSlides.length > 1" @click="previousSlide"
              class="absolute left-0 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200">
              <Icon name="heroicons:chevron-left" class="h-6 w-6 text-white" />
            </button>
            <button v-if="productSlides.length > 1" @click="nextSlide"
              class="absolute right-0 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200">
              <Icon name="heroicons:chevron-right" class="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Most Sold Products -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
            <Icon name="heroicons:fire" class="h-8 w-8 text-orange-600" />
          </div>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Best Sellers</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Products loved by thousands of customers worldwide
          </p>
        </div>

        <div v-if="bestSellersLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="i in 8" :key="i" class="bg-gray-100 rounded-2xl p-6 animate-pulse">
            <div class="bg-gray-300 h-48 rounded-xl mb-4"></div>
            <div class="bg-gray-300 h-4 rounded mb-2"></div>
            <div class="bg-gray-300 h-4 rounded w-2/3"></div>
          </div>
        </div>

        <div v-else-if="bestSellers.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <NuxtLink v-for="(product, index) in bestSellers" :key="product.id" :to="`/product/${product.slug}`"
            class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer block">
            <!-- Bestseller Badge -->
            <div
              class="absolute -top-3 -right-3 z-10 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              #{{ index + 1 }}
            </div>

            <div class="p-6">
              <div class="aspect-square overflow-hidden rounded-xl mb-4 bg-gray-50">
                <img :src="getProductImage(product)" :alt="product.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
              </div>
              <h3 class="text-gray-900 font-semibold text-lg mb-2 line-clamp-2" v-html="product.name"></h3>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-gray-900" v-html="product.price_html"></span>
                <span
                  class="bg-orange-500 group-hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200">
                  View Details
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="text-center mt-12">
          <NuxtLink to="/search?orderby=popularity"
            class="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            View All Best Sellers
            <Icon name="heroicons:arrow-right" class="ml-2 h-5 w-5" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Products -->
    <section class="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Icon name="heroicons:sparkles" class="h-8 w-8 text-blue-600" />
          </div>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">New Arrivals</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Fresh additions to our collection, just for you
          </p>
        </div>

        <div v-if="latestLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="i in 8" :key="i" class="bg-white rounded-2xl p-6 animate-pulse shadow-lg">
            <div class="bg-gray-300 h-48 rounded-xl mb-4"></div>
            <div class="bg-gray-300 h-4 rounded mb-2"></div>
            <div class="bg-gray-300 h-4 rounded w-2/3"></div>
          </div>
        </div>

        <div v-else-if="latestProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <NuxtLink v-for="product in latestProducts" :key="product.id" :to="`/product/${product.slug}`"
            class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden cursor-pointer block">
            <!-- New Badge -->
            <div class="absolute top-4 left-4 z-10 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              NEW
            </div>

            <div class="p-6">
              <div class="aspect-square overflow-hidden rounded-xl mb-4 bg-gray-50">
                <img :src="getProductImage(product)" :alt="product.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
              </div>
              <h3 class="text-gray-900 font-semibold text-lg mb-2 line-clamp-2" v-html="product.name"></h3>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-gray-900" v-html="product.price_html"></span>
                <span
                  class="bg-blue-500 group-hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200">
                  View Details
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="text-center mt-12">
          <NuxtLink to="/search?orderby=date"
            class="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            View All New Arrivals
            <Icon name="heroicons:arrow-right" class="ml-2 h-5 w-5" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Popular Blog Posts -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
            <Icon name="heroicons:document-text" class="h-8 w-8 text-purple-600" />
          </div>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Latest Stories</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Insights, tips, and inspiration from our community
          </p>
        </div>

        <div v-if="blogLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="bg-gray-100 rounded-2xl overflow-hidden animate-pulse">
            <div class="bg-gray-300 h-48"></div>
            <div class="p-6">
              <div class="bg-gray-300 h-4 rounded mb-2"></div>
              <div class="bg-gray-300 h-4 rounded w-2/3 mb-4"></div>
              <div class="bg-gray-300 h-3 rounded mb-2"></div>
              <div class="bg-gray-300 h-3 rounded mb-2"></div>
              <div class="bg-gray-300 h-3 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <div v-else-if="blogPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article v-for="post in blogPosts" :key="post.id"
            class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
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
                class="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                <NuxtLink :to="`/blog/${post.slug}`" v-html="post.title.rendered"></NuxtLink>
              </h3>

              <!-- Post Excerpt -->
              <p class="text-gray-600 mb-4 line-clamp-3">
                {{ formatExcerpt(post.excerpt) }}
              </p>

              <!-- Read More -->
              <NuxtLink :to="`/blog/${post.slug}`"
                class="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold group-hover:translate-x-1 transition-all duration-200">
                Read Article
                <Icon name="heroicons:arrow-right" class="ml-2 h-4 w-4" />
              </NuxtLink>
            </div>
          </article>
        </div>

        <div class="text-center mt-12">
          <NuxtLink to="/blog"
            class="inline-flex items-center bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            View All Articles
            <Icon name="heroicons:arrow-right" class="ml-2 h-5 w-5" />
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar for slider */
.slider-container::-webkit-scrollbar {
  display: none;
}

.slider-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

.group:hover .group-hover\:text-purple-600 {
  color: rgb(147 51 234);
}

/* Background patterns */
.bg-pattern {
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0);
  background-size: 20px 20px;
}
</style>