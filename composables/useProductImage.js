export const useProductImage = () => {
  const config = useRuntimeConfig()
  
  const getProductImage = (product) => {
    // Return the first image if available
    if (product.images && product.images.length > 0) {
      return product.images[0].src
    }
    
    // Use WooCommerce placeholder image
    const baseUrl = config.public.woocommerceUrl || 'https://your-wordpress-site.com'
    return `${baseUrl}/wp-content/plugins/woocommerce/assets/images/placeholder.png`
  }

  const getCartItemImage = (cartItem) => {
    // Cart items have an image property set when added to cart
    if (cartItem.image) {
      return cartItem.image
    }
    
    // Fallback: check the stored product data
    if (cartItem.product && cartItem.product.images && cartItem.product.images.length > 0) {
      return cartItem.product.images[0].src
    }
    
    // If it's a variation, check the variation image
    if (cartItem.variation && cartItem.variation.image) {
      return cartItem.variation.image
    }
    
    // Fallback to WooCommerce placeholder image
    const baseUrl = config.public.woocommerceUrl || 'https://your-wordpress-site.com'
    return `${baseUrl}/wp-content/plugins/woocommerce/assets/images/placeholder.png`
  }

  const handleImageError = (event) => {
    // Set WooCommerce placeholder when the main image fails to load
    const config = useRuntimeConfig()
    const baseUrl = config.public.woocommerceUrl || 'https://your-wordpress-site.com'
    event.target.src = `${baseUrl}/wp-content/plugins/woocommerce/assets/images/placeholder.png`
  }

  return {
    getProductImage,
    getCartItemImage,
    handleImageError
  }
}