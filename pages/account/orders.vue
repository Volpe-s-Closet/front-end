<template>
  <NuxtLayout name="account">
    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
          <input v-model="searchQuery" type="text" placeholder="Search by order number..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="pending-payment">Pending Payment</option>
            <option value="processing">Processing</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select v-model="dateFilter"
            class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
      <div v-for="order in paginatedOrders" :key="order.id" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="p-6">
          <!-- Order Header -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h3 class="text-lg font-semibold">Order #{{ order.number }}</h3>
              <p class="text-gray-600">Placed on {{ formatDate(order.date_created) }}</p>
            </div>
            <div class="text-right mt-2 sm:mt-0">
              <p class="text-lg font-semibold">{{ formatPrice(order.total) }}</p>
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
              <div v-for="item in order.line_items" :key="item.id" class="flex items-center space-x-3">
                <img :src="item.image?.src || getPlaceholderImage()" :alt="item.name"
                  class="w-12 h-12 object-cover rounded" @error="handleImageError">
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-sm truncate">{{ item.name }}</p>
                  <p class="text-gray-600 text-sm">Qty: {{ item.quantity }}</p>
                  <p class="text-gray-900 text-sm">{{ formatPrice(item.total) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="border-t pt-4 mt-4 flex flex-col sm:flex-row gap-3">
            <BaseButton @click="openOrderDetails(order.id)" text="View Details" size="sm" />

            <BaseButton v-if="order.status === 'pending'" @click="openPaymentModal(order.id)" 
              text="Pay Now" variant="primary" size="sm" />

            <BaseButton v-if="order.status === 'completed'" @click="reorderItems(order)"
              :loading="reorderingOrderId === order.id" :disabled="reorderingOrderId === order.id" text="Reorder"
              variant="secondary" size="sm" />

            <BaseButton v-if="['pending', 'processing'].includes(order.status)" @click="cancelOrder(order.id)"
              :loading="processingOrderId === order.id" :disabled="processingOrderId === order.id" text="Cancel Order"
              variant="danger" size="sm" />

            <BaseButton v-if="order.status === 'completed'" :href="`/invoice/${order.id}`" text="Download Invoice"
              variant="outline" size="sm" />
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
        <BaseButton v-if="hasFilters" @click="clearFilters" text="Clear Filters" variant="secondary" size="lg" />
        <BaseButton to="/search" text="Start Shopping" size="lg" />
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredOrders.length > 0 && totalPages > 1" class="mt-8">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ (currentPage - 1) * ordersPerPage + 1 }} to {{ Math.min(currentPage * ordersPerPage,
            filteredOrders.length) }} of {{ filteredOrders.length }} orders
        </div>
        <nav class="flex space-x-2">
          <BaseButton @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
            variant="outline" size="sm" text="Previous" />

          <BaseButton v-for="page in Math.min(totalPages, 5)" :key="page" @click="currentPage = page"
            :variant="page === currentPage ? 'primary' : 'outline'" size="sm" :text="page.toString()" />

          <BaseButton @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages" variant="outline" size="sm" text="Next" />
        </nav>
      </div>
    </div>

    <!-- Order Details Modal -->
    <OrderDetailsModal 
      :is-open="showOrderModal" 
      :order-id="selectedOrderId"
      @close="closeOrderModal"
      @reorder="handleReorder"
    />

    <!-- Payment Modal -->
    <OrderPaymentModal 
      :is-open="showPaymentModal" 
      :order="selectedOrderForPayment"
      @close="closePaymentModal"
      @payment-success="handlePaymentSuccess"
    />
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()
const {
  customerOrders,
  isLoadingOrders,
  loadCustomerOrders,
  loadCustomerProfile,
  getPlaceholderImage,
  formatDate,
  getOrderStatusClass
} = useCustomer()
const { handleImageError } = useProducts()
const { addToCart } = useCart()
const { formatPrice } = useCurrency()

// SEO
useHead({
  title: 'Order History - Your Store',
  meta: [
    { name: 'description', content: 'View and manage your order history.' }
  ]
})

// Data
const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const currentPage = ref(1)
const ordersPerPage = 10
const processingOrderId = ref(null)
const reorderingOrderId = ref(null)

