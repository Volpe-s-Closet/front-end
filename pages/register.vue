<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </NuxtLink>
        </p>
      </div>
      
      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="first-name" class="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                id="first-name"
                v-model="registerForm.firstName"
                name="first-name"
                type="text"
                required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="First Name"
              >
            </div>
            <div>
              <label for="last-name" class="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                id="last-name"
                v-model="registerForm.lastName"
                name="last-name"
                type="text"
                required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Last Name"
              >
            </div>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              id="email"
              v-model="registerForm.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            >
          </div>
          
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <input
              id="username"
              v-model="registerForm.username"
              name="username"
              type="text"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Username"
            >
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              id="password"
              v-model="registerForm.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            >
          </div>
          
          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <input
              id="confirm-password"
              v-model="registerForm.confirmPassword"
              name="confirm-password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Confirm Password"
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
            I agree to the 
            <a href="#" class="text-blue-600 hover:text-blue-500">Terms of Service</a>
            and 
            <a href="#" class="text-blue-600 hover:text-blue-500">Privacy Policy</a>
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
            text="Create Account"
            full-width
          />
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
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

const { register } = useAuth()

// SEO
useHead({
  title: 'Register - Your Store',
  meta: [
    { name: 'description', content: 'Create a new account to start shopping and track your orders.' }
  ]
})

// Data
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

// Methods
const handleRegister = async () => {
  // Reset messages
  error.value = ''
  success.value = ''

  // Validation
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  if (registerForm.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }

  if (!registerForm.value.agreeTerms) {
    error.value = 'You must agree to the Terms of Service and Privacy Policy'
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
      success.value = 'Account created successfully! Please check your email to verify your account, then you can sign in.'
      // Reset form
      registerForm.value = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      }
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigateTo('/login')
      }, 3000)
    } else {
      error.value = result.error || 'Registration failed. Please try again.'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.'
    console.error('Registration error:', err)
  } finally {
    loading.value = false
  }
}
</script>