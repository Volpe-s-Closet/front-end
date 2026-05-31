<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ $t('auth.login.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ $t('auth.login.or') }}
          <NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            {{ $t('auth.login.createAccount') }}
          </NuxtLink>
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">{{ $t('auth.login.emailAddress') }}</label>
            <input
              id="email"
              v-model="loginForm.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.login.emailAddress')"
            >
          </div>
          <div>
            <label for="password" class="sr-only">{{ $t('auth.login.password') }}</label>
            <input
              id="password"
              v-model="loginForm.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.login.password')"
            >
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="loginForm.rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              {{ $t('auth.login.rememberMe') }}
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
              {{ $t('auth.login.forgotPassword') }}
            </a>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
          </div>
        </div>

        <div>
          <BaseButton
            action="submit"
            :loading="loading"
            :text="$t('auth.login.submit')"
            full-width
          />
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            {{ $t('auth.login.noAccount') }}
            <NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-500">
              {{ $t('auth.login.signUpHere') }}
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
const { login, isAuthenticated } = useAuth()

useHead({
  title: () => t('auth.login.title')
})

const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await login(loginForm.value.email, loginForm.value.password)

    if (result.success) {
      const returnUrl = useRoute().query.return || '/account'
      navigateTo(returnUrl)
    } else {
      error.value = result.error || t('auth.login.errors.failed')
    }
  } catch (err) {
    error.value = t('auth.login.errors.unexpected')
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>
