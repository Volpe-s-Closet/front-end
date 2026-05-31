<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ $t('auth.register.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ $t('auth.register.or') }}
          <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            {{ $t('auth.register.signInExisting') }}
          </NuxtLink>
        </p>
      </div>

      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="first-name" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('auth.register.firstName') }} *
              </label>
              <input
                id="first-name"
                v-model="registerForm.firstName"
                name="first-name"
                type="text"
                required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                :placeholder="$t('auth.register.firstName')"
              >
            </div>
            <div>
              <label for="last-name" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('auth.register.lastName') }} *
              </label>
              <input
                id="last-name"
                v-model="registerForm.lastName"
                name="last-name"
                type="text"
                required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                :placeholder="$t('auth.register.lastName')"
              >
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.register.email') }} *
            </label>
            <input
              id="email"
              v-model="registerForm.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.register.email')"
            >
          </div>

          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.register.username') }} *
            </label>
            <input
              id="username"
              v-model="registerForm.username"
              name="username"
              type="text"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.register.username')"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.register.password') }} *
            </label>
            <input
              id="password"
              v-model="registerForm.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.register.password')"
            >
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.register.confirmPassword') }} *
            </label>
            <input
              id="confirm-password"
              v-model="registerForm.confirmPassword"
              name="confirm-password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.register.confirmPassword')"
            >
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="agree-terms"
            v-model="registerForm.agreeTerms"
            name="agree-terms"
            type="checkbox"
            required
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          >
          <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
            {{ $t('auth.register.agreeIntro') }}
            <NuxtLink to="/terms" class="text-blue-600 hover:text-blue-500">{{ $t('auth.register.termsOfService') }}</NuxtLink>
            {{ $t('auth.register.and') }}
            <NuxtLink to="/privacy" class="text-blue-600 hover:text-blue-500">{{ $t('auth.register.privacyPolicy') }}</NuxtLink>
          </label>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
          </div>
        </div>

        <div v-if="success" class="bg-green-50 border border-green-200 rounded-md p-4">
          <div class="flex">
            <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-400" />
            <div class="ml-3">
              <p class="text-sm text-green-800">{{ success }}</p>
            </div>
          </div>
        </div>

        <div>
          <BaseButton
            action="submit"
            :loading="loading"
            :text="$t('auth.register.submit')"
            full-width
          />
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            {{ $t('auth.register.haveAccount') }}
            <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
              {{ $t('auth.register.signInHere') }}
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'guest'
})

const { t } = useI18n()
const { register } = useAuth()

useHead({
  title: () => t('auth.register.title')
})

const registerForm = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  error.value = ''
  success.value = ''

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    error.value = t('auth.register.errors.passwordsMismatch')
    return
  }

  if (registerForm.value.password.length < 6) {
    error.value = t('auth.register.errors.passwordTooShort')
    return
  }

  if (!registerForm.value.agreeTerms) {
    error.value = t('auth.register.errors.agreeTerms')
    return
  }

  loading.value = true

  try {
    const userData = {
      username: registerForm.value.username,
      email: registerForm.value.email,
      password: registerForm.value.password,
      first_name: registerForm.value.firstName,
      last_name: registerForm.value.lastName,
      roles: ['customer']
    }

    const result = await register(userData)

    if (result.success) {
      success.value = t('auth.register.success')
      registerForm.value = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      }

      setTimeout(() => {
        navigateTo('/login')
      }, 3000)
    } else {
      error.value = result.error || t('auth.register.errors.failed')
    }
  } catch (err) {
    error.value = t('auth.register.errors.unexpected')
    console.error('Registration error:', err)
  } finally {
    loading.value = false
  }
}
</script>
