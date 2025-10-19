export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  const { woocommerceKey, woocommerceSecret, siteUrl } = validateWooCommerceConfig(config)
  const credentials = createWooCommerceAuth(woocommerceKey, woocommerceSecret)
  
  try {
    const queryString = new URLSearchParams(query).toString()
    const url = `${siteUrl}/wp-json/wc/v3/products/categories${queryString ? '?' + queryString : ''}`
    
    const response = await $fetch(url, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    })
    
    return response
  } catch (error) {
    console.error('WooCommerce API Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: `WooCommerce API Error: ${error.message || 'Failed to fetch product categories'}`
    })
  }
})