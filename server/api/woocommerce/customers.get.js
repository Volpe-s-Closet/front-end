export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const { woocommerceKey, woocommerceSecret, siteUrl } = validateWooCommerceConfig(config)
  const credentials = createWooCommerceAuth(woocommerceKey, woocommerceSecret)

  try {
    const response = await $fetch(`${siteUrl}/wp-json/wc/v3/customers`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      query: query
    })

    return response
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch customers'
    })
  }
})