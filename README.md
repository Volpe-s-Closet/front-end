# Nuxt 3 WooCommerce Ecommerce Frontend

A modern, responsive ecommerce frontend built with Nuxt 3, Tailwind CSS, and integrated with WordPress/WooCommerce via REST API. This is a static site generator (SSG) optimized for performance and SEO.

## Features

### 🛍️ Ecommerce Functionality
- **Product Catalog**: Browse products with advanced filtering and search
- **Categories**: Hierarchical category navigation
- **Shopping Cart**: Add/remove items, quantity management
- **Checkout Process**: Multi-step checkout with billing/shipping
- **User Accounts**: Registration, login, profile management
- **Order History**: View past orders and track status
- **Responsive Design**: Mobile-first, fully responsive layout

### 🔧 Technical Features
- **Nuxt 3**: Latest Vue.js framework with SSR/SSG
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript Support**: Type-safe development
- **WooCommerce Integration**: Full REST API integration
- **JWT Authentication**: Secure user authentication
- **Static Site Generation**: Optimized for performance
- **SEO Optimized**: Meta tags, structured data

## Project Structure

```
├── components/           # Reusable Vue components
│   ├── ProductCard.vue
│   ├── CartSidebar.vue
│   └── ProductFilters.vue
├── composables/          # Vue composables
│   ├── useProducts.js    # Product & order management
│   ├── useCategories.js  # Category management
│   ├── useCart.js        # Shopping cart management
│   └── useAuth.js        # Authentication
├── layouts/              # Page layouts
│   ├── default.vue       # Main layout
│   └── checkout.vue      # Checkout layout
├── pages/                # Application pages
│   ├── index.vue         # Homepage
│   ├── search.vue        # Product search
│   ├── categories.vue    # Category listing
│   ├── cart.vue          # Shopping cart
│   ├── checkout.vue      # Checkout process
│   ├── login.vue         # User login
│   ├── category/         # Category pages
│   └── account/          # User account pages
├── types/                # TypeScript definitions
└── public/               # Static assets
```

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd front-end
npm install
```

**Note**: This project uses Node.js 22.20.0 as specified in `mise.toml`.

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your WordPress/WooCommerce details:

```env
# Public URL (exposed to client-side)
NUXT_PUBLIC_SITE_URL=https://your-wordpress-site.com

# Private API credentials (server-side only)
NUXT_WOOCOMMERCE_KEY=ck_your_consumer_key_here
NUXT_WOOCOMMERCE_SECRET=cs_your_consumer_secret_here
```

### 3. WordPress/WooCommerce Setup

Follow the detailed instructions in `WORDPRESS_SETUP.md` for complete backend configuration.

### 4. Development

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` to see your site.

### 5. Production Build

Generate static site:

```bash
npm run generate
```

The generated files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Runtime Configuration

This project uses Nuxt's runtime configuration for secure API key management:

- **Public Config**: `NUXT_PUBLIC_SITE_URL` - WordPress/WooCommerce base URL (exposed to client-side)
- **Private Config**: `NUXT_WOOCOMMERCE_KEY` and `NUXT_WOOCOMMERCE_SECRET` - API credentials (server-side only)

The configuration automatically maps environment variables to runtime config in `nuxt.config.ts`.

## Key Pages

### Homepage (`/`)
- Hero section with call-to-action
- Featured products showcase
- Category preview grid
- Latest products section

### Product Search (`/search`)
- Advanced product filtering (price, category, attributes)
- Sort options (price, popularity, rating, date)
- Responsive product grid
- Load more pagination

### Categories (`/categories`)
- All categories overview
- Category hierarchy display
- Search within categories
- Popular categories section

### Shopping Cart (`/cart`)
- Item management (add/remove/update quantities)
- Order summary with totals
- Recommended products
- Secure checkout link

### Checkout (`/checkout`)
- Multi-step process (Information → Payment → Review)
- Billing and shipping address forms
- Payment method selection
- Order review and confirmation

### User Account (`/account`)
- Profile management
- Order history and tracking
- Address book
- Payment methods (placeholder)

## WooCommerce Integration

### API Endpoints Used
- `GET /wp-json/wc/v3/products` - Product listings
- `GET /wp-json/wc/v3/products/categories` - Categories
- `GET /wp-json/wc/v3/products/attributes` - Product attributes
- `GET /wp-json/wc/v3/orders` - Order management
- `GET /wp-json/wc/v3/customers` - Customer data

### Authentication
- JWT tokens for user authentication
- WooCommerce API keys for product data
- Secure token storage in localStorage

### Cart Management
- Client-side cart storage (localStorage)
- Persistent across sessions
- Real-time updates and calculations

## Deployment

### Static Hosting (Recommended)
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Build Command
```bash
npm run generate
```

### Environment Variables
Set the same environment variables in your hosting platform as in your local `.env` file:

```env
NUXT_PUBLIC_SITE_URL=https://your-wordpress-site.com
NUXT_WOOCOMMERCE_KEY=ck_your_consumer_key_here
NUXT_WOOCOMMERCE_SECRET=cs_your_consumer_secret_here
```


## WordPress/WooCommerce Configuration

See `WORDPRESS_SETUP.md` for complete backend setup instructions.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is licensed under the MIT License.
