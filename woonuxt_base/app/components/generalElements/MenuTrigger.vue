<script setup lang="ts">
const { toggleMobileMenu } = useHelpers();
</script>

<template>
  <button @click="toggleMobileMenu" class="p-2 mr-2 rounded-md hover:bg-gray-100 transition-colors" title="Menu">
    <Icon name="ion:menu-outline" size="22" />
  </button>
</template>
