export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    const { woocommerceKey, woocommerceSecret, siteUrl } = validateWooCommerceConfig(config)
    const credentials = createWooCommerceAuth(woocommerceKey, woocommerceSecret)

    try {
        const response = await $fetch(`${siteUrl}/wp-json/wc/v3/payment_gateways`, {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        })

        // Filter to only show card-based payment gateways that are enabled
        const cardGateways = response.filter(gateway =>
            gateway.enabled &&
            (gateway.id === 'stripe' ||
                gateway.id === 'mollie_wc_gateway_creditcard' ||
                gateway.id === 'square_credit_card' ||
                gateway.method_title?.toLowerCase().includes('card') ||
                gateway.method_title?.toLowerCase().includes('credit'))
        )

        return cardGateways
    } catch (error) {
        console.error('WooCommerce API Error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || 'Failed to fetch payment gateways'
        })
    }
})