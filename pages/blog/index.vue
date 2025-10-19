<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the latest insights, tips, and stories from our team
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Blog Posts -->
        <div class="lg:col-span-3">
          <!-- Loading State -->
          <div v-if="postsLoading" class="space-y-8">
            <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
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

          <!-- Error State -->
          <div v-else-if="postsError" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p class="text-red-600">Failed to load blog posts. Please try again later.</p>
          </div>

          <!-- Blog Posts Grid -->
          <div v-else-if="posts.length > 0" class="space-y-8">
            <BlogPostCard v-for="post in posts" :key="post.id" :post="post" size="large" />
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-lg shadow-sm p-12 text-center">
            <Icon name="heroicons:document-text" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
            <p class="text-gray-500">Check back later for new content!</p>
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

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            
            <!-- Categories Loading -->
            <div v-if="blogCategoriesLoading" class="space-y-2">
              <div v-for="i in 5" :key="i" class="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <!-- Categories List -->
            <div v-else-if="blogCategories.length > 0" class="space-y-2">
              <NuxtLink v-for="category in blogCategories" :key="category.id"
                :to="`/blog/category/${category.slug}`"
                class="block text-gray-600 hover:text-blue-600 transition-colors">
                {{ category.name }} ({{ category.count }})
              </NuxtLink>
            </div>

            <!-- No Categories -->
            <p v-else class="text-gray-500 text-sm">No categories available</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { 
  posts, 
  postsLoading, 
  postsError, 
  fetchPosts,
  blogCategories,
  blogCategoriesLoading,
  fetchBlogCategories
} = useBlog()

// Pagination
const currentPage = ref(1)
const postsPerPage = 10

// Load posts for specific page
const loadPage = async (page) => {
  currentPage.value = page
  await fetchPosts({
    page: page,
    per_page: postsPerPage,
    _embed: true // Include embedded data like featured images and categories
  })
}

// SEO
useHead({
  title: 'Blog',
  meta: [
    { name: 'description', content: 'Discover the latest insights, tips, and stories from our team' }
  ]
})

// Load initial data
onMounted(async () => {
  await Promise.all([
    loadPage(1),
    fetchBlogCategories()
  ])
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>