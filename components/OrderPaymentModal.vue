<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">
            Complete Payment for Order #{{ order?.number }}
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <Icon name="heroicons:x-mark" class="h-6 w-6" />
          </button>
        </div>

        <!-- Order Summary -->
        <div class="p-6 border-b bg-gray-50">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Amount Due</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatPrice(order?.total) }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Order Date</p>
              <p class="text-sm font-medium">{{ formatDate(order?.date_created) }}</p>
            </div>
          </div>
        </div>

        <!-- Payment Form -->
        <div class="p-6">
          <form @submit.prevent="processPayment" class="space-y-6">
            <!-- Payment Method Notice -->
            <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div class="flex items-center">
                <Icon name="heroicons:credit-card" class="h-5 w-5 text-blue-600 mr-2" />
                <span class="text-sm text-blue-700 font-medium">Secure Payment</span>
              </div>
              <p class="text-sm text-blue-600 mt-1">Your payment information is encrypted and secure.</p>
            </div>

            <!-- Saved Payment Methods -->
            <div v-if="savedPaymentMethods.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-3">Saved Payment Methods</label>
              <div class="space-y-3 mb-6">
                <div v-for="method in savedPaymentMethods" :key="method.id"
                  class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                  :class="{ 'border-blue-500 bg-blue-50': selectedPaymentMethodId === method.id }"
                  @click="selectedPaymentMethodId = method.id">
                  <label class="flex items-center cursor-pointer">
                    <input v-model="selectedPaymentMethodId" type="radio" :value="method.id"
                      class="text-blue-600 focus:ring-blue-500">
                    <div class="ml-3 flex items-center space-x-3 flex-1">
                      <Icon :name="getCardIcon(method.card_type)" class="h-8 w-8 text-gray-600" />
                      <div>
                        <div class="flex items-center space-x-2">
                          <span class="font-medium text-gray-900">
                            {{ method.card_type }} ending in {{ method.last4 }}
                          </span>
                          <span v-if="method.is_default"
                            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Default
                          </span>
                        </div>
                        <p class="text-sm text-gray-600">
                          Expires {{ method.exp_month }}/{{ method.exp_year }}
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Add New Card Option -->
              <div
                class="mb-6 border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                :class="{ 'border-blue-500 bg-blue-50': selectedPaymentMethodId === 'new' }"
                @click="selectedPaymentMethodId = 'new'">
                <label class="flex items-center cursor-pointer">
                  <input v-model="selectedPaymentMethodId" type="radio" value="new"
                    class="text-blue-600 focus:ring-blue-500">
                  <div class="ml-3 flex items-center space-x-3">
                    <Icon name="heroicons:plus-circle" class="h-8 w-8 text-blue-600" />
                    <span class="font-medium text-gray-900">Use New Card</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Available Payment Gateways -->
            <div v-if="availablePaymentGateways.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                {{ savedPaymentMethods.length > 0 ? 'Payment Processor' : 'Choose Payment Method' }}
              </label>
              <div class="space-y-3 mb-6">
                <div v-for="gateway in availablePaymentGateways" :key="gateway.id"
                  class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                  :class="{ 'border-blue-500 bg-blue-50': selectedPaymentGateway === gateway.id }"
                  @click="handleGatewayChange(gateway)">
                  <label class="flex items-center cursor-pointer">
                    <input v-model="selectedPaymentGateway" type="radio" :value="gateway.id"
                      class="text-blue-600 focus:ring-blue-500">
                    <div class="ml-3 flex items-center space-x-3 flex-1">
                      <Icon name="heroicons:credit-card" class="h-8 w-8 text-gray-600" />
                      <div>
                        <div class="font-medium text-gray-900">
                          {{ gateway.method_title }}
                        </div>
                        <p v-if="gateway.method_description" class="text-sm text-gray-600">
                          {{ gateway.method_description }}
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- New Card Form -->
            <div v-if="!savedPaymentMethods.length || selectedPaymentMethodId === 'new'" class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900">Payment Details</h3>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input v-model="newCardForm.billing_name" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input v-model="newCardForm.card_number" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456" maxlength="19" @input="formatCardNumber">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input v-model="newCardForm.expiry" type="text" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="MM/YY" maxlength="5" @input="formatExpiry">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input v-model="newCardForm.cvv" type="text" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123" maxlength="4">
                </div>
              </div>

              <div v-if="canSaveCard" class="flex items-center">
                <input v-model="newCardForm.save_card" type="checkbox" id="save-card"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="save-card" class="ml-2 block text-sm text-gray-700">
                  Save this card for future purchases
                </label>
              </div>

              <!-- Save Card Button -->
              <div v-if="canSaveCard" class="flex items-center justify-between">
                <BaseButton v-if="!isNewCardSaved" @click="saveCardForLater" :loading="isSavingCard"
                  :disabled="!canSaveNewCard" variant="secondary" text="Save Card" icon="heroicons:credit-card" />
                <div v-else class="flex items-center text-green-600">
                  <Icon name="heroicons:check-circle" class="h-5 w-5 mr-2" />
                  <span class="text-sm font-medium">Card saved successfully</span>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-md">
              <div class="flex">
                <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-red-400" />
                <div class="ml-3">
                  <p class="text-sm text-red-600">{{ errorMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-3 pt-4 border-t">
              <BaseButton @click="closeModal" text="Cancel" variant="outline" :disabled="isProcessing" />
              <BaseButton type="submit" :loading="isProcessing" :disabled="!isPaymentValid" text="Pay" />
            </div>
          </form>
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
  order: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'payment-success'])

