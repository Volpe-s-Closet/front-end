<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
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
              <div class="relative" v-if="isAuthenticated">
                <BaseButton @click="toggleAccountMenu" variant="ghost" size="lg" icon="heroicons:user-circle" />
                <div v-if="showAccountMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <NuxtLink to="/account" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Account
                  </NuxtLink>
                  <NuxtLink to="/account/orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Orders
                  </NuxtLink>
                  <BaseButton @click="logout" variant="ghost" size="sm" text="Logout" full-width class="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" />
                </div>
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

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">Store</h3>
            <p class="text-gray-400">Your trusted ecommerce destination for quality products.</p>
          </div>
          <div>
            <h4 class="text-sm font-semibold mb-4 uppercase tracking-wider">Shop</h4>
            <ul class="space-y-2">
              <li><NuxtLink to="/categories" class="text-gray-400 hover:text-white">Categories</NuxtLink></li>
              <li><NuxtLink to="/search" class="text-gray-400 hover:text-white">All Products</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-semibold mb-4 uppercase tracking-wider">Account</h4>
            <ul class="space-y-2">
              <li><NuxtLink to="/account" class="text-gray-400 hover:text-white">My Account</NuxtLink></li>
              <li><NuxtLink to="/account/orders" class="text-gray-400 hover:text-white">Order History</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-semibold mb-4 uppercase tracking-wider">Support</h4>
            <ul class="space-y-2">
              <li><NuxtLink to="/contact" class="text-gray-400 hover:text-white">Contact Us</NuxtLink></li>
              <li><NuxtLink to="/faq" class="text-gray-400 hover:text-white">FAQ</NuxtLink></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p class="text-gray-400">&copy; 2025 Store. All rights reserved.</p>
            <div class="flex space-x-6">
              <NuxtLink to="/privacy" class="text-gray-400 hover:text-white text-sm">Privacy Policy</NuxtLink>
              <NuxtLink to="/terms" class="text-gray-400 hover:text-white text-sm">Terms & Conditions</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- Cart Sidebar -->
    <CartSidebar />
  </div>
</template>

<script setup>
const { cartItemCount, toggleCart, initCart } = useCart()
const { isAuthenticated, logout } = useAuth()

const searchQuery = ref('')
const showMobileMenu = ref(false)
const showAccountMenu = ref(false)

// Debounced search
let searchTimeout = null

// Cart initialization is handled by the cart.client.js plugin

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  // The watch function will handle navigation to /search
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

const toggleAccountMenu = () => {
  showAccountMenu.value = !showAccountMenu.value
}

// toggleCart and logout are now from composables
</script>