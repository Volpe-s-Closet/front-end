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
            {{ $t('orderModal.title', { number: order?.number }) }}
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
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('orderModal.errorTitle') }}</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <BaseButton @click="fetchOrder" :text="$t('orderModal.tryAgain')" variant="outline" />
        </div>

        <!-- Order Details -->
        <div v-else-if="order" class="p-6 space-y-6">
          <!-- Order Status & Total -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-sm text-gray-600">{{ $t('orderModal.placedOn', { date: formatDate(order.date_created) }) }}</p>
                <span :class="[
                  'inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2',
                  getOrderStatusClass(order.status)
                ]">
                  {{ capitalizeFirst(order.status) }}
                </span>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold">{{ formatPrice(order.total) }}</p>
                <p class="text-gray-600">{{ $t('orderModal.total') }}</p>
              </div>
            </div>

            <!-- Status-specific information and actions -->
            <div v-if="getStatusInfo(order)" class="border-t pt-4 mt-4">
              <div class="bg-white p-4 rounded-lg border-l-4" :class="getStatusBorderClass(order.status)">
                <div class="flex items-start">
                  <Icon :name="getStatusIcon(order.status)" class="h-5 w-5 mt-0.5 mr-3"
                    :class="getStatusIconClass(order.status)" />
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900 mb-1">{{ getStatusInfo(order).title }}</h4>
                    <p class="text-sm text-gray-600 mb-3">{{ getStatusInfo(order).description }}</p>

                    <!-- Status-specific content -->
                    <div v-if="order.status === 'pending'" class="space-y-3">
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-600">{{ $t('orderModal.labels.paymentDue') }}</span>
                        <span class="font-medium">{{ formatPrice(order.total) }}</span>
                      </div>
                      <BaseButton @click="payNow" :text="$t('orderModal.actions.payNow')" size="sm" class="w-full" />
                    </div>

                    <div v-else-if="order.status === 'refunded'" class="space-y-2">
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-600">{{ $t('orderModal.labels.refundedAmount') }}</span>
                        <span class="font-medium text-green-600">{{ formatPrice(getRefundedAmount(order)) }}</span>
                      </div>
                      <div v-if="order.date_modified" class="flex items-center justify-between text-sm">
                        <span class="text-gray-600">{{ $t('orderModal.labels.refundDate') }}</span>
                        <span>{{ formatDate(order.date_modified) }}</span>
                      </div>



                      <div v-if="order.refunds && order.refunds.length > 0" class="mt-3">
                        <p class="text-sm font-medium text-gray-700 mb-2">{{ $t('orderModal.labels.refundDetails') }}</p>
                        <div v-for="refund in order.refunds" :key="refund.id"
                          class="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <div class="flex justify-between">
                            <span>{{ $t('orderModal.labels.refundNumber', { id: refund.id }) }}</span>
                            <span class="font-medium">{{ formatPrice(refund.amount) }}</span>
                          </div>
                          <p v-if="refund.reason" class="text-xs mt-1">{{ $t('orderModal.labels.reason', { reason: refund.reason }) }}</p>
                        </div>
                      </div>

                      <div v-else-if="getRefundedAmount(order) > 0" class="mt-3">
                        <p class="text-sm text-gray-600">{{ $t('orderModal.labels.noRefundDetails') }}</p>
                      </div>
                    </div>

                    <div v-else-if="order.status === 'failed'" class="space-y-2">
                      <div v-if="order.customer_note" class="text-sm">
                        <span class="text-gray-600">{{ $t('orderModal.labels.failureReason') }}</span>
                        <p class="mt-1 text-red-600">{{ order.customer_note }}</p>
                      </div>
                      <BaseButton @click="retryPayment" :text="$t('orderModal.actions.retryPayment')" variant="outline" size="sm" />
                    </div>

                    <div v-else-if="order.status === 'on-hold'" class="space-y-2">
                      <div v-if="order.customer_note" class="text-sm">
                        <span class="text-gray-600">{{ $t('orderModal.labels.holdReason') }}</span>
                        <p class="mt-1">{{ order.customer_note }}</p>
                      </div>
                    </div>

                    <div v-else-if="order.status === 'processing'" class="space-y-2">
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-600">{{ $t('orderModal.labels.estimatedDelivery') }}</span>
                        <span>{{ getEstimatedDelivery(order) }}</span>
                      </div>
                      <div v-if="order.tracking_number" class="flex items-center justify-between text-sm">
                        <span class="text-gray-600">{{ $t('orderModal.labels.trackingNumber') }}</span>
                        <span class="font-mono">{{ order.tracking_number }}</span>
                      </div>
                    </div>

                    <div v-else-if="order.status === 'completed'" class="space-y-2">
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-600">{{ $t('orderModal.labels.completedOn') }}</span>
                        <span>{{ formatDate(order.date_completed || order.date_modified) }}</span>
                      </div>
                      <div class="flex space-x-2">
                        <BaseButton @click="downloadInvoice" :text="$t('orderModal.actions.downloadInvoice')" variant="outline" size="sm" />
                        <BaseButton @click="leaveReview" :text="$t('orderModal.actions.leaveReview')" variant="outline" size="sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div>
            <h3 class="text-lg font-semibold mb-4">{{ $t('orderModal.items') }}</h3>
            <div class="space-y-3">
              <div v-for="item in order.line_items" :key="item.id"
                class="flex items-center space-x-4 p-3 border rounded-lg">
                <img :src="item.image?.src || getPlaceholderImage()" :alt="item.name"
                  class="w-12 h-12 object-cover rounded">
                <div class="flex-1">
                  <h4 class="font-medium">{{ item.name }}</h4>
                  <p class="text-sm text-gray-600">{{ $t('orderModal.qtyTimes', { qty: item.quantity, price: formatPrice(item.price) }) }}</p>
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
                  <span class="text-gray-600">{{ $t('orderModal.labels.subtotal') }}</span>
                  <span>{{ formatPrice(order.total - order.total_tax - order.shipping_total) }}</span>
                </div>
                <div v-if="order.shipping_total > 0" class="flex justify-between">
                  <span class="text-gray-600">{{ $t('orderModal.labels.shippingLabel') }}</span>
                  <span>{{ formatPrice(order.shipping_total) }}</span>
                </div>
                <div v-if="order.total_tax > 0" class="flex justify-between">
                  <span class="text-gray-600">{{ $t('orderModal.labels.taxLabel') }}</span>
                  <span>{{ formatPrice(order.total_tax) }}</span>
                </div>
                <div class="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>{{ $t('orderModal.labels.totalLabel') }}</span>
                  <span>{{ formatPrice(order.total) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Addresses -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Shipping Address -->
            <div v-if="order.shipping && hasShippingAddress(order.shipping)">
              <h3 class="text-lg font-semibold mb-3">{{ $t('orderModal.shippingAddress') }}</h3>
              <div class="text-gray-700 space-y-1">
                <p v-if="order.shipping.first_name || order.shipping.last_name">
                  {{ order.shipping.first_name }} {{ order.shipping.last_name }}
                </p>
                <p v-if="order.shipping.company">{{ order.shipping.company }}</p>
                <p v-if="order.shipping.address_1">{{ order.shipping.address_1 }}</p>
                <p v-if="order.shipping.address_2">{{ order.shipping.address_2 }}</p>
                <p v-if="order.shipping.city || order.shipping.state || order.shipping.postcode">
                  {{ order.shipping.city }}{{ order.shipping.city && order.shipping.state ? ', ' : '' }}{{
                    order.shipping.state }} {{ order.shipping.postcode }}
                </p>
                <p v-if="order.shipping.country">{{ order.shipping.country }}</p>
              </div>
            </div>

            <!-- Billing Address -->
            <div v-if="order.billing && hasBillingAddress(order.billing)">
              <h3 class="text-lg font-semibold mb-3">{{ $t('orderModal.billingAddress') }}</h3>
              <div class="text-gray-700 space-y-1">
                <p v-if="order.billing.first_name || order.billing.last_name">
                  {{ order.billing.first_name }} {{ order.billing.last_name }}
                </p>
                <p v-if="order.billing.company">{{ order.billing.company }}</p>
                <p v-if="order.billing.address_1">{{ order.billing.address_1 }}</p>
                <p v-if="order.billing.address_2">{{ order.billing.address_2 }}</p>
                <p v-if="order.billing.city || order.billing.state || order.billing.postcode">
                  {{ order.billing.city }}{{ order.billing.city && order.billing.state ? ', ' : '' }}{{
                    order.billing.state }} {{ order.billing.postcode }}
                </p>
                <p v-if="order.billing.country">{{ order.billing.country }}</p>
                <p v-if="order.billing.email" class="mt-2">
                  <span class="text-gray-600">{{ $t('orderModal.labels.email') }}</span> {{ order.billing.email }}
                </p>
                <p v-if="order.billing.phone">
                  <span class="text-gray-600">{{ $t('orderModal.labels.phone') }}</span> {{ order.billing.phone }}
                </p>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div v-if="order.payment_method_title">
            <h3 class="text-lg font-semibold mb-3">{{ $t('orderModal.paymentInformation') }}</h3>
            <div class="text-gray-700">
              <p><span class="text-gray-600">{{ $t('orderModal.labels.paymentMethod') }}</span> {{ order.payment_method_title }}</p>
              <p v-if="order.transaction_id" class="mt-1">
                <span class="text-gray-600">{{ $t('orderModal.labels.transactionId') }}</span> {{ order.transaction_id }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
          <div class="flex justify-between items-center">
            <div class="flex space-x-3">
              <!-- Status-specific footer actions -->
              <BaseButton v-if="order?.status === 'pending'" @click="payNow" :text="$t('orderModal.actions.payNow')" />
              <BaseButton v-if="order?.status === 'failed'" @click="retryPayment" :text="$t('orderModal.actions.retryPayment')"
                variant="outline" />
              <BaseButton v-if="order?.status === 'completed'" @click="downloadInvoice" :text="$t('orderModal.actions.downloadInvoice')"
                variant="outline" />
            </div>

            <div class="flex space-x-3">
              <BaseButton @click="closeModal" :text="$t('orderModal.actions.close')" variant="outline" />
              <BaseButton v-if="['completed', 'processing'].includes(order?.status)" @click="reorderItems"
                :loading="reordering" :text="$t('orderModal.actions.reorder')" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <OrderPaymentModal :is-open="showPaymentModal" :order="order" @close="closePaymentModal"
      @payment-success="handlePaymentSuccess" />
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

const { t } = useI18n()
const { user } = useAuth()
const { getOrder, getPlaceholderImage, customerData, loadCustomerProfile } = useCustomer()
const { formatPrice } = useCurrency()
const { addToCart } = useCart()

// Data
const order = ref(null)
const loading = ref(false)
const error = ref(null)
const reordering = ref(false)
const showPaymentModal = ref(false)

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
    error.value = err.statusMessage || err.message || t('orderModal.errorFallback')
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
    alert(t('orderModal.reorderFailed'))
  } finally {
    reordering.value = false
  }
}

// Status-specific action methods
const payNow = () => {
  showPaymentModal.value = true
}

const retryPayment = () => {
  // Similar to payNow but for failed orders
  payNow()
}

const downloadInvoice = () => {
  // Generate and download invoice
  const invoiceUrl = `/invoice/${order.value.id}`
  window.open(invoiceUrl, '_blank')
}

const leaveReview = () => {
  // Navigate to review page or open review modal
  emit('close')
  navigateTo(`/account/reviews?order_id=${order.value.id}`)
}

const handlePaymentSuccess = (paymentResponse) => {
  // Refresh the order data to show updated status
  fetchOrder()
  // Show success message
  alert(t('orderModal.paymentSuccess'))
}

const closePaymentModal = () => {
  showPaymentModal.value = false
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
    'pending': 'bg-orange-100 text-orange-800',
    'pending-payment': 'bg-orange-100 text-orange-800',
    'pending_payment': 'bg-orange-100 text-orange-800',
    'processing': 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-purple-100 text-purple-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'refunded': 'bg-gray-100 text-gray-800',
    'failed': 'bg-red-100 text-red-800',
    'draft': 'bg-gray-100 text-gray-600'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const capitalizeFirst = (str) => {
  if (!str) return ''
  // Handle hyphenated statuses
  return str.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const hasShippingAddress = (shipping) => {
  return shipping && (shipping.address_1 || shipping.city || shipping.first_name)
}

const hasBillingAddress = (billing) => {
  return billing && (billing.address_1 || billing.city || billing.first_name)
}

// Status-specific helper functions
const getStatusInfo = (order) => {
  const statusInfo = {
    'pending-payment': {
      title: t('orderModal.info.pending.title'),
      description: t('orderModal.info.pending.description')
    },
    'pending_payment': {
      title: t('orderModal.info.pending.title'),
      description: t('orderModal.info.pending.description')
    },
    'pending': {
      title: t('orderModal.info.pending.title'),
      description: t('orderModal.info.pending.description')
    },
    'processing': {
      title: t('orderModal.info.processing.title'),
      description: t('orderModal.info.processing.description')
    },
    'on-hold': {
      title: t('orderModal.info.onHold.title'),
      description: t('orderModal.info.onHold.description')
    },
    'completed': {
      title: t('orderModal.info.completed.title'),
      description: t('orderModal.info.completed.description')
    },
    'cancelled': {
      title: t('orderModal.info.cancelled.title'),
      description: t('orderModal.info.cancelled.description')
    },
    'refunded': {
      title: t('orderModal.info.refunded.title'),
      description: t('orderModal.info.refunded.description')
    },
    'failed': {
      title: t('orderModal.info.failed.title'),
      description: t('orderModal.info.failed.description')
    },
    'draft': {
      title: t('orderModal.info.draft.title'),
      description: t('orderModal.info.draft.description')
    }
  }

  return statusInfo[order.status] || null
}

const getStatusIcon = (status) => {
  const icons = {
    'pending-payment': 'heroicons:credit-card',
    'pending_payment': 'heroicons:credit-card',
    'pending': 'heroicons:credit-card',
    'processing': 'heroicons:cog-6-tooth',
    'on-hold': 'heroicons:pause-circle',
    'completed': 'heroicons:check-circle',
    'cancelled': 'heroicons:x-circle',
    'refunded': 'heroicons:arrow-uturn-left',
    'failed': 'heroicons:exclamation-triangle',
    'draft': 'heroicons:document'
  }

  return icons[status] || 'heroicons:information-circle'
}

const getStatusIconClass = (status) => {
  const classes = {
    'pending-payment': 'text-orange-500',
    'pending_payment': 'text-orange-500',
    'pending': 'text-orange-500',
    'processing': 'text-blue-500',
    'on-hold': 'text-purple-500',
    'completed': 'text-green-500',
    'cancelled': 'text-red-500',
    'refunded': 'text-gray-500',
    'failed': 'text-red-500',
    'draft': 'text-gray-400'
  }

  return classes[status] || 'text-gray-500'
}

const getStatusBorderClass = (status) => {
  const classes = {
    'pending-payment': 'border-orange-400',
    'pending_payment': 'border-orange-400',
    'pending': 'border-orange-400',
    'processing': 'border-blue-400',
    'on-hold': 'border-purple-400',
    'completed': 'border-green-400',
    'cancelled': 'border-red-400',
    'refunded': 'border-gray-400',
    'failed': 'border-red-400',
    'draft': 'border-gray-300'
  }

  return classes[status] || 'border-gray-400'
}

const getRefundedAmount = (order) => {
  // Check multiple possible refund amount fields
  if (order.refunds && order.refunds.length > 0) {
    return order.refunds.reduce((total, refund) => total + parseFloat(refund.amount || 0), 0)
  }

  // Check if there's a refund_total field
  if (order.refund_total && parseFloat(order.refund_total) > 0) {
    return parseFloat(order.refund_total)
  }

  // Check if there's a total_refunded field
  if (order.total_refunded && parseFloat(order.total_refunded) > 0) {
    return parseFloat(order.total_refunded)
  }

  // For refunded orders, if no specific refund amount, assume full refund
  if (order.status === 'refunded') {
    return parseFloat(order.total || 0)
  }

  return 0
}

const getEstimatedDelivery = (order) => {
  // Calculate estimated delivery (example: 3-5 business days from order date)
  const orderDate = new Date(order.date_created)
  const estimatedDate = new Date(orderDate)
  estimatedDate.setDate(orderDate.getDate() + 5) // Add 5 days

  return estimatedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
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