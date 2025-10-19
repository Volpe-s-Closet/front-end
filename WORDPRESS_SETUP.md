# WordPress & WooCommerce Setup Instructions

This document provides step-by-step instructions for configuring your WordPress site with WooCommerce and blog functionality to work with this Nuxt.js frontend.

## Prerequisites

- WordPress site with admin access
- WooCommerce plugin installed and activated
- SSL certificate (HTTPS) recommended for production
- Published blog posts (for blog functionality)


## 1. WooCommerce REST API Setup

### Enable REST API
1. Go to **WooCommerce > Settings > Advanced > REST API**
2. Click **Add Key**
3. Fill in the details:
   - **Description**: "Nuxt Frontend API"
   - **User**: Select an administrator user
   - **Permissions**: Read/Write
4. Click **Generate API Key**
5. Copy the **Consumer Key** and **Consumer Secret** - you'll need these for your `.env` file

### Configure CORS (if needed)
Add this to your WordPress theme's `functions.php` file or create a custom plugin:

```php
// Enable CORS for WooCommerce REST API
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');
        
        if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
            status_header(200);
            exit();
        }
        
        return $value;
    });
});
```

## 2. JWT Authentication Setup (Recommended)

### Install JWT Authentication Plugin
1. Install the **JWT Authentication for WP-API** plugin
   - Download from: https://github.com/Tmeister/wp-api-jwt-auth
   - Or search for "JWT Authentication" in WordPress plugins

### Configure JWT Plugin
Add these lines to your `wp-config.php` file:

```php
// JWT Authentication
define('JWT_AUTH_SECRET_KEY', 'your-top-secret-key-here');
define('JWT_AUTH_CORS_ENABLE', true);
```

### Add JWT Endpoints
Add this to your theme's `functions.php`:

```php
// JWT Authentication endpoints
add_action('rest_api_init', function() {
    // Custom registration endpoint
    register_rest_route('wp/v2', '/users/register', array(
        'methods' => 'POST',
        'callback' => 'custom_user_registration',
        'permission_callback' => '__return_true'
    ));
});

function custom_user_registration($request) {
    $username = sanitize_text_field($request['username']);
    $email = sanitize_email($request['email']);
    $password = $request['password'];
    $first_name = sanitize_text_field($request['first_name']);
    $last_name = sanitize_text_field($request['last_name']);

    if (empty($username) || empty($email) || empty($password)) {
        return new WP_Error('missing_fields', 'Missing required fields', array('status' => 400));
    }

    if (username_exists($username) || email_exists($email)) {
        return new WP_Error('user_exists', 'User already exists', array('status' => 400));
    }

    $user_id = wp_create_user($username, $password, $email);

    if (is_wp_error($user_id)) {
        return $user_id;
    }

    // Update user meta
    wp_update_user(array(
        'ID' => $user_id,
        'first_name' => $first_name,
        'last_name' => $last_name
    ));

    return array(
        'success' => true,
        'user_id' => $user_id,
        'message' => 'User registered successfully'
    );
}
```

## 3. WooCommerce Configuration

### Product Settings
1. Go to **WooCommerce > Settings > Products**
2. Enable **Enable reviews** if you want product reviews
3. Configure **Review settings**:
   - **Enable star rating on reviews**: Allow customers to rate products
   - **Star ratings should be required**: Make ratings mandatory
   - **Enable review rating verification**: Only allow reviews from verified purchasers
4. Set up your **Shop page** and **Cart page**

### Review & Comment Moderation
1. Go to **Settings > Discussion** in WordPress admin
2. Configure comment moderation settings:
   - **Comment must be manually approved**: Enable if you want to moderate all reviews
   - **Comment author must have a previously approved comment**: For trusted reviewers
   - **Hold a comment in the queue if it contains X or more links**: Spam prevention

### Inventory Settings
1. Go to **WooCommerce > Settings > Products > Inventory**
2. Enable **Manage stock** if you want inventory tracking
3. Configure **Out of stock visibility** as needed

### Shipping Settings
1. Go to **WooCommerce > Settings > Shipping**
2. Set up your shipping zones and methods
3. Configure shipping classes if needed

### Tax Settings
1. Go to **WooCommerce > Settings > Tax**
2. Enable taxes if applicable
3. Set up tax rates for your regions

## 4. Security Considerations

### API Security
- Use HTTPS in production
- Regularly rotate your API keys
- Limit API key permissions to what's needed
- Monitor API usage

