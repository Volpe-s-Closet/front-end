<template>
  <Teleport to="body">
    <Transition
      :css="false"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div
        v-if="activeMenu"
        ref="panelRef"
        class="fixed left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] bg-white shadow-2xl border border-gray-100 rounded-xl z-50 overflow-hidden transition-[max-width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        :class="containerWidthClass"
        :style="{ top: panelTop }"
        @mouseenter="cancelPending"
        @mouseleave="requestClose"
      >
        <!-- Cross-fade content while card morphs -->
        <Transition
          mode="out-in"
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div :key="activeMenu.id" class="px-6 sm:px-8">
            <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 pt-8 pb-4 items-stretch">
              <!-- Left: categories -->
              <div class="flex-1 min-w-0 flex flex-col">
                <div class="mb-5">
                  <h3 class="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                    {{ activeMenu.label }}
                  </h3>
                </div>

                <div
                  v-if="hasSubcategories"
                  class="grid grid-flow-row sm:grid-flow-col gap-x-10 gap-y-1 auto-cols-fr"
                  :style="gridStyle"
                  @mouseleave="setHoveredSubcategory(null)"
                >
                  <NuxtLink
                    v-for="subcategory in activeMenu.subcategories"
                    :key="subcategory.id"
                    :to="`/category/${subcategory.slug}`"
                    class="group/item relative flex items-center py-2 pl-3 pr-2 -ml-3 text-sm text-gray-700 hover:text-gray-900 rounded-md transition-colors"
                    @click="closeNow"
                    @mouseenter="setHoveredSubcategory(subcategory.id)"
                  >
                    <span
                      class="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-gray-900 origin-top transition-transform duration-200"
                      :class="hoveredSubcategoryId === subcategory.id ? 'scale-y-100' : 'scale-y-0'"
                    />
                    <span class="truncate transition-transform duration-200 group-hover/item:translate-x-0.5">
                      {{ subcategory.name }}
                    </span>
                  </NuxtLink>
                </div>

                <div v-else class="flex flex-col">
                  <p class="text-sm text-gray-500 mb-4">
                    Browse the entire {{ activeMenu.label.toLowerCase() }} collection.
                  </p>
                  <NuxtLink
                    v-if="activeMenu.mainCategory"
                    :to="`/category/${activeMenu.mainCategory.slug}`"
                    class="inline-flex items-center self-start px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 rounded-md transition-colors"
                    @click="closeNow"
                  >
                    Shop {{ activeMenu.label }}
                    <ClientOnly>
                      <Icon name="heroicons:arrow-right" class="ml-2 h-4 w-4" />
                      <template #fallback>
                        <div class="ml-2 h-4 w-4"></div>
                      </template>
                    </ClientOnly>
                  </NuxtLink>
                </div>
              </div>

              <!-- Right: featured image + view all -->
              <div
                class="flex flex-col gap-3 flex-shrink-0 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                :class="imageWidthClass"
              >
                <NuxtLink
                  :to="featuredLink"
                  class="group/img relative block overflow-hidden rounded-lg bg-gray-100 aspect-[4/3] lg:aspect-auto lg:h-[300px] lg:flex-shrink-0"
                  @click="closeNow"
                >
                <!-- Crossfading image layer -->
                <Transition
                  enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  enter-from-class="opacity-0 scale-105"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                >
                  <img
                    v-if="displayImage"
                    :key="displayImage"
                    :src="displayImage"
                    :alt="displayImageAlt"
                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                    @error="handleImageError"
                  />
                  <div
                    v-else
                    class="absolute inset-0 flex items-center justify-center text-gray-300"
                  >
                    <ClientOnly>
                      <Icon name="heroicons:photo" class="h-16 w-16" />
                      <template #fallback>
                        <div class="h-16 w-16 bg-gray-200 rounded"></div>
                      </template>
                    </ClientOnly>
                  </div>
                </Transition>

                <!-- Gradient overlay (static) -->
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  <!-- Caption (crossfades on hover change) -->
                  <div class="absolute bottom-0 left-0 right-0 p-5">
                    <Transition
                      mode="out-in"
                      enter-active-class="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      enter-from-class="opacity-0 translate-y-2"
                      enter-to-class="opacity-100 translate-y-0"
                      leave-active-class="transition-all duration-200 ease-in"
                      leave-from-class="opacity-100 translate-y-0"
                      leave-to-class="opacity-0 -translate-y-1"
                    >
                      <div :key="captionKey">
                        <p class="text-xs uppercase tracking-wider text-white/80 mb-1">
                          {{ hoveredSubcategoryId ? 'Explore' : 'Featured' }}
                        </p>
                        <p class="text-lg font-semibold text-white">
                          {{ displayImageAlt }}
                        </p>
                      </div>
                    </Transition>
                  </div>
                </NuxtLink>

                <!-- View all link, aligned bottom-right under the image -->
                <NuxtLink
                  v-if="activeMenu.mainCategory"
                  :to="`/category/${activeMenu.mainCategory.slug}`"
                  class="group/all inline-flex items-center self-end text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  @click="closeNow"
                  @mouseenter="setHoveredSubcategory(null)"
                >
                  View all {{ activeMenu.label.toLowerCase() }}
                  <ClientOnly>
                    <Icon
                      name="heroicons:arrow-right"
                      class="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover/all:translate-x-0.5"
                    />
                    <template #fallback>
                      <div class="ml-1.5 h-4 w-4"></div>
                    </template>
                  </ClientOnly>
                </NuxtLink>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  panelTop: {
    type: String,
    default: '112px'
  }
})

