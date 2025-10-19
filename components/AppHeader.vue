<template>
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="text-2xl font-bold text-gray-900">
            Store
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink to="/categories" class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
            Categories
          </NuxtLink>
          <NuxtLink to="/search" class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
            All Products
          </NuxtLink>
        </nav>

        <!-- Search Bar -->
        <div class="flex-1 max-w-lg mx-8">
          <div class="relative">
            <input
              type="text"
              placeholder="Search products..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="handleSearch"
              v-model="searchQuery"
            >
            <ClientOnly>
              <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <template #fallback>
                <div class="absolute left-3 top-2.5 h-5 w-5 bg-gray-200 rounded"></div>
              </template>
            </ClientOnly>
            <BaseButton 
              v-if="searchQuery"
              @click="clearSearch"
              variant="ghost"
              size="xs"
              icon="heroicons:x-mark"
              class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            />
          </div>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center space-x-4">
          <!-- Account -->
          <ClientOnly>
            <div v-if="isAuthenticated">
              <DropDown
                :items="accountMenuItems"
                @item-click="handleAccountAction"
                trigger-icon="heroicons:user-circle"
                trigger-label="Account"
                button-class="!bg-transparent hover:!bg-gray-100 !px-2 !py-2"
                position="right"
                size="sm"
                hide-label
              />
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

          <!-- Cart -->
          <BaseButton 
            @click="toggleCart" 
            variant="ghost" 
            size="lg" 
            icon="heroicons:shopping-bag" 
            :badge="cartItemCount > 0 ? cartItemCount : null"
            badge-color="red"
            class="text-gray-700 hover:text-gray-900"
          />

          <!-- Mobile menu button -->
          <BaseButton @click="toggleMobileMenu" variant="ghost" size="sm" icon="heroicons:bars-3" class="md:hidden text-gray-700 hover:text-gray-900" />
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 pt-4 pb-3">
        <div class="space-y-1">
          <NuxtLink to="/categories" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900">
            Categories
          </NuxtLink>
          <NuxtLink to="/search" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900">
            All Products
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const { cartItemCount, toggleCart } = useCart()
const { isAuthenticated, logout } = useAuth()

const searchQuery = ref('')
const showMobileMenu = ref(false)

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

// Debounced search
let searchTimeout = null

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

// Watch for search query changes and debounce
watch(searchQuery, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    if (newValue.trim()) {
      navigateTo(`/search?q=${encodeURIComponent(newValue)}`)
    } else {
      // Navigate to all products when search is cleared
      navigateTo('/search')
    }
  }, 300)
})

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const handleAccountAction = () => {
  // Actions are already defined in the menu items
  // This handler is just for additional logic if needed
}
</script>