### User Authentication
- Use strong JWT secrets
- Implement rate limiting
- Consider two-factor authentication

## 5. Environment Configuration

Create a `.env` file in your Nuxt project root:

```env
# Public URL (exposed to client-side)
NUXT_PUBLIC_SITE_URL=https://your-wordpress-site.com

# Private API credentials (server-side only)
NUXT_WOOCOMMERCE_KEY=ck_your_consumer_key_here
NUXT_WOOCOMMERCE_SECRET=cs_your_consumer_secret_here
```

## 6. Product Review System

The frontend includes a comprehensive product review system that integrates with WooCommerce's native review functionality while adding enhanced features like purchase verification and moderation support.

### Review System Features

- **Purchase Verification**: Reviews can be restricted to customers who have purchased the product
- **User Authentication**: Users must be logged in to leave reviews
- **Rating System**: 5-star rating system with visual feedback
- **Review Management**: Users can edit their existing reviews
- **Moderation Support**: Shows pending/approved status for reviews
- **WooCommerce Integration**: Respects all WooCommerce review settings

### Review System Components

#### ProductComments.vue
Main component that handles the review interface and logic.

**Props:**
- `productId` (required): The WooCommerce product ID
- `comments`: Array of existing reviews

**Events:**
- `comment-added`: Emitted when a review is successfully submitted
- `refresh-comments`: Emitted to trigger a refresh of the reviews list

#### Usage in Product Pages
```vue
<ProductComments 
  :product-id="product.id" 
  :comments="reviews"
  @comment-added="handleCommentAdded"
  @refresh-comments="refreshReviews"
/>
```

### Review API Endpoints

The system adds these custom API endpoints:

#### Purchase Status Check
`GET /api/woocommerce/products/[productId]/purchase-status`

Checks if a customer has purchased a specific product (server-side verification).

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

#### Review Settings
`GET /api/woocommerce/settings/reviews`

Gets WooCommerce review configuration settings.

**Response:**
```json
{
  "reviews_enabled": true,
  "purchase_verification_required": false,
  "ratings_enabled": true,
  "moderation_required": false,
  "verification_label": "Verified Purchase"
}
```

#### Review Management
`POST /api/woocommerce/products/reviews`

Creates new reviews or updates existing ones (handles both operations).

### Review System States

The component handles several user states:

- **Loading**: While checking purchase status and settings
- **Not Authenticated**: User needs to log in to review
- **Purchase Required**: User must purchase product first (if verification enabled)
- **Can Review**: User can leave or update reviews
- **Has Reviewed**: User has already reviewed - shows edit option
- **Pending Moderation**: Review submitted but awaiting approval

### Review Security Features

- **Server-side purchase verification** for security
- **User authentication required** for all review operations
- **Customer ID validation** prevents unauthorized access
- **Review ownership verification** ensures users can only edit their own reviews

### Review Configuration Options

The system automatically respects these WooCommerce settings:

1. **Enable Reviews**: Controls whether reviews are enabled globally
2. **Purchase Verification**: When enabled, only verified purchasers can review
3. **Enable Ratings**: Controls whether the star rating system is available
4. **Comment Moderation**: WordPress setting for review approval workflow

### Review Error Handling

The system gracefully handles:
- Network errors when checking purchase status
- Missing WooCommerce settings (falls back to safe defaults)
- Authentication failures
- Review submission errors
- Moderation queue status

## 7. Blog Integration Setup

The frontend includes a complete blog integration that consumes content from your WordPress site using the WordPress REST API.

### WordPress Blog Requirements

Your WordPress site needs:

1. **WordPress REST API enabled** (enabled by default in WordPress 4.7+)
2. **Published blog posts** with the following recommended setup:
   - Featured images for better visual appeal
   - Categories for organization
   - Proper excerpts (auto-generated or manual)
   - Tags for better content organization

### Blog Features Included

The blog integration provides:

- **Blog post listing** (`/blog`) with pagination and category sidebar
- **Individual blog post pages** (`/blog/{slug}`) with full content and related posts
- **Category-based filtering** (`/blog/category/{slug}`)
- **SEO optimization** with meta tags and Open Graph
- **Responsive design** with loading states and error handling
- **Social sharing** functionality
- **Navigation integration** in header and mobile menu

### Blog API Endpoints Used

The integration uses these WordPress REST API endpoints:

