<template>
  <NuxtLayout name="account">
    <!-- Profile Information -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold">Profile Information</h2>
        <BaseButton @click="editMode = !editMode" variant="link" :text="editMode ? 'Cancel' : 'Edit'" />
      </div>

      <form v-if="editMode" @submit.prevent="updateProfile" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input v-model="profileData.first_name" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input v-model="profileData.last_name" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input v-model="profileData.email" type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input v-model="profileData.phone" type="tel"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input v-model="profileData.date_of_birth" type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>

        <div class="flex space-x-4">
          <BaseButton action="save" :loading="updating" :disabled="updating" />
          <BaseButton action="cancel" @click="editMode = false" />
        </div>
      </form>

      <div v-else class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">First Name</label>
            <ClientOnly>
              <div v-if="loadingProfile" class="mt-1">
                <div class="bg-gray-300 h-5 rounded animate-pulse w-24"></div>
              </div>
              <p v-else class="mt-1 text-gray-900">{{ displayUser?.first_name || 'Not provided' }}</p>
              <template #fallback>
                <p class="mt-1 text-gray-900">Not provided</p>
              </template>
            </ClientOnly>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Last Name</label>
            <ClientOnly>
              <div v-if="loadingProfile" class="mt-1">
                <div class="bg-gray-300 h-5 rounded animate-pulse w-24"></div>
              </div>
              <p v-else class="mt-1 text-gray-900">{{ displayUser?.last_name || 'Not provided' }}</p>
              <template #fallback>
                <p class="mt-1 text-gray-900">Not provided</p>
              </template>
            </ClientOnly>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <ClientOnly>
            <div v-if="loadingProfile" class="mt-1">
              <div class="bg-gray-300 h-5 rounded animate-pulse w-32"></div>
            </div>
            <p v-else class="mt-1 text-gray-900">{{ displayUser?.email || 'Not provided' }}</p>
            <template #fallback>
              <p class="mt-1 text-gray-900">Not provided</p>
            </template>
          </ClientOnly>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Phone Number</label>
          <ClientOnly>
            <div v-if="loadingProfile" class="mt-1">
              <div class="bg-gray-300 h-5 rounded animate-pulse w-28"></div>
            </div>
            <p v-else class="mt-1 text-gray-900">{{ displayUser?.billing?.phone || profileData?.phone || 'Not provided' }}</p>
            <template #fallback>
              <p class="mt-1 text-gray-900">Not provided</p>
            </template>
          </ClientOnly>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
          <ClientOnly>
            <div v-if="loadingProfile" class="mt-1">
              <div class="bg-gray-300 h-5 rounded animate-pulse w-24"></div>
            </div>
            <p v-else class="mt-1 text-gray-900">{{ profileData?.date_of_birth ? formatDate(profileData.date_of_birth) : 'Not provided' }}</p>
            <template #fallback>
              <p class="mt-1 text-gray-900">Not provided</p>
            </template>
          </ClientOnly>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Member Since</label>
          <ClientOnly>
            <div v-if="loadingProfile" class="mt-1">
              <div class="bg-gray-300 h-5 rounded animate-pulse w-20"></div>
            </div>
            <p v-else class="mt-1 text-gray-900">{{ formatDate(displayUser?.date_created) }}</p>
            <template #fallback>
              <p class="mt-1 text-gray-900">N/A</p>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold">Recent Orders</h2>
        <NuxtLink to="/account/orders" class="text-blue-600 hover:text-blue-800 font-medium">
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
        <div v-for="order in recentOrders" :key="order.id"
          class="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Order #{{ order.number }}</h3>
              <p class="text-sm text-gray-600">{{ formatDate(order.date_created) }}</p>
            </div>
            <div class="text-right">
              <ClientOnly>
                <p class="font-medium">{{ formatPrice(order.total) }}</p>
                <template #fallback>
                  <p class="font-medium">€{{ order.total }}</p>
                </template>
              </ClientOnly>
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
        <NuxtLink to="/search" class="text-blue-600 hover:text-blue-800 font-medium">
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
        <ClientOnly>
          <p class="text-2xl font-bold text-gray-900">{{ formatPrice(totalSpent) }}</p>
          <template #fallback>
            <p class="text-2xl font-bold text-gray-900">€0.00</p>
          </template>
        </ClientOnly>
        <p class="text-sm text-gray-600">Total Spent</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-6 text-center">
        <Icon name="heroicons:heart" class="h-8 w-8 text-red-600 mx-auto mb-2" />
        <p class="text-2xl font-bold text-gray-900">0</p>
        <p class="text-sm text-gray-600">Wishlist Items</p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()
const {
  displayCustomer,
  recentOrders,
  totalOrders,
  totalSpent,
  isLoadingProfile,
  isLoadingOrders,
  loadCustomerProfile,
  loadCustomerOrders,
  getProfileData,
  updateCustomerProfile,
  formatDate,
  getOrderStatusClass
} = useCustomer()
const { formatPrice } = useCurrency()

// SEO
useHead({
  title: 'My Account - Your Store',
  meta: [
    { name: 'description', content: 'Manage your account settings and view your order history.' }
  ]
})

// Local state
const editMode = ref(false)
const updating = ref(false)
const profileData = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: ''
})

// Computed
const displayUser = computed(() => displayCustomer.value || user.value)
const loadingProfile = computed(() => isLoadingProfile.value)
const loadingOrders = computed(() => isLoadingOrders.value)

// Methods
const updateProfile = async () => {
  updating.value = true
  try {
    const result = await updateCustomerProfile(profileData.value, user.value)
    if (result.success) {
      editMode.value = false
      console.log('Profile updated successfully')
    } else {
      console.error('Error updating profile:', result.error)
    }
  } catch (error) {
    console.error('Error updating profile:', error)
  } finally {
    updating.value = false
  }
}

// Watch for customer data changes to update profile form
watch(displayCustomer, (customer) => {
  if (customer) {
    profileData.value = getProfileData(customer, user.value) || profileData.value
  }
}, { immediate: true })

// Initialize
onMounted(async () => {
  await loadCustomerProfile(user.value)
  await loadCustomerOrders(user.value)
})
</script>