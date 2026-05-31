<template>
  <Transition
    enter-active-class="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-40 md:hidden overflow-y-auto flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">{{ $t('common.menu') }}</h2>
        <BaseButton
          @click="$emit('close')"
          variant="ghost"
          size="sm"
          icon="heroicons:x-mark"
          class="text-gray-500 hover:text-gray-700"
        />
      </div>

      <!-- Navigation Links -->
      <nav class="p-4 flex-1">
        <div class="space-y-1">
          <!-- Category Sections -->
          <div v-for="section in sections" :key="section.slug" class="space-y-1">
            <!-- Section Header -->
            <button
              @click="toggleSection(section.slug)"
              class="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              :class="{ 'text-gray-900': isExpanded(section.slug) }"
            >
              <span>{{ section.label }}</span>
              <ClientOnly>
                <Icon
                  name="heroicons:chevron-down"
                  class="h-4 w-4 text-gray-400 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  :class="{ 'rotate-180': isExpanded(section.slug) }"
                />
                <template #fallback>
                  <div class="h-4 w-4 bg-gray-200 rounded"></div>
                </template>
              </ClientOnly>
            </button>

            <!-- Section Dropdown -->
            <Transition
              :css="false"
              @before-enter="onCollapseBeforeEnter"
              @enter="onCollapseEnter"
              @leave="onCollapseLeave"
            >
              <div v-if="isExpanded(section.slug)" class="ml-4 overflow-hidden">
                <div class="space-y-1 pt-1 pb-2">
                  <NuxtLink
                    :to="getCategory(section.slug) ? `/category/${getCategory(section.slug).slug}` : '/'"
                    class="group/item relative flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    @click="$emit('close')"
                  >
                    <span
                      class="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-gray-900 origin-top scale-y-0 transition-transform duration-200 group-hover/item:scale-y-100"
                    />
                    <span class="transition-transform duration-200 group-hover/item:translate-x-0.5">
                      {{ $t('mobileSidebar.all', { category: section.label }) }}
                    </span>
                  </NuxtLink>

                  <NuxtLink
                    v-for="subcategory in getCategory(section.slug)?.children || []"
                    :key="subcategory.id"
                    :to="`/category/${subcategory.slug}`"
                    class="group/item relative flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    @click="$emit('close')"
                  >
                    <span
                      class="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-gray-900 origin-top scale-y-0 transition-transform duration-200 group-hover/item:scale-y-100"
                    />
                    <span class="transition-transform duration-200 group-hover/item:translate-x-0.5">
                      {{ subcategory.name }}
                    </span>
                  </NuxtLink>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Blog Link -->
          <NuxtLink
            to="/blog"
            class="group/link flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            @click="$emit('close')"
          >
            <span class="transition-transform duration-200 group-hover/link:translate-x-0.5">{{ $t('header.nav.blog') }}</span>
          </NuxtLink>

          <!-- About Us Link -->
          <NuxtLink
            to="/about"
            class="group/link flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            @click="$emit('close')"
          >
            <span class="transition-transform duration-200 group-hover/link:translate-x-0.5">{{ $t('header.nav.aboutUs') }}</span>
          </NuxtLink>
        </div>
      </nav>

      <!-- Language Switcher (Mobile only) -->
      <div class="p-4 border-t border-gray-200">
        <div class="mb-2">
          <span class="text-sm font-medium text-gray-700">{{ $t('common.language') }}</span>
        </div>
        <SelectBox
          v-model="selectedLanguage"
          :options="languages"
          @change="handleLanguageChange"
          size="sm"
          position="left"
          button-class="w-full justify-between"
          flag-only
        />
      </div>
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
const { currentLanguage, languages, setLanguage } = useLanguage()
const { t } = useI18n()
const selectedLanguage = ref(currentLanguage.value)

watch(currentLanguage, (val) => {
  selectedLanguage.value = val
})

// Single source of truth for the category sections rendered in the sidebar.
// Labels are translated so the section headers and the "All ..." links pick up
// the active locale automatically.
const sections = computed(() => [
  { slug: 'bolsos', label: t('header.nav.bags') },
  { slug: 'accesorios', label: t('header.nav.accessories') },
  { slug: 'promos', label: t('header.nav.promos') }
])

const expanded = ref({})

const isExpanded = (slug) => !!expanded.value[slug]

const toggleSection = (slug) => {
  expanded.value = { ...expanded.value, [slug]: !expanded.value[slug] }
}

const getCategory = (slug) => categories.value.find(cat => cat.slug === slug)

const handleLanguageChange = (option) => {
  setLanguage(option.value)
  selectedLanguage.value = option.value
}

// Smooth expand/collapse via JS hooks. Mirrors the easing/timing used by the
// MegaMenu overlay so the sidebar feels like part of the same animation system.
const COLLAPSE_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const COLLAPSE_DURATION = 260

const onCollapseBeforeEnter = (el) => {
  el.style.maxHeight = '0px'
  el.style.opacity = '0'
}

const onCollapseEnter = (el, done) => {
  const target = el.scrollHeight
  el.style.transition = `max-height ${COLLAPSE_DURATION}ms ${COLLAPSE_EASE}, opacity ${COLLAPSE_DURATION}ms ${COLLAPSE_EASE}`
  // Force reflow so the browser registers the starting state
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
  // Safety fallback in case transitionend doesn't fire
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

// Close sidebar when pressing escape
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