const { user, isAuthenticated } = useAuth()
const { formatPrice } = useCurrency()
const { loadCustomerProfile, updateCustomer } = useCustomer()

// Data
const isProcessing = ref(false)
const errorMessage = ref('')
const savedPaymentMethods = ref([])
const selectedPaymentMethodId = ref(null)
const availablePaymentGateways = ref([])
const selectedPaymentGateway = ref('')
const isNewCardSaved = ref(false)
const isSavingCard = ref(false)

const newCardForm = ref({
  billing_name: '',
  card_number: '',
  expiry: '',
  cvv: '',
  save_card: true
})

// Computed
const canSaveCard = computed(() => isAuthenticated.value)

const hasPaymentMethods = computed(() => {
  return savedPaymentMethods.value.length > 0 || availablePaymentGateways.value.length > 0
})

const isPaymentValid = computed(() => {
  // ONLY activate if a saved card is selected (not 'new' and not null)
  if (selectedPaymentMethodId.value && selectedPaymentMethodId.value !== 'new') {
    return true
  }

  // For all other cases (no selection, 'new' card form, etc.), button is disabled
  return false
})

const canSaveNewCard = computed(() => {
  return !!(newCardForm.value.billing_name &&
    newCardForm.value.card_number &&
    newCardForm.value.expiry &&
    newCardForm.value.cvv) &&
    !isNewCardSaved.value &&
    !isSavingCard.value
})

// Methods
const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  errorMessage.value = ''
  selectedPaymentMethodId.value = null
  selectedPaymentGateway.value = ''
  isNewCardSaved.value = false
  isSavingCard.value = false
  newCardForm.value = {
    billing_name: '',
    card_number: '',
    expiry: '',
    cvv: '',
    save_card: true
  }
}

const handleGatewayChange = (gateway) => {
  selectedPaymentGateway.value = gateway.id
}

const saveCardForLater = async () => {
  if (!canSaveNewCard.value) return

  // Check for duplicate cards (only check card number)
  const last4 = newCardForm.value.card_number.replace(/\s/g, '').slice(-4)

  const existingCard = savedPaymentMethods.value.find(method =>
    method.last4 === last4
  )

  if (existingCard) {
    errorMessage.value = 'This card is already saved. Please select it from your saved cards or use a different card.'
    return
  }

  isSavingCard.value = true

  try {
    const newCardId = await saveNewCard('card_save')
    isNewCardSaved.value = true
    selectedPaymentMethodId.value = newCardId // This enables the Pay button
    errorMessage.value = '' // Clear any previous errors
  } catch (error) {
    console.error('Error saving card:', error)
    errorMessage.value = 'Failed to save card. Please try again.'
  } finally {
    isSavingCard.value = false
  }
}

const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '')
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  newCardForm.value.card_number = formattedValue
}

const formatExpiry = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  newCardForm.value.expiry = value
}

