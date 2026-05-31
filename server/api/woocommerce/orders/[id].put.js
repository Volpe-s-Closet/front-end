export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  // Handle null/undefined order ID
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
    // Preserve specific status codes from the upstream call (e.g. 403/404)
    // so the client can branch on them, while still attaching an i18n key.
    let statusCode = error.statusCode || error.status || 500
    let i18nKey = 'errors.orderUpdateFailed'

    if (statusCode === 403) {
      i18nKey = 'errors.orderForbidden'
    } else if (statusCode === 404) {
      i18nKey = 'errors.orderNotFound'
    } else if (statusCode === 401) {
      i18nKey = 'errors.authRequired'
    }

    throw createI18nError({
      statusCode,
      i18nKey,
      statusMessage: error.message || 'Failed to update order'
    })
  }
})
