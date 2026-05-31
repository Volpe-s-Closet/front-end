<template>
  <!-- News Banner -->
  <div class="bg-black text-white py-2 overflow-hidden relative">
    <div class="animate-scroll whitespace-nowrap">
      <span class="inline-block px-4">
        {{ $t('header.newsBanner') }}
      </span>
    </div>
  </div>

  <header class="bg-white shadow-sm border-b sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Left side (Mobile: Search + Menu, Desktop: Logo) -->
        <div class="flex items-center">
          <!-- Mobile Search Button -->
          <BaseButton @click="toggleSearchModal" variant="ghost" size="sm" icon="heroicons:magnifying-glass"
            custom-padding="px-3 py-2" class="md:hidden text-gray-700 hover:text-gray-900" />

          <!-- Mobile menu button -->
          <BaseButton @click="toggleMobileMenu" variant="ghost" size="sm" icon="heroicons:bars-3"
            custom-padding="px-3 py-2" class="md:hidden text-gray-700 hover:text-gray-900" />

          <!-- Logo (Desktop) -->
          <div class="hidden md:block flex-shrink-0">
            <NuxtLink to="/" class="flex items-center">
              <img
                src="https://admin.volpescloset.com/wp-content/uploads/2025/06/Screenshot-From-2025-06-15-12-15-13.png"
                :alt="$t('header.logoAlt')" class="h-10 w-auto" />
            </NuxtLink>
          </div>
        </div>

        <!-- Center Logo (Mobile) -->
        <div class="md:hidden flex-shrink-0">
          <NuxtLink to="/" class="flex items-center">
            <img src="https://admin.volpescloset.com/wp-content/uploads/2025/06/Screenshot-From-2025-06-15-12-15-13.png"
              :alt="$t('header.logoAlt')" class="h-8 w-auto" />
          </NuxtLink>
        </div>

        <!-- Navigation (Desktop) -->
        <nav class="hidden md:flex space-x-8">
          <!-- Bags Mega Menu -->
          <MegaMenu :label="$t('header.nav.bags')" category-slug="bolsos" />

          <!-- Accessories Mega Menu -->
          <MegaMenu :label="$t('header.nav.accessories')" category-slug="accesorios" />

          <!-- Promos Mega Menu -->
          <MegaMenu :label="$t('header.nav.promos')" category-slug="promos" />

          <!-- Blog Link -->
          <NuxtLink to="/blog"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            {{ $t('header.nav.blog') }}
          </NuxtLink>

          <!-- About Us Link -->
          <NuxtLink to="/about"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            {{ $t('header.nav.aboutUs') }}
          </NuxtLink>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center">
          <!-- Language Switcher (Desktop only) -->
          <div class="hidden md:block mr-2">
            <SelectBox v-model="selectedLanguage" :options="languages" @change="handleLanguageChange" size="sm"
              position="right" button-class="!bg-transparent hover:!bg-gray-100 !border-0 !px-2 !py-1" flag-only />
          </div>

          <!-- Search Button (Desktop only) -->
          <BaseButton @click="toggleSearchModal" variant="ghost" size="lg" icon="heroicons:magnifying-glass"
            custom-padding="px-3 py-2" class="hidden md:inline-flex text-gray-700 hover:text-gray-900" />

          <!-- Cart -->
          <ClientOnly>
            <BaseButton @click="toggleCart" variant="ghost" size="lg" icon="heroicons:shopping-bag"
              custom-padding="px-3 py-2" :badge="cartItemCount > 0 ? cartItemCount : null" badge-color="red"
              class="text-gray-700 hover:text-gray-900" />
            <template #fallback>
              <BaseButton @click="toggleCart" variant="ghost" size="lg" icon="heroicons:shopping-bag"
                custom-padding="px-3 py-2" class="text-gray-700 hover:text-gray-900" />
            </template>
          </ClientOnly>

          <!-- Account -->
          <ClientOnly>
            <div v-if="isAuthenticated">
              <DropDown :items="accountMenuItems" @item-click="handleAccountAction" trigger-icon="heroicons:user-circle"
                :trigger-label="$t('header.account.label')" button-class="!bg-transparent hover:!bg-gray-100 !px-3 !py-2" position="right"
                size="lg" hide-label hide-chevron />
            </div>
            <NuxtLink v-else to="/login"
              class="inline-flex items-center justify-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <ClientOnly>
                <Icon name="heroicons:user-circle" class="h-6 w-6" />
                <template #fallback>
                  <div class="h-6 w-6 bg-gray-200 rounded-full"></div>
                </template>
              </ClientOnly>
            </NuxtLink>
            <template #fallback>
              <NuxtLink to="/login"
                class="inline-flex items-center justify-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <div class="h-6 w-6 bg-gray-200 rounded-full"></div>
              </NuxtLink>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <MobileSidebar :is-open="showMobileMenu" @close="closeMobileMenu" />

    <!-- Mega Menu Overlay (shared panel for all desktop mega menus) -->
    <MegaMenuOverlay />

    <!-- Search Modal -->
    <SearchModal :is-open="showSearchModal" @close="closeSearchModal" :search-query="searchQuery" @search="handleSearch"
      @clear-search="clearSearch" />

    <!-- Mobile Sidebar Overlay -->
    <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showMobileMenu" class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" @click="closeMobileMenu" />
    </Transition>
  </header>
</template>

<script setup>
const { t } = useI18n()
const { cartItemCount, toggleCart } = useCart()
const { isAuthenticated, logout } = useAuth()
const { fetchCategories } = useCategories()
const { currentLanguage, languages, setLanguage } = useLanguage()

const searchQuery = ref('')
const showMobileMenu = ref(false)
const showSearchModal = ref(false)
const selectedLanguage = ref(currentLanguage.value)

// Keep the SelectBox in sync if the locale is changed elsewhere
// (e.g. via the mobile sidebar's switcher).
watch(currentLanguage, (val) => {
  selectedLanguage.value = val
})

// Account dropdown menu items — labels are translated, recomputed on locale change
const accountMenuItems = computed(() => [
  {
    label: t('header.account.profile'),
    icon: 'heroicons:user-circle',
    action: () => navigateTo('/account')
  },
  {
    label: t('header.account.orders'),
    icon: 'heroicons:shopping-bag',
    action: () => navigateTo('/account/orders')
  },
  {
    label: t('header.account.logout'),
    icon: 'heroicons:arrow-right-on-rectangle',
    danger: true,
    action: () => logout()
  }
])

const handleSearch = (query) => {
  if (query && query.trim()) {
    searchQuery.value = query
    navigateTo(`/search?q=${encodeURIComponent(query)}`)
    closeSearchModal()
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const toggleSearchModal = () => {
  showSearchModal.value = !showSearchModal.value
}

const closeSearchModal = () => {
  showSearchModal.value = false
}

const handleAccountAction = () => {
  // Actions are already defined in the menu items
  // This handler is just for additional logic if needed
}

const handleLanguageChange = (option) => {
  setLanguage(option.value)
  selectedLanguage.value = option.value
}

// Fetch categories on component mount
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
@keyframes scroll {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}

.animate-scroll {
  animation: scroll 30s linear infinite;
}
</style>