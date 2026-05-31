<template>
  <NuxtLayout name="checkout">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Progress Steps -->
      <CheckoutProgress :current-step="currentStep" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Checkout Form -->
        <div class="space-y-6">
          <!-- Customer Information -->
          <CheckoutContactInformation v-if="currentStep === 1" :checkout-data="checkoutData"
            :same-as-shipping="sameAsShipping" :is-loading-user-data="isLoadingUserData" :is-mounted="isMounted"
            @proceed="proceedToPayment" @update:same-as-shipping="sameAsShipping = $event" />

          <!-- Payment Information -->
          <CheckoutPaymentInformation v-if="currentStep === 2" :checkout-data="checkoutData"
            :saved-payment-methods="savedPaymentMethods" :selected-payment-method-id="selectedPaymentMethodId"
            :available-payment-gateways="availablePaymentGateways" :new-card-form="newCardForm"
            :is-new-card-saved="isNewCardSaved" :is-saving-card="isSavingCard" :can-save-new-card="canSaveNewCard"
            :has-payment-methods="hasPaymentMethods" :is-payment-method-valid="isPaymentMethodValid"
            :is-mounted="isMounted" @proceed="proceedToReview" @back="currentStep = 1" @save-card="saveCardForCheckout"
            @update:selected-payment-method-id="selectedPaymentMethodId = $event" />

          <!-- Order Review -->
          <CheckoutOrderReview v-if="currentStep === 3" :checkout-data="checkoutData"
            :selected-saved-card="selectedSavedCard" :selected-payment-method-id="selectedPaymentMethodId"
            :new-card-form="newCardForm" :selected-payment-gateway="selectedPaymentGateway"
            :is-placing-order="isPlacingOrder" @back="currentStep = 2" @place-order="placeOrder" />
        </div>

        <!-- Order Summary -->
        <CheckoutOrderSummary :shipping-cost="shippingCost" :tax-amount="taxAmount" :order-total="orderTotal"
          :is-mounted="isMounted" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const { t } = useI18n()
const { cartItems, cartSubtotal, clearCart } = useCart()
const { createOrder, loadCustomerProfile, updateCustomer } = useCustomer()
const { user, isAuthenticated, initAuth } = useAuth()

useHead({
  title: () => t('checkout.secureCheckout')
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
const availablePaymentGateways = ref([])
const savedPaymentMethods = ref([])
const selectedPaymentMethodId = ref(null)

const isNewCardSaved = ref(false)
const isSavingCard = ref(false)

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
  payment_method: '',
  payment_method_title: ''
})

const newCardForm = ref({
  billing_name: '',
  card_number: '',
  expiry: '',
  cvv: '',
  save_card: true
})

// Computed
const shippingCost = computed(() => 10.00)
const taxAmount = computed(() => cartSubtotal.value * 0.08)
const orderTotal = computed(() => cartSubtotal.value + shippingCost.value + taxAmount.value)

const selectedPaymentGateway = computed(() => {
  return availablePaymentGateways.value.find(gateway => gateway.id === checkoutData.value.payment_method)
})

const selectedSavedCard = computed(() => {
  return savedPaymentMethods.value.find(method => method.id === selectedPaymentMethodId.value)
})

const hasPaymentMethods = computed(() => {
  return savedPaymentMethods.value.length > 0 || availablePaymentGateways.value.length > 0
})

const isPaymentMethodValid = computed(() => {
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

const proceedToReview = async () => {
  // Card should already be saved via the Save Card button
  currentStep.value = 3
}

const loadPaymentGateways = async () => {
  try {
    const gateways = await $fetch('/api/woocommerce/payment-gateways')
    availablePaymentGateways.value = gateways
    // Auto-select first available gateway
    if (gateways.length > 0 && !checkoutData.value.payment_method) {
      checkoutData.value.payment_method = gateways[0].id
      checkoutData.value.payment_method_title = gateways[0].method_title
    }
  } catch (error) {
    console.error('Error loading payment gateways:', error)
    availablePaymentGateways.value = []
  }
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
  }
}

const saveNewPaymentMethod = async () => {
  if (!isAuthenticated.value || !user.value) return

  try {
    const cardType = detectCardType(newCardForm.value.card_number)
    const last4 = newCardForm.value.card_number.replace(/\s/g, '').slice(-4)
    const [exp_month, exp_year] = newCardForm.value.expiry.split('/')

    const newMethod = {
      id: Date.now(),
      card_type: cardType,
      last4: last4,
      exp_month: exp_month,
      exp_year: `20${exp_year}`,
      billing_name: newCardForm.value.billing_name,
      is_default: savedPaymentMethods.value.length === 0,
      created_at: new Date().toISOString()
    }

    savedPaymentMethods.value.push(newMethod)
    selectedPaymentMethodId.value = newMethod.id

    // Save to customer profile
    const customer = await loadCustomerProfile(user.value)
    const customerId = customer?.id || user.value.id

    // Only proceed if we have a valid customer ID
    if (customerId && customerId !== 'null' && customerId !== null) {
      const metaData = customer?.meta_data || []
      const existingIndex = metaData.findIndex(meta => meta.key === 'payment_methods')

      const paymentMethodsData = {
        key: 'payment_methods',
        value: JSON.stringify(savedPaymentMethods.value)
      }

      if (existingIndex !== -1) {
        metaData[existingIndex] = paymentMethodsData
      } else {
        metaData.push(paymentMethodsData)
      }

      await updateCustomer(customerId, { meta_data: metaData })
    } else {
      console.warn('Cannot save payment method: invalid customer ID')
    }
  } catch (error) {
    console.error('Error saving payment method:', error)
  }
}

const detectCardType = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '')

  if (/^4/.test(number)) return 'Visa'
  if (/^5[1-5]/.test(number)) return 'Mastercard'
  if (/^3[47]/.test(number)) return 'American Express'
  if (/^6/.test(number)) return 'Discover'

  return 'Unknown'
}

