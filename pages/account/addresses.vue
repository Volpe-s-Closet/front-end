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

    <!-- Address Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Billing Address -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold flex items-center">
            <Icon name="heroicons:credit-card" class="h-5 w-5 mr-2 text-blue-600" />
            {{ $t('account.addresses.billing') }}
          </h2>
          <BaseButton @click="editAddress('billing')" variant="link" size="sm"
            :text="addresses.billing && hasAddressData(addresses.billing) ? $t('account.addresses.edit') : $t('account.addresses.add')" />
        </div>

        <div v-if="addresses.billing && hasAddressData(addresses.billing)" class="space-y-2">
          <p class="font-medium">{{ getFullName(addresses.billing) }}</p>
          <p v-if="addresses.billing.company">{{ addresses.billing.company }}</p>
          <p>{{ addresses.billing.address_1 }}</p>
          <p v-if="addresses.billing.address_2">{{ addresses.billing.address_2 }}</p>
          <p>{{ addresses.billing.city }}, {{ addresses.billing.state }} {{ addresses.billing.postcode }}</p>
          <p>{{ getCountryName(addresses.billing.country) }}</p>
          <p v-if="addresses.billing.phone" class="text-gray-600">{{ addresses.billing.phone }}</p>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          <Icon name="heroicons:map-pin" class="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>{{ $t('account.addresses.noBilling') }}</p>
        </div>
      </div>

      <!-- Shipping Address -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold flex items-center">
            <Icon name="heroicons:truck" class="h-5 w-5 mr-2 text-green-600" />
            {{ $t('account.addresses.shipping') }}
          </h2>
          <BaseButton @click="editAddress('shipping')" variant="link" size="sm"
            :text="addresses.shipping && hasAddressData(addresses.shipping) ? $t('account.addresses.edit') : $t('account.addresses.add')" />
        </div>

        <div v-if="addresses.shipping && hasAddressData(addresses.shipping)" class="space-y-2">
          <p class="font-medium">{{ getFullName(addresses.shipping) }}</p>
          <p v-if="addresses.shipping.company">{{ addresses.shipping.company }}</p>
          <p>{{ addresses.shipping.address_1 }}</p>
          <p v-if="addresses.shipping.address_2">{{ addresses.shipping.address_2 }}</p>
          <p>{{ addresses.shipping.city }}, {{ addresses.shipping.state }} {{ addresses.shipping.postcode }}</p>
          <p>{{ getCountryName(addresses.shipping.country) }}</p>
          <p v-if="addresses.shipping.phone" class="text-gray-600">{{ addresses.shipping.phone }}</p>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          <Icon name="heroicons:map-pin" class="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>{{ $t('account.addresses.noShipping') }}</p>
        </div>

        <div v-if="addresses.billing && hasAddressData(addresses.billing)" class="mt-4 pt-4 border-t">
          <label class="flex items-center">
            <input type="checkbox" v-model="sameAsBilling" @change="copyBillingToShipping"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
            <span class="ml-2 text-sm text-gray-700">{{ $t('account.addresses.sameAsBilling') }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Address Form Modal -->
    <div v-if="showAddressForm" class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeAddressForm"></div>

      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold">
                {{ editingAddress === 'billing' ? $t('account.addresses.editBilling') : $t('account.addresses.editShipping') }}
              </h3>
              <BaseButton @click="closeAddressForm" variant="ghost" size="sm" icon="heroicons:x-mark" />
            </div>

            <form @submit.prevent="saveAddress" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.addresses.form.firstName') }} *</label>
                  <input v-model="addressForm.first_name" type="text" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.addresses.form.lastName') }} *</label>
                  <input v-model="addressForm.last_name" type="text" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.addresses.form.company') }}</label>
                <input v-model="addressForm.company" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.addresses.form.address1') }} *</label>
                <input v-model="addressForm.address_1" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.addresses.form.address2') }}</label>
                <input v-model="addressForm.address_2" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.addresses.form.city') }} *</label>
                  <input v-model="addressForm.city" type="text" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.addresses.form.state') }} *</label>
                  <input v-model="addressForm.state" type="text" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.addresses.form.postcode') }} *</label>
                  <input v-model="addressForm.postcode" type="text" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.addresses.form.country') }} *</label>
                <SelectBox v-model="addressForm.country" :options="[
                  { value: '', label: $t('account.addresses.form.selectCountry') },
                  ...countries.map(country => ({ value: country.code, label: country.name }))
                ]" :placeholder="$t('account.addresses.form.selectCountry')" button-class="w-full" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ editingAddress === 'billing' ? $t('account.addresses.form.phoneRequired') : $t('account.addresses.form.phoneOptional') }}
                </label>
                <input v-model="addressForm.phone" type="tel" :required="editingAddress === 'billing'"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>

              <div class="flex space-x-4 pt-4">
                <BaseButton action="save" :loading="saving" :disabled="saving" :text="$t('account.addresses.form.save')" />
                <BaseButton action="cancel" @click="closeAddressForm" />
              </div>
            </form>
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

