<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/50"
          @click="$emit('close')"
        />

        <!-- Modal Container -->
        <div class="relative flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24" @click="$emit('close')">
          <Transition
            enter-active-class="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            enter-from-class="opacity-0 scale-[0.98] -translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-[0.98] -translate-y-1"
          >
            <div
              v-if="isOpen"
              ref="modalContainer"
              class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 z-10"
              @click.stop
              @keydown="handleModalKeydown"
            >
              <!-- Search Input -->
              <div class="relative p-6 pb-4">
                <div class="relative">
                  <input
                    ref="searchInput"
                    type="text"
                    :placeholder="$t('search.placeholder')"
                    class="w-full pl-12 pr-12 py-4 text-lg border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors focus:outline-none"
                    v-model="localSearchQuery"
                    @keydown="handleKeydown"
                    @keyup.escape="$emit('close')"
                    autocomplete="off"
                  >
                  <ClientOnly>
                    <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                    <template #fallback>
                      <div class="absolute left-4 top-4 h-6 w-6 bg-gray-200 rounded"></div>
                    </template>
                  </ClientOnly>

                  <!-- Clear button (fades in/out with the query) -->
                  <Transition
                    enter-active-class="transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    enter-from-class="opacity-0 scale-90"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition-all duration-150 ease-in"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-90"
                  >
                    <BaseButton
                      v-if="localSearchQuery"
                      ref="clearButton"
                      @click="clearSearch"
                      variant="ghost"
                      size="sm"
                      icon="heroicons:x-mark"
                      class="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                      tabindex="0"
                    />
                  </Transition>
                </div>
              </div>

              <!-- Live Search Results (smooth height + opacity collapse) -->
              <Transition
                :css="false"
                @before-enter="onCollapseBeforeEnter"
                @enter="onCollapseEnter"
                @leave="onCollapseLeave"
              >
                <div
                  v-if="localSearchQuery && localSearchQuery.length > 1"
                  class="border-t border-gray-100 bg-white overflow-hidden"
                >
                  <div class="p-6">
                    <div class="text-sm text-gray-500 mb-3">
                      <span v-if="searchResults.length > 0">{{ $t('search.resultsFound', { count: searchResults.length }) }}</span>
                      <span v-else-if="isSearching">{{ $t('search.searching') }}</span>
                      <span v-else>{{ $t('search.noResults') }}</span>
                      <span class="ml-2 text-xs">· {{ $t('search.pressEnterAll') }}</span>
                    </div>

                    <!-- State swap: loading / results / empty -->
                    <Transition
                      mode="out-in"
                      enter-active-class="transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      enter-from-class="opacity-0 translate-y-1"
                      enter-to-class="opacity-100 translate-y-0"
                      leave-active-class="transition-all duration-150 ease-in"
                      leave-from-class="opacity-100 translate-y-0"
                      leave-to-class="opacity-0 -translate-y-1"
                    >
                      <!-- Loading state -->
                      <div v-if="isSearching" key="loading" class="space-y-2">
                        <div v-for="i in 3" :key="i" class="flex items-center p-3 rounded-lg animate-pulse">
                          <div class="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex-shrink-0"></div>
                          <div class="flex-1">
                            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                          <div class="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>

                      <!-- Search Results -->
                      <div v-else-if="searchResults.length > 0" key="results" class="space-y-1">
                        <button
                          v-for="(result, index) in searchResults.slice(0, 5)"
                          :key="result.id"
                          :ref="el => setResultRef(el, index)"
                          class="group/result w-full flex items-center p-3 rounded-lg cursor-pointer text-left focus:outline-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                          :class="selectedIndex === index
                            ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset'
                            : 'hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-inset'"
                          @click="handleResultClick(result)"
                          @mouseenter="selectedIndex = index"
                          @mouseleave="selectedIndex = -1"
                          tabindex="0"
                        >
                          <div class="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex-shrink-0 overflow-hidden">
                            <img
                              v-if="result.image"
                              :src="result.image"
                              :alt="result.name"
                              class="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/result:scale-105"
                            />
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="text-sm font-medium text-gray-900 truncate transition-transform duration-200 group-hover/result:translate-x-0.5">
                              {{ result.name }}
                            </div>
                            <div class="text-sm text-gray-500 truncate">
                              {{ result.category || $t('product.featuredBadge') }}
                            </div>
                          </div>
                          <div class="text-sm font-medium text-gray-900">
                            ${{ result.price }}
                          </div>
                        </button>

                        <!-- Show more results indicator -->
                        <div v-if="searchResults.length > 5" class="text-center py-2">
                          <span class="text-xs text-gray-500">
                            {{ $t('search.moreResults', { count: searchResults.length - 5 }) }}
                          </span>
                        </div>
                      </div>

                      <!-- No results -->
                      <div v-else key="empty" class="text-center py-8 text-gray-500">
                        <ClientOnly>
                          <Icon name="heroicons:magnifying-glass" class="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <template #fallback>
                            <div class="h-8 w-8 mx-auto mb-2 bg-gray-200 rounded"></div>
                          </template>
                        </ClientOnly>
                        <p class="text-sm">{{ $t('search.noProductsFound', { query: localSearchQuery }) }}</p>
                        <p class="text-xs mt-1">{{ $t('search.tryDifferent') }}</p>
                      </div>
                    </Transition>
                  </div>
                </div>
              </Transition>

              <!-- Footer -->
              <div class="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-2xl">
                <!-- Keyboard hints - hidden on mobile, visible on tablet and desktop -->
                <div class="hidden sm:flex items-center justify-between text-xs text-gray-500">
                  <div class="flex items-center flex-wrap gap-x-4 gap-y-2">
                    <span class="flex items-center">
                      <kbd class="px-2 py-1 bg-white border border-gray-200 rounded text-xs">↑↓</kbd>
                      <span class="ml-2">{{ $t('search.hints.navigate') }}</span>
                    </span>
                    <span class="flex items-center">
                      <kbd class="px-2 py-1 bg-white border border-gray-200 rounded text-xs">Enter</kbd>
                      <span class="ml-2">{{ $t('search.hints.select') }}</span>
                    </span>
                    <span class="flex items-center">
                      <kbd class="px-2 py-1 bg-white border border-gray-200 rounded text-xs">Tab</kbd>
                      <span class="ml-2">{{ $t('search.hints.focus') }}</span>
                    </span>
                    <span class="flex items-center">
                      <kbd class="px-2 py-1 bg-white border border-gray-200 rounded text-xs">Esc</kbd>
                      <span class="ml-2">{{ $t('search.hints.close') }}</span>
                    </span>
                  </div>
                </div>

                <!-- Mobile footer - helpful text -->
                <div class="sm:hidden text-center text-xs text-gray-500">
                  {{ $t('search.typeToSearch') }}
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  searchQuery: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'search', 'clear-search'])

