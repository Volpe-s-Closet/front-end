<template>
  <NuxtLayout name="checkout">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-center space-x-4">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <span class="ml-2 text-sm font-medium text-gray-900">Information</span>
          </div>
          <div class="w-16 h-0.5 bg-gray-300"></div>
          <div class="flex items-center">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            ]">
              2
            </div>
            <span class="ml-2 text-sm font-medium" :class="currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'">
              Payment
            </span>
          </div>
          <div class="w-16 h-0.5 bg-gray-300"></div>
          <div class="flex items-center">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            ]">
              3
            </div>
            <span class="ml-2 text-sm font-medium" :class="currentStep >= 3 ? 'text-gray-900' : 'text-gray-500'">
              Review
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Checkout Form -->
        <div class="space-y-6">
          <!-- Customer Information -->
          <div v-if="currentStep === 1" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-6">Contact Information</h2>
            
            <!-- Authentication-dependent notifications -->
            <template v-if="isMounted">
              <!-- Loading indicator for auto-filling addresses -->
              <div v-if="isLoadingUserData" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div class="flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span class="text-sm text-blue-700">Loading your saved addresses...</span>
                </div>
              </div>

              <!-- Success message when addresses are auto-filled -->
              <div v-else-if="isAuthenticated && checkoutData.billing.address_1" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div class="flex items-center">
                  <Icon name="heroicons:check-circle" class="h-4 w-4 text-green-600 mr-2" />
                  <span class="text-sm text-green-700">Your saved addresses have been loaded automatically</span>
                </div>
              </div>

              <!-- Login prompt for non-authenticated users -->
              <div v-else-if="!isAuthenticated" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <Icon name="heroicons:information-circle" class="h-4 w-4 text-blue-600 mr-2" />
                    <span class="text-sm text-blue-700">Have an account? Log in to auto-fill your addresses</span>
                  </div>
                  <NuxtLink 
                    to="/login?redirect=/checkout" 
                    class="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Log In
                  </NuxtLink>
                </div>
              </div>
            </template>
            
            <form @submit.prevent="proceedToPayment" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    v-model="checkoutData.billing.first_name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    v-model="checkoutData.billing.last_name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  v-model="checkoutData.billing.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  v-model="checkoutData.billing.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
                <input
                  v-model="checkoutData.billing.company"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <h3 class="text-lg font-semibold mt-8 mb-4">Billing Address</h3>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                <input
                  v-model="checkoutData.billing.address_1"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                <input
                  v-model="checkoutData.billing.address_2"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    v-model="checkoutData.billing.city"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    v-model="checkoutData.billing.state"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                  <input
                    v-model="checkoutData.billing.postcode"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <select
                  v-model="checkoutData.billing.country"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                </select>
              </div>

              <!-- Shipping Address -->
              <div class="mt-6">
                <label class="flex items-center">
                  <input
                    v-model="sameAsShipping"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">Ship to same address</span>
                </label>
              </div>

              <div v-if="!sameAsShipping" class="space-y-4">
                <h3 class="text-lg font-semibold mt-6 mb-4">Shipping Address</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      v-model="checkoutData.shipping.first_name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      v-model="checkoutData.shipping.last_name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
                  <input
                    v-model="checkoutData.shipping.company"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    v-model="checkoutData.shipping.phone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                  <input
                    v-model="checkoutData.shipping.address_1"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                  <input
                    v-model="checkoutData.shipping.address_2"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      v-model="checkoutData.shipping.city"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      v-model="checkoutData.shipping.state"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                    <input
                      v-model="checkoutData.shipping.postcode"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <select
                    v-model="checkoutData.shipping.country"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </div>
              </div>

              <BaseButton
                action="submit"
                text="Continue to Payment"
                full-width
                size="lg"
              />
            </form>
          </div>

          <!-- Payment Information -->
          <div v-if="currentStep === 2" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-6">Payment Information</h2>
            
            <form @submit.prevent="proceedToReview" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="checkoutData.payment_method"
                      type="radio"
                      value="stripe"
                      class="text-blue-600 focus:ring-blue-500"
                    >
                    <span class="ml-2">Credit Card</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="checkoutData.payment_method"
                      type="radio"
                      value="paypal"
                      class="text-blue-600 focus:ring-blue-500"
                    >
                    <span class="ml-2">PayPal</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="checkoutData.payment_method"
                      type="radio"
                      value="cod"
                      class="text-blue-600 focus:ring-blue-500"
                    >
                    <span class="ml-2">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <div class="flex space-x-4">
                <BaseButton
                  @click="currentStep = 1"
                  variant="secondary"
                  text="Back"
                  full-width
                  size="lg"
                />
                <BaseButton
                  action="submit"
                  text="Review Order"
                  full-width
                  size="lg"
                />
              </div>
            </form>
          </div>

          <!-- Order Review -->
          <div v-if="currentStep === 3" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-6">Review Your Order</h2>
            
            <div class="space-y-6">
              <div>
                <h3 class="font-medium mb-2">Contact Information</h3>
                <p class="text-gray-600">{{ checkoutData.billing.email }}</p>
                <p class="text-gray-600">{{ checkoutData.billing.phone }}</p>
              </div>

              <div>
                <h3 class="font-medium mb-2">Billing Address</h3>
                <p class="text-gray-600">
                  {{ checkoutData.billing.first_name }} {{ checkoutData.billing.last_name }}<br>
                  {{ checkoutData.billing.address_1 }}<br>
                  <span v-if="checkoutData.billing.address_2">{{ checkoutData.billing.address_2 }}<br></span>
                  {{ checkoutData.billing.city }}, {{ checkoutData.billing.state }} {{ checkoutData.billing.postcode }}<br>
                  {{ checkoutData.billing.country }}
                </p>
              </div>

              <div>
                <h3 class="font-medium mb-2">Payment Method</h3>
                <p class="text-gray-600">{{ getPaymentMethodName(checkoutData.payment_method) }}</p>
              </div>

              <div class="flex space-x-4">
                <BaseButton
                  @click="currentStep = 2"
                  variant="secondary"
                  text="Back"
                  full-width
                  size="lg"
                />
                <BaseButton
                  @click="placeOrder"
                  :loading="isPlacingOrder"
                  :disabled="isPlacingOrder"
                  variant="success"
                  text="Place Order"
                  full-width
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold mb-6">Order Summary</h2>
          
          <template v-if="isMounted">
            <div class="space-y-4 mb-6">
              <div 
                v-for="item in cartItems" 
                :key="`${item.id}-${JSON.stringify(item.variation)}`"
                class="flex items-center space-x-3"
              >
                <img 
                  :src="getCartItemImage(item)" 
                  :alt="item.name"
                  class="w-16 h-16 object-cover rounded"
                  @error="handleImageError"
                >
                <div class="flex-1">
                  <h4 class="font-medium">{{ item.name }}</h4>
                  <p class="text-gray-600 text-sm">Qty: {{ item.quantity }}</p>
                </div>
                <div class="text-right">
                  <p class="font-medium">{{ formatPrice(item.price * item.quantity) }}</p>
                </div>
              </div>
            </div>

            <div class="border-t pt-4 space-y-2">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>{{ formatPrice(cartSubtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping</span>
                <span>{{ formatPrice(shippingCost) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Tax</span>
                <span>{{ formatPrice(taxAmount) }}</span>
              </div>
              <div class="border-t pt-2">
                <div class="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{{ formatPrice(orderTotal) }}</span>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="space-y-4 mb-6">
              <div class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div class="border-t pt-4 space-y-2">
              <div class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const { cartItems, cartSubtotal, clearCart, formatPrice } = useCart()
const { createOrder, loadCustomerProfile, updateCustomer } = useCustomer()
const { getCartItemImage, handleImageError } = useProducts()
const { user, isAuthenticated, initAuth } = useAuth()

// SEO
useHead({
  title: 'Checkout - Your Store',
  meta: [
    { name: 'description', content: 'Complete your purchase securely.' }
  ]
})

// Redirect if cart is empty
if (process.client && (!cartItems.value || cartItems.value.length === 0)) {
  navigateTo('/cart')
}

// Data
const currentStep = ref(1)
const sameAsShipping = ref(true)
const isPlacingOrder = ref(false)
const isLoadingUserData = ref(false)
const isMounted = ref(false)

const checkoutData = ref({
  billing: {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'US'
  },
  shipping: {},
  payment_method: 'stripe',
  payment_method_title: 'Credit Card'
})

// Computed
const shippingCost = computed(() => 10.00)
const taxAmount = computed(() => cartSubtotal.value * 0.08)
const orderTotal = computed(() => cartSubtotal.value + shippingCost.value + taxAmount.value)

// Auto-fill addresses for logged-in users
const autoFillAddresses = async () => {
  if (!isAuthenticated.value || !user.value) return

  try {
    isLoadingUserData.value = true
    
    const customerProfile = await loadCustomerProfile(user.value)
    
    if (customerProfile) {
      if (customerProfile.billing) {
        const billing = customerProfile.billing
        checkoutData.value.billing = {
          first_name: billing.first_name || customerProfile.first_name || '',
          last_name: billing.last_name || customerProfile.last_name || '',
          email: billing.email || customerProfile.email || user.value.email || '',
          phone: billing.phone || '',
          company: billing.company || '',
          address_1: billing.address_1 || '',
          address_2: billing.address_2 || '',
          city: billing.city || '',
          state: billing.state || '',
          postcode: billing.postcode || '',
          country: billing.country || 'US'
        }
      } else {
        checkoutData.value.billing.first_name = customerProfile.first_name || ''
        checkoutData.value.billing.last_name = customerProfile.last_name || ''
        checkoutData.value.billing.email = customerProfile.email || user.value.email || ''
      }

      if (customerProfile.shipping && Object.keys(customerProfile.shipping).length > 0) {
        const shipping = customerProfile.shipping
        const hasShippingData = shipping.address_1 || shipping.city || shipping.state
        
        if (hasShippingData) {
          checkoutData.value.shipping = {
            first_name: shipping.first_name || customerProfile.first_name || '',
            last_name: shipping.last_name || customerProfile.last_name || '',
            company: shipping.company || '',
            phone: shipping.phone || '',
            address_1: shipping.address_1 || '',
            address_2: shipping.address_2 || '',
            city: shipping.city || '',
            state: shipping.state || '',
            postcode: shipping.postcode || '',
            country: shipping.country || 'US'
          }
          
          const billingAddress = `${checkoutData.value.billing.address_1}${checkoutData.value.billing.city}${checkoutData.value.billing.state}`
          const shippingAddress = `${checkoutData.value.shipping.address_1}${checkoutData.value.shipping.city}${checkoutData.value.shipping.state}`
          
          if (shippingAddress && billingAddress !== shippingAddress) {
            sameAsShipping.value = false
          }
        }
      }
    }
  } catch (error) {
    console.error('Error auto-filling addresses:', error)
  } finally {
    isLoadingUserData.value = false
  }
}

// Methods
const proceedToPayment = () => {
  currentStep.value = 2
}

const proceedToReview = () => {
  currentStep.value = 3
}

const getPaymentMethodName = (method) => {
  const methods = {
    stripe: 'Credit Card',
    paypal: 'PayPal',
    cod: 'Cash on Delivery'
  }
  return methods[method] || method
}

const placeOrder = async () => {
  isPlacingOrder.value = true
  
  try {
    const orderData = {
      payment_method: checkoutData.value.payment_method,
      payment_method_title: getPaymentMethodName(checkoutData.value.payment_method),
      set_paid: false,
      billing: checkoutData.value.billing,
      shipping: sameAsShipping.value ? checkoutData.value.billing : checkoutData.value.shipping,
      line_items: cartItems.value.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        variation_id: item.variation?.id || 0
      })),
      shipping_lines: [
        {
          method_id: 'flat_rate',
          method_title: 'Flat Rate',
          total: shippingCost.value.toString()
        }
      ]
    }

    const order = await createOrder(orderData)
    
    if (isAuthenticated.value && user.value) {
      try {
        const addressUpdateData = {
          billing: checkoutData.value.billing,
          shipping: sameAsShipping.value ? checkoutData.value.billing : checkoutData.value.shipping
        }
        await updateCustomer(user.value.id, addressUpdateData)
      } catch (addressError) {
        console.warn('Could not save addresses for future use:', addressError)
      }
    }
    
    clearCart()
    navigateTo(`/order-confirmation/${order.id}`)
    
  } catch (error) {
    console.error('Error placing order:', error)
    alert('There was an error placing your order. Please try again.')
  } finally {
    isPlacingOrder.value = false
  }
}

// Copy billing to shipping if same address
watch(sameAsShipping, (newValue) => {
  if (newValue) {
    checkoutData.value.shipping = { ...checkoutData.value.billing }
  }
})

// Initialize auth and auto-fill addresses when component mounts
onMounted(async () => {
  initAuth()
  isMounted.value = true
  
  await nextTick()
  if (isAuthenticated.value) {
    autoFillAddresses()
  }
})

// Watch for authentication changes and auto-fill when user logs in
watch(isAuthenticated, (newValue) => {
  if (newValue) {
    autoFillAddresses()
  }
})
</script>