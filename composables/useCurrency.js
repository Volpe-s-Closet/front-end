export const useCurrency = () => {
    // Store currency settings from WooCommerce
    const currencySettings = useState('currency.settings', () => ({
        currency: 'EUR',
        symbol: '€',
        position: 'left',
        decimal_separator: '.',
        thousand_separator: ',',
        decimals: 2
    }))

    // Fetch currency settings from WooCommerce
    const fetchCurrencySettings = async () => {
        try {
            const config = useRuntimeConfig()
            const apiUrl = config.public.woocommerceUrl
            const consumerKey = config.public.woocommerceKey
            const consumerSecret = config.public.woocommerceSecret

            if (!apiUrl || !consumerKey || !consumerSecret) {
                console.warn('WooCommerce API credentials not configured, using default currency settings')
                return
            }

            const credentials = btoa(`${consumerKey}:${consumerSecret}`)

            // Fetch WooCommerce currency settings
            const response = await $fetch(`${apiUrl}/wp-json/wc/v3/settings/general`, {
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

            // Get currency symbol from WooCommerce or use common symbols
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

            // Update global state
            currencySettings.value = { ...currencySettings.value, ...settings }

            // Save to localStorage for persistence
            if (process.client) {
                localStorage.setItem('wc_currency_settings', JSON.stringify(currencySettings.value))
            }
        } catch (error) {
            console.error('Failed to fetch WooCommerce currency settings:', error)
        }
    }

    // Initialize currency settings from localStorage
    const initCurrency = () => {
        if (process.client) {
            const stored = localStorage.getItem('wc_currency_settings')
            if (stored) {
                try {
                    currencySettings.value = JSON.parse(stored)
                } catch (error) {
                    console.error('Failed to parse stored currency settings:', error)
                }
            }
        }
    }

    // Format price with WooCommerce currency settings
    const formatPrice = (price) => {
        if (!price && price !== 0) return ''

        const numericPrice = parseFloat(price)
        if (isNaN(numericPrice)) return price

        const settings = currencySettings.value

        // Format the number with proper separators
        let formattedNumber = numericPrice.toFixed(settings.decimals)

        // Apply thousand separator if needed
        if (settings.thousand_separator) {
            const parts = formattedNumber.split('.')
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, settings.thousand_separator)
            formattedNumber = parts.join(settings.decimal_separator)
        } else if (settings.decimal_separator !== '.') {
            formattedNumber = formattedNumber.replace('.', settings.decimal_separator)
        }

        // Position the currency symbol according to WooCommerce settings
        switch (settings.position) {
            case 'left':
                return `${settings.symbol}${formattedNumber}`
            case 'right':
                return `${formattedNumber}${settings.symbol}`
            case 'left_space':
                return `${settings.symbol} ${formattedNumber}`
            case 'right_space':
                return `${formattedNumber} ${settings.symbol}`
            default:
                return `${settings.symbol}${formattedNumber}`
        }
    }

    // Initialize on client side
    if (process.client) {
        initCurrency()

        // Fetch fresh settings if we don't have them or they're old (cache for 1 hour)
        const lastFetch = localStorage.getItem('wc_currency_last_fetch')
        const now = Date.now()
        const oneHour = 60 * 60 * 1000

        if (!lastFetch || (now - parseInt(lastFetch)) > oneHour) {
            fetchCurrencySettings().then(() => {
                if (process.client) {
                    localStorage.setItem('wc_currency_last_fetch', now.toString())
                }
            })
        }
    }

    return {
        currencySettings: readonly(currencySettings),
        formatPrice,
        fetchCurrencySettings,
        initCurrency
    }
}