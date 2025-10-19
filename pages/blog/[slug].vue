<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="pending" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
        <div class="h-64 bg-gray-200"></div>
        <div class="p-8">
          <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <Icon name="heroicons:exclamation-triangle" class="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h1 class="text-2xl font-bold text-red-900 mb-2">Post Not Found</h1>
        <p class="text-red-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <NuxtLink to="/blog" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Icon name="heroicons:arrow-left" class="mr-2 h-4 w-4" />
          Back to Blog
        </NuxtLink>
      </div>
    </div>

    <!-- Blog Post Content -->
    <article v-else-if="post" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Back to Blog -->
      <div class="mb-8">
        <NuxtLink to="/blog" class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <Icon name="heroicons:arrow-left" class="mr-2 h-4 w-4" />
          Back to Blog
        </NuxtLink>
      </div>

      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- Featured Image -->
        <div v-if="getFeaturedImageUrl(post)" class="aspect-video overflow-hidden">
          <img :src="getFeaturedImageUrl(post, 'large')" 
               :alt="post.title.rendered"
               class="w-full h-full object-cover">
        </div>

        <div class="p-8">
          <!-- Post Meta -->
          <div class="flex items-center text-sm text-gray-500 mb-6">
            <time :datetime="post.date">{{ formatPostDate(post.date) }}</time>
            <span v-if="post._embedded && post._embedded['wp:term']" class="mx-2">•</span>
            <div v-if="post._embedded && post._embedded['wp:term']" class="flex flex-wrap gap-2">
              <NuxtLink v-for="category in post._embedded['wp:term'][0]" :key="category.id"
                :to="`/blog/category/${category.slug}`"
                class="text-blue-600 hover:text-blue-800 transition-colors">
                {{ category.name }}
              </NuxtLink>
            </div>
          </div>

          <!-- Post Title -->
          <h1 class="text-4xl font-bold text-gray-900 mb-6" v-html="post.title.rendered"></h1>

          <!-- Post Content -->
          <div class="prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg prose-img:shadow-sm prose-blockquote:border-l-4 prose-blockquote:border-blue-200 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100" v-html="post.content.rendered"></div>

          <!-- Post Footer -->
          <div class="mt-12 pt-8 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <!-- Tags -->
              <div v-if="post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][1]" 
                class="flex flex-wrap gap-2">
                <span class="text-sm text-gray-500">Tags:</span>
                <NuxtLink v-for="tag in post._embedded['wp:term'][1]" :key="tag.id"
                  :to="`/blog/tag/${tag.slug}`"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                  {{ tag.name }}
                </NuxtLink>
              </div>

              <!-- Share Buttons -->
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">Share:</span>
                <button @click="shareOnTwitter" 
                  class="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                  <Icon name="heroicons:share" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Posts -->
      <div v-if="relatedPosts.length > 0" class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogPostCard v-for="relatedPost in relatedPosts" :key="relatedPost.id" 
            :post="relatedPost" size="small" />
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
const route = useRoute()
const slug = route.params.slug

const { 
  getPost,
  getPosts,
  formatExcerpt,
  formatPostDate,
  getFeaturedImageUrl
} = useBlog()

// Fetch the blog post
const { data: post, pending, error } = await useLazyAsyncData(`blog-post-${slug}`, async () => {
  try {
    // First, get posts by slug to find the ID
    const posts = await getPosts({ 
      slug: slug, 
      _embed: true,
      per_page: 1 
    })
    
    if (!posts || posts.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog post not found'
      })
    }
    
    return posts[0]
  } catch (err) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Blog post not found'
    })
  }
})

// Fetch related posts
const relatedPosts = ref([])

const fetchRelatedPosts = async () => {
  if (!post.value) return
  
  try {
    // Get posts from the same categories
    const categoryIds = post.value._embedded?.['wp:term']?.[0]?.map(cat => cat.id) || []
    
    if (categoryIds.length > 0) {
      const related = await getPosts({
        categories: categoryIds.join(','),
        exclude: post.value.id,
        per_page: 3,
        _embed: true
      })
      relatedPosts.value = related || []
    }
  } catch (err) {
    console.error('Error fetching related posts:', err)
  }
}

// Share functionality
const shareOnTwitter = () => {
  if (!post.value) return
  
  const url = `${window.location.origin}/blog/${post.value.slug}`
  const text = post.value.title.rendered
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  
  window.open(twitterUrl, '_blank', 'width=600,height=400')
}

// SEO
useHead(() => {
  if (!post.value) return {}
  
  return {
    title: post.value.title.rendered,
    meta: [
      { name: 'description', content: formatExcerpt(post.value.excerpt) },
      { property: 'og:title', content: post.value.title.rendered },
      { property: 'og:description', content: formatExcerpt(post.value.excerpt) },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `${useRuntimeConfig().public.siteUrl}/blog/${post.value.slug}` },
      ...(getFeaturedImageUrl(post.value) ? [{ property: 'og:image', content: getFeaturedImageUrl(post.value, 'large') }] : [])
    ]
  }
})

// Load related posts when post is loaded
watch(post, (newPost) => {
  if (newPost) {
    fetchRelatedPosts()
  }
}, { immediate: true })
</script>

