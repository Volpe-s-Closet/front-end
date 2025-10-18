export const useWooCommerce = () => {
    const config = useRuntimeConfig()

    // WooCommerce API configuration
    const apiUrl = config.public.woocommerceUrl || 'https://your-wordpress-site.com'
    const consumerKey = config.public.woocommerceKey
    const consumerSecret = config.public.woocommerceSecret

    // Create basic auth header for WooCommerce REST API
    const createAuthHeader = () => {
        const credentials = btoa(`${consumerKey}:${consumerSecret}`)
        return {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
        }
    }

    // Generic API call function
    const apiCall = async (endpoint, options = {}) => {
        try {
            const response = await $fetch(`${apiUrl}/wp-json/wc/v3/${endpoint}`, {
                headers: createAuthHeader(),
                ...options
            })
            return response
        } catch (error) {
            console.error('WooCommerce API Error:', error)
            throw error
        }
    }

    // Products
    const getProducts = async (params = {}) => {
        const queryString = new URLSearchParams(params).toString()
        return await apiCall(`products${queryString ? '?' + queryString : ''}`)
    }

    const getProduct = async (identifier) => {
        // If identifier is numeric, treat as ID, otherwise treat as slug
        if (/^\d+$/.test(identifier)) {
            return await apiCall(`products/${identifier}`)
        } else {
            // Fetch by slug
            const products = await apiCall(`products?slug=${identifier}`)
            return products.length > 0 ? products[0] : null
        }
    }

    const searchProducts = async (search, params = {}) => {
        return await getProducts({ search, ...params })
    }

    // Product variations
    const getProductVariations = async (productId) => {
        return await apiCall(`products/${productId}/variations`)
    }

    const getProductVariation = async (productId, variationId) => {
        return await apiCall(`products/${productId}/variations/${variationId}`)
    }

    // Product reviews
    const getProductReviews = async (productId, params = {}) => {
        const queryString = new URLSearchParams(params).toString()
        return await apiCall(`products/reviews?product=${productId}${queryString ? '&' + queryString : ''}`)
    }

    const createProductReview = async (reviewData) => {
        return await apiCall('products/reviews', {
            method: 'POST',
            body: reviewData
        })
    }

    // Related products (by category)
    const getRelatedProducts = async (productId, categoryIds = [], limit = 4) => {
        if (categoryIds.length === 0) return []

        const categoryQuery = categoryIds.map(id => `category=${id}`).join('&')
        return await apiCall(`products?${categoryQuery}&exclude=${productId}&per_page=${limit}&orderby=popularity`)
    }

    // Categories
    const getCategories = async (params = {}) => {
        const queryString = new URLSearchParams(params).toString()
        return await apiCall(`products/categories${queryString ? '?' + queryString : ''}`)
    }

    const getCategory = async (id) => {
        return await apiCall(`products/categories/${id}`)
    }

    // Product attributes (for filters)
    const getProductAttributes = async () => {
        return await apiCall('products/attributes')
    }

    const getAttributeTerms = async (attributeId) => {
        return await apiCall(`products/attributes/${attributeId}/terms`)
    }

    // Orders (requires authentication)
    const getOrders = async (customerId, params = {}) => {
        return await apiCall(`orders`, {
            query: { customer: customerId, ...params }
        })
    }

    const getOrder = async (orderId) => {
        return await apiCall(`orders/${orderId}`)
    }

    const createOrder = async (orderData) => {
        return await apiCall('orders', {
            method: 'POST',
            body: orderData
        })
    }

    // Customers (requires authentication)
    const getCustomer = async (customerId) => {
        return await apiCall(`customers/${customerId}`)
    }

    const updateCustomer = async (customerId, customerData) => {
        return await apiCall(`customers/${customerId}`, {
            method: 'PUT',
            body: customerData
        })
    }

    return {
        // Products
        getProducts,
        getProduct,
        searchProducts,
        getProductVariations,
        getProductVariation,
        getRelatedProducts,

        // Categories
        getCategories,
        getCategory,

        // Attributes
        getProductAttributes,
        getAttributeTerms,

        // Reviews
        getProductReviews,
        createProductReview,

        // Orders
        getOrders,
        getOrder,
        createOrder,

        // Customers
        getCustomer,
        updateCustomer
    }
}