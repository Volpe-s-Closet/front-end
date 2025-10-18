<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">My Account</h1>
      <p class="text-gray-600 mt-2">Manage your account settings and view your order history</p>
    </div>

    <!-- Account Navigation -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Sidebar Navigation -->
      <div class="lg:col-span-1">
        <nav class="bg-white rounded-lg shadow-sm p-6">
          <ul class="space-y-2">
            <li>
              <NuxtLink 
                to="/account" 
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                :class="$route.path === '/account' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                <Icon name="heroicons:user" class="h-5 w-5 mr-3" />
                Profile
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/account/orders" 
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Icon name="heroicons:shopping-bag" class="h-5 w-5 mr-3" />
                Orders
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/account/addresses" 
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Icon name="heroicons:map-pin" class="h-5 w-5 mr-3" />
                Addresses
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/account/payment-methods" 
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Icon name="heroicons:credit-card" class="h-5 w-5 mr-3" />
                Payment Methods
              </NuxtLink>
            </li>
            <li>
              <button 
                @click="logout"
                class="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-red-700 hover:bg-red-50"
              >
                <Icon name="heroicons:arrow-right-on-rectangle" class="h-5 w-5 mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-3">
        <!-- Profile Information -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold">Profile Information</h2>
            <button 
              @click="editMode = !editMode"
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              {{ editMode ? 'Cancel' : 'Edit' }}
            </button>
          </div>

          <form v-if="editMode" @submit.prevent="updateProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  v-model="profileData.first_name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  v-model="profileData.last_name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="profileData.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <div class="flex space-x-4">
              <button
                type="submit"
                :disabled="updating"
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                <Icon v-if="updating" name="heroicons:arrow-path" class="h-4 w-4 animate-spin inline mr-2" />
                {{ updating ? 'Updating...' : 'Save Changes' }}
              </button>
              <button
                type="button"
                @click="editMode = false"
                class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>

          <div v-else class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">First Name</label>
                <p class="mt-1 text-gray-900">{{ user?.first_name || 'Not provided' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Last Name</label>
                <p class="mt-1 text-gray-900">{{ user?.last_name || 'Not provided' }}</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <p class="mt-1 text-gray-900">{{ user?.email || 'Not provided' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Member Since</label>
              <p class="mt-1 text-gray-900">{{ formatDate(user?.date_created) }}</p>
            </div>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold">Recent Orders</h2>
            <NuxtLink 
              to="/account/orders" 
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </NuxtLink>
          </div>

          <div v-if="loadingOrders" class="space-y-4">
            <div v-for="i in 3" :key="i" class="border rounded-lg p-4 animate-pulse">
              <div class="bg-gray-300 h-4 rounded mb-2"></div>
              <div class="bg-gray-300 h-3 rounded w-2/3"></div>
            </div>
          </div>

          <div v-else-if="recentOrders.length > 0" class="space-y-4">
            <div 
              v-for="order in recentOrders" 
              :key="order.id"
              class="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium">Order #{{ order.number }}</h3>
                  <p class="text-sm text-gray-600">{{ formatDate(order.date_created) }}</p>
                </div>
                <div class="text-right">
                  <p class="font-medium">${{ order.total }}</p>
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    getOrderStatusClass(order.status)
                  ]">
                    {{ order.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <Icon name="heroicons:shopping-bag" class="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-600">No orders yet</p>
            <NuxtLink 
              to="/search" 
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              Start Shopping
            </NuxtLink>
          </div>
        </div>

        <!-- Account Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <Icon name="heroicons:shopping-bag" class="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p class="text-2xl font-bold text-gray-900">{{ totalOrders }}</p>
            <p class="text-sm text-gray-600">Total Orders</p>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <Icon name="heroicons:currency-dollar" class="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p class="text-2xl font-bold text-gray-900">${{ totalSpent.toFixed(2) }}</p>
            <p class="text-sm text-gray-600">Total Spent</p>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <Icon name="heroicons:heart" class="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p class="text-2xl font-bold text-gray-900">0</p>
            <p class="text-sm text-gray-600">Wishlist Items</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user, logout, updateUserProfile, getUserProfile } = useAuth()
const { getOrders } = useWooCommerce()

// SEO
useHead({
  title: 'My Account - Your Store',
  meta: [
    { name: 'description', content: 'Manage your account settings and view your order history.' }
  ]
})

// Redirect if not authenticated
if (!user.value) {
  navigateTo('/login')
}

// Data
const editMode = ref(false)
const updating = ref(false)
const loadingOrders = ref(true)
const recentOrders = ref([])
const profileData = ref({
  first_name: '',
  last_name: '',
  email: ''
})

// Computed
const totalOrders = computed(() => recentOrders.value.length)
const totalSpent = computed(() => {
  return recentOrders.value.reduce((total, order) => {
    return total + parseFloat(order.total)
  }, 0)
})

// Methods
const updateProfile = async () => {
  updating.value = true
  try {
    const result = await updateUserProfile(profileData.value)
    if (result.success) {
      editMode.value = false
      // Show success message
    } else {
      console.error('Error updating profile:', result.error)
    }
  } catch (error) {
    console.error('Error updating profile:', error)
  } finally {
    updating.value = false
  }
}

const fetchRecentOrders = async () => {
  if (!user.value) return
  
  try {
    loadingOrders.value = true
    const orders = await getOrders(user.value.id, { per_page: 5 })
    recentOrders.value = orders
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loadingOrders.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

const getOrderStatusClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'refunded': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Initialize profile data
watch(user, (newUser) => {
  if (newUser) {
    profileData.value = {
      first_name: newUser.first_name || '',
      last_name: newUser.last_name || '',
      email: newUser.email || ''
    }
  }
}, { immediate: true })

// Initialize
onMounted(() => {
  fetchRecentOrders()
})
</script>