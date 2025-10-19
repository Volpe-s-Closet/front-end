<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">
            Order #{{ order?.number }}
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <Icon name="heroicons:x-mark" class="h-6 w-6" />
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-6">
          <div class="space-y-4">
            <div class="bg-gray-300 h-6 rounded animate-pulse"></div>
            <div class="bg-gray-300 h-4 rounded w-2/3 animate-pulse"></div>
            <div class="bg-gray-300 h-4 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-6 text-center">
          <Icon name="heroicons:exclamation-triangle" class="h-16 w-16 text-red-300 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Error Loading Order</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <BaseButton @click="fetchOrder" text="Try Again" variant="outline" />
        </div>

        <!-- Order Details -->
        <div v-else-if="order" class="p-6 space-y-6">
          <!-- Order Status & Total -->
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="text-sm text-gray-600">Placed on {{ formatDate(order.date_created) }}</p>
              <span :class="[
                'inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2',
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

          <!-- Order Items -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Items Ordered</h3>
            <div class="space-y-3">
              <div 
                v-for="item in order.line_items" 
                :key="item.id"
                class="flex items-center space-x-4 p-3 border rounded-lg"
              >
                <img 
                  :src="item.image?.src || getPlaceholderImage()" 
                  :alt="item.name"
                  class="w-12 h-12 object-cover rounded"
                >
                <div class="flex-1">
                  <h4 class="font-medium">{{ item.name }}</h4>
                  <p class="text-sm text-gray-600">Qty: {{ item.quantity }} × {{ formatPrice(item.price) }}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold">{{ formatPrice(item.total) }}</p>
                </div>
              </div>
            </div>

            <!-- Order Totals -->
            <div class="border-t pt-4 mt-4">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal:</span>
                  <span>{{ formatPrice(order.total - order.total_tax - order.shipping_total) }}</span>
                </div>
                <div v-if="order.shipping_total > 0" class="flex justify-between">
                  <span class="text-gray-600">Shipping:</span>
                  <span>{{ formatPrice(order.shipping_total) }}</span>
                </div>
                <div v-if="order.total_tax > 0" class="flex justify-between">
                  <span class="text-gray-600">Tax:</span>
                  <span>{{ formatPrice(order.total_tax) }}</span>
                </div>
                <div class="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{{ formatPrice(order.total) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Addresses -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Shipping Address -->
            <div v-if="order.shipping && hasShippingAddress(order.shipping)">
              <h3 class="text-lg font-semibold mb-3">Shipping Address</h3>
              <div class="text-gray-700 space-y-1">
                <p v-if="order.shipping.first_name || order.shipping.last_name">
                  {{ order.shipping.first_name }} {{ order.shipping.last_name }}
                </p>
                <p v-if="order.shipping.company">{{ order.shipping.company }}</p>
                <p v-if="order.shipping.address_1">{{ order.shipping.address_1}}</p>
                <p v-if="order.shipping.address_2">{{ order.shipping.address_2}}</p>
                <p v-if="order.shipping.city || order.shipping.state || order.shipping.postcode">
                  {{ order.shipping.city }}{{ order.shipping.city && order.shipping.state ? ', ' : '' }}{{ order.shipping.state }} {{ order.shipping.postcode }}
                </p>
                <p v-if="order.shipping.country">{{ order.shipping.country }}</p>
              </div>
            </div>

            <!-- Billing Address -->
            <div v-if="order.billing && hasBillingAddress(order.billing)">
              <h3 class="text-lg font-semibold mb-3">Billing Address</h3>
              <div class="text-gray-700 space-y-1">
                <p v-if="order.billing.first_name || order.billing.last_name">
                  {{ order.billing.first_name }} {{ order.billing.last_name }}
                </p>
                <p v-if="order.billing.company">{{ order.billing.company }}</p>
                <p v-if="order.billing.address_1">{{ order.billing.address_1}}</p>
                <p v-if="order.billing.address_2">{{ order.billing.address_2}}</p>
                <p v-if="order.billing.city || order.billing.state || order.billing.postcode">
                  {{ order.billing.city }}{{ order.billing.city && order.billing.state ? ', ' : '' }}{{ order.billing.state }} {{ order.billing.postcode }}
                </p>
                <p v-if="order.billing.country">{{ order.billing.country }}</p>
                <p v-if="order.billing.email" class="mt-2">
                  <span class="text-gray-600">Email:</span> {{ order.billing.email }}
                </p>
                <p v-if="order.billing.phone">
                  <span class="text-gray-600">Phone:</span> {{ order.billing.phone }}
                </p>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div v-if="order.payment_method_title">
            <h3 class="text-lg font-semibold mb-3">Payment Information</h3>
            <div class="text-gray-700">
              <p><span class="text-gray-600">Payment Method:</span> {{ order.payment_method_title }}</p>
              <p v-if="order.transaction_id" class="mt-1">
                <span class="text-gray-600">Transaction ID:</span> {{ order.transaction_id }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
          <div class="flex justify-end space-x-3">
            <BaseButton @click="closeModal" text="Close" variant="outline" />
            <BaseButton v-if="order?.status === 'completed'" @click="reorderItems" 
              :loading="reordering" text="Reorder" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  orderId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['close', 'reorder'])

