<template>
  <NuxtLayout name="account">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-6">{{ $t('account.password.title') }}</h2>

          <!-- Success Message -->
          <div v-if="successMessage" class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            <div class="flex">
              <Icon name="heroicons:check-circle" class="h-5 w-5 mr-2" />
              {{ successMessage }}
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <div class="flex">
              <Icon name="heroicons:exclamation-circle" class="h-5 w-5 mr-2" />
              {{ errorMessage }}
            </div>
          </div>

          <form @submit.prevent="changePassword" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.password.currentPassword') }}</label>
              <input
                v-model="passwordData.current_password"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.current_password }"
              >
              <p v-if="errors.current_password" class="mt-1 text-sm text-red-600">{{ errors.current_password }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.password.newPassword') }}</label>
              <input
                v-model="passwordData.new_password"
                type="password"
                required
                minlength="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.new_password }"
              >
              <p v-if="errors.new_password" class="mt-1 text-sm text-red-600">{{ errors.new_password }}</p>
              <p class="mt-1 text-sm text-gray-600">{{ $t('account.password.minLength') }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.password.confirmPassword') }}</label>
              <input
                v-model="passwordData.confirm_password"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.confirm_password }"
              >
              <p v-if="errors.confirm_password" class="mt-1 text-sm text-red-600">{{ errors.confirm_password }}</p>
            </div>

            <!-- Password Strength Indicator -->
            <div v-if="passwordData.new_password" class="space-y-2">
              <div class="text-sm font-medium text-gray-700">{{ $t('account.password.strengthLabel') }}</div>
              <div class="flex space-x-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-2 flex-1 rounded"
                  :class="getStrengthBarClass(i)"
                ></div>
              </div>
              <div class="text-sm" :class="getStrengthTextClass()">
                {{ getStrengthText() }}
              </div>
            </div>

            <div class="flex space-x-4">
              <BaseButton
                action="save"
                :loading="updating"
                :disabled="updating || !isFormValid"
                :text="$t('account.password.submit')"
              />
              <BaseButton
                to="/account"
                variant="secondary"
                :text="$t('common.cancel')"
              />
            </div>
          </form>

          <!-- Security Tips -->
          <div class="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 class="text-sm font-medium text-blue-900 mb-2">{{ $t('account.password.tipsTitle') }}</h3>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>· {{ $t('account.password.tips.tip1') }}</li>
              <li>· {{ $t('account.password.tips.tip2') }}</li>
              <li>· {{ $t('account.password.tips.tip3') }}</li>
              <li>· {{ $t('account.password.tips.tip4') }}</li>
              <li>· {{ $t('account.password.tips.tip5') }}</li>
            </ul>
          </div>
        </div>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { resolveApiError } = useApiError()
const { user, changePassword: authChangePassword } = useAuth()

useHead({
  title: () => t('account.password.metaTitle'),
  meta: [
    { name: 'description', content: () => t('account.password.metaDescription') }
  ]
})

// Data
const updating = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const passwordData = ref({
  current_password: '',
  new_password: '',
  confirm_password: ''
})
const errors = ref({})

// Computed
const passwordStrength = computed(() => {
  const password = passwordData.value.new_password
  if (!password) return 0

  let strength = 0
  
  // Length check
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  
  // Character variety checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  return Math.min(strength, 4)
})

const isFormValid = computed(() => {
  return passwordData.value.current_password &&
         passwordData.value.new_password &&
         passwordData.value.confirm_password &&
         passwordData.value.new_password === passwordData.value.confirm_password &&
         passwordData.value.new_password.length >= 8
})

// Methods
const validateForm = () => {
  errors.value = {}

  if (!passwordData.value.current_password) {
    errors.value.current_password = t('account.password.errors.currentRequired')
  }

  if (!passwordData.value.new_password) {
    errors.value.new_password = t('account.password.errors.newRequired')
  } else if (passwordData.value.new_password.length < 8) {
    errors.value.new_password = t('account.password.errors.tooShort')
  }

  if (!passwordData.value.confirm_password) {
    errors.value.confirm_password = t('account.password.errors.confirmRequired')
  } else if (passwordData.value.new_password !== passwordData.value.confirm_password) {
    errors.value.confirm_password = t('account.password.errors.mismatch')
  }

  return Object.keys(errors.value).length === 0
}

const changePassword = async () => {
  if (!validateForm()) return

  updating.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await authChangePassword(
      passwordData.value.current_password,
      passwordData.value.new_password
    )

    if (result.success) {
      successMessage.value = t('account.password.success')

      // Reset form
      passwordData.value = {
        current_password: '',
        new_password: '',
        confirm_password: ''
      }
    } else {
      // Handle the case where API validation succeeds but password change isn't supported
      if (result.current_password_valid && result.redirect_url) {
        const baseMsg = resolveApiError(result, 'account.password.errors.failed')
        errorMessage.value = `${baseMsg} (${result.redirect_url})`
      } else {
        errorMessage.value = resolveApiError(result, 'account.password.errors.failed')
      }
    }

  } catch (error) {
    console.error('Error changing password:', error)
    errorMessage.value = resolveApiError(error, 'account.password.errors.failed')
  } finally {
    updating.value = false
  }
}

const getStrengthBarClass = (index) => {
  if (index <= passwordStrength.value) {
    if (passwordStrength.value <= 1) return 'bg-red-500'
    if (passwordStrength.value <= 2) return 'bg-yellow-500'
    if (passwordStrength.value <= 3) return 'bg-blue-500'
    return 'bg-green-500'
  }
  return 'bg-gray-200'
}

const getStrengthTextClass = () => {
  if (passwordStrength.value <= 1) return 'text-red-600'
  if (passwordStrength.value <= 2) return 'text-yellow-600'
  if (passwordStrength.value <= 3) return 'text-blue-600'
  return 'text-green-600'
}

const getStrengthText = () => {
  if (passwordStrength.value <= 1) return t('account.password.strength.weak')
  if (passwordStrength.value <= 2) return t('account.password.strength.fair')
  if (passwordStrength.value <= 3) return t('account.password.strength.good')
  return t('account.password.strength.strong')
}

// Clear messages when form changes
watch(passwordData, () => {
  if (successMessage.value || errorMessage.value) {
    successMessage.value = ''
    errorMessage.value = ''
  }
}, { deep: true })
</script>