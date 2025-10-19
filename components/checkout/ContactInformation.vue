<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
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
      <div v-else-if="isAuthenticated && checkoutData.billing.address_1"
        class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
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
          <NuxtLink to="/login?redirect=/checkout"
            class="text-sm font-medium text-blue-600 hover:text-blue-500">
            Log In
          </NuxtLink>
        </div>
      </div>
    </template>

    <form @submit.prevent="$emit('proceed')" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input v-model="checkoutData.billing.first_name" type="text" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input v-model="checkoutData.billing.last_name" type="text" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
        <input v-model="checkoutData.billing.email" type="email" required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <input v-model="checkoutData.billing.phone" type="tel"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
        <input v-model="checkoutData.billing.company" type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <h3 class="text-lg font-semibold mt-8 mb-4">Billing Address</h3>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
        <input v-model="checkoutData.billing.address_1" type="text" required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
        <input v-model="checkoutData.billing.address_2" type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <input v-model="checkoutData.billing.city" type="text" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
          <input v-model="checkoutData.billing.state" type="text" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
          <input v-model="checkoutData.billing.postcode" type="text" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Country *</label>
        <SelectBox
          v-model="checkoutData.billing.country"
          :options="[
            { value: 'US', label: 'United States' },
            { value: 'CA', label: 'Canada' },
            { value: 'GB', label: 'United Kingdom' }
          ]"
          placeholder="Select Country"
          button-class="w-full"
        />
      </div>

      <!-- Shipping Address -->
      <div class="mt-6">
        <label class="flex items-center">
          <input :checked="sameAsShipping" @change="$emit('update:sameAsShipping', $event.target.checked)" type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
          <span class="ml-2 text-sm text-gray-700">Ship to same address</span>
        </label>
      </div>

      <div v-if="!sameAsShipping" class="space-y-4">
        <h3 class="text-lg font-semibold mt-6 mb-4">Shipping Address</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input v-model="checkoutData.shipping.first_name" type="text" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input v-model="checkoutData.shipping.last_name" type="text" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
          <input v-model="checkoutData.shipping.company" type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input v-model="checkoutData.shipping.phone" type="tel"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
          <input v-model="checkoutData.shipping.address_1" type="text" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
          <input v-model="checkoutData.shipping.address_2" type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <input v-model="checkoutData.shipping.city" type="text" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
            <input v-model="checkoutData.shipping.state" type="text" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
            <input v-model="checkoutData.shipping.postcode" type="text" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Country *</label>
          <SelectBox
            v-model="checkoutData.shipping.country"
            :options="[
              { value: 'US', label: 'United States' },
              { value: 'CA', label: 'Canada' },
              { value: 'GB', label: 'United Kingdom' }
            ]"
            placeholder="Select Country"
            button-class="w-full"
          />
        </div>
      </div>

      <BaseButton action="submit" text="Continue to Payment" full-width size="lg" />
    </form>
  </div>
</template>

<script setup>
const { isAuthenticated } = useAuth()

defineProps({
  checkoutData: {
    type: Object,
    required: true
  },
  sameAsShipping: {
    type: Boolean,
    required: true
  },
  isLoadingUserData: {
    type: Boolean,
    default: false
  },
  isMounted: {
    type: Boolean,
    default: false
  }
})

defineEmits(['proceed', 'update:sameAsShipping'])
</script>