const { user } = useAuth()
const { getOrder, getPlaceholderImage, customerData, loadCustomerProfile } = useCustomer()
const { formatPrice } = useCurrency()
const { addToCart } = useCart()

// Data
const order = ref(null)
const loading = ref(false)
const error = ref(null)
const reordering = ref(false)

// Methods
const fetchOrder = async () => {
  if (!props.orderId) return
  
  try {
    loading.value = true
    error.value = null
    
    // Ensure customer profile is loaded
    if (!customerData.value && user.value) {
      await loadCustomerProfile(user.value)
    }
    
    // Get customer ID for validation
    const customerId = customerData.value?.id || user.value?.id
    
    // Fetch the order
    const orderData = await getOrder(props.orderId, customerId)
    order.value = orderData
  } catch (err) {
    console.error('Error fetching order:', err)
    error.value = err.statusMessage || err.message || 'Order not found or you do not have permission to view this order.'
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  emit('close')
  // Reset state when closing
  order.value = null
  error.value = null
}

const reorderItems = async () => {
  if (!order.value?.line_items) return
  
  reordering.value = true
  
  try {
    let itemsAdded = 0
    
    for (const item of order.value.line_items) {
      try {
        const product = {
          id: item.product_id,
          name: item.name,
          price: parseFloat(item.price || 0),
          images: item.image ? [{ src: item.image.src, alt: item.name }] : [],
          sku: item.sku || '',
          variation_id: item.variation_id || null
        }
        
        await addToCart(product, parseInt(item.quantity))
        itemsAdded++
      } catch (itemError) {
        console.warn(`Failed to add item ${item.name} to cart:`, itemError)
      }
    }
    
    if (itemsAdded > 0) {
      emit('reorder')
      closeModal()
      await navigateTo('/cart')
    } else {
      throw new Error('No items could be added to cart')
    }
  } catch (error) {
    console.error('Error reordering items:', error)
    alert('Failed to reorder items. Some products may no longer be available.')
  } finally {
    reordering.value = false
  }
}

// Utility functions
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

const hasShippingAddress = (shipping) => {
  return shipping && (shipping.address_1 || shipping.city || shipping.first_name)
}

const hasBillingAddress = (billing) => {
  return billing && (billing.address_1 || billing.city || billing.first_name)
}

// Watch for orderId changes
watch(() => props.orderId, (newId) => {
  if (newId && props.isOpen) {
    fetchOrder()
  }
})

// Fetch order when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.orderId) {
    fetchOrder()
  }
})

// Close modal on escape key
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && props.isOpen) {
      closeModal()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>