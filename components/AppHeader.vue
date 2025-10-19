<template>
  <header class="bg-white shadow-sm border-b relative z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Mobile menu button (left side on mobile) -->
        <BaseButton @click="toggleMobileMenu" variant="ghost" size="sm" icon="heroicons:bars-3"
          class="md:hidden text-gray-700 hover:text-gray-900" />

        <!-- Logo -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="text-2xl font-bold text-gray-900">
            Store
          </NuxtLink>
        </div>

        <!-- Navigation (Desktop) -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink to="/categories" class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
            Categories
          </NuxtLink>
          <NuxtLink to="/search" class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
            All Products
          </NuxtLink>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center">
          <!-- Search Button -->
          <BaseButton @click="toggleSearchModal" variant="ghost" size="lg" icon="heroicons:magnifying-glass"
            class="text-gray-700 hover:text-gray-900" />

          <!-- Cart -->
          <ClientOnly>
            <BaseButton @click="toggleCart" variant="ghost" size="lg" icon="heroicons:shopping-bag"
              :badge="cartItemCount > 0 ? cartItemCount : null" badge-color="red"
              class="text-gray-700 hover:text-gray-900" />
            <template #fallback>
              <BaseButton @click="toggleCart" variant="ghost" size="lg" icon="heroicons:shopping-bag"
                class="text-gray-700 hover:text-gray-900" />
            </template>
          </ClientOnly>

          <!-- Account -->
          <ClientOnly>
            <div v-if="isAuthenticated">
              <DropDown :items="accountMenuItems" @item-click="handleAccountAction" trigger-icon="heroicons:user-circle"
                trigger-label="Account" button-class="!bg-transparent hover:!bg-gray-100 !px-2 !py-2" position="right"
                size="sm" hide-label />
            </div>
            <NuxtLink v-else to="/login" class="text-gray-700 hover:text-gray-900">
              <ClientOnly>
                <Icon name="heroicons:user-circle" class="h-6 w-6" />
                <template #fallback>
                  <div class="h-6 w-6 bg-gray-200 rounded-full"></div>
                </template>
              </ClientOnly>
            </NuxtLink>
            <template #fallback>
              <NuxtLink to="/login" class="text-gray-700 hover:text-gray-900">
                <div class="h-6 w-6 bg-gray-200 rounded-full"></div>
              </NuxtLink>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <MobileSidebar :is-open="showMobileMenu" @close="closeMobileMenu" />

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
const { cartItemCount, toggleCart } = useCart()
const { isAuthenticated, logout } = useAuth()

const searchQuery = ref('')
const showMobileMenu = ref(false)
const showSearchModal = ref(false)

// Account dropdown menu items
const accountMenuItems = [
  {
    label: 'Profile',
    icon: 'heroicons:user-circle',
    action: () => navigateTo('/account')
  },
  {
    label: 'Orders',
    icon: 'heroicons:shopping-bag',
    action: () => navigateTo('/account/orders')
  },
  {
    label: 'Logout',
    icon: 'heroicons:arrow-right-on-rectangle',
    danger: true,
    action: () => logout()
  }
]



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
</script>