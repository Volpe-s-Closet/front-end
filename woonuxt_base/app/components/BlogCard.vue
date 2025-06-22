<script setup>
const props = defineProps({
  post: { type: Object, required: true },
});

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Extract excerpt text without HTML tags
const getExcerpt = (excerpt) => {
  if (!excerpt) return '';
  return excerpt.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
};
</script>

<template>
  <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <!-- Featured Image -->
    <div v-if="post.featuredImage?.node?.sourceUrl" class="relative h-48 overflow-hidden">
      <img
        :src="post.featuredImage.node.sourceUrl"
        :alt="post.featuredImage.node.altText || post.title"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Categories -->
      <div v-if="post.categories?.nodes?.length" class="mb-3">
        <span
          v-for="category in post.categories.nodes"
          :key="category.slug"
          class="inline-block bg-gray-900 text-white text-xs px-2 py-1 rounded-full mr-2 mb-1">
          {{ category.name }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-black transition-colors">
        <span class="cursor-pointer hover:underline">
          {{ post.title }}
        </span>
      </h3>

      <!-- Excerpt -->
      <p v-if="post.excerpt" class="text-gray-700 mb-4 line-clamp-3">
        {{ getExcerpt(post.excerpt) }}
      </p>

      <!-- Meta Information -->
      <div class="flex items-center justify-between text-sm text-gray-600">
        <!-- Author -->
        <div v-if="post.author?.node?.name" class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          <span>{{ post.author.node.name }}</span>
        </div>

        <!-- Date -->
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd" />
          </svg>
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        </div>
      </div>

      <!-- Read More Link -->
      <div class="mt-4">
        <span class="inline-flex items-center text-gray-900 hover:text-black font-medium transition-colors cursor-pointer hover:underline">
          Read More
          <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
