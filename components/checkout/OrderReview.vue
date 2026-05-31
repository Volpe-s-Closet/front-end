<template>
    <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-6">{{ $t('checkout.review.title') }}</h2>

        <div class="space-y-6">
            <div>
                <h3 class="font-medium mb-2">{{ $t('checkout.review.contactInformation') }}</h3>
                <p class="text-gray-600">{{ checkoutData.billing.email }}</p>
                <p class="text-gray-600">{{ checkoutData.billing.phone }}</p>
            </div>

            <div>
                <h3 class="font-medium mb-2">{{ $t('checkout.review.billingAddress') }}</h3>
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
                <h3 class="font-medium mb-2">{{ $t('checkout.review.paymentMethod') }}</h3>
                <div v-if="selectedSavedCard" class="flex items-center space-x-3">
                    <Icon :name="getCardIcon(selectedSavedCard.card_type)" class="h-6 w-6 text-gray-600" />
                    <div>
                        <p class="text-gray-900 font-medium">
                            {{ $t('checkout.payment.endingIn', { cardType: selectedSavedCard.card_type, last4: selectedSavedCard.last4 }) }}
                        </p>
                        <p class="text-sm text-gray-600">
                            {{ selectedSavedCard.billing_name }}
                        </p>
                        <p class="text-sm text-gray-600">
                            {{ $t('checkout.review.via', { gateway: selectedPaymentGateway?.method_title || checkoutData.payment_method_title }) }}
                        </p>
                    </div>
                </div>
                <div v-else-if="selectedPaymentMethodId === 'new' && newCardForm.card_number"
                    class="flex items-center space-x-3">
                    <Icon :name="getCardIcon(detectCardType(newCardForm.card_number))" class="h-6 w-6 text-gray-600" />
                    <div>
                        <p class="text-gray-900 font-medium">
                            {{ $t('checkout.payment.endingIn', { cardType: detectCardType(newCardForm.card_number), last4: newCardForm.card_number.replace(/\s/g, '').slice(-4) }) }}
                        </p>
                        <p class="text-sm text-gray-600">
                            {{ newCardForm.billing_name }}
                        </p>
                        <p class="text-sm text-gray-600">
                            {{ $t('checkout.review.via', { gateway: selectedPaymentGateway?.method_title || checkoutData.payment_method_title }) }}
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
                <p v-else class="text-gray-600">{{ checkoutData.payment_method_title || $t('checkout.review.creditCard') }}</p>
            </div>

            <div class="flex space-x-4">
                <BaseButton @click="$emit('back')" variant="secondary" :text="$t('common.back')" full-width size="lg" />
                <BaseButton @click="$emit('placeOrder')" :loading="isPlacingOrder" :disabled="isPlacingOrder"
                    variant="success" :text="$t('checkout.review.placeOrder')" full-width size="lg" />
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    checkoutData: {
        type: Object,
        required: true
    },
    selectedSavedCard: {
        type: Object,
        default: null
    },
    selectedPaymentMethodId: {
        type: [String, Number],
        default: null
    },
    newCardForm: {
        type: Object,
        required: true
    },
    selectedPaymentGateway: {
        type: Object,
        default: null
    },
    isPlacingOrder: {
        type: Boolean,
        default: false
    }
})

defineEmits(['back', 'placeOrder'])

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
</script>