const saveCardForCheckout = async () => {
  if (!isAuthenticated.value || !user.value) return

  // Check for duplicate cards (only check card number)
  const last4 = newCardForm.value.card_number.replace(/\s/g, '').slice(-4)

  const existingCard = savedPaymentMethods.value.find(method =>
    method.last4 === last4
  )

  if (existingCard) {
    alert(t('checkout.payment.duplicateCard'))
    return
  }

  isSavingCard.value = true

  try {
    await saveNewPaymentMethod()
    isNewCardSaved.value = true

    // Clear the form after saving
    newCardForm.value = {
      billing_name: '',
      card_number: '',
      expiry: '',
      cvv: '',
      save_card: true
    }
  } catch (error) {
    console.error('Error saving card for checkout:', error)
    alert(t('checkout.payment.saveFailed'))
  } finally {
    isSavingCard.value = false
  }
}

const getPaymentMethodName = (method) => {
  const methods = {
    stripe: t('checkout.review.creditCard'),
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

    // Add customer ID to order if user is authenticated
    if (isAuthenticated.value && user.value) {
      try {
        const customer = await loadCustomerProfile(user.value)
        const customerId = customer?.id || user.value.id

        if (customerId && customerId !== 'null' && customerId !== null) {
          orderData.customer_id = customerId
        }
      } catch (error) {
        console.warn('Could not determine customer ID for order:', error)
      }
    }

    const order = await createOrder(orderData)

    // Save addresses for future use (only if we have a valid customer ID)
    if (isAuthenticated.value && user.value && orderData.customer_id) {
      try {
        const addressUpdateData = {
          billing: checkoutData.value.billing,
          shipping: sameAsShipping.value ? checkoutData.value.billing : checkoutData.value.shipping
        }
        await updateCustomer(orderData.customer_id, addressUpdateData)
      } catch (addressError) {
        console.warn('Could not save addresses for future use:', addressError)
      }
    }

    clearCart()
    navigateTo(`/order-confirmation/${order.id}`)

  } catch (error) {
    console.error('Error placing order:', error)
    alert(t('checkout.errors.placeOrder'))
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

  // Load payment gateways immediately
  await loadPaymentGateways()

  await nextTick()
  if (isAuthenticated.value) {
    autoFillAddresses()
    loadSavedPaymentMethods()
  }
})

// Watch for authentication changes and auto-fill when user logs in
watch(isAuthenticated, (newValue) => {
  if (newValue) {
    autoFillAddresses()
    loadSavedPaymentMethods()
  }
})

// Watch for saved payment methods changes to auto-select new card form if no saved cards
watch(savedPaymentMethods, (newMethods) => {
  if (newMethods.length === 0 && !selectedPaymentMethodId.value) {
    selectedPaymentMethodId.value = 'new'
  }
}, { immediate: true })

// Reset card saved state when switching payment methods or changing card details
watch(selectedPaymentMethodId, (newId, oldId) => {
  if (newId !== 'new') {
    isNewCardSaved.value = false
  }

  // Clear form when switching from 'new' to a saved card
  if (oldId === 'new' && newId !== 'new') {
    newCardForm.value = {
      billing_name: '',
      card_number: '',
      expiry: '',
      cvv: '',
      save_card: true
    }
  }
})

// Reset card saved state when card form changes
watch([
  () => newCardForm.value.billing_name,
  () => newCardForm.value.card_number,
  () => newCardForm.value.expiry,
  () => newCardForm.value.cvv
], () => {
  if (isNewCardSaved.value) {
    isNewCardSaved.value = false
  }
})
</script>