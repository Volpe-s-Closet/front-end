<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="pending" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="h-48 bg-gray-200"></div>
            <div class="p-6">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="space-y-2">
                <div class="h-3 bg-gray-200 rounded"></div>
                <div class="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <Icon name="heroicons:exclamation-triangle" class="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h1 class="text-2xl font-bold text-red-900 mb-2">Category Not Found</h1>
        <p class="text-red-600 mb-6">The blog category you're looking for doesn't exist.</p>
        <NuxtLink to="/blog" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Icon name="heroicons:arrow-left" class="mr-2 h-4 w-4" />
          Back to Blog
        </NuxtLink>
      </div>
    </div>

    <!-- Category Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Back to Blog -->
      <div class="mb-8">
        <NuxtLink to="/blog" class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <Icon name="heroicons:arrow-left" class="mr-2 h-4 w-4" />
          Back to Blog
        </NuxtLink>
      </div>

      <!-- Category Header -->
      <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ category?.name || 'Category' }}</h1>
        <p v-if="category?.description" class="text-xl text-gray-600" v-html="category.description"></p>
        <div class="mt-4 text-sm text-gray-500">
          {{ posts.length }} {{ posts.length === 1 ? 'post' : 'posts' }} in this category
        </div>
      </div>

      <!-- Posts Loading -->
      <div v-if="postsLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-200"></div>
          <div class="p-6">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div class="space-y-2">
              <div class="h-3 bg-gray-200 rounded"></div>
              <div class="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Posts Error -->
      <div v-else-if="postsError" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-600">Failed to load posts for this category. Please try again later.</p>
      </div>

      <!-- Posts Grid -->
      <div v-else-if="posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogPostCard v-for="post in posts" :key="post.id" :post="post" size="medium" />
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-sm p-12 text-center">
        <Icon name="heroicons:document-text" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No posts in this category</h3>
        <p class="text-gray-500 mb-6">This category doesn't have any published posts yet.</p>
        <NuxtLink to="/blog" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Browse All Posts
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div v-if="posts.length > 0" class="mt-12 flex justify-center">
        <nav class="flex items-center space-x-2">
          <BaseButton v-if="currentPage > 1" @click="loadPage(currentPage - 1)" 
            variant="outline" size="sm">
            Previous
          </BaseButton>
          <span class="px-4 py-2 text-sm text-gray-700">
            Page {{ currentPage }}
          </span>
          <BaseButton v-if="posts.length === postsPerPage" @click="loadPage(currentPage + 1)" 
            variant="outline" size="sm">
            Next
          </BaseButton>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const slug = route.params.slug

const { 
  posts, 
  postsLoading, 
  postsError, 
  fetchPosts,
  getBlogCategories,
  getBlogCategoryBySlug
} = useBlog()

// Pagination
const currentPage = ref(1)
const postsPerPage = 12

// Category data
const category = ref(null)

// Fetch category and posts
const { pending, error } = await useLazyAsyncData(`blog-category-${slug}`, async () => {
  try {
    // First get all categories to find the one with this slug
    const categories = await getBlogCategories({ slug: slug })
    
    if (!categories || categories.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }
    
    category.value = categories[0]
    
    // Then fetch posts for this category
    await loadPage(1)
    
    return { category: category.value }
  } catch (err) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found'
    })
  }
})

// Load posts for specific page
const loadPage = async (page) => {
  if (!category.value) return
  
  currentPage.value = page
  await fetchPosts({
    categories: category.value.id,
    page: page,
    per_page: postsPerPage,
    _embed: true
  })
}

// SEO
useHead(() => {
  if (!category.value) return {}
  
  return {
    title: `${category.value.name} - Blog`,
    meta: [
      { name: 'description', content: category.value.description || `Browse all posts in the ${category.value.name} category` }
    ]
  }
})
</script>

