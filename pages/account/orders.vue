<template>
  <NuxtLayout name="account">
    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.orders.searchOrders') }}</label>
          <input v-model="searchQuery" type="text" :placeholder="$t('account.orders.searchPlaceholder')"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.orders.status') }}</label>
          <SelectBox v-model="statusFilter" :options="statusFilterOptions" :placeholder="$t('account.orders.filters.allOrders')" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.orders.dateRange') }}</label>
          <SelectBox v-model="dateFilter" :options="dateFilterOptions" :placeholder="$t('account.orders.filters.allTime')" />
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
              <h3 class="text-lg font-semibold">{{ $t('account.orders.orderNumber', { number: order.number }) }}</h3>
              <p class="text-gray-600">{{ $t('account.orders.placedOn', { date: formatDate(order.date_created) }) }}</p>
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
            <h4 class="font-medium mb-3">{{ $t('account.orders.items', { count: order.line_items.length }) }}</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="item in order.line_items" :key="item.id" class="flex items-center space-x-3">
                <img :src="item.image?.src || getPlaceholderImage()" :alt="item.name"
                  class="w-12 h-12 object-cover rounded" @error="handleImageError">
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-sm truncate">{{ item.name }}</p>
                  <p class="text-gray-600 text-sm">{{ $t('account.orders.qty', { count: item.quantity }) }}</p>
                  <p class="text-gray-900 text-sm">{{ formatPrice(item.total) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="border-t pt-4 mt-4 flex flex-col sm:flex-row gap-3">
            <BaseButton @click="openOrderDetails(order.id)" :text="$t('account.orders.viewDetails')" size="sm" />

            <BaseButton v-if="order.status === 'pending'" @click="openPaymentModal(order.id)" :text="$t('account.orders.payNow')"
              variant="primary" size="sm" />

            <BaseButton v-if="order.status === 'completed'" @click="reorderItems(order)"
              :loading="reorderingOrderId === order.id" :disabled="reorderingOrderId === order.id" :text="$t('account.orders.reorder')"
              variant="secondary" size="sm" />

            <BaseButton v-if="['pending', 'processing'].includes(order.status)" @click="cancelOrder(order.id)"
              :loading="processingOrderId === order.id" :disabled="processingOrderId === order.id" :text="$t('account.orders.cancelOrder')"
              variant="danger" size="sm" />

            <BaseButton v-if="order.status === 'completed'" :href="`/invoice/${order.id}`" :text="$t('account.orders.downloadInvoice')"
              variant="outline" size="sm" />
          </div>
        </div>
      </div>
    </div>

    <!-- No Orders -->
    <div v-else class="text-center py-16">
      <Icon name="heroicons:shopping-bag" class="h-24 w-24 text-gray-300 mx-auto mb-6" />
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">
        <span v-if="hasFilters">{{ $t('account.orders.noMatch') }}</span>
        <span v-else>{{ $t('account.orders.noOrders') }}</span>
      </h2>
      <p class="text-gray-600 mb-8">
        <span v-if="hasFilters">{{ $t('account.orders.tryAdjusting') }}</span>
        <span v-else>{{ $t('account.orders.willAppear') }}</span>
      </p>
      <div class="space-x-4">
        <BaseButton v-if="hasFilters" @click="clearFilters" :text="$t('account.orders.clearFilters')" variant="secondary" size="lg" />
        <BaseButton to="/search" :text="$t('account.orders.startShopping')" size="lg" />
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredOrders.length > 0 && totalPages > 1" class="mt-8">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          {{ $t('account.orders.showing', { start: (currentPage - 1) * ordersPerPage + 1, end: Math.min(currentPage * ordersPerPage, filteredOrders.length), total: filteredOrders.length }) }}
        </div>
        <nav class="flex space-x-2">
          <BaseButton @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
            variant="outline" size="sm" :text="$t('account.orders.previous')" />

          <BaseButton v-for="page in Math.min(totalPages, 5)" :key="page" @click="currentPage = page"
            :variant="page === currentPage ? 'primary' : 'outline'" size="sm" :text="page.toString()" />

          <BaseButton @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages" variant="outline" size="sm" :text="$t('account.orders.next')" />
        </nav>
      </div>
    </div>

    <!-- Order Details Modal -->
    <OrderDetailsModal :is-open="showOrderModal" :order-id="selectedOrderId" @close="closeOrderModal"
      @reorder="handleReorder" />

    <!-- Payment Modal -->
    <OrderPaymentModal :is-open="showPaymentModal" :order="selectedOrderForPayment" @close="closePaymentModal"
      @payment-success="handlePaymentSuccess" />
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { resolveApiError } = useApiError()
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

useHead({
  title: () => t('account.orders.metaTitle'),
  meta: [
    { name: 'description', content: () => t('account.orders.metaDescription') }
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
const statusFilterOptions = computed(() => [
  { value: '', label: t('account.orders.filters.allOrders') },
  { value: 'pending', label: t('account.orders.filters.pending') },
  { value: 'processing', label: t('account.orders.filters.processing') },
  { value: 'on-hold', label: t('account.orders.filters.onHold') },
  { value: 'completed', label: t('account.orders.filters.completed') },
  { value: 'cancelled', label: t('account.orders.filters.cancelled') },
  { value: 'refunded', label: t('account.orders.filters.refunded') },
  { value: 'failed', label: t('account.orders.filters.failed') },
  { value: 'draft', label: t('account.orders.filters.draft') }
])

const dateFilterOptions = computed(() => [
  { value: '', label: t('account.orders.filters.allTime') },
  { value: '30', label: t('account.orders.filters.last30') },
  { value: '90', label: t('account.orders.filters.last3Months') },
  { value: '365', label: t('account.orders.filters.lastYear') }
])

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
    alert(t('account.orders.reorderFailed'))
  } finally {
    reorderingOrderId.value = null
  }
}

const cancelOrder = async (orderId) => {
  if (!confirm(t('account.orders.confirmCancel'))) {
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
      // Refresh the entire orders list to get the latest data
      await fetchOrders()

      alert(t('account.orders.cancelSuccess'))
    }
  } catch (error) {
    console.error('Error cancelling order:', error)

    // Prefer the route-specific labels for the common cases the page already
    // localizes. Fall back to the i18n key from the server (or its English
    // statusMessage) for anything else.
    let errorMessage
    if (error.status === 404) {
      errorMessage = t('account.orders.cancelNotFound')
    } else if (error.status === 403) {
      errorMessage = t('account.orders.cancelForbidden')
    } else {
      errorMessage = resolveApiError(error, 'account.orders.cancelFailed')
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