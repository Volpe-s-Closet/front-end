<script setup lang="ts">
const { toggleSearch } = useSearching();
</script>

<template>
  <button @click="toggleSearch" class="p-2 rounded-md hover:bg-gray-100 transition-colors lg:hidden" title="Search">
    <Icon name="ion:search-outline" size="20" />
  </button>
</template>
