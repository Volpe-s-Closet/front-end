export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  const { siteUrl } = config.public
  
  if (!siteUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'WordPress site URL not configured'
    })
  }

  try {
    const response = await $fetch(`${siteUrl}/wp-json/wp/v2/posts/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response
  } catch (error) {
    console.error('WordPress API Error:', error)
    throw createError({
      statusCode: error.statusCode || 404,
      statusMessage: error.message || 'Blog post not found'
    })
  }
})