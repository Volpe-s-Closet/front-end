export const useWooCommerce = () => {
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

    // Categories state management
    const categories = ref([])
    const categoriesLoading = ref(false)
    const categoriesError = ref(null)

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

    // Categories
    const getCategories = async (params = {}) => {
        return await apiCall('products/categories', { query: params })
    }

    const getCategory = async (id) => {
        return await apiCall(`products/categories/${id}`)
    }

    // Enhanced categories functionality with state management
    const fetchCategories = async (params = {}) => {
        try {
            categoriesLoading.value = true
            categoriesError.value = null

            // Default params to get main categories (exclude uncategorized)
            const defaultParams = {
                per_page: 100,
                hide_empty: true,
                exclude: 15, // Usually the "Uncategorized" category ID
                orderby: 'name',
                order: 'asc',
                ...params
            }

            const allCategories = await getCategories(defaultParams)

            // Organize categories with their children for hierarchical structure
            const categoryMap = new Map()
            const rootCategories = []

            // First pass: create map of all categories
            allCategories.forEach(cat => {
                categoryMap.set(cat.id, { ...cat, children: [] })
            })

            // Second pass: organize parent-child relationships
            allCategories.forEach(cat => {
                if (cat.parent === 0) {
                    rootCategories.push(categoryMap.get(cat.id))
                } else {
                    const parent = categoryMap.get(cat.parent)
                    if (parent) {
                        parent.children.push(categoryMap.get(cat.id))
                    }
                }
            })

            categories.value = rootCategories

            return categories.value
        } catch (err) {
            categoriesError.value = err
            console.error('Error fetching categories:', err)
            return []
        } finally {
            categoriesLoading.value = false
        }
    }

    // Format categories for dropdown component
    const getCategoriesForDropdown = () => {
        return categories.value.map(category => ({
            key: category.id,
            label: category.name,
            action: () => navigateTo(`/category/${category.slug}`)
        }))
    }

    // Get category by slug
    const getCategoryBySlug = (slug) => {
        return categories.value.find(cat => cat.slug === slug)
    }

    // Get category by ID
    const getCategoryById = (id) => {
        return categories.value.find(cat => cat.id === id)
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

    const createCustomer = async (customerData) => {
        return await apiCall('customers', {
            method: 'POST',
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

        // Categories (API calls)
        getCategories,
        getCategory,

        // Categories (state management)
        categories: readonly(categories),
        categoriesLoading: readonly(categoriesLoading),
        categoriesError: readonly(categoriesError),
        fetchCategories,
        getCategoriesForDropdown,
        getCategoryBySlug,
        getCategoryById,

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
        updateCustomer,
        createCustomer
    }
}