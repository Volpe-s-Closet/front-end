export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)
  
  console.log('Server: Fetching order with ID:', id)
  console.log('Server: Query params:', query)
  
  // Validate order ID
  if (!id || id === 'null' || id === 'undefined') {
    console.error('Server: Invalid order ID')
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid order ID'
    })
  }
  
  const { woocommerceKey, woocommerceSecret, siteUrl } = validateWooCommerceConfig(config)
  const credentials = createWooCommerceAuth(woocommerceKey, woocommerceSecret)
  
  console.log('Server: Making request to WooCommerce API...')
  
  try {
    // Get the order
    const response = await $fetch(`${siteUrl}/wp-json/wc/v3/orders/${id}`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Server: Order retrieved successfully')
    console.log('Server: Order status:', response.status)
    console.log('Server: Order customer ID:', response.customer_id)
    
    // Optional: Validate customer ownership if customer ID is provided
    if (query.customer_id && response.customer_id) {
      const customerId = parseInt(query.customer_id)
      const orderCustomerId = parseInt(response.customer_id)
      
      console.log('Server: Validating customer ownership:', customerId, 'vs', orderCustomerId)
      
      if (customerId !== orderCustomerId) {
        console.error('Server: Customer ID mismatch')
        throw createError({
          statusCode: 403,
          statusMessage: 'You do not have permission to view this order'
        })
      }
    }
    
    // If order is refunded, try to fetch refund details
    if (response.status === 'refunded') {
      console.log('Server: Fetching refund details for refunded order')
      try {
        const refunds = await $fetch(`${siteUrl}/wp-json/wc/v3/orders/${id}/refunds`, {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
          }
        })
        
        console.log('Server: Refunds retrieved:', refunds)
        
        // Add refunds to the response
        response.refunds = refunds
        
        // Calculate total refunded amount
        if (refunds && refunds.length > 0) {
          response.total_refunded = refunds.reduce((total, refund) => {
            return total + Math.abs(parseFloat(refund.amount || 0))
          }, 0)
          console.log('Server: Total refunded amount:', response.total_refunded)
        }
      } catch (refundError) {
        console.warn('Server: Could not fetch refund details:', refundError)
        // Continue without refund details
      }
    }
    
    return response
  } catch (error) {
    console.error('Server: Error fetching order:', error)
    
    // Handle createError calls
    if (error.statusCode) {
      throw error
    }
    
    // Provide more detailed error information for other errors
    let statusCode = 404
    let statusMessage = 'Order not found or you do not have permission to view it'
    
    if (error.status === 403) {
      statusCode = 403
      statusMessage = 'You do not have permission to view this order'
    } else if (error.status === 401) {
      statusCode = 401
      statusMessage = 'Authentication required'
    } else if (error.status === 404) {
      statusCode = 404
      statusMessage = 'Order not found'
    } else if (error.data?.message) {
      statusMessage = error.data.message
    } else if (error.message) {
      statusMessage = error.message
    }
    
    throw createError({
      statusCode,
      statusMessage
    })
  }
})