const searchInput = ref(null)
const clearButton = ref(null)
const modalContainer = ref(null)
const localSearchQuery = ref(props.searchQuery)
const searchResults = ref([])
const isSearching = ref(false)
const selectedIndex = ref(-1) // -1 means no selection, 0+ means result index

// Get WooCommerce products for search
const { getProducts } = useProducts()

// Smooth expand/collapse for the live-results panel. Same easing/timing as
// the MegaMenu overlay and MobileSidebar so all menu surfaces feel related.
const COLLAPSE_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const COLLAPSE_DURATION = 280

const onCollapseBeforeEnter = (el) => {
  el.style.maxHeight = '0px'
  el.style.opacity = '0'
}

const onCollapseEnter = (el, done) => {
  const target = el.scrollHeight
  el.style.transition = `max-height ${COLLAPSE_DURATION}ms ${COLLAPSE_EASE}, opacity ${COLLAPSE_DURATION}ms ${COLLAPSE_EASE}`
  void el.offsetWidth
  el.style.maxHeight = `${target}px`
  el.style.opacity = '1'

  const cleanup = () => {
    el.style.transition = ''
    el.style.maxHeight = ''
    el.style.opacity = ''
    el.removeEventListener('transitionend', onEnd)
    done()
  }
  const onEnd = (e) => {
    if (e.target === el && e.propertyName === 'max-height') cleanup()
  }
  el.addEventListener('transitionend', onEnd)
  setTimeout(cleanup, COLLAPSE_DURATION + 80)
}

const onCollapseLeave = (el, done) => {
  const current = el.scrollHeight
  el.style.maxHeight = `${current}px`
  el.style.opacity = '1'
  void el.offsetWidth

  el.style.transition = `max-height ${COLLAPSE_DURATION - 40}ms ${COLLAPSE_EASE}, opacity ${COLLAPSE_DURATION - 40}ms ease-in`
  el.style.maxHeight = '0px'
  el.style.opacity = '0'

  const cleanup = () => {
    el.removeEventListener('transitionend', onEnd)
    done()
  }
  const onEnd = (e) => {
    if (e.target === el && e.propertyName === 'max-height') cleanup()
  }
  el.addEventListener('transitionend', onEnd)
  setTimeout(cleanup, COLLAPSE_DURATION + 80)
}

