<script setup>
import { computed } from 'vue';

const props = defineProps({
  posts: { type: Array, default: () => [] },
  showTitle: { type: Boolean, default: true },
  title: { type: String, default: 'Latest Blog Posts' },
  columns: { type: Number, default: 3 },
});

const gridCols = computed(() => {
  switch (props.columns) {
    case 1:
      return 'grid-cols-1';
    case 2:
      return 'grid-cols-1 md:grid-cols-2';
    case 3:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    case 4:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    default:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  }
});
</script>

<template>
  <section class="container mx-auto px-4">
    <!-- Section Title -->
    <div v-if="showTitle" class="mb-8 text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ title }}</h2>
      <div class="w-24 h-1 bg-gray-900 mx-auto"></div>
    </div>

    <!-- Blog Posts Grid -->
    <div v-if="posts?.length" :class="`grid ${gridCols} gap-6`">
      <BlogCard v-for="post in posts" :key="post.id" :post="post" />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clip-rule="evenodd" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
      <p class="text-gray-600">Check back later for new content!</p>
    </div>
  </section>
</template>
