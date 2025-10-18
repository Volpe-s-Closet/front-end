export const useProductImage = () => {
  const getPlaceholderImage = () => {
    return 'https://via.placeholder.com/300x300?text=No+Image'
  }

  const handleImageError = (event) => {
    event.target.src = getPlaceholderImage()
  }

  const getOptimizedImageUrl = (imageUrl, width = 300, height = 300) => {
    if (!imageUrl) return getPlaceholderImage()
    
    // If it's already a placeholder, return as is
    if (imageUrl.includes('placeholder')) return imageUrl
    
    // For WordPress images, you could add size parameters
    // This is a basic implementation - adjust based on your image optimization setup
    return imageUrl
  }

  const getCartItemImage = (item) => {
    // Try to get image from various possible sources
    if (item.image) {
      return typeof item.image === 'string' ? item.image : item.image.src
    }
    
    if (item.images && item.images.length > 0) {
      return typeof item.images[0] === 'string' ? item.images[0] : item.images[0].src
    }
    
    // Fallback to placeholder
    return getPlaceholderImage()
  }

  const getProductImage = (product) => {
    // Try to get image from various possible sources for WooCommerce products
    if (product.images && product.images.length > 0) {
      return product.images[0].src || product.images[0]
    }
    
    if (product.image) {
      return typeof product.image === 'string' ? product.image : product.image.src
    }
    
    // Fallback to placeholder
    return getPlaceholderImage()
  }

  return {
    getPlaceholderImage,
    handleImageError,
    getOptimizedImageUrl,
    getCartItemImage,
    getProductImage
  }
}