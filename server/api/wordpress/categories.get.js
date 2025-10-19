export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const { siteUrl } = config.public
  
  if (!siteUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'WordPress site URL not configured'
    })
  }

  try {
    // Filter allowed parameters for WordPress categories
    const allowedParams = [
      'per_page', 'page', 'search', 'exclude', 'include', 'order', 'orderby',
      'hide_empty', 'parent', 'post', 'slug'
    ]

    const filteredQuery = {}
    Object.keys(query).forEach(key => {
      if (allowedParams.includes(key)) {
        filteredQuery[key] = query[key]
      }
    })

    // Set default parameters
    if (!filteredQuery.per_page) {
      filteredQuery.per_page = 100
    }

    const queryString = new URLSearchParams(filteredQuery).toString()
    const response = await $fetch(`${siteUrl}/wp-json/wp/v2/categories${queryString ? '?' + queryString : ''}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response
  } catch (error) {
    console.error('WordPress API Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch blog categories'
    })
  }
})