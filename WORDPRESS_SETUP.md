# WordPress & WooCommerce Setup Instructions

This document provides step-by-step instructions for configuring your WordPress site with WooCommerce to work with this Nuxt.js frontend.

## Prerequisites

- WordPress site with admin access
- WooCommerce plugin installed and activated
- SSL certificate (HTTPS) recommended for production
- Node.js 22.20.0 or compatible version (as specified in `mise.toml`)

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
3. Set up your **Shop page** and **Cart page**

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

### Runtime Configuration Structure

This Nuxt project uses a secure runtime configuration approach that separates public and private environment variables:

- **Public variables** (prefixed with `NUXT_PUBLIC_`): Exposed to client-side code
- **Private variables** (no prefix): Only available on server-side

This ensures sensitive API credentials are never exposed to the browser.

Create a `.env` file in your Nuxt project root:

```env
# Public URL (exposed to client-side)
NUXT_PUBLIC_SITE_URL=https://your-wordpress-site.com

# Private API credentials (server-side only)
NUXT_WOOCOMMERCE_KEY=ck_your_consumer_key_here
NUXT_WOOCOMMERCE_SECRET=cs_your_consumer_secret_here
```

### Environment Variable Security

The new configuration uses Nuxt's runtime config for better security:

- **`NUXT_PUBLIC_SITE_URL`**: WordPress/WooCommerce base URL - exposed to client-side for API calls
- **`NUXT_WOOCOMMERCE_KEY`**: Consumer key - kept server-side only for security
- **`NUXT_WOOCOMMERCE_SECRET`**: Consumer secret - kept server-side only for security

This ensures sensitive API credentials are never exposed to the client-side code.

## 6. Testing the Setup

### Test WooCommerce API
You can test your WooCommerce API using curl:

```bash
curl -X GET \
  'https://your-site.com/wp-json/wc/v3/products' \
  -u 'your_consumer_key:your_consumer_secret'
```

Replace `your_consumer_key` and `your_consumer_secret` with the values from your WooCommerce REST API settings.

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

## 7. Optional Enhancements

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

## 8. Troubleshooting

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