- `GET /wp-json/wp/v2/posts` - List blog posts
- `GET /wp-json/wp/v2/posts/{id}` - Get single post by ID
- `GET /wp-json/wp/v2/categories` - List blog categories

### Blog Components Added

- `composables/useBlog.js` - Blog functionality and state management
- `components/BlogPostCard.vue` - Reusable blog post card component
- `pages/blog/index.vue` - Main blog listing page
- `pages/blog/[slug].vue` - Individual blog post page
- `pages/blog/category/[slug].vue` - Category-filtered blog posts
- Updated navigation in `AppHeader.vue` and `MobileSidebar.vue`

## 8. Testing the Setup

### Test WooCommerce API
You can test your WooCommerce API using curl:

```bash
curl -X GET \
  'https://your-site.com/wp-json/wc/v3/products' \
  -u 'your_consumer_key:your_consumer_secret'
```

Replace `your_consumer_key` and `your_consumer_secret` with the values from your WooCommerce REST API settings.

### Test WordPress Blog API
Test the blog functionality:

```bash
# Get blog posts
curl -X GET 'https://your-site.com/wp-json/wp/v2/posts'

# Get blog categories
curl -X GET 'https://your-site.com/wp-json/wp/v2/categories'

# Get a specific post by slug
curl -X GET 'https://your-site.com/wp-json/wp/v2/posts?slug=your-post-slug'
```

### Test JWT Authentication
```bash
curl -X POST \
  'https://your-site.com/wp-json/jwt-auth/v1/token' \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "your_username",
    "password": "your_password"
  }'
```

### Test Review System
```bash
# Get product reviews
curl -X GET 'https://your-site.com/wp-json/wc/v3/products/reviews?product=123'

# Get review settings (requires API credentials)
curl -X GET \
  'https://your-site.com/wp-json/wc/v3/settings/products' \
  -u 'your_consumer_key:your_consumer_secret'

# Test purchase verification (replace with actual product and customer IDs)
curl -X GET 'https://your-frontend-domain.com/api/woocommerce/products/123/purchase-status?customer_id=456'
```

## 9. Optional Enhancements

### Custom Product Fields
If you need custom product fields, consider using:
- Advanced Custom Fields (ACF)
- Custom post meta
- WooCommerce product attributes

### Performance Optimization
- Use caching plugins (WP Rocket, W3 Total Cache)
- Optimize images
- Use a CDN
- Enable gzip compression

### SEO
- Install Yoast SEO or RankMath
- Configure product schema markup
- Set up proper URL structures

## 10. Troubleshooting

### Common Issues

**CORS Errors**
- Ensure CORS headers are properly set
- Check if your hosting provider blocks cross-origin requests

**Authentication Failures**
- Verify JWT secret is set correctly
- Check user permissions
- Ensure the JWT plugin is activated

**API Rate Limiting**
- Some hosting providers limit API requests
- Consider implementing caching on the frontend

**SSL Certificate Issues**
- Ensure your WordPress site has a valid SSL certificate
- Update WordPress and WooCommerce URLs to use HTTPS

**Blog Posts Not Loading**
- Check that `NUXT_PUBLIC_SITE_URL` is correctly set in your environment
- Verify WordPress REST API is accessible at `/wp-json/wp/v2/posts`
- Ensure blog posts are published and not in draft status

**Blog Images Not Displaying**
- Ensure WordPress site allows external image requests
- Check that featured images are properly set on blog posts
- Verify image URLs are accessible from your frontend domain

**Blog Categories Empty**
- Make sure blog posts are assigned to categories
- Check that categories are not empty (have at least one published post)
- Verify category slugs match the URLs being requested

**Review System Issues**
- **Reviews not showing**: Check WooCommerce > Settings > Products > Enable reviews
- **Purchase verification not working**: Verify customer has completed orders with "completed" status
- **Reviews always pending**: Check WordPress > Settings > Discussion > Comment moderation settings
- **Can't edit reviews**: Ensure user is logged in and owns the review
- **API errors**: Check WooCommerce API credentials and permissions

### Debug Mode
Enable WordPress debug mode by adding to `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

## Support

For additional help:
- WooCommerce Documentation: https://docs.woocommerce.com/
- WordPress REST API: https://developer.wordpress.org/rest-api/
- JWT Plugin Documentation: https://github.com/Tmeister/wp-api-jwt-auth

Remember to always backup your WordPress site before making configuration changes!