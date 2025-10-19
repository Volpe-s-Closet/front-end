<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="pending" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>

    <div v-else-if="error" class="text-center py-16">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
      <p class="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
      <BaseButton to="/" text="Back to Home" size="lg" />
    </div>

    <div v-else-if="product">
      <!-- Breadcrumb -->
      <div class="bg-white border-b">
        <div class="container mx-auto px-4 py-3">
          <nav class="text-sm">
            <ol class="flex items-center space-x-2">
              <li>
                <NuxtLink to="/" class="text-gray-600 hover:text-gray-900">Home</NuxtLink>
              </li>
              <li class="text-gray-400">/</li>
              <li v-if="product.categories && product.categories[0]">
                <NuxtLink :to="`/category/${product.categories[0].slug}`" class="text-gray-600 hover:text-gray-900">
                  {{ product.categories[0].name }}
                </NuxtLink>
              </li>
              <li v-if="product.categories && product.categories[0]" class="text-gray-400">/</li>
              <li class="text-gray-900 font-medium">{{ product.name }}</li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- Main Product Section -->
      <div class="bg-white">
        <div class="container mx-auto px-4 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <!-- Product Images -->
            <div class="lg:col-span-3">
              <ProductImageGallery :product="product" :selected-variation="selectedVariation" />
            </div>

            <!-- Product Details Sidebar -->
            <div class="lg:col-span-2">
              <div class="sticky top-8 space-y-6">
                <div>
                  <h1 class="text-2xl font-bold text-gray-900 mb-3">{{ product.name }}</h1>

                  <!-- Rating -->
                  <div v-if="product.average_rating > 0" class="flex items-center space-x-2 mb-4">
                    <div class="flex items-center">
                      <span v-for="i in 5" :key="i" class="text-yellow-400 text-lg">
                        {{ i <= Math.floor(product.average_rating) ? '★' : '☆' }} </span>
                    </div>
                    <span class="text-sm text-gray-600">({{ product.rating_count }} reviews)</span>
                  </div>

                  <!-- Price -->
                  <div class="flex items-center space-x-3 mb-4">
                    <span class="text-3xl font-bold text-gray-900">
                      {{ formatPrice(selectedVariation?.price || product.price) }}
                    </span>
                    <span
                      v-if="(selectedVariation?.regular_price || product.regular_price) && (selectedVariation?.regular_price || product.regular_price) !== (selectedVariation?.price || product.price)"
                      class="text-xl text-gray-500 line-through">
                      {{ formatPrice(selectedVariation?.regular_price || product.regular_price) }}
                    </span>
                    <span v-if="(selectedVariation?.sale_price || product.sale_price)"
                      class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      Sale!
                    </span>
                  </div>
                </div>

                <!-- Short Description -->
                <div v-if="product.short_description" class="prose prose-sm text-gray-600 border-b pb-6">
                  <div v-html="product.short_description"></div>
                </div>

                <!-- Product Variations -->
                <div v-if="hasVariations" class="space-y-4 border-b pb-6">
                  <div v-for="attribute in productAttributes" :key="attribute.name" class="space-y-2">
                    <label class="text-sm font-semibold text-gray-900">{{ attribute.name }}:</label>
                    <SelectBox v-model="selectedAttributes[attribute.name]" @change="updateSelectedVariation" :options="[
                      { value: '', label: `Choose ${attribute.name}` },
                      ...attribute.options.map(option => ({ value: option, label: option }))
                    ]" :placeholder="`Choose ${attribute.name}`" button-class="w-full" />
                  </div>
                </div>

                <!-- Stock & Quantity -->
                <div class="space-y-4 border-b pb-6">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-gray-900">Availability:</span>
                    <div class="flex items-center space-x-2">
                      <div :class="isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                        class="px-3 py-1 rounded-full text-sm font-medium">
                        {{ getStockStatusText }}
                      </div>
                      <span v-if="(selectedVariation?.stock_quantity ?? product.stock_quantity)"
                        class="text-sm text-gray-500">
                        ({{ selectedVariation?.stock_quantity ?? product.stock_quantity }} left)
                      </span>
                    </div>
                  </div>

                  <div class="flex items-center space-x-4">
                    <label for="quantity" class="text-sm font-semibold text-gray-900">Quantity:</label>
                    <input id="quantity" v-model.number="quantity" type="number" min="1"
                      :max="selectedVariation?.stock_quantity || product.stock_quantity || 999"
                      class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
                  </div>
                </div>

                <!-- Add to Cart -->
                <BaseButton action="add" :product="product" :quantity="quantity" :variation="selectedAttributes"
                  @click="addToCart" :disabled="!isInStock || (hasVariations && !selectedVariation)" full-width
                  size="lg" :text="!isInStock ? getStockStatusText :
                    (hasVariations && !selectedVariation) ? 'Select Options' : 'Add to Cart'"
                  class="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors" />

                <!-- Product Meta -->
                <div class="space-y-3 text-sm">
                  <div v-if="selectedVariation?.sku || product.sku" class="flex justify-between">
                    <span class="text-gray-600">SKU:</span>
                    <span class="font-medium text-gray-900">{{ selectedVariation?.sku || product.sku }}</span>
                  </div>
                  <div v-if="product.categories && product.categories.length" class="flex justify-between">
                    <span class="text-gray-600">Categories:</span>
                    <div class="flex flex-wrap gap-2">
                      <NuxtLink v-for="category in product.categories" :key="category.id"
                        :to="`/category/${category.slug}`" class="text-gray-900 hover:text-gray-700 font-medium">
                        {{ category.name }}
                      </NuxtLink>
                    </div>
                  </div>
                  <div v-if="product.tags && product.tags.length" class="flex justify-between">
                    <span class="text-gray-600">Tags:</span>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="tag in product.tags" :key="tag.id"
                        class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {{ tag.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Information Tabs -->
      <div class="bg-white border-t">
        <div class="container mx-auto px-4">
          <!-- Tab Navigation -->
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button @click="activeTab = 'description'" :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'description'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]">
                Description
              </button>
              <button @click="activeTab = 'reviews'" :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'reviews'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]">
                Reviews ({{ reviews?.length || 0 }})
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="py-8">
            <!-- Description Tab -->
            <div v-if="activeTab === 'description'" class="prose prose-lg max-w-none">
              <div v-if="product.description" v-html="product.description"></div>
              <p v-else class="text-gray-500">No description available.</p>
            </div>

            <!-- Reviews Tab -->
            <div v-if="activeTab === 'reviews'">
              <ProductComments :product-id="product.id" :comments="reviews" @comment-added="handleCommentAdded"
                @refresh-comments="refreshReviews" />
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products Sections -->
      <div v-if="(relatedProducts && relatedProducts.length > 0) || (categoryProducts && categoryProducts.length > 0)"
        class="bg-gray-50 py-12">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <!-- Related Products -->
            <div v-if="relatedProducts && relatedProducts.length > 0">
              <h2 class="text-xl font-bold text-gray-900 mb-6">You might also like</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ProductCard v-for="relatedProduct in relatedProducts" :key="relatedProduct.id"
                  :product="relatedProduct" />
              </div>
            </div>

            <!-- Products from Same Category -->
            <div v-if="categoryProducts && categoryProducts.length > 0">
              <h2 class="text-xl font-bold text-gray-900 mb-6">More from {{ product.categories[0]?.name }}</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ProductCard v-for="categoryProduct in categoryProducts" :key="categoryProduct.id"
                  :product="categoryProduct" />
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
const {
  getProduct,
  getProductVariations,
  getProductReviews,
  getRelatedProducts,
  getProducts
} = useProducts()
const { addToCart: addItemToCart, openCart } = useCart()
const { formatPrice } = useCurrency()

