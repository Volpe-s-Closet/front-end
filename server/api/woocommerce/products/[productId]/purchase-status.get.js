export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const productId = getRouterParam(event, 'productId')
  const query = getQuery(event)
  const customerId = query.customer_id
  
  if (!customerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer ID is required'
    })
  }

  const { woocommerceKey, woocommerceSecret, siteUrl } = validateWooCommerceConfig(config)
  const credentials = createWooCommerceAuth(woocommerceKey, woocommerceSecret)
  
  try {
    // Get customer's completed orders
    const orders = await $fetch(`${siteUrl}/wp-json/wc/v3/orders`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      query: {
        customer: customerId,
        status: 'completed',
        per_page: 100
      }
    })

    // Check if any order contains the product
    const hasPurchased = orders.some(order => 
      order.line_items.some(item => 
        parseInt(item.product_id) === parseInt(productId) || 
        parseInt(item.variation_id) === parseInt(productId)
      )
    )

    return {
      has_purchased: hasPurchased,
      product_id: productId,
      customer_id: customerId
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to check purchase status'
    })
  }
})