// Modal state
const showOrderModal = ref(false)
const selectedOrderId = ref(null)
const showPaymentModal = ref(false)
const selectedOrderForPayment = ref(null)

// Computed
const filteredOrders = computed(() => {
  let filtered = [...customerOrders.value]

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

// Paginated orders
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * ordersPerPage
  const end = start + ordersPerPage
  return filteredOrders.value.slice(start, end)
})

const loading = computed(() => isLoadingOrders.value)

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / ordersPerPage)
})

const hasFilters = computed(() => {
  return searchQuery.value || statusFilter.value || dateFilter.value
})

// Methods
const fetchOrders = async () => {
  await loadCustomerProfile(user.value)
  await loadCustomerOrders(user.value, { per_page: 100 })
}

const capitalizeFirst = (str) => {
  if (!str) return ''
  // Handle hyphenated statuses
  return str.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  dateFilter.value = ''
  currentPage.value = 1
}

// Modal methods
const openOrderDetails = (orderId) => {
  selectedOrderId.value = orderId
  showOrderModal.value = true
}

const closeOrderModal = () => {
  showOrderModal.value = false
  selectedOrderId.value = null
}

const handleReorder = () => {
  // The modal will handle the reorder and navigation
  // We just need to close the modal
  closeOrderModal()
}

// Payment modal methods
const openPaymentModal = (orderId) => {
  const order = customerOrders.value.find(o => o.id === orderId)
  selectedOrderForPayment.value = order
  showPaymentModal.value = true
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedOrderForPayment.value = null
}

const handlePaymentSuccess = () => {
  // Refresh orders to show updated status
  fetchOrders()
  closePaymentModal()
}

// Reset to first page when filters change
watch([searchQuery, statusFilter, dateFilter], () => {
  currentPage.value = 1
})

const reorderItems = async (order) => {
  reorderingOrderId.value = order.id

  try {
    if (!order.line_items || order.line_items.length === 0) {
      throw new Error('No items found in this order')
    }

    let itemsAdded = 0

    // Add all items from the order to cart
    for (const item of order.line_items) {
      try {
        // Create a product object from order item data
        const product = {
          id: item.product_id,
          name: item.name,
          price: parseFloat(item.price || 0),
          images: item.image ? [{ src: item.image.src, alt: item.name }] : [],
          // Add any other product data available
          sku: item.sku || '',
          variation_id: item.variation_id || null
        }

        await addToCart(product, parseInt(item.quantity))
        itemsAdded++
      } catch (itemError) {
        console.warn(`Failed to add item ${item.name} to cart:`, itemError)
        // Continue with other items even if one fails
      }
    }

    if (itemsAdded > 0) {
      // Show success message and navigate to cart
      await navigateTo('/cart')
    } else {
      throw new Error('No items could be added to cart')
    }
  } catch (error) {
    console.error('Error reordering items:', error)
    alert('Failed to reorder items. Some products may no longer be available.')
  } finally {
    reorderingOrderId.value = null
  }
}

const cancelOrder = async (orderId) => {
  if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
    return
  }

  processingOrderId.value = orderId

  try {
    // Call WooCommerce API to update order status to cancelled
    const response = await $fetch(`/api/woocommerce/orders/${orderId}`, {
      method: 'PUT',
      body: {
        status: 'cancelled'
      }
    })

    if (response) {
      // Update local order status
      const orderIndex = customerOrders.value.findIndex(order => order.id === orderId)
      if (orderIndex !== -1) {
        customerOrders.value[orderIndex].status = 'cancelled'
      }

      alert('Order cancelled successfully')
    }
  } catch (error) {
    console.error('Error cancelling order:', error)

    // Show error message based on the error type
    let errorMessage = 'Failed to cancel order. Please try again.'

    if (error.status === 404) {
      errorMessage = 'Order not found or cannot be cancelled.'
    } else if (error.status === 403) {
      errorMessage = 'You do not have permission to cancel this order.'
    } else if (error.data?.message) {
      errorMessage = error.data.message
    }

    alert(errorMessage)
  } finally {
    processingOrderId.value = null
  }
}

// Initialize
onMounted(() => {
  fetchOrders()
})
</script>