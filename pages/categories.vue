<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-6">
            <Icon name="heroicons:squares-2x2" class="h-8 w-8 text-gray-600" />
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            {{ $t('categories.title') }}
          </h1>
          <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {{ $t('categories.subtitle') }}
          </p>

          <!-- Search Categories -->
          <div ref="searchContainer" class="max-w-md mx-auto">
            <div class="relative">
              <input v-model="searchQuery" type="text" :placeholder="$t('categories.searchPlaceholder')"
                class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm">
              <Icon name="heroicons:magnifying-glass"
                class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Categories Section -->
    <section ref="categoriesSection" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-12" v-if="!searchQuery">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ $t('categories.all') }}</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            {{ $t('categories.allSubtitle') }}
          </p>
        </div>

        <!-- Search Results Header -->
        <div class="text-center mb-12" v-if="searchQuery">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ $t('categories.searchResultsFor', { query: searchQuery }) }}
          </h2>
          <p class="text-gray-600">
            {{ filteredCategories.length }} {{ filteredCategories.length === 1 ? $t('categories.categoryFound') : $t('categories.categoriesFound') }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 12" :key="i"
            class="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
            <div class="bg-gray-100 h-48"></div>
            <div class="p-6">
              <div class="bg-gray-200 h-4 rounded mb-3"></div>
              <div class="bg-gray-200 h-3 rounded mb-4 w-2/3"></div>
              <div class="bg-gray-200 h-8 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Categories Grid -->
        <div v-else-if="filteredCategories.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <NuxtLink v-for="category in filteredCategories" :key="category.id" :to="`/category/${category.slug}`"
            class="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer block">
            <!-- Category Image -->
            <div class="relative h-48 bg-gray-50">
              <img v-if="category.image?.src" :src="category.image.src" :alt="category.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
              <div v-else class="flex items-center justify-center h-full">
                <Icon name="heroicons:tag"
                  class="h-12 w-12 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
              </div>

              <!-- Product count badge -->
              <div
                class="absolute top-3 right-3 bg-white text-gray-700 px-2 py-1 rounded-full text-xs font-medium shadow-sm border border-gray-200">
                {{ category.count }}
              </div>
            </div>

            <!-- Category Info -->
            <div class="p-5">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ category.name }}
              </h3>

              <p v-if="category.description" class="text-gray-600 text-sm mb-4 line-clamp-2">
                {{ stripHtml(category.description) }}
              </p>

              <!-- Subcategories -->
              <div v-if="category.children?.length > 0" class="mb-4">
                <p class="text-xs font-medium text-gray-500 mb-2">{{ $t('categories.subcategories') }}</p>
                <div class="flex flex-wrap gap-1">
                  <span v-for="child in category.children.slice(0, 3)" :key="child.id"
                    class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">
                    {{ child.name }}
                  </span>
                  <span v-if="category.children.length > 3" class="text-xs text-gray-500 px-2 py-1">
                    {{ $t('categories.moreCount', { count: category.children.length - 3 }) }}
                  </span>
                </div>
              </div>

              <!-- Action Indicator -->
              <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                <span class="text-gray-700 font-medium text-sm">
                  {{ category.count }} {{ category.count === 1 ? $t('categories.product') : $t('categories.products') }}
                </span>
                <Icon name="heroicons:arrow-right"
                  class="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-16">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Icon name="heroicons:folder-open" class="h-8 w-8 text-gray-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('categories.noFound') }}</h3>
          <p class="text-gray-600 mb-6">
            <span v-if="searchQuery">{{ $t('categories.tryAdjusting') }}</span>
            <span v-else>{{ $t('categories.noneAvailable') }}</span>
          </p>
          <button v-if="searchQuery" @click="searchQuery = ''"
            class="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
            {{ $t('common.clearSearch') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Popular Categories Section -->
    <section v-if="!searchQuery && popularCategories.length > 0" class="py-16 bg-gray-50 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ $t('categories.popular') }}</h2>
          <p class="text-gray-600">
            {{ $t('categories.popularSubtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <NuxtLink v-for="category in popularCategories" :key="category.id" :to="`/category/${category.slug}`"
            class="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 p-4 text-center cursor-pointer block">
            <div
              class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-200 transition-colors duration-300">
              <Icon name="heroicons:tag" class="h-6 w-6 text-gray-600" />
            </div>
            <h3 class="font-semibold text-gray-900 text-sm mb-1">
              {{ category.name }}
            </h3>
            <p class="text-xs text-gray-500">
              {{ category.count }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { t } = useI18n()
const { categories, categoriesLoading, fetchCategories } = useCategories()

useHead({
  title: () => t('categories.metaTitle'),
  meta: [
    { name: 'description', content: () => t('categories.metaDescription') }
  ]
})

// Data
const searchQuery = ref('')
const loading = computed(() => categoriesLoading.value)
const categoriesSection = ref(null)
const searchContainer = ref(null)

// Computed
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value

  return categories.value.filter(category =>
    category.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
})

const popularCategories = computed(() => {
  return categories.value
    .filter(cat => cat.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
})

// Methods
const scrollToResults = () => {
  if (searchContainer.value) {
    const searchRect = searchContainer.value.getBoundingClientRect()
    const targetOffset = 60 // Keep search input 60px from top
    const currentScrollY = window.pageYOffset
    const searchCurrentTop = searchRect.top + currentScrollY
    const targetScrollY = searchCurrentTop - targetOffset

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    })
  }
}

const stripHtml = (html) => {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

// Watchers
watch(searchQuery, (newValue, oldValue) => {
  // Only scroll when starting a search (from empty to having content)
  if (newValue && !oldValue) {
    nextTick(() => {
      scrollToResults()
    })
  }
})

// Initialize
onMounted(() => {
  fetchCategories()
})
</script>
