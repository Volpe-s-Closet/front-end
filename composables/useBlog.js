export const useBlog = () => {
    // Generic API call function for WordPress REST API
    const apiCall = async (endpoint, options = {}) => {
        try {
            const response = await $fetch(`/api/wordpress/${endpoint}`, options)
            return response
        } catch (error) {
            console.error('WordPress API Error:', error)
            throw error
        }
    }

    // Blog posts state management
    const posts = ref([])
    const postsLoading = ref(false)
    const postsError = ref(null)
    
    // Blog categories state management
    const blogCategories = ref([])
    const blogCategoriesLoading = ref(false)
    const blogCategoriesError = ref(null)

    // Get blog posts
    const getPosts = async (params = {}) => {
        return await apiCall('posts', { query: params })
    }

    // Get single blog post
    const getPost = async (id) => {
        return await apiCall(`posts/${id}`)
    }

    // Get blog categories
    const getBlogCategories = async (params = {}) => {
        return await apiCall('categories', { query: params })
    }

    // Fetch blog posts with state management
    const fetchPosts = async (params = {}) => {
        try {
            postsLoading.value = true
            postsError.value = null

            const defaultParams = {
                per_page: 10,
                status: 'publish',
                orderby: 'date',
                order: 'desc',
                ...params
            }

            const fetchedPosts = await getPosts(defaultParams)
            posts.value = fetchedPosts

            return posts.value
        } catch (err) {
            postsError.value = err
            console.error('Error fetching blog posts:', err)
            return []
        } finally {
            postsLoading.value = false
        }
    }

    // Fetch blog categories with state management
    const fetchBlogCategories = async (params = {}) => {
        try {
            blogCategoriesLoading.value = true
            blogCategoriesError.value = null

            const defaultParams = {
                per_page: 100,
                hide_empty: true,
                orderby: 'name',
                order: 'asc',
                ...params
            }

            const fetchedCategories = await getBlogCategories(defaultParams)
            blogCategories.value = fetchedCategories

            return blogCategories.value
        } catch (err) {
            blogCategoriesError.value = err
            console.error('Error fetching blog categories:', err)
            return []
        } finally {
            blogCategoriesLoading.value = false
        }
    }

    // Get blog categories for dropdown
    const getBlogCategoriesForDropdown = () => {
        return blogCategories.value.map(category => ({
            key: category.id,
            label: category.name,
            action: () => navigateTo(`/blog/category/${category.slug}`)
        }))
    }

    // Get category by slug
    const getBlogCategoryBySlug = (slug) => {
        return blogCategories.value.find(cat => cat.slug === slug)
    }

    // Format post excerpt
    const formatExcerpt = (excerpt) => {
        if (!excerpt || !excerpt.rendered) return ''
        // Remove HTML tags and decode entities
        return excerpt.rendered.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim()
    }

    // Format post date
    const formatPostDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    // Get featured image URL
    const getFeaturedImageUrl = (post, size = 'medium') => {
        if (!post._embedded || !post._embedded['wp:featuredmedia']) return null
        
        const media = post._embedded['wp:featuredmedia'][0]
        if (!media || !media.media_details || !media.media_details.sizes) return media.source_url
        
        const sizeData = media.media_details.sizes[size]
        return sizeData ? sizeData.source_url : media.source_url
    }

    return {
        // Blog posts API
        getPosts,
        getPost,
        getBlogCategories,

        // Blog posts state management
        posts: readonly(posts),
        postsLoading: readonly(postsLoading),
        postsError: readonly(postsError),
        fetchPosts,

        // Blog categories state management
        blogCategories: readonly(blogCategories),
        blogCategoriesLoading: readonly(blogCategoriesLoading),
        blogCategoriesError: readonly(blogCategoriesError),
        fetchBlogCategories,
        getBlogCategoriesForDropdown,
        getBlogCategoryBySlug,

        // Utility functions
        formatExcerpt,
        formatPostDate,
        getFeaturedImageUrl
    }
}