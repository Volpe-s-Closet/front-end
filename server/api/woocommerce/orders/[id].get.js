export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  
  // Validate order ID
  if (!id || id === 'null' || id === 'undefined') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid order ID'
    })
  }
  
  const { woocommerceKey, woocommerceSecret, siteUrl } = validateWooCommerceConfig(config)
  const credentials = createWooCommerceAuth(woocommerceKey, woocommerceSecret)
  
  try {
    const response = await $fetch(`${siteUrl}/wp-json/wc/v3/orders/${id}`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 404,
      statusMessage: error.message || 'Order not found'
    })
  }
})