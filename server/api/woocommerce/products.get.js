export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const { woocommerceKey, woocommerceSecret, siteUrl } = validateWooCommerceConfig(config)
  const credentials = createWooCommerceAuth(woocommerceKey, woocommerceSecret)

  try {
    // Filter out potentially problematic parameters
    const allowedParams = [
      'per_page', 'page', 'search', 'after', 'before', 'exclude', 'include',
      'offset', 'order', 'orderby', 'parent', 'parent_exclude', 'slug',
      'status', 'type', 'sku', 'featured', 'category', 'tag', 'shipping_class',
      'attribute', 'attribute_term', 'tax_class', 'on_sale', 'min_price',
      'max_price', 'stock_status'
    ]

    const filteredQuery = {}
    Object.keys(query).forEach(key => {
      if (allowedParams.includes(key)) {
        filteredQuery[key] = query[key]
      }
    })

    // Replace 'rand' orderby with 'date' as it's more reliable
    if (filteredQuery.orderby === 'rand') {
      filteredQuery.orderby = 'date'
      filteredQuery.order = 'desc'
    }

    const queryString = new URLSearchParams(filteredQuery).toString()
    const response = await $fetch(`${siteUrl}/wp-json/wc/v3/products${queryString ? '?' + queryString : ''}`, {
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
      statusMessage: error.message || 'Failed to fetch products'
    })
  }
})