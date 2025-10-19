export function createWooCommerceAuth(key, secret) {
  return btoa(`${key}:${secret}`)
}

export function validateWooCommerceConfig(config) {
  const { woocommerceKey, woocommerceSecret } = config
  const { siteUrl } = config.public
  
  if (!woocommerceKey || !woocommerceSecret || !siteUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'WooCommerce API credentials not configured'
    })
  }
  
  return { woocommerceKey, woocommerceSecret, siteUrl }
}