const getCardIcon = (cardType) => {
  const icons = {
    'visa': 'heroicons:credit-card',
    'mastercard': 'heroicons:credit-card',
    'amex': 'heroicons:credit-card',
    'discover': 'heroicons:credit-card'
  }
  return icons[cardType?.toLowerCase()] || 'heroicons:credit-card'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadSavedPaymentMethods = async () => {
  if (!isAuthenticated.value || !user.value) return

  try {
    const customer = await loadCustomerProfile(user.value)

    if (customer && customer.meta_data) {
      const savedMethods = customer.meta_data.find(meta => meta.key === 'payment_methods')

      if (savedMethods && savedMethods.value) {
        try {
          savedPaymentMethods.value = JSON.parse(savedMethods.value)

          // Auto-select default card
          const defaultCard = savedPaymentMethods.value.find(method => method.is_default)
          if (defaultCard) {
            selectedPaymentMethodId.value = defaultCard.id
          }
        } catch (error) {
          console.error('Error parsing saved payment methods:', error)
          savedPaymentMethods.value = []
        }
      }
    }
  } catch (error) {
    console.error('Error loading saved payment methods:', error)
    savedPaymentMethods.value = []
  }
}

const loadPaymentGateways = async () => {
  try {
    const gateways = await $fetch('/api/woocommerce/payment-gateways')
    availablePaymentGateways.value = gateways
  } catch (error) {
    console.error('Error loading payment gateways:', error)
    availablePaymentGateways.value = []
  }
}

const processPayment = async () => {
  if (!isPaymentValid.value) return

  isProcessing.value = true
  errorMessage.value = ''

  try {
    // Prepare payment data
    const paymentData = {
      order_id: props.order.id,
      payment_method: selectedPaymentGateway.value,
      amount: props.order.total
    }

    if (selectedPaymentMethodId.value === 'new' || !savedPaymentMethods.value.length) {
      if (isNewCardSaved.value) {
        // Use the saved card
        const savedCard = savedPaymentMethods.value.find(card => card.id === selectedPaymentMethodId.value)
        paymentData.payment_method_id = savedCard?.id || selectedPaymentMethodId.value
      } else {
        // Use new card
        paymentData.card = {
          name: newCardForm.value.billing_name,
          number: newCardForm.value.card_number.replace(/\s/g, ''),
          expiry: newCardForm.value.expiry,
          cvv: newCardForm.value.cvv
        }
        paymentData.save_card = newCardForm.value.save_card
      }
    } else {
      // Use saved payment method
      paymentData.payment_method_id = selectedPaymentMethodId.value
    }

    // Process payment through your payment API
    const response = await $fetch('/api/payments/process', {
      method: 'POST',
      body: paymentData
    })

    if (response.success) {
      // Save new card if requested and not already saved
      if ((selectedPaymentMethodId.value === 'new' || !savedPaymentMethods.value.length) &&
        newCardForm.value.save_card && isAuthenticated.value && !isNewCardSaved.value) {

        // Check for duplicate before saving during payment
        const last4 = newCardForm.value.card_number.replace(/\s/g, '').slice(-4)
        const existingCard = savedPaymentMethods.value.find(method => method.last4 === last4)

        if (!existingCard) {
          await saveNewCard(response.transaction_id)
        }
      }

      // Update order status to paid
      await $fetch(`/api/woocommerce/orders/${props.order.id}`, {
        method: 'PUT',
        body: {
          status: 'processing',
          set_paid: true,
          transaction_id: response.transaction_id
        }
      })

      emit('payment-success', response)
      closeModal()
    } else {
      throw new Error(response.message || 'Payment failed')
    }

  } catch (error) {
    console.error('Payment error:', error)
    errorMessage.value = error.message || 'Payment failed. Please try again.'
  } finally {
    isProcessing.value = false
  }
}

const saveNewCard = async (transactionId) => {
  try {
    const cardNumber = newCardForm.value.card_number.replace(/\s/g, '')
    const [exp_month, exp_year] = newCardForm.value.expiry.split('/')

    const newMethod = {
      id: `card_${Date.now()}`,
      card_type: getCardType(cardNumber),
      last4: cardNumber.slice(-4),
      exp_month: exp_month,
      exp_year: `20${exp_year}`,
      billing_name: newCardForm.value.billing_name,
      is_default: savedPaymentMethods.value.length === 0,
      transaction_id: transactionId,
      created_at: new Date().toISOString()
    }

    savedPaymentMethods.value.push(newMethod)
    selectedPaymentMethodId.value = newMethod.id

    // Save to customer meta data
    if (user.value) {
      const customer = await loadCustomerProfile(user.value)
      const customerId = customer?.id || user.value.id

      const paymentMethodsData = {
        key: 'payment_methods',
        value: JSON.stringify(savedPaymentMethods.value)
      }

      const existingMeta = customer?.meta_data || []
      const metaIndex = existingMeta.findIndex(meta => meta.key === 'payment_methods')

      let updatedMeta
      if (metaIndex !== -1) {
        updatedMeta = [...existingMeta]
        updatedMeta[metaIndex] = paymentMethodsData
      } else {
        updatedMeta = [...existingMeta, paymentMethodsData]
      }

      await updateCustomer(customerId, { meta_data: updatedMeta })
    }

    return newMethod.id
  } catch (error) {
    console.error('Error saving payment method:', error)
    throw error
  }
}

const getCardType = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '')

  if (number.startsWith('4')) return 'Visa'
  if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard'
  if (number.startsWith('3')) return 'American Express'
  if (number.startsWith('6')) return 'Discover'

  return 'Unknown'
}

// Initialize when modal opens
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await loadPaymentGateways()
    await loadSavedPaymentMethods()

    // Auto-select first gateway
    if (availablePaymentGateways.value.length > 0) {
      selectedPaymentGateway.value = availablePaymentGateways.value[0].id
    }
  }
})

// Watch for saved payment methods changes to auto-select
watch(savedPaymentMethods, (newMethods) => {
  if (newMethods.length === 0 && !selectedPaymentMethodId.value) {
    selectedPaymentMethodId.value = 'new'
  }
}, { immediate: true })

// Reset card saved state when switching payment methods
watch(selectedPaymentMethodId, (newId, oldId) => {
  if (newId !== 'new') {
    isNewCardSaved.value = false
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