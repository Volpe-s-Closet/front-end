export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createI18nError({
      statusCode: 401,
      i18nKey: 'errors.authRequired',
      statusMessage: 'Authorization token required'
    })
  }

  const token = authHeader.replace('Bearer ', '')
  const { current_password, new_password, user_id, user_email } = body

  if (!current_password || !new_password || !user_id) {
    throw createI18nError({
      statusCode: 400,
      i18nKey: 'errors.passwordFieldsRequired',
      statusMessage: 'Current password, new password, and user ID are required'
    })
  }

  try {
    // First, validate the JWT token to get user info
    const tokenValidation = await $fetch(`${config.public.siteUrl}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (tokenValidation.code !== 'jwt_auth_valid_token') {
      throw createI18nError({
        statusCode: 401,
        i18nKey: 'errors.authTokenInvalid',
        statusMessage: 'Invalid or expired token'
      })
    }

    // Use email from request body (sent from client) or try to get from token
    const userData = tokenValidation.data || {}
    const userEmailFromToken = userData.user_email || userData.email
    const emailToUse = user_email || userEmailFromToken

    if (!emailToUse) {
      throw createI18nError({
        statusCode: 400,
        i18nKey: 'errors.passwordEmailMissing',
        statusMessage: 'Unable to determine user email for password validation'
      })
    }

    // Validate current password by attempting login
    try {
      const loginCheck = await $fetch(`${config.public.siteUrl}/wp-json/jwt-auth/v1/token`, {
        method: 'POST',
        body: {
          username: emailToUse,
          password: current_password
        }
      })

      if (!loginCheck.token) {
        throw createI18nError({
          statusCode: 400,
          i18nKey: 'errors.passwordIncorrect',
          statusMessage: 'Current password is incorrect'
        })
      }
    } catch (loginError) {
      throw createI18nError({
        statusCode: 400,
        i18nKey: 'errors.passwordIncorrect',
        statusMessage: 'Current password is incorrect'
      })
    }

    // Try to update password using WordPress REST API
    // This will work if the JWT plugin grants proper user edit capabilities
    try {
      await $fetch(`${config.public.siteUrl}/wp-json/wp/v2/users/me`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: {
          password: new_password
        }
      })

      return {
        success: true,
        i18nKey: 'errors.passwordUpdated',
        message: 'Password updated successfully'
      }
    } catch (meError) {
      // Try with direct user ID
      try {
        await $fetch(`${config.public.siteUrl}/wp-json/wp/v2/users/${user_id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: {
            password: new_password
          }
        })

        return {
          success: true,
          i18nKey: 'errors.passwordUpdated',
          message: 'Password updated successfully'
        }
      } catch (directError) {
        // If both fail, provide a helpful response
        return {
          success: false,
          i18nKey: 'errors.passwordChangeUnsupported',
          error: 'Password change not supported via API. Please use WordPress admin panel.',
          redirect_url: `${config.public.siteUrl}/wp-admin/profile.php`,
          current_password_valid: true
        }
      }
    }

  } catch (error) {
    console.error('Password change error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createI18nError({
      statusCode: 500,
      i18nKey: 'errors.passwordValidateFailed',
      statusMessage: error.message || 'Failed to validate password'
    })
  }
})
