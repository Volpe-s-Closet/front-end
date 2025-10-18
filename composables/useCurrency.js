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

    // Fetch currency settings from WooCommerce via server API
    const fetchCurrencySettings = async () => {
        try {
            // Fetch WooCommerce currency settings via our server API
            const settings = await $fetch('/api/woocommerce/settings/currency')

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