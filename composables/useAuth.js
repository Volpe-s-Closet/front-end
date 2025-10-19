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
            id: response.user_id || response.ID || null,
            email: email,
            username: email,
            display_name: response.user_display_name || email
          }
        }

        // Ensure we have a valid user ID - try multiple possible fields
        const possibleIds = [
          userData?.id,
          userData?.ID,
          userData?.user_id,
          response.user_id,
          response.ID,
          response.data?.user_id,
          response.data?.ID,
          response.data?.user?.id,  // This is where the ID actually is!
          response.data?.user?.ID
        ]

        const validId = possibleIds.find(id => id && id !== null && id !== 'null')
        
        if (validId) {
          userData.id = validId
          
          // Also store other user info from the response
          userData.email = response.user_email || email
          userData.username = response.user_nicename || email
          userData.display_name = response.user_display_name || email
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

    // Clear customer data if available
    if (process.client) {
      try {
        const { clearCustomerData } = useCustomer()
        clearCustomerData()
      } catch (error) {
        // Customer composable might not be available in all contexts
      }
    }

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

  // Validate token and get user data
  const validateTokenAndGetUser = async (tokenToValidate = null) => {
    const tokenValue = tokenToValidate || token.value
    if (!tokenValue) return null

    try {
      const config = useRuntimeConfig()
      const response = await $fetch(`${config.public.siteUrl}/wp-json/jwt-auth/v1/token/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenValue}`
        }
      })

      if (response.code === 'jwt_auth_valid_token') {
        const userData = response.data || response
        return userData
      }
      return null
    } catch (error) {
      if (!tokenToValidate) {
        clearAuth()
      }
      return null
    }
  }

  // Validate token
  const validateToken = async () => {
    const result = await validateTokenAndGetUser()
    return result !== null
  }

  // Refresh user data from token
  const refreshUserData = async () => {
    if (!token.value) return false

    try {
      const tokenData = await validateTokenAndGetUser()
      
      if (tokenData) {
        // Try different possible user ID fields
        const userId = tokenData.user_id || tokenData.ID || tokenData.id || tokenData.user?.ID
        
        if (userId) {
          // Update user data with fresh info from token
          const updatedUser = {
            ...user.value,
            id: userId,
            email: tokenData.user_email || tokenData.email || user.value.email,
            username: tokenData.user_login || tokenData.username || user.value.username,
            display_name: tokenData.user_display_name || tokenData.display_name || user.value.display_name
          }
          
          user.value = updatedUser
          if (process.client) {
            localStorage.setItem('user_data', JSON.stringify(updatedUser))
          }
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Error refreshing user data:', error)
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

  // Update user profile (now delegates to customer composable)
  const updateUserProfile = async (profileData, customerId = null) => {
    if (!token.value || !user.value) return { success: false, error: 'Not authenticated' }

    try {
      const { updateCustomerProfile } = useCustomer()
      const result = await updateCustomerProfile(profileData, user.value)

      if (result.success) {
        // Update local user data with relevant fields
        user.value = {
          ...user.value,
          first_name: result.data.first_name,
          last_name: result.data.last_name,
          email: result.data.email
        }

        if (process.client) {
          localStorage.setItem('user_data', JSON.stringify(user.value))
        }
      }

      return result
    } catch (error) {
      console.error('Error updating profile:', error)
      return { success: false, error: error.message }
    }
  }

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    if (!token.value || !user.value) return { success: false, error: 'Not authenticated' }

    // Get user ID using the same logic as profile updates
    const { customerData } = useCustomer()
    let userId = customerData.value?.id || user.value.id

    // Check if we have a valid ID
    if (!userId || userId === 'null') {
      const refreshed = await refreshUserData()
      
      // Try again after refresh
      userId = customerData.value?.id || user.value.id
      
      if (!userId || userId === 'null') {
        return { success: false, error: 'Invalid user ID. Please log out and log in again.' }
      }
    }

    try {
      // Use our server API route for password change
      const response = await $fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`
        },
        body: {
          current_password: currentPassword,
          new_password: newPassword,
          user_id: userId,
          user_email: user.value.email
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
    validateTokenAndGetUser,
    refreshUserData,
    getUserProfile,
    updateUserProfile,
    changePassword,
    initAuth
  }
}