const {
  activeMenu,
  hoveredSubcategoryId,
  cancelPending,
  requestClose,
  closeNow,
  setHoveredSubcategory
} = useMegaMenu()

const subcategories = computed(() => activeMenu.value?.subcategories || [])
const hasSubcategories = computed(() => subcategories.value.length > 0)

const hoveredSubcategory = computed(() =>
  subcategories.value.find(s => s.id === hoveredSubcategoryId.value) || null
)

const containerWidthClass = computed(() => {
  if (!activeMenu.value || !hasSubcategories.value) return 'max-w-3xl'
  const cols = columnsRendered.value
  if (cols >= 4) return 'max-w-7xl'
  if (cols === 3) return 'max-w-6xl'
  if (cols === 2) return 'max-w-5xl'
  return 'max-w-3xl'
})

const imageWidthClass = computed(() => {
  if (!activeMenu.value || !hasSubcategories.value) return 'lg:w-[460px]'
  const cols = columnsRendered.value
  if (cols >= 3) return 'lg:w-[380px]'
  if (cols === 2) return 'lg:w-[340px]'
  return 'lg:w-[300px]'
})

// Layout math, based on known sizes. No DOM measurement = stable result.
// Right column = image (300px) + gap-3 (12px) + link (~24px) ≈ 336px target.
// Each item ≈ 36px (text-sm + py-2 + gap-y-1).
const TARGET_COL_HEIGHT = 336
const ITEM_HEIGHT = 36
const MAX_ROWS_PER_COL = Math.floor(TARGET_COL_HEIGHT / ITEM_HEIGHT) // 9

const columnsRendered = computed(() => {
  const count = subcategories.value.length
  if (count === 0) return 1
  return Math.max(1, Math.ceil(count / MAX_ROWS_PER_COL))
})

const rowsPerColumn = computed(() => {
  const count = subcategories.value.length
  if (count === 0) return 1
  // Balance items across columns so all columns are roughly equal height
  return Math.ceil(count / columnsRendered.value)
})

const gridStyle = computed(() => {
  const count = subcategories.value.length
  if (count === 0) return {}
  return { gridTemplateRows: `repeat(${rowsPerColumn.value}, minmax(0, auto))` }
})

const displayImage = computed(() => {
  if (hoveredSubcategory.value?.image?.src) return hoveredSubcategory.value.image.src
  if (activeMenu.value?.mainCategory?.image?.src) return activeMenu.value.mainCategory.image.src
  return null
})

const displayImageAlt = computed(() => {
  if (hoveredSubcategory.value) return hoveredSubcategory.value.name
  if (activeMenu.value?.mainCategory) return activeMenu.value.mainCategory.name
  return activeMenu.value?.label || ''
})

const featuredLink = computed(() => {
  if (hoveredSubcategory.value) return `/category/${hoveredSubcategory.value.slug}`
  if (activeMenu.value?.mainCategory) return `/category/${activeMenu.value.mainCategory.slug}`
  return '/'
})

// Stable key for caption transition: changes when text content changes
const captionKey = computed(() => `${activeMenu.value?.id || ''}-${hoveredSubcategoryId.value || 'main'}`)

const handleImageError = (event) => {
  event.target.style.display = 'none'
}

// JS transition: grow/shrink the panel like the switch animation
const panelRef = ref(null)
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const DURATION = 280

const onBeforeEnter = (el) => {
  el.style.opacity = '0'
  el.style.transform = 'translate(-50%, -8px)'
  // Collapse height/width so it grows from the trigger area
  el.style.maxHeight = '0px'
  el.style.transformOrigin = 'top center'
}

const onEnter = (el, done) => {
  // Read target dimensions before animating
  el.style.maxHeight = 'none'
  const targetHeight = el.scrollHeight
  el.style.maxHeight = '0px'
  // Force reflow so the browser registers the starting state
  void el.offsetWidth

  el.style.transition = [
    `opacity ${DURATION}ms ${EASE}`,
    `transform ${DURATION}ms ${EASE}`,
    `max-height ${DURATION}ms ${EASE}`,
    `max-width 300ms ${EASE}`
  ].join(', ')

  el.style.opacity = '1'
  el.style.transform = 'translate(-50%, 0)'
  el.style.maxHeight = `${targetHeight}px`

  const cleanup = () => {
    el.style.transition = ''
    el.style.maxHeight = ''
    el.removeEventListener('transitionend', onEnd)
    done()
  }
  const onEnd = (e) => {
    if (e.target === el && e.propertyName === 'max-height') cleanup()
  }
  el.addEventListener('transitionend', onEnd)
  // Safety fallback
  setTimeout(cleanup, DURATION + 80)
}

const onLeave = (el, done) => {
  const currentHeight = el.scrollHeight
  el.style.maxHeight = `${currentHeight}px`
  void el.offsetWidth

  el.style.transition = [
    `opacity ${DURATION - 60}ms ease-in`,
    `transform ${DURATION - 60}ms ease-in`,
    `max-height ${DURATION - 60}ms ${EASE}`
  ].join(', ')

  el.style.opacity = '0'
  el.style.transform = 'translate(-50%, -6px)'
  el.style.maxHeight = '0px'

  const cleanup = () => {
    el.removeEventListener('transitionend', onEnd)
    done()
  }
  const onEnd = (e) => {
    if (e.target === el && e.propertyName === 'max-height') cleanup()
  }
  el.addEventListener('transitionend', onEnd)
  setTimeout(cleanup, DURATION + 80)
}

// Match column heights to the right column (image + link).
// Layout is computed from known constants (see columnsRendered above) so
// it's stable regardless of when measurement would run.
</script>
