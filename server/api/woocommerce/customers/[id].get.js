export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  
  // Handle null/undefined customer ID
  if (!id || id === 'null' || id === 'undefined') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid customer ID'
    })
  }
  
  const { woocommerceKey, woocommerceSecret } = config
  const { woocommerceUrl } = config.public
  
  if (!woocommerceKey || !woocommerceSecret || !woocommerceUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'WooCommerce API credentials not configured'
    })
  }
  
  const credentials = Buffer.from(`${woocommerceKey}:${woocommerceSecret}`).toString('base64')
  
  try {
    const response = await $fetch(`${woocommerceUrl}/wp-json/wc/v3/customers/${id}`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch customer'
    })
  }
})