// Reactive data
const quantity = ref(1)
const activeTab = ref('description')
const selectedAttributes = ref({})
const selectedVariation = ref(null)

// Fetch product data
const { data: product, pending, error } = await useLazyAsyncData(
  `product-${route.params.slug}`,
  () => getProduct(route.params.slug)
)

// Fetch variations if product is variable
const { data: variations, refresh: refreshVariations } = await useLazyAsyncData(
  `variations-${route.params.slug}`,
  async () => {
    if (!product.value?.id) return []
    return product.value.type === 'variable' ? getProductVariations(product.value.id) : []
  },
  {
    default: () => [],
    server: false
  }
)

// Fetch reviews
const { data: reviews, refresh: refreshReviews } = await useLazyAsyncData(
  `reviews-${route.params.slug}`,
  async () => {
    if (!product.value?.id) return []
    return getProductReviews(product.value.id, { per_page: 10 })
  },
  {
    default: () => [],
    server: false
  }
)

// Fetch related products
const { data: relatedProducts, refresh: refreshRelated } = await useLazyAsyncData(
  `related-${route.params.slug}`,
  async () => {
    if (!product.value?.categories?.length) return []
    const categoryIds = product.value.categories.map(cat => cat.id)
    return getRelatedProducts(product.value.id, categoryIds, 4)
  },
  {
    default: () => [],
    server: false
  }
)

