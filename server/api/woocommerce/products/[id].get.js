export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  
  const { woocommerceKey, woocommerceSecret, siteUrl } = validateWooCommerceConfig(config)
  const credentials = createWooCommerceAuth(woocommerceKey, woocommerceSecret)
  
  try {
    // If id is numeric, fetch by ID, otherwise fetch by slug
    if (/^\d+$/.test(id)) {
      const response = await $fetch(`${siteUrl}/wp-json/wc/v3/products/${id}`, {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      })
      return response
    } else {
      // Fetch by slug
      const response = await $fetch(`${siteUrl}/wp-json/wc/v3/products?slug=${id}`, {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      })
      return response.length > 0 ? response[0] : null
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch product'
    })
  }
})