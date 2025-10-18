<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Product Categories</h1>
      <p class="text-gray-600 max-w-2xl">
        Browse our complete collection of product categories to find exactly what you're looking for.
      </p>
    </div>

    <!-- Search Categories -->
    <div class="mb-8 max-w-md">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search categories..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="i in 12" :key="i" class="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div class="bg-gray-300 h-16 w-16 rounded-full mx-auto mb-4"></div>
        <div class="bg-gray-300 h-4 rounded mb-2"></div>
        <div class="bg-gray-300 h-3 rounded w-2/3 mx-auto"></div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div v-else-if="filteredCategories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div 
        v-for="category in filteredCategories" 
        :key="category.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
      >
        <!-- Category Image -->
        <div class="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
          <img 
            v-if="category.image?.src"
            :src="category.image.src" 
            :alt="category.name"
            class="w-full h-full object-cover"
          >
          <div v-else class="flex items-center justify-center h-full">
            <Icon name="heroicons:tag" class="h-16 w-16 text-blue-400" />
          </div>
          
          <!-- Product count badge -->
          <div class="absolute top-2 right-2 bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
            {{ category.count }} products
          </div>
        </div>

        <!-- Category Info -->
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
          
          <p v-if="category.description" class="text-gray-600 text-sm mb-4 line-clamp-2">
            {{ stripHtml(category.description) }}
          </p>

          <!-- Subcategories -->
          <div v-if="category.children?.length > 0" class="mb-4">
            <p class="text-xs font-medium text-gray-500 mb-2">Subcategories:</p>
            <div class="flex flex-wrap gap-1">
              <NuxtLink 
                v-for="child in category.children.slice(0, 3)" 
                :key="child.id"
                :to="`/category/${child.slug}`"
                class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors duration-200"
              >
                {{ child.name }}
              </NuxtLink>
              <span v-if="category.children.length > 3" class="text-xs text-gray-500">
                +{{ category.children.length - 3 }} more
              </span>
            </div>
          </div>

          <!-- Action Button -->
          <NuxtLink 
            :to="`/category/${category.slug}`"
            class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md font-medium transition-colors duration-200"
          >
            Browse Products
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div v-else class="text-center py-12">
      <Icon name="heroicons:folder-open" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
      <p class="text-gray-600">
        <span v-if="searchQuery">Try adjusting your search terms.</span>
        <span v-else>No categories are available at the moment.</span>
      </p>
    </div>

    <!-- Popular Categories Section -->
    <section v-if="!searchQuery && popularCategories.length > 0" class="mt-16">
      <h2 class="text-2xl font-bold text-gray-900 mb-8">Popular Categories</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink 
          v-for="category in popularCategories" 
          :key="category.id"
          :to="`/category/${category.slug}`"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 text-center"
        >
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="heroicons:tag" class="h-6 w-6 text-blue-600" />
          </div>
          <h3 class="font-medium text-gray-900 text-sm">{{ category.name }}</h3>
          <p class="text-xs text-gray-600 mt-1">{{ category.count }} products</p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
const { getCategories } = useWooCommerce()

// SEO
useHead({
  title: 'Categories - Your Store',
  meta: [
    { name: 'description', content: 'Browse all product categories in our online store.' }
  ]
})

// Data
const categories = ref([])
const loading = ref(true)
const searchQuery = ref('')

// Computed
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const popularCategories = computed(() => {
  return categories.value
    .filter(cat => cat.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
})

// Methods
const fetchCategories = async () => {
  try {
    loading.value = true
    
    // Fetch all categories
    const allCategories = await getCategories({ 
      per_page: 100,
      hide_empty: true
    })

    // Organize categories with their children
    const categoryMap = new Map()
    const rootCategories = []

    // First pass: create map of all categories
    allCategories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] })
    })

    // Second pass: organize parent-child relationships
    allCategories.forEach(cat => {
      if (cat.parent === 0) {
        rootCategories.push(categoryMap.get(cat.id))
      } else {
        const parent = categoryMap.get(cat.parent)
        if (parent) {
          parent.children.push(categoryMap.get(cat.id))
        }
      }
    })

    categories.value = rootCategories

  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    loading.value = false
  }
}

const stripHtml = (html) => {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

// Initialize
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>