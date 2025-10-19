export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  const { woocommerceKey, woocommerceSecret, siteUrl } = validateWooCommerceConfig(config)
  const credentials = createWooCommerceAuth(woocommerceKey, woocommerceSecret)
  
  try {
    // If review has an ID, it's an update
    if (body.id) {
      const reviewId = body.id
      delete body.id // Remove ID from body for the update
      
      const response = await $fetch(`${siteUrl}/wp-json/wc/v3/products/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        },
        body: body
      })
      
      return response
    } else {
      // Create new review
      const response = await $fetch(`${siteUrl}/wp-json/wc/v3/products/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        },
        body: body
      })
      
      return response
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to create/update product review'
    })
  }
})