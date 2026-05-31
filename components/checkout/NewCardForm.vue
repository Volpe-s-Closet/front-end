<template>
    <div class="space-y-4 border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-900">
            {{ hasExistingCards ? $t('checkout.payment.addNewCardSection') : $t('checkout.payment.cardDetails') }}
        </h3>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('checkout.payment.cardholderName') }} *</label>
            <input v-model="newCardForm.billing_name" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('checkout.payment.cardNumber') }} *</label>
            <input v-model="newCardForm.card_number" type="text" required maxlength="19"
                placeholder="1234 5678 9012 3456" @input="formatCardNumber"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('checkout.payment.expiryDate') }} *</label>
                <input v-model="newCardForm.expiry" type="text" required placeholder="MM/YY" maxlength="5"
                    @input="formatExpiry"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('checkout.payment.cvv') }} *</label>
                <input v-model="newCardForm.cvv" type="text" required maxlength="4" placeholder="123"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
        </div>

        <div v-if="isAuthenticated" class="flex items-center">
            <input v-model="newCardForm.save_card" type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
            <span class="ml-2 text-sm text-gray-700">{{ $t('checkout.payment.saveCardForFuture') }}</span>
        </div>

        <!-- Save Card Button -->
        <div v-if="isAuthenticated" class="flex items-center justify-between">
            <BaseButton v-if="!isNewCardSaved" @click="$emit('saveCard')" :loading="isSavingCard"
                :disabled="!canSaveNewCard" variant="secondary" :text="$t('checkout.payment.saveCard')" icon="heroicons:credit-card" />
            <div v-else class="flex items-center text-green-600">
                <Icon name="heroicons:check-circle" class="h-5 w-5 mr-2" />
                <span class="text-sm font-medium">{{ $t('checkout.payment.cardSaved') }}</span>
            </div>
        </div>

        <!-- Security Notice -->
        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div class="flex">
                <Icon name="heroicons:shield-check" class="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                <div class="text-sm text-yellow-800">
                    <p class="font-medium">{{ $t('checkout.payment.secure') }}</p>
                    <p>{{ $t('checkout.payment.secureHint') }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    newCardForm: {
        type: Object,
        required: true
    },
    isAuthenticated: {
        type: Boolean,
        default: false
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
    hasExistingCards: {
        type: Boolean,
        default: false
    }
})

defineEmits(['saveCard', 'update:newCardForm'])

const formatCardNumber = (event) => {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '')
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
    props.newCardForm.card_number = formattedValue
}

const formatExpiry = (event) => {
    let value = event.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4)
    }
    props.newCardForm.expiry = value
}
</script>
