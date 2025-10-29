<template>
  <div class="relative" @mouseenter="showMenu" @mouseleave="hideMenu">
    <!-- Trigger Button -->
    <button
      class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      :class="{ 'text-gray-900 bg-gray-100': isOpen }"
    >
      {{ label }}
      <ClientOnly>
        <Icon name="heroicons:chevron-down" class="ml-1 h-4 w-4" />
        <template #fallback>
          <div class="ml-1 h-4 w-4 bg-gray-200 rounded"></div>
        </template>
      </ClientOnly>
    </button>

    <!-- Mega Menu Panel -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="isOpen"
        class="fixed left-0 w-full bg-white shadow-xl border-t border-gray-200 z-50"
        style="top: 104px;"
        @mouseenter="showMenu"
        @mouseleave="hideMenu"
      >
        <!-- Container to center and limit content width -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex h-80">
            <!-- Left side - Categories -->
            <div class="w-64 p-6 flex-shrink-0">
              <!-- Main Category Link -->
              <NuxtLink
                :to="mainCategory ? `/category/${mainCategory.slug}` : '/'"
                class="block text-lg font-semibold text-gray-900 hover:text-blue-600 mb-4 transition-colors"
                @click="closeMenu"
              >
                All {{ label }}
              </NuxtLink>

              <!-- Subcategories -->
              <div v-if="subcategories && subcategories.length > 0" class="space-y-2">
                <div
                  v-for="subcategory in subcategories"
                  :key="subcategory.id"
                  @mouseenter="setHoveredCategory(subcategory)"
                  @mouseleave="clearHoveredCategory"
                >
                  <NuxtLink
                    :to="`/category/${subcategory.slug}`"
                    class="block text-sm text-gray-600 hover:text-gray-900 py-1 transition-colors"
                    @click="closeMenu"
                  >
                    {{ subcategory.name }}
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Right side - Category Image -->
            <div class="flex-1 max-w-md p-6">
              <div class="w-full h-full bg-gray-100 overflow-hidden">
                <img
                  v-if="displayImage"
                  :src="displayImage"
                  :alt="displayImageAlt"
                  class="w-full h-full object-cover transition-opacity duration-300"
                  @error="handleImageError"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-gray-400"
                >
                  <ClientOnly>
                    <Icon name="heroicons:photo" class="h-16 w-16" />
                    <template #fallback>
                      <div class="h-16 w-16 bg-gray-300 rounded"></div>
                    </template>
                  </ClientOnly>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  categorySlug: {
    type: String,
    required: true
  }
})

const { categories, fetchCategories } = useCategories()

const isOpen = ref(false)
const hoveredCategory = ref(null)
const showTimeout = ref(null)
const hideTimeout = ref(null)

// Get the main category and its subcategories
const mainCategory = computed(() => {
  const category = categories.value.find(cat => cat.slug === props.categorySlug)
  console.log(`MegaMenu ${props.label}: Looking for slug "${props.categorySlug}", found:`, category)
  console.log(`MegaMenu ${props.label}: Available categories:`, categories.value.map(cat => ({ slug: cat.slug, name: cat.name, childrenCount: cat.children?.length || 0 })))
  return category
})

const subcategories = computed(() => {
  const subs = mainCategory.value?.children || []
  console.log(`MegaMenu ${props.label}: Subcategories:`, subs.map(sub => ({ slug: sub.slug, name: sub.name })))
  return subs
})

// Ensure categories are fetched when component mounts
onMounted(() => {
  if (categories.value.length === 0) {
    fetchCategories()
  }
})

// Computed property for the image to display
const displayImage = computed(() => {
  // Show hovered subcategory image if available
  if (hoveredCategory.value && hoveredCategory.value.image && hoveredCategory.value.image.src) {
    return hoveredCategory.value.image.src
  }
  
  // Fallback to main category image
  if (mainCategory.value && mainCategory.value.image && mainCategory.value.image.src) {
    return mainCategory.value.image.src
  }
  
  return null
})

const displayImageAlt = computed(() => {
  if (hoveredCategory.value) {
    return hoveredCategory.value.name
  }
  
  if (mainCategory.value) {
    return mainCategory.value.name
  }
  
  return props.label
})

const showMenu = () => {
  clearTimeout(hideTimeout.value)
  showTimeout.value = setTimeout(() => {
    isOpen.value = true
  }, 100)
}

const hideMenu = () => {
  clearTimeout(showTimeout.value)
  hideTimeout.value = setTimeout(() => {
    isOpen.value = false
    hoveredCategory.value = null
  }, 300)
}

const closeMenu = () => {
  clearTimeout(showTimeout.value)
  clearTimeout(hideTimeout.value)
  isOpen.value = false
  hoveredCategory.value = null
}

const setHoveredCategory = (category) => {
  hoveredCategory.value = category
}

const clearHoveredCategory = () => {
  hoveredCategory.value = null
}

const handleImageError = (event) => {
  // Hide the image if it fails to load
  event.target.style.display = 'none'
}

// Clean up timeouts on unmount
onUnmounted(() => {
  clearTimeout(showTimeout.value)
  clearTimeout(hideTimeout.value)
})
</script>