<script setup>
const { getSearchQuery, setSearchQuery, clearSearchQuery } = useSearching();
const searchQuery = ref(getSearchQuery());
const emit = defineEmits(['blur']);

const props = defineProps({
  compact: {
    type: Boolean,
    default: false,
  },
});

const reset = () => {
  clearSearchQuery();
  searchQuery.value = '';
};

const handleBlur = () => {
  emit('blur');
};

watch(getSearchQuery, (value) => {
  if (!value) reset();
});
</script>

<template>
  <form class="relative items-center flex-1 rounded-md" @submit.prevent="setSearchQuery(searchQuery)">
    <Icon name="ion:search-outline" size="20" class="absolute z-10 opacity-50 pointer-events-none left-3 top-1/2 transform -translate-y-1/2" />
    <input
      id="product-search-input"
      v-model="searchQuery"
      type="text"
      :placeholder="$t('messages.shop.searchProducts')"
      :class="[
        'w-full px-10 py-2 text-sm text-gray-700 rounded-md outline-none bg-white hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all',
      ]"
      @blur="handleBlur" />
    <span
      v-if="searchQuery"
      class="absolute z-10 flex items-center gap-1 px-2 py-1 text-xs rounded cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 right-2 top-1/2 transform -translate-y-1/2"
      @click="reset">
      <span>{{ $t('messages.general.clear') }}</span>
      <Icon name="ion:close-outline" size="16" />
    </span>
  </form>
</template>
