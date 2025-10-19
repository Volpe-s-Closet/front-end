<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center space-x-4 mb-4">
        <NuxtLink 
          to="/account/orders"
          class="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <Icon name="heroicons:arrow-left" class="h-5 w-5 mr-2" />
          Back to Orders
        </NuxtLink>
      </div>
      <h1 class="text-3xl font-bold text-gray-900">Order #{{ order?.number }}</h1>
      <p class="text-gray-600 mt-2">Placed on {{ formatDate(order?.date_created) }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div class="bg-gray-300 h-6 rounded mb-4"></div>
        <div class="bg-gray-300 h-4 rounded w-2/3 mb-2"></div>
        <div class="bg-gray-300 h-4 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Order Details -->
    <div v-else-if="order" class="space-y-6">
      <!-- Order Status -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold mb-2">Order Status</h2>
            <span :class="[
              'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
              getOrderStatusClass(order.status)
            ]">
              {{ capitalizeFirst(order.status) }}
            </span>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold">{{ formatPrice(order.total) }}</p>
            <p class="text-gray-600">Total</p>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">Items Ordered</h2>
        <div class="space-y-4">
          <div 
            v-for="item in order.line_items" 
            :key="item.id"
            class="flex items-center space-x-4 pb-4 border-b last:border-b-0"
          >
            <img 
              :src="item.image?.src || getPlaceholderImage()" 
              :alt="item.name"
              class="w-16 h-16 object-cover rounded"
            >
            <div class="flex-1">
              <h3 class="font-medium">{{ item.name }}</h3>
              <p class="text-gray-600">Quantity: {{ item.quantity }}</p>
              <p class="text-gray-600">Price: {{ formatPrice(item.price) }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold">{{ formatPrice(item.total) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const { getOrder, getPlaceholderImage } = useCustomer()
const { formatPrice } = useCurrency()

// Data
const order = ref(null)
const loading = ref(true)

// Methods
const fetchOrder = async () => {
  try {
    loading.value = true
    const orderId = route.params.id
    order.value = await getOrder(orderId)
  } catch (error) {
    console.error('Error fetching order:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getOrderStatusClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// SEO
useHead({
  title: computed(() => order.value ? `Order #${order.value.number} - Your Store` : 'Order Details - Your Store')
})

// Initialize
onMounted(() => {
  fetchOrder()
})
</script>