// Debounced search function
let searchTimeout = null
const performSearch = async (query) => {
  if (!query || query.length < 2) {
    searchResults.value = []
    return
  }

  try {
    isSearching.value = true
    const response = await getProducts({
      search: query,
      per_page: 10,
      status: 'publish'
    })

    // Handle different response structures
    let products = []
    if (response?.data?.value) {
      products = response.data.value
    } else if (response?.data) {
      products = response.data
    } else if (Array.isArray(response)) {
      products = response
    }

    // Format products for display
    searchResults.value = products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price || '0.00',
      category: product.categories?.[0]?.name || 'Product',
      image: product.images?.[0]?.src || null,
      slug: product.slug
    }))
  } catch (error) {
    console.error('Search failed:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

// Watch for search query changes and perform live search
watch(localSearchQuery, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // Reset selection when search changes
  selectedIndex.value = -1

  searchTimeout = setTimeout(() => {
    performSearch(newValue)
  }, 300) // 300ms debounce
})

// Watch for search results changes and reset selection
watch(searchResults, () => {
  selectedIndex.value = -1
})

// Watch for external search query changes
watch(() => props.searchQuery, (newValue) => {
  localSearchQuery.value = newValue
})

// Focus input when modal opens and clear results when closed
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      searchInput.value?.focus()
      // Store the previously focused element to restore later
      if (typeof document !== 'undefined') {
        previouslyFocusedElement.value = document.activeElement
      }
    })
  } else {
    // Clear search results when modal closes
    searchResults.value = []
    localSearchQuery.value = ''
    selectedIndex.value = -1

    // Restore focus to previously focused element
    if (previouslyFocusedElement.value && typeof previouslyFocusedElement.value.focus === 'function') {
      previouslyFocusedElement.value.focus()
    }
  }
})

// Store previously focused element for restoration
const previouslyFocusedElement = ref(null)

// Refs for result elements (for scrolling)
const resultRefs = ref([])
const setResultRef = (el, index) => {
  if (el) {
    resultRefs.value[index] = el
  }
}

// Get all focusable elements within the modal
const getFocusableElements = () => {
  if (!modalContainer.value) return []

  const focusableSelectors = [
    'input:not([disabled])',
    'button:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'a[href]'
  ]

  return Array.from(modalContainer.value.querySelectorAll(focusableSelectors.join(', ')))
    .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null)
}

// Handle keydown events on the modal container (focus trapping)
const handleModalKeydown = (e) => {
  if (e.key === 'Tab') {
    const focusableElements = getFocusableElements()
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey) {
      // Shift + Tab (backward)
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab (forward)
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }
}

// Handle keydown events on the search input (arrow navigation)
const handleKeydown = (e) => {
  const visibleResults = searchResults.value.slice(0, 5)

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (visibleResults.length > 0) {
      selectedIndex.value = selectedIndex.value < visibleResults.length - 1
        ? selectedIndex.value + 1
        : 0
      scrollToSelected()
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (visibleResults.length > 0) {
      selectedIndex.value = selectedIndex.value > 0
        ? selectedIndex.value - 1
        : visibleResults.length - 1
      scrollToSelected()
    }
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (selectedIndex.value >= 0 && visibleResults[selectedIndex.value]) {
      handleResultClick(visibleResults[selectedIndex.value])
    } else {
      handleSearch()
    }
  }
}

const scrollToSelected = () => {
  if (selectedIndex.value >= 0 && resultRefs.value[selectedIndex.value]) {
    resultRefs.value[selectedIndex.value].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    })
  }
}

const handleSearch = () => {
  if (localSearchQuery.value.trim()) {
    emit('search', localSearchQuery.value)
  }
}

const clearSearch = () => {
  localSearchQuery.value = ''
  searchResults.value = []
  selectedIndex.value = -1
  emit('clear-search')
  searchInput.value?.focus()
}

const handleResultClick = (result) => {
  // Navigate directly to product page if we have a slug
  if (result.slug) {
    navigateTo(`/product/${result.slug}`)
    emit('close')
  } else {
    // Fallback to search with product name
    emit('search', result.name)
  }
}



// Handle escape key globally when modal is open
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && props.isOpen) {
      emit('close')
    }
  }

  document.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>
