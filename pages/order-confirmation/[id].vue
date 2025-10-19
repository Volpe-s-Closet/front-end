<template>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">Loading your order details...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
            <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 class="text-xl font-semibold text-red-800 mb-2">Order Not Found</h2>
                <p class="text-red-600 mb-4">{{ error }}</p>
                <NuxtLink to="/"
                    class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Return to Home
                </NuxtLink>
            </div>
        </div>

        <!-- Success State -->
        <div v-else-if="order" class="space-y-8">
            <!-- Success Header -->
            <div class="text-center bg-green-50 border border-green-200 rounded-lg p-8">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 class="text-3xl font-bold text-green-800 mb-2">Order Confirmed!</h1>
                <p class="text-green-700 mb-4">Thank you for your purchase. Your order has been received and is being
                    processed.</p>
                <p class="text-sm text-green-600">Order #{{ order.number || order.id }}</p>
            </div>

            <!-- Order Details -->
            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-900">Order Details</h2>
                </div>

                <div class="p-6 space-y-6">
                    <!-- Order Info Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Order Information
                            </h3>
                            <dl class="space-y-2">
                                <div class="flex justify-between">
                                    <dt class="text-sm text-gray-600">Order Number:</dt>
                                    <dd class="text-sm font-medium text-gray-900">#{{ order.number || order.id }}</dd>
                                </div>
                                <div class="flex justify-between">
                                    <dt class="text-sm text-gray-600">Date:</dt>
                                    <dd class="text-sm font-medium text-gray-900">{{ formatDate(order.date_created) }}
                                    </dd>
                                </div>
                                <div class="flex justify-between">
                                    <dt class="text-sm text-gray-600">Status:</dt>
                                    <dd class="text-sm">
                                        <span :class="getOrderStatusClass(order.status)"
                                            class="px-2 py-1 rounded-full text-xs font-medium">
                                            {{ formatStatus(order.status) }}
                                        </span>
                                    </dd>
                                </div>
                                <div class="flex justify-between">
                                    <dt class="text-sm text-gray-600">Total:</dt>
                                    <dd class="text-sm font-medium text-gray-900">${{ parseFloat(order.total).toFixed(2)
                                        }}</dd>
                                </div>
                            </dl>
                        </div>

                        <div>
                            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Payment Method
                            </h3>
                            <p class="text-sm text-gray-900">{{ order.payment_method_title || 'N/A' }}</p>

                            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2 mt-4">Shipping
                                Address</h3>
                            <div class="text-sm text-gray-900" v-if="order.shipping">
                                <p>{{ order.shipping.first_name }} {{ order.shipping.last_name }}</p>
                                <p v-if="order.shipping.company">{{ order.shipping.company }}</p>
                                <p>{{ order.shipping.address_1 }}</p>
                                <p v-if="order.shipping.address_2">{{ order.shipping.address_2 }}</p>
                                <p>{{ order.shipping.city }}, {{ order.shipping.state }} {{ order.shipping.postcode }}
                                </p>
                                <p>{{ order.shipping.country }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Order Items -->
                    <div>
                        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Items Ordered</h3>
                        <div class="space-y-4">
                            <div v-for="item in order.line_items" :key="item.id"
                                class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div
                                    class="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <h4 class="text-sm font-medium text-gray-900">{{ item.name }}</h4>
                                    <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
                                    <p class="text-sm text-gray-600">Price: ${{ parseFloat(item.price).toFixed(2) }}</p>
                                </div>
                                <div class="text-sm font-medium text-gray-900">
                                    ${{ parseFloat(item.total).toFixed(2) }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Order Totals -->
                    <div class="border-t border-gray-200 pt-6">
                        <div class="space-y-2">
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">Subtotal:</span>
                                <span class="text-gray-900">${{ calculateSubtotal() }}</span>
                            </div>
                            <div v-if="order.shipping_lines && order.shipping_lines.length > 0"
                                class="flex justify-between text-sm">
                                <span class="text-gray-600">Shipping:</span>
                                <span class="text-gray-900">${{ parseFloat(order.shipping_lines[0].total).toFixed(2)
                                    }}</span>
                            </div>
                            <div v-if="order.total_tax && parseFloat(order.total_tax) > 0"
                                class="flex justify-between text-sm">
                                <span class="text-gray-600">Tax:</span>
                                <span class="text-gray-900">${{ parseFloat(order.total_tax).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                                <span class="text-gray-900">Total:</span>
                                <span class="text-gray-900">${{ parseFloat(order.total).toFixed(2) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <NuxtLink to="/account/orders"
                    class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View All Orders
                </NuxtLink>
                <NuxtLink to="/"
                    class="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                    Continue Shopping
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute()
const { getOrder, formatDate, getOrderStatusClass } = useCustomer()

// Redirect to home if accessed without order ID
if (!route.params.id) {
    navigateTo('/')
}

// SEO
useHead({
    title: 'Order Confirmation - Your Store',
    meta: [
        { name: 'description', content: 'Your order has been confirmed.' }
    ]
})

// Data
const order = ref(null)
const isLoading = ref(true)
const error = ref(null)

// Methods
const loadOrder = async () => {
    const orderId = route.params.id

    if (!orderId) {
        error.value = 'No order ID provided'
        isLoading.value = false
        return
    }

    try {
        isLoading.value = true
        const orderData = await getOrder(orderId)
        order.value = orderData
    } catch (err) {
        console.error('Error loading order:', err)
        error.value = 'Order not found or you do not have permission to view this order.'
    } finally {
        isLoading.value = false
    }
}

const formatStatus = (status) => {
    const statusMap = {
        'pending': 'Pending Payment',
        'processing': 'Processing',
        'on-hold': 'On Hold',
        'completed': 'Completed',
        'cancelled': 'Cancelled',
        'refunded': 'Refunded',
        'failed': 'Failed'
    }
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1)
}

const calculateSubtotal = () => {
    if (!order.value?.line_items) return '0.00'

    const subtotal = order.value.line_items.reduce((total, item) => {
        return total + parseFloat(item.total)
    }, 0)

    return subtotal.toFixed(2)
}

// Load order on mount
onMounted(() => {
    loadOrder()
})
</script>