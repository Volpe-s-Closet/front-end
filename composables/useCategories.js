export const useCategories = () => {
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

    return {
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
        getCategoryById
    }
}