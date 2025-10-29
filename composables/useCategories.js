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
            // By default, hide empty categories unless explicitly overridden
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
            const allCategoriesWithChildren = []

            // First pass: create map of all categories
            allCategories.forEach(cat => {
                const categoryWithChildren = { ...cat, children: [] }
                categoryMap.set(cat.id, categoryWithChildren)
                allCategoriesWithChildren.push(categoryWithChildren)
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

            // Store all categories (including subcategories) so we can find them by slug
            categories.value = allCategoriesWithChildren

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

    // Get category by slug - searches through all categories including nested ones
    const getCategoryBySlug = (slug) => {
        return categories.value.find(cat => cat.slug === slug)
    }

    // Get category by ID
    const getCategoryById = (id) => {
        return categories.value.find(cat => cat.id === id)
    }

    // Get only root categories (parent === 0)
    const getRootCategories = () => {
        return categories.value.filter(cat => cat.parent === 0)
    }

    // Fetch categories including empty ones (useful for megamenu)
    const fetchCategoriesIncludingEmpty = async (params = {}) => {
        return await fetchCategories({
            hide_empty: false,
            ...params
        })
    }

    // Fetch only categories with products (default behavior)
    const fetchCategoriesWithProducts = async (params = {}) => {
        return await fetchCategories({
            hide_empty: true,
            ...params
        })
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
        fetchCategoriesIncludingEmpty,
        fetchCategoriesWithProducts,
        getCategoriesForDropdown,
        getCategoryBySlug,
        getCategoryById,
        getRootCategories
    }
}