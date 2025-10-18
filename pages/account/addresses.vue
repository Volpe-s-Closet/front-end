<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">My Addresses</h1>
      <p class="text-gray-600 mt-2">Manage your billing and shipping addresses</p>
    </div>

    <!-- Account Navigation -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Sidebar Navigation -->
      <div class="lg:col-span-1">
        <nav class="bg-white rounded-lg shadow-sm p-6">
          <ul class="space-y-2">
            <li>
              <NuxtLink 
                to="/account" 
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Icon name="heroicons:user" class="h-5 w-5 mr-3" />
                Profile
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/account/password" 
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Icon name="heroicons:lock-closed" class="h-5 w-5 mr-3" />
                Password
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/account/orders" 
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Icon name="heroicons:shopping-bag" class="h-5 w-5 mr-3" />
                Orders
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/account/addresses" 
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                :class="$route.path === '/account/addresses' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                <Icon name="heroicons:map-pin" class="h-5 w-5 mr-3" />
                Addresses
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/account/payment-methods" 
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Icon name="heroicons:credit-card" class="h-5 w-5 mr-3" />
                Payment Methods
              </NuxtLink>
            </li>
            <li>
              <button 
                @click="logout"
                class="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-red-700 hover:bg-red-50"
              >
                <Icon name="heroicons:arrow-right-on-rectangle" class="h-5 w-5 mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-3">
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
                Billing Address
              </h2>
              <button 
                @click="editAddress('billing')"
                class="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                {{ addresses.billing && hasAddressData(addresses.billing) ? 'Edit' : 'Add' }}
              </button>
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
              <p>No billing address added</p>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold flex items-center">
                <Icon name="heroicons:truck" class="h-5 w-5 mr-2 text-green-600" />
                Shipping Address
              </h2>
              <button 
                @click="editAddress('shipping')"
                class="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                {{ addresses.shipping && hasAddressData(addresses.shipping) ? 'Edit' : 'Add' }}
              </button>
            </div>

            <div v-if="addresses.shipping && hasAddressData(addresses.shipping)" class="space-y-2">
              <p class="font-medium">{{ getFullName(addresses.shipping) }}</p>
              <p v-if="addresses.shipping.company">{{ addresses.shipping.company }}</p>
              <p>{{ addresses.shipping.address_1 }}</p>
              <p v-if="addresses.shipping.address_2">{{ addresses.shipping.address_2 }}</p>
              <p>{{ addresses.shipping.city }}, {{ addresses.shipping.state }} {{ addresses.shipping.postcode }}</p>
              <p>{{ getCountryName(addresses.shipping.country) }}</p>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
              <Icon name="heroicons:map-pin" class="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No shipping address added</p>
            </div>

            <div v-if="addresses.billing && hasAddressData(addresses.billing)" class="mt-4 pt-4 border-t">
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="sameAsBilling"
                  @change="copyBillingToShipping"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >
                <span class="ml-2 text-sm text-gray-700">Same as billing address</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Address Form Modal -->
        <div v-if="showAddressForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold">
                  {{ editingAddress === 'billing' ? 'Edit Billing Address' : 'Edit Shipping Address' }}
                </h3>
                <button 
                  @click="closeAddressForm"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="heroicons:x-mark" class="h-6 w-6" />
                </button>
              </div>

              <form @submit.prevent="saveAddress" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      v-model="addressForm.first_name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      v-model="addressForm.last_name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    v-model="addressForm.company"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                  <input
                    v-model="addressForm.address_1"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                  <input
                    v-model="addressForm.address_2"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      v-model="addressForm.city"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
                    <input
                      v-model="addressForm.state"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
                    <input
                      v-model="addressForm.postcode"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <select
                    v-model="addressForm.country"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Country</option>
                    <option v-for="country in countries" :key="country.code" :value="country.code">
                      {{ country.name }}
                    </option>
                  </select>
                </div>

                <div v-if="editingAddress === 'billing'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    v-model="addressForm.phone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>

                <div class="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    :disabled="saving"
                    class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                  >
                    <Icon v-if="saving" name="heroicons:arrow-path" class="h-4 w-4 animate-spin inline mr-2" />
                    {{ saving ? 'Saving...' : 'Save Address' }}
                  </button>
                  <button
                    type="button"
                    @click="closeAddressForm"
                    class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { user, logout } = useAuth()
const { getCustomer, updateCustomer } = useWooCommerce()

// SEO
useHead({
  title: 'My Addresses - Your Store',
  meta: [
    { name: 'description', content: 'Manage your billing and shipping addresses.' }
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
  if (!user.value) return

  try {
    const customer = await getCustomer(user.value.id)
    addresses.value = {
      billing: customer.billing || {},
      shipping: customer.shipping || {}
    }
  } catch (error) {
    console.error('Error fetching addresses:', error)
    errorMessage.value = 'Failed to load addresses'
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
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const updateData = {}
    updateData[editingAddress.value] = { ...addressForm.value }

    await updateCustomer(user.value.id, updateData)
    
    // Update local addresses
    addresses.value[editingAddress.value] = { ...addressForm.value }
    
    successMessage.value = `${editingAddress.value === 'billing' ? 'Billing' : 'Shipping'} address updated successfully!`
    closeAddressForm()
    
  } catch (error) {
    console.error('Error saving address:', error)
    errorMessage.value = 'Failed to save address. Please try again.'
  } finally {
    saving.value = false
  }
}

const copyBillingToShipping = () => {
  if (sameAsBilling.value && addresses.value.billing) {
    const billingCopy = { ...addresses.value.billing }
    delete billingCopy.phone // Remove phone from shipping address
    addresses.value.shipping = billingCopy
    
    // Save to server
    updateCustomer(user.value.id, { shipping: billingCopy })
      .then(() => {
        successMessage.value = 'Shipping address updated to match billing address!'
      })
      .catch(error => {
        console.error('Error copying address:', error)
        errorMessage.value = 'Failed to update shipping address'
        sameAsBilling.value = false
      })
  }
}

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