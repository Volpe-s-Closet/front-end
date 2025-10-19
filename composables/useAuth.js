export const useAuth = () => {
  const user = useState('auth.user', () => null)
  const token = useState('auth.token', () => null)
  const isAuthenticated = computed(() => !!token.value)
  const isInitialized = useState('auth.initialized', () => false)

  // Watch for changes and sync to localStorage
  if (process.client) {
    watch(token, (newToken) => {
      if (newToken) {
        localStorage.setItem('auth_token', newToken)
      } else {
        localStorage.removeItem('auth_token')
      }
    })

    watch(user, (newUser) => {
      if (newUser) {
        localStorage.setItem('user_data', JSON.stringify(newUser))
      } else {
        localStorage.removeItem('user_data')
      }
    })
  }

  // Initialize auth from localStorage
  const initAuth = () => {
    if (process.client && !isInitialized.value) {
      try {
        const storedToken = localStorage.getItem('auth_token')
        const storedUser = localStorage.getItem('user_data')

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser)
          token.value = storedToken
          user.value = userData
        }

        isInitialized.value = true
      } catch (error) {
        console.error('Error initializing auth:', error)
        clearAuth()
        isInitialized.value = true
      }
    }
  }

  // Save auth data
  const saveAuth = (authToken, userData) => {
    token.value = authToken
    user.value = userData

    if (process.client) {
      try {
        localStorage.setItem('auth_token', authToken)
        localStorage.setItem('user_data', JSON.stringify(userData))
      } catch (error) {
        console.error('Error saving auth data:', error)
      }
    }
  }

  // Clear auth data
  const clearAuth = () => {
    token.value = null
    user.value = null

    if (process.client) {
      try {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      } catch (error) {
        console.error('Error clearing auth data:', error)
      }
    }
  }

  // Login function (to be used with JWT plugin)
  const login = async (email, password) => {
    try {
      const config = useRuntimeConfig()
      const response = await $fetch(`${config.public.siteUrl}/wp-json/jwt-auth/v1/token`, {
        method: 'POST',
        body: {
          username: email,
          password: password
        }
      })

      if (response.token) {
        // Handle different response structures
        let userData = response.user_data || response.data || response.user || null

        // If no user data in response, create basic user object
        if (!userData) {
          userData = {
            id: response.user_id || null,
            email: email,
            username: email,
            display_name: response.user_display_name || email
          }
        }

        saveAuth(response.token, userData)
        return { success: true, user: userData }
      } else {
        return { success: false, error: 'No token received from server' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message || 'Login failed' }
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
      // Use custom WordPress registration endpoint
      const response = await $fetch(`${config.public.siteUrl}/wp-json/wp/v2/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          first_name: userData.first_name,
          last_name: userData.last_name
        }
      })

      return { success: true, data: response }
    } catch (error) {
      console.error('Registration error:', error)
      let errorMessage = 'Registration failed. Please try again.'

      if (error.data?.message) {
        errorMessage = error.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      return { success: false, error: errorMessage }
    }
  }

  // Validate token
  const validateToken = async () => {
    if (!token.value) return false

    try {
      const config = useRuntimeConfig()
      const response = await $fetch(`${config.public.siteUrl}/wp-json/jwt-auth/v1/token/validate`, {
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
      const { getCustomer } = useCustomer()
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
      const { updateCustomer } = useCustomer()
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

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    if (!token.value || !user.value) return { success: false, error: 'Not authenticated' }

    try {
      const config = useRuntimeConfig()

      const response = await $fetch(`${config.public.siteUrl}/wp-json/wp/v2/users/${user.value.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`
        },
        body: {
          current_password: currentPassword,
          password: newPassword
        }
      })

      return { success: true, data: response }
    } catch (error) {
      console.error('Error changing password:', error)
      return { success: false, error: error.data?.message || error.message || 'Failed to change password' }
    }
  }



  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    isInitialized: readonly(isInitialized),
    login,
    logout,
    register,
    validateToken,
    getUserProfile,
    updateUserProfile,
    changePassword,
    initAuth
  }
}