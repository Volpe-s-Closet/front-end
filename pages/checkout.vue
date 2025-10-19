<template>
  <NuxtLayout name="checkout">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-center space-x-4">
          <div class="flex items-center">
            <div
              class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
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

            <form @submit.prevent="proceedToPayment" class="space-y-4">
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
                <select v-model="checkoutData.billing.country" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                </select>
              </div>

              <!-- Shipping Address -->
              <div class="mt-6">
                <label class="flex items-center">
                  <input v-model="sameAsShipping" type="checkbox"
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
                  <select v-model="checkoutData.shipping.country" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </div>
              </div>

              <BaseButton action="submit" text="Continue to Payment" full-width size="lg" />
            </form>
          </div>

          <!-- Payment Information -->
          <div v-if="currentStep === 2" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-6">Payment Information</h2>

            <form @submit.prevent="proceedToReview" class="space-y-6">
              <!-- Payment Method Notice -->
              <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div class="flex items-center">
                  <Icon name="heroicons:credit-card" class="h-5 w-5 text-blue-600 mr-2" />
                  <span class="text-sm text-blue-700 font-medium">Credit Card Payment Only</span>
                </div>
                <p class="text-sm text-blue-600 mt-1">For security and convenience, we only accept credit card payments.
                </p>
              </div>

              <!-- Saved Payment Methods -->
              <div v-if="savedPaymentMethods.length > 0">
                <div class="flex items-center justify-between mb-3">
                  <label class="block text-sm font-medium text-gray-700">Saved Payment Methods</label>
                  <NuxtLink to="/account/payment-methods" class="text-sm text-blue-600 hover:text-blue-500"
                    target="_blank">
                    Manage Cards
                  </NuxtLink>
                </div>
                <div class="space-y-3 mb-6">
                  <div v-for="method in savedPaymentMethods" :key="method.id"
                    class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    :class="{ 'border-blue-500 bg-blue-50': selectedPaymentMethodId === method.id }">
                    <label class="flex items-center cursor-pointer">
                      <input v-model="selectedPaymentMethodId" type="radio" :value="method.id"
                        class="text-blue-600 focus:ring-blue-500" @change="showNewCardForm = false">
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
                          <p v-if="method.billing_name" class="text-sm text-gray-600">
                            {{ method.billing_name }}
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Add New Card Option -->
                <div class="mb-6 border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  :class="{ 'border-blue-500 bg-blue-50': selectedPaymentMethodId === 'new' }">
                  <label class="flex items-center cursor-pointer">
                    <input v-model="selectedPaymentMethodId" type="radio" value="new"
                      class="text-blue-600 focus:ring-blue-500">
                    <div class="ml-3 flex items-center space-x-3">
                      <Icon name="heroicons:plus-circle" class="h-8 w-8 text-blue-600" />
                      <span class="font-medium text-gray-900">Add New Card</span>
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
                    class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    :class="{ 'border-blue-500 bg-blue-50': checkoutData.payment_method === gateway.id }">
                    <label class="flex items-center cursor-pointer">
                      <input v-model="checkoutData.payment_method" type="radio" :value="gateway.id"
                        class="text-blue-600 focus:ring-blue-500"
                        @change="checkoutData.payment_method_title = gateway.method_title">
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
              <div v-if="selectedPaymentMethodId === 'new' || savedPaymentMethods.length === 0"
                class="space-y-4 border-t pt-6">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ savedPaymentMethods.length > 0 ? 'Add New Card' : 'Card Details' }}
                </h3>



                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                  <input v-model="newCardForm.billing_name" type="text" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                  <input v-model="newCardForm.card_number" type="text" required maxlength="19"
                    placeholder="1234 5678 9012 3456" @input="formatCardNumber"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                    <input v-model="newCardForm.expiry" type="text" required placeholder="MM/YY" maxlength="5"
                      @input="formatExpiry"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                    <input v-model="newCardForm.cvv" type="text" required maxlength="4" placeholder="123"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  </div>
                </div>

                <div v-if="isAuthenticated" class="flex items-center">
                  <input v-model="newCardForm.save_card" type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                  <span class="ml-2 text-sm text-gray-700">Save this card for future purchases</span>
                </div>

                <!-- Save Card Button -->
                <div v-if="isAuthenticated" class="flex items-center justify-between">
                  <BaseButton v-if="!isNewCardSaved" @click="saveCardForCheckout" :loading="isSavingCard"
                    :disabled="!canSaveNewCard" variant="secondary" text="Save Card" icon="heroicons:credit-card" />
                  <div v-else class="flex items-center text-green-600">
                    <Icon name="heroicons:check-circle" class="h-5 w-5 mr-2" />
                    <span class="text-sm font-medium">Card saved successfully</span>
                  </div>
                </div>

                <!-- Security Notice -->
                <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div class="flex">
                    <Icon name="heroicons:shield-check" class="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                    <div class="text-sm text-yellow-800">
                      <p class="font-medium">Secure Payment</p>
                      <p>Your payment information is encrypted and secure. We use industry-standard security measures.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Payment Methods Available -->
              <div v-if="!hasPaymentMethods && isMounted">
                <div class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <Icon name="heroicons:exclamation-triangle" class="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                  <h3 class="text-lg font-medium text-gray-900 mb-2">No Payment Methods Available</h3>
                  <p class="text-gray-600 mb-4">Please contact support to complete your order.</p>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="!isMounted" class="space-y-3">
                <div class="animate-pulse">
                  <div class="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div class="border border-gray-200 rounded-lg p-4">
                    <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>



              <!-- Debug Info -->
              <div class="mb-4 p-3 bg-gray-100 rounded text-xs">
                <strong>Debug:</strong><br>
                Payment Gateway: {{ checkoutData.payment_method }}<br>
                Selected Card ID: {{ selectedPaymentMethodId }}<br>
                Saved Cards Count: {{ savedPaymentMethods.length }}<br>
                Is New Card Saved: {{ isNewCardSaved }}<br>
                Is Valid: {{ isPaymentMethodValid }}
              </div>

              <div class="flex space-x-4">
                <BaseButton @click="currentStep = 1" variant="secondary" text="Back" full-width size="lg" />
                <BaseButton action="submit" text="Review Order" full-width size="lg" :disabled="false" />
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
                  {{ checkoutData.billing.city }}, {{ checkoutData.billing.state }} {{ checkoutData.billing.postcode
                  }}<br>
                  {{ checkoutData.billing.country }}
                </p>
              </div>

              <div>
                <h3 class="font-medium mb-2">Payment Method</h3>
                <div v-if="selectedSavedCard" class="flex items-center space-x-3">
                  <Icon :name="getCardIcon(selectedSavedCard.card_type)" class="h-6 w-6 text-gray-600" />
                  <div>
                    <p class="text-gray-900 font-medium">
                      {{ selectedSavedCard.card_type }} ending in {{ selectedSavedCard.last4 }}
                    </p>
                    <p class="text-sm text-gray-600">
                      {{ selectedSavedCard.billing_name }}
                    </p>
                    <p class="text-sm text-gray-600">
                      via {{ selectedPaymentGateway?.method_title || checkoutData.payment_method_title }}
                    </p>
                  </div>
                </div>
                <div v-else-if="selectedPaymentMethodId === 'new' && newCardForm.card_number"
                  class="flex items-center space-x-3">
                  <Icon :name="getCardIcon(detectCardType(newCardForm.card_number))" class="h-6 w-6 text-gray-600" />
                  <div>
                    <p class="text-gray-900 font-medium">
                      {{ detectCardType(newCardForm.card_number) }} ending in {{ newCardForm.card_number.replace(/\s/g,
                        '').slice(-4) }}
                    </p>
                    <p class="text-sm text-gray-600">
                      {{ newCardForm.billing_name }}
                    </p>
                    <p class="text-sm text-gray-600">
                      via {{ selectedPaymentGateway?.method_title || checkoutData.payment_method_title }}
                    </p>
                  </div>
                </div>
                <div v-else-if="selectedPaymentGateway" class="flex items-center space-x-3">
                  <Icon name="heroicons:credit-card" class="h-6 w-6 text-gray-600" />
                  <div>
                    <p class="text-gray-900 font-medium">
                      {{ selectedPaymentGateway.method_title }}
                    </p>
                    <p v-if="selectedPaymentGateway.method_description" class="text-sm text-gray-600">
                      {{ selectedPaymentGateway.method_description }}
                    </p>
                  </div>
                </div>
                <p v-else class="text-gray-600">{{ checkoutData.payment_method_title || 'Credit Card' }}</p>
              </div>

              <div class="flex space-x-4">
                <BaseButton @click="currentStep = 2" variant="secondary" text="Back" full-width size="lg" />
                <BaseButton @click="placeOrder" :loading="isPlacingOrder" :disabled="isPlacingOrder" variant="success"
                  text="Place Order" full-width size="lg" />
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold mb-6">Order Summary</h2>

          <template v-if="isMounted">
            <div class="space-y-4 mb-6">
              <div v-for="item in cartItems" :key="`${item.id}-${JSON.stringify(item.variation)}`"
                class="flex items-center space-x-3">
                <img :src="getCartItemImage(item)" :alt="item.name" class="w-16 h-16 object-cover rounded"
                  @error="handleImageError">
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
const availablePaymentGateways = ref([])
const savedPaymentMethods = ref([])
const selectedPaymentMethodId = ref(null)
const showNewCardForm = ref(false)
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
  console.log('Validation check:', {
    paymentMethod: checkoutData.value.payment_method,
    selectedId: selectedPaymentMethodId.value,
    savedCount: savedPaymentMethods.value.length,
    isNewSaved: isNewCardSaved.value
  })

  // Must have a payment gateway selected
  if (!checkoutData.value.payment_method) {
    console.log('No payment gateway selected')
    return false
  }

  // If using a saved card (has ID and not 'new')
  if (selectedPaymentMethodId.value && selectedPaymentMethodId.value !== 'new') {
    console.log('Using saved card, valid')
    return true
  }

  // If no saved cards OR selected 'new', check new card requirements
  const needsNewCard = savedPaymentMethods.value.length === 0 || selectedPaymentMethodId.value === 'new'

  if (needsNewCard) {
    const formValid = !!(newCardForm.value.billing_name &&
      newCardForm.value.card_number &&
      newCardForm.value.expiry &&
      newCardForm.value.cvv)

    console.log('New card needed:', { formValid, isNewSaved: isNewCardSaved.value })
    return formValid && isNewCardSaved.value
  }

  console.log('Default false')
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
  } catch (error) {
    console.error('Error saving payment method:', error)
  }
}

const saveCardForCheckout = async () => {
  if (!isAuthenticated.value || !user.value) return

  // Check for duplicate cards (only check card number)
  const last4 = newCardForm.value.card_number.replace(/\s/g, '').slice(-4)

  const existingCard = savedPaymentMethods.value.find(method =>
    method.last4 === last4
  )

  if (existingCard) {
    alert('This card is already saved. Please select it from your saved cards or use a different card.')
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
    alert('Failed to save card. Please try again.')
  } finally {
    isSavingCard.value = false
  }
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

const detectCardType = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '')

  if (/^4/.test(number)) return 'Visa'
  if (/^5[1-5]/.test(number)) return 'Mastercard'
  if (/^3[47]/.test(number)) return 'American Express'
  if (/^6/.test(number)) return 'Discover'

  return 'Unknown'
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