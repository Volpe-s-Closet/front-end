export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const { woocommerceKey, woocommerceSecret } = config
  const { siteUrl } = config.public
  
  if (!woocommerceKey || !woocommerceSecret || !siteUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'WooCommerce API credentials not configured'
    })
  }
  
  const credentials = Buffer.from(`${woocommerceKey}:${woocommerceSecret}`).toString('base64')
  
  try {
    const response = await $fetch(`${siteUrl}/wp-json/wc/v3/products/attributes`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch product attributes'
    })
  }
})