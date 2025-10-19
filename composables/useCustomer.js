export const useCustomer = () => {
    const config = useRuntimeConfig()

    // Reactive state for customer data
    const customerData = useState('customer.data', () => null)
    const customerOrders = useState('customer.orders', () => [])
    const isLoadingProfile = useState('customer.loadingProfile', () => false)
    const isLoadingOrders = useState('customer.loadingOrders', () => false)

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

    // Find customer by email (useful when user ID doesn't match customer ID)
    const getCustomerByEmail = async (email) => {
        try {
            const customers = await apiCall('customers', {
                query: { email: email, per_page: 1 }
            })
            return customers.length > 0 ? customers[0] : null
        } catch (error) {
            console.error('Error finding customer by email:', error)
            return null
        }
    }

    const updateCustomer = async (customerId, customerData) => {
        // Validate customer ID before making the API call
        if (!customerId || customerId === 'null' || customerId === 'undefined' || customerId === null) {
            throw new Error('Invalid customer ID provided for update')
        }
        
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

    // Enhanced customer profile management
    const findCustomerProfile = async (user) => {
        if (!user) {
            console.warn('No user provided for customer profile lookup')
            return null
        }

        let customer = null

        // First try to get customer by user ID
        if (user.id) {
            try {
                customer = await getCustomer(user.id)
            } catch (error) {
                console.log('Customer not found by ID, trying email lookup...')
            }
        }

        // If that fails, try to find customer by email
        if (!customer && user.email) {
            try {
                customer = await getCustomerByEmail(user.email)
            } catch (error) {
                console.log('Customer not found by email either')
            }
        }

        return customer
    }

    const loadCustomerProfile = async (user) => {
        if (!user) {
            console.warn('No user available for fetching customer profile')
            isLoadingProfile.value = false
            return null
        }

        try {
            isLoadingProfile.value = true
            const customer = await findCustomerProfile(user)
            
            if (customer) {
                customerData.value = customer
                return customer
            } else {
                console.log('No WooCommerce customer found, using WordPress user data')
                // Create a customer-like object from user data
                customerData.value = {
                    id: user.id,
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    email: user.email || '',
                    date_created: user.date_created || new Date().toISOString(),
                    billing: { phone: '' },
                    meta_data: []
                }
                return customerData.value
            }
        } catch (error) {
            console.error('Error loading customer profile:', error)
            return null
        } finally {
            isLoadingProfile.value = false
        }
    }

    const loadCustomerOrders = async (user, params = { per_page: 5 }) => {
        if (!user) {
            console.warn('No user available for fetching orders')
            isLoadingOrders.value = false
            return []
        }

        try {
            isLoadingOrders.value = true
            
            // Use customer ID if available, otherwise fall back to user ID
            const customerId = customerData.value?.id || user.id
            
            if (customerId) {
                const orders = await getOrders(customerId, params)
                customerOrders.value = orders
                return orders
            } else {
                console.warn('No customer ID available for fetching orders')
                customerOrders.value = []
                return []
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
            customerOrders.value = []
            return []
        } finally {
            isLoadingOrders.value = false
        }
    }

    const getProfileData = (customer = null, user = null) => {
        const source = customer || customerData.value || user
        if (!source) return null

        return {
            first_name: source.first_name || '',
            last_name: source.last_name || '',
            email: source.email || '',
            phone: source.billing?.phone || '',
            date_of_birth: source.meta_data?.find(meta => meta.key === 'date_of_birth')?.value || ''
        }
    }

    const prepareCustomerUpdateData = (profileData, existingCustomer = null) => {
        const customer = existingCustomer || customerData.value
        
        const updateData = {
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: profileData.email,
            billing: {
                ...customer?.billing,
                first_name: profileData.first_name,
                last_name: profileData.last_name,
                email: profileData.email,
                phone: profileData.phone
            },
            shipping: {
                ...customer?.shipping,
                first_name: profileData.first_name,
                last_name: profileData.last_name
            }
        }

        // Add date of birth as meta data if provided
        if (profileData.date_of_birth) {
            updateData.meta_data = [
                ...(customer?.meta_data || []).filter(meta => meta.key !== 'date_of_birth'),
                {
                    key: 'date_of_birth',
                    value: profileData.date_of_birth
                }
            ]
        }

        return updateData
    }

    const updateCustomerProfile = async (profileData, user) => {
        if (!user) {
            return { success: false, error: 'No user provided' }
        }

        try {
            const customerId = customerData.value?.id || user.id
            const updateData = prepareCustomerUpdateData(profileData)
            
            const updatedCustomer = await updateCustomer(customerId, updateData)
            
            // Update local state
            customerData.value = { ...customerData.value, ...updatedCustomer }
            
            return { success: true, data: updatedCustomer }
        } catch (error) {
            console.error('Error updating customer profile:', error)
            return { success: false, error: error.message }
        }
    }

    // Computed properties
    const displayCustomer = computed(() => customerData.value)
    const recentOrders = computed(() => customerOrders.value.slice(0, 5))
    const totalOrders = computed(() => customerOrders.value.length)
    const totalSpent = computed(() => {
        return customerOrders.value.reduce((total, order) => {
            return total + parseFloat(order.total || 0)
        }, 0)
    })

    // Utility functions
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString()
    }

    const getOrderStatusClass = (status) => {
        const classes = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'processing': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
            'refunded': 'bg-gray-100 text-gray-800'
        }
        return classes[status] || 'bg-gray-100 text-gray-800'
    }

    // Image utilities for orders (placeholder image)
    const getPlaceholderImage = () => {
        const baseUrl = config.public.siteUrl
        return `${baseUrl}/wp-content/plugins/woocommerce/assets/images/placeholder.png`
    }

    // Clear customer data (useful for logout)
    const clearCustomerData = () => {
        customerData.value = null
        customerOrders.value = []
        isLoadingProfile.value = false
        isLoadingOrders.value = false
    }

    return {
        // State
        customerData: readonly(customerData),
        customerOrders: readonly(customerOrders),
        isLoadingProfile: readonly(isLoadingProfile),
        isLoadingOrders: readonly(isLoadingOrders),

        // Computed
        displayCustomer,
        recentOrders,
        totalOrders,
        totalSpent,

        // Core API methods
        getOrders,
        getOrder,
        createOrder,
        getCustomer,
        getCustomerByEmail,
        updateCustomer,
        createCustomer,

        // Enhanced customer management
        findCustomerProfile,
        loadCustomerProfile,
        loadCustomerOrders,
        getProfileData,
        prepareCustomerUpdateData,
        updateCustomerProfile,
        clearCustomerData,

        // Utilities
        formatDate,
        getOrderStatusClass,
        getPlaceholderImage
    }
}