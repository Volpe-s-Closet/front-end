export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)

  // Validate order ID
  if (!id || id === 'null' || id === 'undefined') {
    throw createI18nError({
      statusCode: 400,
      i18nKey: 'errors.orderInvalidId',
      statusMessage: 'Invalid order ID'
    })
  }

  const { woocommerceKey, woocommerceSecret, siteUrl } = validateWooCommerceConfig(config)
  const credentials = createWooCommerceAuth(woocommerceKey, woocommerceSecret)

  try {
    // Get the order
    const response = await $fetch(`${siteUrl}/wp-json/wc/v3/orders/${id}`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    })

    // Optional: Validate customer ownership if customer ID is provided
    if (query.customer_id && response.customer_id) {
      const customerId = parseInt(query.customer_id)
      const orderCustomerId = parseInt(response.customer_id)

      if (customerId !== orderCustomerId) {
        throw createI18nError({
          statusCode: 403,
          i18nKey: 'errors.orderForbidden',
          statusMessage: 'You do not have permission to view this order'
        })
      }
    }

    // If order is refunded, try to fetch refund details
    if (response.status === 'refunded') {
      try {
        const refunds = await $fetch(`${siteUrl}/wp-json/wc/v3/orders/${id}/refunds`, {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
          }
        })

        // Add refunds to the response
        response.refunds = refunds

        // Calculate total refunded amount
        if (refunds && refunds.length > 0) {
          response.total_refunded = refunds.reduce((total, refund) => {
            return total + Math.abs(parseFloat(refund.amount || 0))
          }, 0)
        }
      } catch (refundError) {
        // Continue without refund details if fetch fails
      }
    }

    return response
  } catch (error) {

    // Handle createError calls (already i18n-aware)
    if (error.statusCode) {
      throw error
    }

    // Map upstream error status codes to i18n keys + English fallbacks. The
    // English statusMessage is preserved for server logs.
    let statusCode = 404
    let i18nKey = 'errors.orderForbiddenGeneric'
    let statusMessage = 'Order not found or you do not have permission to view it'

    if (error.status === 403) {
      statusCode = 403
      i18nKey = 'errors.orderForbidden'
      statusMessage = 'You do not have permission to view this order'
    } else if (error.status === 401) {
      statusCode = 401
      i18nKey = 'errors.authRequired'
      statusMessage = 'Authentication required'
    } else if (error.status === 404) {
      statusCode = 404
      i18nKey = 'errors.orderNotFound'
      statusMessage = 'Order not found'
    } else if (error.data?.message) {
      // Upstream provided a specific message — surface it but flag the generic key
      statusMessage = error.data.message
    } else if (error.message) {
      statusMessage = error.message
    }

    throw createI18nError({
      statusCode,
      i18nKey,
      statusMessage
    })
  }
})
