<template>
  <article class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <!-- Featured Image -->
    <div v-if="featuredImage" class="aspect-video overflow-hidden">
      <img :src="featuredImage" :alt="post.title.rendered"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
    </div>

    <div class="p-6">
      <!-- Post Meta -->
      <div class="flex items-center text-sm text-gray-500 mb-3">
        <time :datetime="post.date">{{ formattedDate }}</time>
        <span v-if="categories.length > 0" class="mx-2">•</span>
        <div v-if="categories.length > 0" class="flex flex-wrap gap-2">
          <NuxtLink v-for="category in categories" :key="category.id" :to="`/blog/category/${category.slug}`"
            class="text-blue-600 hover:text-blue-800 transition-colors">
            {{ category.name }}
          </NuxtLink>
        </div>
      </div>

      <!-- Post Title -->
      <h2 :class="titleClass">
        <NuxtLink :to="`/blog/${post.slug}`" class="hover:text-blue-600 transition-colors" v-html="post.title.rendered">
        </NuxtLink>
      </h2>

      <!-- Post Excerpt -->
      <p class="text-gray-600 mb-4 line-clamp-3">
        {{ excerpt }}
      </p>

      <!-- Read More -->
      <NuxtLink :to="`/blog/${post.slug}`"
        class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
        {{ $t('common.readMore') }}
        <Icon name="heroicons:arrow-right" class="ml-1 h-4 w-4" />
      </NuxtLink>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: 'medium', // 'small', 'medium', 'large'
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const { formatExcerpt, formatPostDate, getFeaturedImageUrl } = useBlog()

// Computed properties
const featuredImage = computed(() => {
  const imageSize = props.size === 'large' ? 'large' : 'medium'
  return getFeaturedImageUrl(props.post, imageSize)
})

const formattedDate = computed(() => {
  return formatPostDate(props.post.date)
})

const excerpt = computed(() => {
  return formatExcerpt(props.post.excerpt)
})

const categories = computed(() => {
  if (!props.post._embedded || !props.post._embedded['wp:term']) return []
  return props.post._embedded['wp:term'][0] || []
})

const titleClass = computed(() => {
  const baseClass = 'font-bold text-gray-900 mb-3'

  switch (props.size) {
    case 'small':
      return `${baseClass} text-lg line-clamp-2`
    case 'large':
      return `${baseClass} text-3xl mb-4`
    default:
      return `${baseClass} text-xl line-clamp-2`
  }
})
</script>
