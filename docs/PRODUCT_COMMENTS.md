# Product Comments System

This document explains the product commenting/review system implementation that respects WooCommerce purchase verification settings.

## Features

- **Purchase Verification**: Comments can be restricted to customers who have purchased the product
- **User Authentication**: Users must be logged in to leave comments
- **Rating System**: 5-star rating system for reviews
- **Review Management**: Users can update their existing reviews
- **WooCommerce Integration**: Respects WooCommerce review settings

## Components

### ProductComments.vue
Main component that handles the commenting interface and logic.

**Props:**
- `productId` (required): The WooCommerce product ID
- `comments`: Array of existing comments/reviews

**Events:**
- `comment-added`: Emitted when a new comment is successfully submitted
- `refresh-comments`: Emitted to trigger a refresh of the comments list

## API Endpoints

### Purchase Status Check
`GET /api/woocommerce/products/[productId]/purchase-status`

Checks if a customer has purchased a specific product.

**Query Parameters:**
- `customer_id`: The WooCommerce customer ID

**Response:**
```json
{
  "has_purchased": true,
  "product_id": "123",
  "customer_id": "456"
}
```

### Review Settings
`GET /api/woocommerce/settings/reviews`

Gets WooCommerce review configuration settings.

**Response:**
```json
{
  "reviews_enabled": true,
  "purchase_verification_required": false,
  "ratings_enabled": true,
  "verification_label": "Verified Purchase"
}
```

## Usage

### In Product Page
```vue
<ProductComments 
  :product-id="product.id" 
  :comments="reviews"
  @comment-added="handleCommentAdded"
  @refresh-comments="refreshReviews"
/>
```

### Composable Methods
```javascript
const { checkPurchaseStatus, getReviewSettings } = useProducts()

// Check if user purchased product
const hasPurchased = await checkPurchaseStatus(productId, customerId)

// Get review settings
const settings = await getReviewSettings()
```

## Configuration

The system automatically respects WooCommerce settings:

1. **Enable Reviews**: Controls whether reviews are enabled globally
2. **Purchase Verification**: When enabled, only customers who purchased the product can review
3. **Enable Ratings**: Controls whether the star rating system is available

## States

The component handles several states:

- **Loading**: While checking purchase status and settings
- **Not Authenticated**: User needs to log in
- **Purchase Required**: User must purchase product first (if verification enabled)
- **Can Comment**: User can leave/update reviews
- **Has Reviewed**: User has already reviewed this product

## Security

- Purchase verification is done server-side for security
- User authentication is required for all review operations
- Customer ID validation prevents unauthorized access to purchase history

## Error Handling

The system gracefully handles:
- Network errors when checking purchase status
- Missing WooCommerce settings (falls back to defaults)
- Authentication failures
- Review submission errors

## Styling

The component uses Tailwind CSS classes and follows the existing design system:
- Form inputs with focus states
- Loading spinners
- Status messages with appropriate colors
- Responsive design