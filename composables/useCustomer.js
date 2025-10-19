export const useCustomer = () => {
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

    // Image utilities for orders (placeholder image)
    const getPlaceholderImage = () => {
        const baseUrl = config.public.siteUrl
        return `${baseUrl}/wp-content/plugins/woocommerce/assets/images/placeholder.png`
    }

    return {
        // Orders
        getOrders,
        getOrder,
        createOrder,

        // Customers
        getCustomer,
        updateCustomer,
        createCustomer,

        // Utilities
        getPlaceholderImage
    }
}