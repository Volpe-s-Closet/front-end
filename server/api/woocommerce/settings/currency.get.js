export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
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
    const response = await $fetch(`${woocommerceUrl}/wp-json/wc/v3/settings/general`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    })
    
    // Extract currency settings from WooCommerce response
    const settings = {}
    response.forEach(setting => {
      switch (setting.id) {
        case 'woocommerce_currency':
          settings.currency = setting.value
          break
        case 'woocommerce_currency_pos':
          settings.position = setting.value
          break
        case 'woocommerce_price_decimal_sep':
          settings.decimal_separator = setting.value
          break
        case 'woocommerce_price_thousand_sep':
          settings.thousand_separator = setting.value
          break
        case 'woocommerce_price_num_decimals':
          settings.decimals = parseInt(setting.value)
          break
      }
    })
    
    // Add currency symbol
    const currencySymbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'CHF': 'CHF',
      'CNY': '¥',
      'SEK': 'kr',
      'NZD': 'NZ$'
    }
    
    settings.symbol = currencySymbols[settings.currency] || settings.currency
    
    return settings
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch currency settings'
    })
  }
})