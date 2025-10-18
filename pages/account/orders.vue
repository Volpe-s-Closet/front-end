<template>
  <NuxtLayout name="account">
        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by order number..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select
            v-model="dateFilter"
            class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
            <option value="365">Last Year</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div class="bg-gray-300 h-4 rounded mb-4"></div>
        <div class="bg-gray-300 h-3 rounded w-2/3 mb-2"></div>
        <div class="bg-gray-300 h-3 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Orders List -->
    <div v-else-if="filteredOrders.length > 0" class="space-y-4">
      <div 
        v-for="order in filteredOrders" 
        :key="order.id"
        class="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <div class="p-6">
          <!-- Order Header -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h3 class="text-lg font-semibold">Order #{{ order.number }}</h3>
              <p class="text-gray-600">Placed on {{ formatDate(order.date_created) }}</p>
            </div>
            <div class="text-right mt-2 sm:mt-0">
              <p class="text-lg font-semibold">${{ order.total }}</p>
              <span :class="[
                'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                getOrderStatusClass(order.status)
              ]">
                {{ capitalizeFirst(order.status) }}
              </span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="border-t pt-4">
            <h4 class="font-medium mb-3">Items ({{ order.line_items.length }})</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="item in order.line_items" 
                :key="item.id"
                class="flex items-center space-x-3"
              >
                <img 
                  :src="item.image?.src || getPlaceholderImage()" 
                  :alt="item.name"
                  class="w-12 h-12 object-cover rounded"
                  @error="handleImageError"
                >
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-sm truncate">{{ item.name }}</p>
                  <p class="text-gray-600 text-sm">Qty: {{ item.quantity }}</p>
                  <p class="text-gray-900 text-sm">${{ item.total }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="border-t pt-4 mt-4 flex flex-col sm:flex-row gap-3">
            <BaseButton 
              :to="`/account/orders/${order.id}`"
              text="View Details"
              size="sm"
            />
            
            <BaseButton 
              v-if="order.status === 'completed'"
              @click="reorderItems(order)"
              text="Reorder"
              variant="secondary"
              size="sm"
            />
            
            <BaseButton 
              v-if="['pending', 'processing'].includes(order.status)"
              @click="cancelOrder(order.id)"
              text="Cancel Order"
              variant="danger"
              size="sm"
            />

            <BaseButton 
              v-if="order.status === 'completed'"
              :href="`/invoice/${order.id}`"
              text="Download Invoice"
              variant="outline"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- No Orders -->
    <div v-else class="text-center py-16">
      <Icon name="heroicons:shopping-bag" class="h-24 w-24 text-gray-300 mx-auto mb-6" />
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">
        <span v-if="hasFilters">No orders match your filters</span>
        <span v-else>No orders yet</span>
      </h2>
      <p class="text-gray-600 mb-8">
        <span v-if="hasFilters">Try adjusting your search criteria.</span>
        <span v-else>When you place orders, they'll appear here.</span>
      </p>
      <div class="space-x-4">
        <BaseButton 
          v-if="hasFilters"
          @click="clearFilters"
          text="Clear Filters"
          variant="secondary"
          size="lg"
        />
        <BaseButton 
          to="/search" 
          text="Start Shopping"
          size="lg"
        />
      </div>
    </div>

        <!-- Pagination -->
        <div v-if="filteredOrders.length > 0 && totalPages > 1" class="mt-8 flex justify-center">
          <nav class="flex space-x-2">
            <BaseButton 
              v-for="page in totalPages" 
              :key="page"
              @click="currentPage = page"
              :variant="page === currentPage ? 'primary' : 'outline'"
              size="sm"
              :text="page.toString()"
            />
          </nav>
        </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()
const { getOrders } = useWooCommerce()
const { getPlaceholderImage, handleImageError } = useProductImage()
const { addToCart } = useCart()

// SEO
useHead({
  title: 'Order History - Your Store',
  meta: [
    { name: 'description', content: 'View and manage your order history.' }
  ]
})

// Data
const orders = ref([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const currentPage = ref(1)
const ordersPerPage = 10

// Computed
const filteredOrders = computed(() => {
  let filtered = [...orders.value]

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(order => 
      order.number.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  // Date filter
  if (dateFilter.value) {
    const days = parseInt(dateFilter.value)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    filtered = filtered.filter(order => 
      new Date(order.date_created) >= cutoffDate
    )
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / ordersPerPage)
})

const hasFilters = computed(() => {
  return searchQuery.value || statusFilter.value || dateFilter.value
})

// Methods
const fetchOrders = async () => {
  if (!user.value) return
  
  try {
    loading.value = true
    const fetchedOrders = await getOrders(user.value.id, { per_page: 100 })
    orders.value = fetchedOrders
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
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
    'cancelled': 'bg-red-100 text-red-800',
    'refunded': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  dateFilter.value = ''
  currentPage.value = 1
}

const reorderItems = async (order) => {
  try {
    // Add all items from the order to cart
    for (const item of order.line_items) {
      // You would need to fetch the current product data
      // For now, we'll create a simplified product object
      const product = {
        id: item.product_id,
        name: item.name,
        price: parseFloat(item.price),
        images: item.image ? [{ src: item.image.src }] : []
      }
      addToCart(product, item.quantity)
    }
    
    // Navigate to cart
    navigateTo('/cart')
  } catch (error) {
    console.error('Error reordering items:', error)
  }
}

const cancelOrder = async (orderId) => {
  if (confirm('Are you sure you want to cancel this order?')) {
    try {
      // Implement order cancellation logic
      console.log('Cancelling order:', orderId)
      // You would call a WooCommerce API endpoint to cancel the order
    } catch (error) {
      console.error('Error cancelling order:', error)
    }
  }
}

// Initialize
onMounted(() => {
  fetchOrders()
})
</script>