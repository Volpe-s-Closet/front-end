export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const { woocommerceKey, woocommerceSecret, siteUrl } = validateWooCommerceConfig(config)
  const credentials = createWooCommerceAuth(woocommerceKey, woocommerceSecret)
  
  try {
    const response = await $fetch(`${siteUrl}/wp-json/wc/v3/settings/general`, {
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