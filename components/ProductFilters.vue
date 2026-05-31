<template>
  <div>
    <!-- Mobile Filter Toggle Button -->
    <BaseButton
      @click="toggleMobileFilters"
      variant="outline"
      full-width
      class="lg:hidden mb-4 justify-between"
    >
      <span class="font-medium text-gray-900">{{ $t('filters.title') }}</span>
      <Icon
        :name="showMobileFilters ? 'heroicons:x-mark' : 'heroicons:funnel'"
        class="h-5 w-5 text-gray-500"
      />
    </BaseButton>

    <!-- Overlay for mobile -->
    <div
      v-if="showMobileFilters"
      @click="closeMobileFilters"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
    ></div>

    <!-- Filters Panel (mobile slide-over) -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="showMobileFilters"
        class="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-white shadow-xl z-50 overflow-y-auto"
      >
        <!-- Mobile Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold">{{ $t('filters.title') }}</h3>
          <BaseButton
            @click="closeMobileFilters"
            variant="ghost"
            size="sm"
            icon="heroicons:x-mark"
            rounded="full"
          />
        </div>

        <!-- Filter Content (mobile) -->
        <div class="p-6">
          <FilterSections
            :categories="categories"
            :attributes="attributes"
            :filters="filters"
            @update="updateFilters"
          />
          <BaseButton
            @click="clearFilters"
            variant="secondary"
            size="sm"
            :text="$t('filters.clearAll')"
            full-width
          />
          <BaseButton
            @click="applyFiltersAndClose"
            :text="$t('filters.apply')"
            full-width
            size="lg"
            class="mt-4"
          />
        </div>
      </div>
    </Transition>

    <!-- Desktop Filters (always visible on lg+) -->
    <div class="hidden lg:block bg-white rounded-lg shadow-sm">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">{{ $t('filters.title') }}</h3>
        <FilterSections
          :categories="categories"
          :attributes="attributes"
          :filters="filters"
          @update="updateFilters"
        />
        <BaseButton
          @click="clearFilters"
          variant="secondary"
          size="sm"
          :text="$t('filters.clearAll')"
          full-width
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// FilterSections is a shared subcomponent so the markup isn't duplicated
// between mobile and desktop. Both surfaces render the same fields.

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  attributes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['filtersChanged'])

const filters = ref({
  minPrice: '',
  maxPrice: '',
  categories: [],
  attributes: {},
  stockStatus: [],
  onSale: false,
  featured: false
})

// Mobile filters state
const showMobileFilters = ref(false)

// Initialize attribute filters
watch(() => props.attributes, (newAttributes) => {
  newAttributes.forEach(attr => {
    if (!filters.value.attributes[attr.slug]) {
      filters.value.attributes[attr.slug] = []
    }
  })
}, { immediate: true })

const updateFilters = () => {
  emit('filtersChanged', { ...filters.value })
}

const clearFilters = () => {
  filters.value = {
    minPrice: '',
    maxPrice: '',
    categories: [],
    attributes: {},
    stockStatus: [],
    onSale: false,
    featured: false
  }

  props.attributes.forEach(attr => {
    filters.value.attributes[attr.slug] = []
  })

  updateFilters()
}

const toggleMobileFilters = () => {
  showMobileFilters.value = !showMobileFilters.value
  if (showMobileFilters.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileFilters = () => {
  showMobileFilters.value = false
  document.body.style.overflow = ''
}

const applyFiltersAndClose = () => {
  updateFilters()
  closeMobileFilters()
}

onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeMobileFilters()
    }
  }

  document.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
  })
})

defineExpose({
  filters,
  clearFilters,
  closeMobileFilters
})
</script>
