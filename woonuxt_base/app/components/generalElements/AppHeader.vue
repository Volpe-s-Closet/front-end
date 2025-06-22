<script setup lang="ts">
const { isShowingSearch, toggleSearch } = useSearching();
const isSearchExpanded = ref(false);
const searchContainer = ref(null);

const expandSearch = () => {
  isSearchExpanded.value = true;
  nextTick(() => {
    const searchInput = document.getElementById('product-search-input');
    searchInput?.focus();
  });
};

const collapseSearch = () => {
  isSearchExpanded.value = false;
};

// Prevent search from closing when clicking inside the search container
const preventClose = (event: Event) => {
  event.stopPropagation();
};

// Close search when clicking outside
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    if (isSearchExpanded.value && searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
      collapseSearch();
    }
  };

  document.addEventListener('click', handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});
</script>

<template>
  <header class="sticky top-0 z-40 bg-white shadow-sm shadow-light-500">
    <div class="container py-4">
      <!-- Desktop Layout -->
      <div class="hidden lg:grid lg:grid-cols-3 lg:items-center lg:gap-4">
        <!-- Logo - Left -->
        <div class="flex items-center">
          <Logo class="w-[160px]" />
        </div>

        <!-- Menu - Center -->
        <div class="flex justify-center">
          <MainMenu class="flex items-center gap-6 text-sm text-gray-500" />
        </div>

        <!-- Search & Actions - Right -->
        <div class="flex justify-end items-center gap-4">
          <div ref="searchContainer" class="flex items-center h-10">
            <Transition name="search-expand" mode="out-in">
              <div v-if="isSearchExpanded" class="flex items-center rounded-lg border border-gray-200 mr-4 h-10" @click="preventClose">
                <ProductSearch class="w-80 h-full mt-[1px]" :compact="true" />
                <button
                  @click="collapseSearch"
                  class="p-2 rounded-md hover:bg-gray-100 hover:scale-110 transition-all duration-200 ease-in-out h-10 w-10 flex items-center justify-center"
                  title="Close search">
                  <Icon name="ion:close-outline" size="20" class="transition-transform duration-200 ease-in-out" />
                </button>
              </div>
              <button
                v-else
                @click="expandSearch"
                class="p-2 rounded-md hover:bg-gray-100 hover:scale-110 transition-all duration-200 ease-in-out h-10 w-10 flex items-center justify-center"
                title="Search">
                <Icon name="ion:search-outline" size="20" class="transition-transform duration-200 ease-in-out" />
              </button>
            </Transition>
          </div>
          <SignInLink />
          <CartTrigger />
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="flex lg:hidden items-center justify-between">
        <div class="flex items-center">
          <MenuTrigger />
          <Logo class="w-[120px]" />
        </div>
        <div class="flex items-center gap-2">
          <SearchTrigger />
          <SignInLink />
          <CartTrigger />
        </div>
      </div>
    </div>

    <!-- Mobile Search Dropdown -->
    <Transition name="scale-y" mode="out-in">
      <div class="container mb-3 -mt-1 lg:hidden bg-white border-t border-gray-100 py-3" v-if="isShowingSearch">
        <ProductSearch class="flex w-full" />
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.search-expand-enter-active,
.search-expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-expand-enter-from {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
  width: 0;
}

.search-expand-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
  width: 0;
}

.search-expand-enter-to,
.search-expand-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
  width: auto;
}

button:hover .icon {
  transform: scale(1.1);
}

@media (max-width: 1023px) {
  .search-expand-enter-from,
  .search-expand-leave-to {
    transform: translateX(10px) scale(0.98);
  }
}
</style>