// Fetch more products from same category
const { data: categoryProducts, refresh: refreshCategory } = await useLazyAsyncData(
  `category-products-${route.params.slug}`,
  async () => {
    if (!product.value?.categories?.length) return []
    return getProducts({
      category: product.value.categories[0].id,
      exclude: [product.value.id],
      per_page: 4,
      orderby: 'popularity'
    })
  },
  {
    default: () => [],
    server: false
  }
)

// Computed properties
const productAttributes = computed(() => {
  if (!product.value?.attributes) return []
  return product.value.attributes.filter(attr => attr.variation === true)
})

const isInStock = computed(() => {
  const stockStatus = selectedVariation.value?.stock_status ?? product.value?.stock_status
  return stockStatus === 'instock'
})

const getStockStatusText = computed(() => {
  const stockStatus = selectedVariation.value?.stock_status ?? product.value?.stock_status
  switch (stockStatus) {
    case 'instock':
      return 'In Stock'
    case 'outofstock':
      return 'Out of Stock'
    case 'onbackorder':
      return 'On Backorder'
    default:
      return 'Unknown'
  }
})

const hasVariations = computed(() => {
  return product.value?.type === 'variable' && variations.value && variations.value.length > 0
})

// Methods
const updateSelectedVariation = () => {
  if (!variations.value?.length) return

  const matchingVariation = variations.value.find(variation => {
    return variation.attributes.every(attr => {
      const selectedValue = selectedAttributes.value[attr.name]
      return !selectedValue || attr.option === selectedValue
    })
  })

  selectedVariation.value = matchingVariation
}

const addToCart = () => {
  if (!product.value) return

  let productToAdd = product.value
  let variation = null

  // If a variation is selected, create a combined product object
  if (selectedVariation.value) {
    productToAdd = {
      ...selectedVariation.value,
      // Keep the main product's name and images as fallback
      name: product.value.name,
      images: selectedVariation.value.image ? [selectedVariation.value.image] : product.value.images,
      // Store reference to main product
      product: product.value
    }
    variation = selectedAttributes.value
  }

  addItemToCart(productToAdd, quantity.value, variation)

  // Show cart sidebar after adding
  openCart()
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleCommentAdded = () => {
  // Switch to reviews tab to show the new comment
  activeTab.value = 'reviews'
}

// Set page meta
useHead({
  title: computed(() => product.value ? product.value.name : 'Product Not Found'),
  meta: [
    {
      name: 'description',
      content: computed(() => product.value?.short_description || 'Product page')
    },
    {
      property: 'og:title',
      content: computed(() => product.value?.name || 'Product')
    },
    {
      property: 'og:description',
      content: computed(() => product.value?.short_description || 'Product page')
    },
    {
      property: 'og:image',
      content: computed(() => product.value?.images?.[0]?.src || '')
    }
  ]
})

// Watch for product changes to reset selections and refresh dependent data
watch(product, (newProduct, oldProduct) => {
  if (newProduct && newProduct !== oldProduct) {
    selectedAttributes.value = {}
    selectedVariation.value = null

    // Refresh dependent data when product loads
    if (newProduct.id) {
      refreshVariations()
      refreshReviews()
      refreshRelated()
      refreshCategory()
    }
  }
})
</script>