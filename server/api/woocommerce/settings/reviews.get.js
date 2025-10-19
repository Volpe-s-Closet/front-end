export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const { woocommerceKey, woocommerceSecret, siteUrl } = validateWooCommerceConfig(config)
  const credentials = createWooCommerceAuth(woocommerceKey, woocommerceSecret)
  
  try {
    // Get WooCommerce product settings
    const productSettings = await $fetch(`${siteUrl}/wp-json/wc/v3/settings/products`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    })

    // Find review-related settings
    const reviewSettings = {}
    
    productSettings.forEach(setting => {
      switch (setting.id) {
        case 'woocommerce_enable_reviews':
          reviewSettings.reviews_enabled = setting.value === 'yes'
          break
        case 'woocommerce_review_rating_verification_required':
          reviewSettings.purchase_verification_required = setting.value === 'yes'
          break
        case 'woocommerce_review_rating_verification_label':
          reviewSettings.verification_label = setting.value
          break
        case 'woocommerce_enable_review_rating':
          reviewSettings.ratings_enabled = setting.value === 'yes'
          break
      }
    })

    // Get general WordPress settings for comment moderation
    try {
      const generalSettings = await $fetch(`${siteUrl}/wp-json/wc/v3/settings/general`, {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      })

      generalSettings.forEach(setting => {
        switch (setting.id) {
          case 'comment_moderation':
            reviewSettings.moderation_required = setting.value === '1'
            break
        }
      })
    } catch (error) {
      console.log('Could not fetch general settings for moderation')
    }

    return {
      ...reviewSettings,
      // Default values if settings not found
      reviews_enabled: reviewSettings.reviews_enabled ?? true,
      purchase_verification_required: reviewSettings.purchase_verification_required ?? false,
      ratings_enabled: reviewSettings.ratings_enabled ?? true,
      moderation_required: reviewSettings.moderation_required ?? false,
      verification_label: reviewSettings.verification_label ?? 'Verified Purchase'
    }
  } catch (error) {
    // Return default settings if API call fails
    console.error('Failed to fetch review settings:', error)
    return {
      reviews_enabled: true,
      purchase_verification_required: false,
      ratings_enabled: true,
      moderation_required: false,
      verification_label: 'Verified Purchase'
    }
  }
})