<template>
  <Transition enter-active-class="transition-transform duration-300 ease-out" enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0" leave-active-class="transition-transform duration-300 ease-in"
    leave-from-class="translate-x-0" leave-to-class="-translate-x-full">
    <div v-if="isOpen" class="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-40 md:hidden overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Menu</h2>
        <BaseButton @click="$emit('close')" variant="ghost" size="sm" icon="heroicons:x-mark"
          class="text-gray-500 hover:text-gray-700" />
      </div>



      <!-- Navigation Links -->
      <nav class="p-4">
        <div class="space-y-2">
          <!-- Categories Section -->
          <div class="space-y-2">
            <!-- Categories Header -->
            <button @click="toggleCategoriesExpanded"
              class="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <div class="flex items-center">
                Categories
              </div>
              <ClientOnly>
                <Icon :name="categoriesExpanded ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
                  class="h-4 w-4 text-gray-400" />
                <template #fallback>
                  <div class="h-4 w-4 bg-gray-200 rounded"></div>
                </template>
              </ClientOnly>
            </button>

            <!-- Categories Dropdown -->
            <div v-if="categoriesExpanded" class="ml-8 space-y-1">
              <NuxtLink to="/categories"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                @click="$emit('close')">
                All Categories
              </NuxtLink>

              <template v-for="category in categories" :key="category.id">
                <NuxtLink :to="`/category/${category.slug}`"
                  class="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  @click="$emit('close')">
                  {{ category.name }}
                </NuxtLink>
              </template>
            </div>
          </div>

          <NuxtLink to="/search"
            class="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            @click="$emit('close')">
            All Products
          </NuxtLink>
        </div>
      </nav>


    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const { categories, fetchCategories } = useCategories()
const categoriesExpanded = ref(false)

const toggleCategoriesExpanded = () => {
  categoriesExpanded.value = !categoriesExpanded.value
}

// Close sidebar when clicking outside or pressing escape
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && props.isOpen) {
      emit('close')
    }
  }

  document.addEventListener('keydown', handleEscape)

  // Fetch categories when component mounts
  fetchCategories()

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>