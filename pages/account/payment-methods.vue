<template>
  <NuxtLayout name="account">
        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <div class="flex">
            <Icon name="heroicons:check-circle" class="h-5 w-5 mr-2" />
            {{ successMessage }}
          </div>
        </div>

        <div v-if="errorMessage" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <div class="flex">
            <Icon name="heroicons:exclamation-circle" class="h-5 w-5 mr-2" />
            {{ errorMessage }}
          </div>
        </div>

        <!-- Add New Payment Method Button -->
        <div class="mb-6">
          <BaseButton 
            @click="showAddPaymentForm = true"
            icon="heroicons:plus"
            text="Add Payment Method"
          />
        </div>

        <!-- Payment Methods List -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div class="bg-gray-300 h-4 rounded mb-4"></div>
            <div class="bg-gray-300 h-3 rounded w-2/3 mb-2"></div>
            <div class="bg-gray-300 h-3 rounded w-1/2"></div>
          </div>
        </div>

        <div v-else-if="paymentMethods.length > 0" class="space-y-4">
          <div 
            v-for="method in paymentMethods" 
            :key="method.id"
            class="bg-white rounded-lg shadow-sm p-6"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- Card Icon -->
                <div class="flex-shrink-0">
                  <Icon 
                    :name="getCardIcon(method.card_type)" 
                    class="h-8 w-8 text-gray-600"
                  />
                </div>
                
                <!-- Card Details -->
                <div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-medium text-gray-900">
                      {{ method.card_type }} ending in {{ method.last4 }}
                    </h3>
                    <span 
                      v-if="method.is_default"
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                    >
                      Default
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">
                    Expires {{ method.exp_month }}/{{ method.exp_year }}
                  </p>
                  <p v-if="method.billing_name" class="text-sm text-gray-600">
                    {{ method.billing_name }}
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2">
                <BaseButton 
                  v-if="!method.is_default"
                  @click="setDefaultPaymentMethod(method.id)"
                  variant="link"
                  size="sm"
                  text="Set as Default"
                />
                <BaseButton 
                  @click="editPaymentMethod(method)"
                  variant="link"
                  size="sm"
                  text="Edit"
                  class="text-gray-600 hover:text-gray-800"
                />
                <BaseButton 
                  @click="deletePaymentMethod(method.id)"
                  variant="link"
                  size="sm"
                  text="Delete"
                  class="text-red-600 hover:text-red-800"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- No Payment Methods -->
        <div v-else class="text-center py-16">
          <Icon name="heroicons:credit-card" class="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">No payment methods</h2>
          <p class="text-gray-600 mb-8">Add a payment method to make checkout faster and easier.</p>
          <BaseButton 
            @click="showAddPaymentForm = true"
            text="Add Your First Payment Method"
            size="lg"
          />
        </div>

        <!-- Payment Method Form Modal -->
        <div v-if="showAddPaymentForm || showEditPaymentForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg max-w-md w-full">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold">
                  {{ showEditPaymentForm ? 'Edit Payment Method' : 'Add Payment Method' }}
                </h3>
                <BaseButton 
                  @click="closePaymentForm"
                  variant="ghost"
                  size="sm"
                  icon="heroicons:x-mark"
                />
              </div>

              <form @submit.prevent="savePaymentMethod" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                  <input
                    v-model="paymentForm.billing_name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                  <input
                    v-model="paymentForm.card_number"
                    type="text"
                    required
                    maxlength="19"
                    placeholder="1234 5678 9012 3456"
                    @input="formatCardNumber"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                    <input
                      v-model="paymentForm.expiry"
                      type="text"
                      required
                      placeholder="MM/YY"
                      maxlength="5"
                      @input="formatExpiry"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                    <input
                      v-model="paymentForm.cvv"
                      type="text"
                      required
                      maxlength="4"
                      placeholder="123"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                  </div>
                </div>

                <div class="flex items-center">
                  <input 
                    v-model="paymentForm.is_default"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">Set as default payment method</span>
                </div>

                <div class="flex space-x-4 pt-4">
                  <BaseButton
                    action="save"
                    :loading="saving"
                    :disabled="saving"
                    :text="`${showEditPaymentForm ? 'Update' : 'Add'} Payment Method`"
                  />
                  <BaseButton
                    action="cancel"
                    @click="closePaymentForm"
                  />
                </div>
              </form>

              <!-- Security Notice -->
              <div class="mt-6 p-4 bg-gray-50 rounded-md">
                <div class="flex">
                  <Icon name="heroicons:shield-check" class="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <div class="text-sm text-gray-700">
                    <p class="font-medium">Your payment information is secure</p>
                    <p>We use industry-standard encryption to protect your data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()

// SEO
useHead({
  title: 'Payment Methods - Your Store',
  meta: [
    { name: 'description', content: 'Manage your saved payment methods securely.' }
  ]
})

// Data
const paymentMethods = ref([])
const loading = ref(true)
const saving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showAddPaymentForm = ref(false)
const showEditPaymentForm = ref(false)
const editingPaymentId = ref(null)

const paymentForm = ref({
  billing_name: '',
  card_number: '',
  expiry: '',
  cvv: '',
  is_default: false
})