const { t } = useI18n()
const { user } = useAuth()
const {
  displayCustomer,
  loadCustomerProfile,
  updateCustomer,
  getCustomer,
  findCustomerProfile
} = useCustomer()

useHead({
  title: () => t('account.addresses.metaTitle'),
  meta: [
    { name: 'description', content: () => t('account.addresses.metaDescription') }
  ]
})

// Data
const addresses = ref({
  billing: {},
  shipping: {}
})
const showAddressForm = ref(false)
const editingAddress = ref('')
const saving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const sameAsBilling = ref(false)

const addressForm = ref({
  first_name: '',
  last_name: '',
  company: '',
  address_1: '',
  address_2: '',
  city: '',
  state: '',
  postcode: '',
  country: '',
  phone: ''
})

// Countries list (simplified)
const countries = ref([
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' }
])

// Methods
const fetchAddresses = async () => {
  if (!user.value) {
    console.warn('No user available for fetching addresses')
    return
  }

  try {
    const customer = await loadCustomerProfile(user.value)

    if (customer) {
      addresses.value = {
        billing: customer.billing || {},
        shipping: customer.shipping || {}
      }
    } else {
      console.warn('No customer data found')
      addresses.value = {
        billing: {},
        shipping: {}
      }
    }
  } catch (error) {
    console.error('Error fetching addresses:', error)
    errorMessage.value = t('account.addresses.messages.loadFailed')
  }
}

const hasAddressData = (address) => {
  return address && (address.address_1 || address.city || address.postcode)
}

const getFullName = (address) => {
  return `${address.first_name || ''} ${address.last_name || ''}`.trim()
}

const getCountryName = (countryCode) => {
  const country = countries.value.find(c => c.code === countryCode)
  return country ? country.name : countryCode
}

const editAddress = (type) => {
  editingAddress.value = type
  const address = addresses.value[type] || {}

  addressForm.value = {
    first_name: address.first_name || '',
    last_name: address.last_name || '',
    company: address.company || '',
    address_1: address.address_1 || '',
    address_2: address.address_2 || '',
    city: address.city || '',
    state: address.state || '',
    postcode: address.postcode || '',
    country: address.country || '',
    phone: address.phone || ''
  }

  showAddressForm.value = true
}

const closeAddressForm = () => {
  showAddressForm.value = false
  editingAddress.value = ''
  addressForm.value = {
    first_name: '',
    last_name: '',
    company: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    phone: ''
  }
}

const saveAddress = async () => {
  if (!user.value) {
    errorMessage.value = t('account.addresses.messages.userNotAuth')
    return
  }

  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Get the correct customer ID using the same logic as other pages
    const customer = displayCustomer.value || await findCustomerProfile(user.value)
    const customerId = customer?.id || user.value.id

    if (!customerId) {
      throw new Error('No valid customer ID found')
    }

    const updateData = {}
    updateData[editingAddress.value] = { ...addressForm.value }

    await updateCustomer(customerId, updateData)

    // Update local addresses
    addresses.value[editingAddress.value] = { ...addressForm.value }

    successMessage.value = editingAddress.value === 'billing'
      ? t('account.addresses.messages.billingUpdated')
      : t('account.addresses.messages.shippingUpdated')
    closeAddressForm()

  } catch (error) {
    console.error('Error saving address:', error)
    errorMessage.value = t('account.addresses.messages.saveFailed')
  } finally {
    saving.value = false
  }
}

const copyBillingToShipping = async () => {
  if (!user.value) {
    errorMessage.value = t('account.addresses.messages.userNotAuth')
    sameAsBilling.value = false
    return
  }

  if (sameAsBilling.value && addresses.value.billing) {
    try {
      // Get the correct customer ID
      const customer = displayCustomer.value || await findCustomerProfile(user.value)
      const customerId = customer?.id || user.value.id

      if (!customerId) {
        throw new Error('No valid customer ID found')
      }

      const billingCopy = { ...addresses.value.billing }
      // Keep phone number when copying to shipping (user can remove it if not needed)
      addresses.value.shipping = billingCopy

      // Save to server
      await updateCustomer(customerId, { shipping: billingCopy })
      successMessage.value = t('account.addresses.messages.shippingMatched')
    } catch (error) {
      console.error('Error copying address:', error)
      errorMessage.value = t('account.addresses.messages.copyFailed')
      sameAsBilling.value = false
    }
  }
}

// Watch for customer data changes
watch(displayCustomer, (customer) => {
  if (customer) {
    addresses.value = {
      billing: customer.billing || {},
      shipping: customer.shipping || {}
    }
  }
}, { immediate: true })

// Initialize
onMounted(() => {
  fetchAddresses()
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