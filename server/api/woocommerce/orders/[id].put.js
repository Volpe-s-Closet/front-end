export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  // Handle null/undefined order ID
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
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      body: body
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to update order'
    })
  }
})