// Methods
const fetchPaymentMethods = async () => {
  loading.value = true
  
  // Simulate API call - In real implementation, this would call your payment processor API
  setTimeout(() => {
    // Mock data for demonstration
    paymentMethods.value = [
      {
        id: 1,
        card_type: 'Visa',
        last4: '4242',
        exp_month: '12',
        exp_year: '2025',
        billing_name: 'John Doe',
        is_default: true
      },
      {
        id: 2,
        card_type: 'Mastercard',
        last4: '5555',
        exp_month: '08',
        exp_year: '2024',
        billing_name: 'John Doe',
        is_default: false
      }
    ]
    loading.value = false
  }, 1000)
}

const getCardIcon = (cardType) => {
  const icons = {
    'Visa': 'heroicons:credit-card',
    'Mastercard': 'heroicons:credit-card',
    'American Express': 'heroicons:credit-card',
    'Discover': 'heroicons:credit-card'
  }
  return icons[cardType] || 'heroicons:credit-card'
}

const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '')
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  paymentForm.value.card_number = formattedValue
}

const formatExpiry = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  paymentForm.value.expiry = value
}

const detectCardType = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '')
  
  if (/^4/.test(number)) return 'Visa'
  if (/^5[1-5]/.test(number)) return 'Mastercard'
  if (/^3[47]/.test(number)) return 'American Express'
  if (/^6/.test(number)) return 'Discover'
  
  return 'Unknown'
}

const savePaymentMethod = async () => {
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Validate form
    if (!paymentForm.value.billing_name || !paymentForm.value.card_number || 
        !paymentForm.value.expiry || !paymentForm.value.cvv) {
      throw new Error('Please fill in all required fields')
    }

    // In a real implementation, you would:
    // 1. Tokenize the card with your payment processor (Stripe, PayPal, etc.)
    // 2. Save the token to your backend
    // 3. Never store actual card details

    const cardType = detectCardType(paymentForm.value.card_number)
    const last4 = paymentForm.value.card_number.replace(/\s/g, '').slice(-4)
    const [exp_month, exp_year] = paymentForm.value.expiry.split('/')

    const newMethod = {
      id: showEditPaymentForm.value ? editingPaymentId.value : Date.now(),
      card_type: cardType,
      last4: last4,
      exp_month: exp_month,
      exp_year: `20${exp_year}`,
      billing_name: paymentForm.value.billing_name,
      is_default: paymentForm.value.is_default
    }

    if (showEditPaymentForm.value) {
      // Update existing method
      const index = paymentMethods.value.findIndex(m => m.id === editingPaymentId.value)
      if (index !== -1) {
        paymentMethods.value[index] = newMethod
      }
      successMessage.value = 'Payment method updated successfully!'
    } else {
      // Add new method
      if (paymentForm.value.is_default) {
        // Remove default from other methods
        paymentMethods.value.forEach(method => {
          method.is_default = false
        })
      }
      paymentMethods.value.push(newMethod)
      successMessage.value = 'Payment method added successfully!'
    }

    closePaymentForm()

  } catch (error) {
    console.error('Error saving payment method:', error)
    errorMessage.value = error.message || 'Failed to save payment method. Please try again.'
  } finally {
    saving.value = false
  }
}

const editPaymentMethod = (method) => {
  editingPaymentId.value = method.id
  paymentForm.value = {
    billing_name: method.billing_name,
    card_number: `**** **** **** ${method.last4}`,
    expiry: `${method.exp_month}/${method.exp_year.slice(-2)}`,
    cvv: '',
    is_default: method.is_default
  }
  showEditPaymentForm.value = true
}

const deletePaymentMethod = async (methodId) => {
  if (!confirm('Are you sure you want to delete this payment method?')) return

  try {
    // In real implementation, call API to delete payment method
    paymentMethods.value = paymentMethods.value.filter(method => method.id !== methodId)
    successMessage.value = 'Payment method deleted successfully!'
  } catch (error) {
    console.error('Error deleting payment method:', error)
    errorMessage.value = 'Failed to delete payment method. Please try again.'
  }
}

const setDefaultPaymentMethod = async (methodId) => {
  try {
    // Update default status
    paymentMethods.value.forEach(method => {
      method.is_default = method.id === methodId
    })
    successMessage.value = 'Default payment method updated!'
  } catch (error) {
    console.error('Error setting default payment method:', error)
    errorMessage.value = 'Failed to update default payment method. Please try again.'
  }
}

const closePaymentForm = () => {
  showAddPaymentForm.value = false
  showEditPaymentForm.value = false
  editingPaymentId.value = null
  paymentForm.value = {
    billing_name: '',
    card_number: '',
    expiry: '',
    cvv: '',
    is_default: false
  }
}

// Initialize
onMounted(() => {
  fetchPaymentMethods()
})

// Clear messages after 5 seconds
watch([successMessage, errorMessage], () => {
  if (successMessage.value || errorMessage.value) {
    setTimeout(() => {
      successMessage.value = ''
      errorMessage.value = ''
    }, 5000)
  }
})
</script>