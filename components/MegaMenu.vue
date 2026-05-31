<template>
  <div
    class="relative"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <button
      class="relative flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg transition-colors"
      :class="{ 'text-gray-900': isOpen }"
      @click="onClick"
    >
      {{ label }}
      <ClientOnly>
        <Icon
          name="heroicons:chevron-down"
          class="ml-1 h-4 w-4 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
        <template #fallback>
          <div class="ml-1 h-4 w-4 bg-gray-200 rounded"></div>
        </template>
      </ClientOnly>
      <span
        class="pointer-events-none absolute left-3 right-3 -bottom-px h-0.5 bg-gray-900 origin-center transition-transform duration-200"
        :class="isOpen ? 'scale-x-100' : 'scale-x-0'"
      />
    </button>
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

const { categories, fetchCategoriesIncludingEmpty } = useCategories()
const {
  activeId,
  registerMenu,
  unregisterMenu,
  requestOpen,
  requestClose,
  closeNow
} = useMegaMenu()

const id = props.categorySlug

const mainCategory = computed(() =>
  categories.value.find(cat => cat.slug === props.categorySlug)
)

const subcategories = computed(() => mainCategory.value?.children || [])

const isOpen = computed(() => activeId.value === id)

// Register/sync this menu with the shared overlay
watchEffect(() => {
  registerMenu({
    id,
    label: props.label,
    categorySlug: props.categorySlug,
    mainCategory: mainCategory.value,
    subcategories: subcategories.value
  })
})

onMounted(() => {
  if (categories.value.length === 0) {
    fetchCategoriesIncludingEmpty()
  }
})

onUnmounted(() => {
  unregisterMenu(id)
})

const onEnter = () => requestOpen(id)
const onLeave = () => requestClose()
const onClick = () => {
  if (isOpen.value) {
    closeNow()
  } else {
    requestOpen(id)
  }
}
</script>
