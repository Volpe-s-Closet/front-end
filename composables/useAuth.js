export const useAuth = () => {
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = computed(() => !!token.value)

  // Initialize auth from localStorage
  const initAuth = () => {
    if (process.client) {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user_data')
      
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      }
    }
  }

  // Save auth data
  const saveAuth = (authToken, userData) => {
    if (process.client) {
      localStorage.setItem('auth_token', authToken)
      localStorage.setItem('user_data', JSON.stringify(userData))
    }
    token.value = authToken
    user.value = userData
  }

  // Clear auth data
  const clearAuth = () => {
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    }
    token.value = null
    user.value = null
  }

  // Login function (to be used with JWT plugin)
  const login = async (email, password) => {
    try {
      const config = useRuntimeConfig()
      const response = await $fetch(`${config.public.wordpressUrl}/wp-json/jwt-auth/v1/token`, {
        method: 'POST',
        body: {
          username: email,
          password: password
        }
      })

      if (response.token) {
        saveAuth(response.token, response.user_data)
        return { success: true, user: response.user_data }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  // Logout function
  const logout = () => {
    clearAuth()
    navigateTo('/')
  }

  // Register function
  const register = async (userData) => {
    try {
      const config = useRuntimeConfig()
      const response = await $fetch(`${config.public.wordpressUrl}/wp-json/wp/v2/users/register`, {
        method: 'POST',
        body: userData
      })

      return { success: true, data: response }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    }
  }

  // Validate token
  const validateToken = async () => {
    if (!token.value) return false

    try {
      const config = useRuntimeConfig()
      const response = await $fetch(`${config.public.wordpressUrl}/wp-json/jwt-auth/v1/token/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })

      return response.code === 'jwt_auth_valid_token'
    } catch (error) {
      clearAuth()
      return false
    }
  }

  // Get user profile
  const getUserProfile = async () => {
    if (!token.value || !user.value) return null

    try {
      const { getCustomer } = useWooCommerce()
      return await getCustomer(user.value.id)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  // Update user profile
  const updateUserProfile = async (profileData) => {
    if (!token.value || !user.value) return { success: false, error: 'Not authenticated' }

    try {
      const { updateCustomer } = useWooCommerce()
      const updatedUser = await updateCustomer(user.value.id, profileData)
      
      // Update local user data
      user.value = { ...user.value, ...updatedUser }
      if (process.client) {
        localStorage.setItem('user_data', JSON.stringify(user.value))
      }

      return { success: true, data: updatedUser }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { success: false, error: error.message }
    }
  }

  // Initialize on mount
  onMounted(() => {
    initAuth()
  })

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    login,
    logout,
    register,
    validateToken,
    getUserProfile,
    updateUserProfile
  }
}