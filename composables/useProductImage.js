export const useProductImage = () => {
  const config = useRuntimeConfig()
  
  const getPlaceholderImage = () => {
    // Use WooCommerce's default placeholder image
    const baseUrl = config.public.woocommerceUrl || config.public.wordpressUrl
    return `${baseUrl}/wp-content/plugins/woocommerce/assets/images/placeholder.png`
  }

  const getProductImage = (product) => {
    // Try to get the first image from the product
    if (product.images && product.images.length > 0) {
      return product.images[0].src
    }
    
    // Fallback to WooCommerce placeholder
    return getPlaceholderImage()
  }

  const getCartItemImage = (item) => {
    // Try to get image from cart item
    if (item.image) {
      return item.image
    }
    
    // Try to get from product if available
    if (item.product && item.product.images && item.product.images.length > 0) {
      return item.product.images[0].src
    }
    
    // Fallback to WooCommerce placeholder
    return getPlaceholderImage()
  }

  const handleImageError = (event) => {
    // Set WooCommerce placeholder on error
    event.target.src = getPlaceholderImage()
  }

  return {
    getProductImage,
    getCartItemImage,
    getPlaceholderImage,
    handleImageError
  }
}