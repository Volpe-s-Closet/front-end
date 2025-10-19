<template>
    <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-6">Payment Information</h2>

        <form @submit.prevent="$emit('proceed')" class="space-y-6">
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
                            <input :checked="selectedPaymentMethodId === method.id"
                                @change="$emit('update:selectedPaymentMethodId', method.id)" type="radio"
                                :value="method.id" class="text-blue-600 focus:ring-blue-500">
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
                        <input :checked="selectedPaymentMethodId === 'new'"
                            @change="$emit('update:selectedPaymentMethodId', 'new')" type="radio" value="new"
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
                            <input :checked="checkoutData.payment_method === gateway.id"
                                @change="handleGatewayChange(gateway)" type="radio" :value="gateway.id"
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
            <CheckoutNewCardForm v-if="selectedPaymentMethodId === 'new' || savedPaymentMethods.length === 0"
                :new-card-form="newCardForm" :is-authenticated="isAuthenticated" :is-new-card-saved="isNewCardSaved"
                :is-saving-card="isSavingCard" :can-save-new-card="canSaveNewCard"
                :has-existing-cards="savedPaymentMethods.length > 0" @save-card="$emit('saveCard')" />

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

            <div class="flex space-x-4">
                <BaseButton @click="$emit('back')" variant="secondary" text="Back" full-width size="lg" />
                <BaseButton action="submit" text="Review Order" full-width size="lg"
                    :disabled="!isPaymentMethodValid" />
            </div>
        </form>
    </div>
</template>

<script setup>
const { isAuthenticated } = useAuth()

const props = defineProps({
    checkoutData: {
        type: Object,
        required: true
    },
    savedPaymentMethods: {
        type: Array,
        default: () => []
    },
    selectedPaymentMethodId: {
        type: [String, Number],
        default: null
    },
    availablePaymentGateways: {
        type: Array,
        default: () => []
    },
    newCardForm: {
        type: Object,
        required: true
    },
    isNewCardSaved: {
        type: Boolean,
        default: false
    },
    isSavingCard: {
        type: Boolean,
        default: false
    },
    canSaveNewCard: {
        type: Boolean,
        default: false
    },
    hasPaymentMethods: {
        type: Boolean,
        default: false
    },
    isPaymentMethodValid: {
        type: Boolean,
        default: false
    },
    isMounted: {
        type: Boolean,
        default: false
    }
})

defineEmits(['proceed', 'back', 'saveCard', 'update:selectedPaymentMethodId', 'update:showNewCardForm'])

const getCardIcon = (cardType) => {
    const icons = {
        'Visa': 'heroicons:credit-card',
        'Mastercard': 'heroicons:credit-card',
        'American Express': 'heroicons:credit-card',
        'Discover': 'heroicons:credit-card'
    }
    return icons[cardType] || 'heroicons:credit-card'
}

const handleGatewayChange = (gateway) => {
    props.checkoutData.payment_method = gateway.id
    props.checkoutData.payment_method_title = gateway.method_title
}
</script>