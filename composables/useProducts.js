export const useProducts = () => {
    const config = useRuntimeConfig()

    // Generic API call function - now calls our server API routes
    const apiCall = async (endpoint, options = {}) => {
        try {
            const response = await $fetch(`/api/woocommerce/${endpoint}`, options)
            return response
        } catch (error) {
            console.error('WooCommerce API Error:', error)
            throw error
        }
    }

    // Products
    const getProducts = async (params = {}) => {
        return await apiCall('products', { query: params })
    }

    const getProduct = async (identifier) => {
        return await apiCall(`products/${identifier}`)
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
        return await apiCall('products/reviews', {
            query: { product: productId, ...params }
        })
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

        const params = {
            category: categoryIds.join(','),
            exclude: productId,
            per_page: limit,
            orderby: 'popularity'
        }
        return await apiCall('products', { query: params })
    }

    // Product attributes (for filters)
    const getProductAttributes = async () => {
        return await apiCall('products/attributes')
    }

    const getAttributeTerms = async (attributeId) => {
        return await apiCall(`products/attributes/${attributeId}/terms`)
    }



    // Product image utilities
    const getProductImage = (product) => {
        // Return the first image if available
        if (product.images && product.images.length > 0) {
            return product.images[0].src
        }

        // Use WooCommerce placeholder image
        const baseUrl = config.public.siteUrl || 'https://your-wordpress-site.com'
        return `${baseUrl}/wp-content/plugins/woocommerce/assets/images/placeholder.png`
    }

    const getCartItemImage = (cartItem) => {
        // Cart items have an image property set when added to cart
        if (cartItem.image) {
            return cartItem.image
        }

        // Fallback: check the stored product data
        if (cartItem.product && cartItem.product.images && cartItem.product.images.length > 0) {
            return cartItem.product.images[0].src
        }

        // If it's a variation, check the variation image
        if (cartItem.variation && cartItem.variation.image) {
            return cartItem.variation.image
        }

        // Fallback to WooCommerce placeholder image
        const baseUrl = config.public.siteUrl || 'https://your-wordpress-site.com'
        return `${baseUrl}/wp-content/plugins/woocommerce/assets/images/placeholder.png`
    }

    const handleImageError = (event) => {
        // Set WooCommerce placeholder when the main image fails to load
        const baseUrl = config.public.siteUrl || 'https://your-wordpress-site.com'
        event.target.src = `${baseUrl}/wp-content/plugins/woocommerce/assets/images/placeholder.png`
    }

    const getPlaceholderImage = () => {
        const baseUrl = config.public.siteUrl || 'https://your-wordpress-site.com'
        return `${baseUrl}/wp-content/plugins/woocommerce/assets/images/placeholder.png`
    }

    return {
        // Products
        getProducts,
        getProduct,
        searchProducts,
        getProductVariations,
        getProductVariation,
        getRelatedProducts,

        // Attributes
        getProductAttributes,
        getAttributeTerms,

        // Reviews
        getProductReviews,
        createProductReview,

        // Product images
        getProductImage,
        getCartItemImage,
        handleImageError,
        getPlaceholderImage
    }
}