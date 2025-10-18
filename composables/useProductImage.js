export const useProductImage = () => {
  const config = useRuntimeConfig()
  
  // WooCommerce default placeholder image
  const getPlaceholderImage = () => {
    const baseUrl = config.public.woocommerceUrl || config.public.wordpressUrl
    return `${baseUrl}/wp-content/plugins/woocommerce/assets/images/placeholder.png`
  }
  
  // Get product image with fallback
  const getProductImage = (product, imageIndex = 0) => {
    if (product?.images && product.images[imageIndex]?.src) {
      return product.images[imageIndex].src
    }
    return getPlaceholderImage()
  }
  
  // Get cart item image with fallback
  const getCartItemImage = (item) => {
    // First, try the item's direct image
    if (item?.image && item.image !== '/placeholder-product.jpg' && item.image !== '/placeholder-product.svg' && item.image !== '') {
      return item.image
    }
    
    // If the item has a variation with an image
    if (item?.product?.image?.src) {
      return item.product.image.src
    }
    
    // Try the main product's images
    if (item?.product?.images?.[0]?.src) {
      return item.product.images[0].src
    }
    
    // Try the stored product reference
    if (item?.product?.product?.images?.[0]?.src) {
      return item.product.product.images[0].src
    }
    
    return getPlaceholderImage()
  }
  
  // Handle image error by setting placeholder
  const handleImageError = (event) => {
    event.target.src = getPlaceholderImage()
  }
  
  return {
    getPlaceholderImage,
    getProductImage,
    getCartItemImage,
    handleImageError
  }
}