# Nuxt Static Site

A static-only Nuxt application configured for client-side rendering and static deployment.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production Build

Build the static application for production:

```bash
npm run build
```

This generates static files in the `.output/public` directory that can be deployed to any static hosting service.

Locally preview the production build:

```bash
npm run preview
```

## Deployment

This app is configured as a static site (SSR disabled) and can be deployed to any static hosting provider:

### Manual Deployment Steps:

1. Build with `npm run build` to generate static files
2. The build can be found at `.output/public`
3. Configure your hosting provider to serve `index.html` for all routes (SPA fallback)

## NPM Packages

This project uses the following NPM packages:

- [@nuxt/fonts](https://fonts.nuxt.com/) - Font optimization and loading for Nuxt
- [@nuxt/icon](https://icon.nuxt.com/) - Icon component and utilities for Nuxt
- [@nuxt/scripts](https://scripts.nuxt.com/) - Third-party script management for Nuxt
- [@nuxt/test-utils](https://nuxt.com/docs/getting-started/testing) - Testing utilities for Nuxt applications
- [@nuxtjs/tailwindcss](https://tailwindcss.nuxtjs.org/) - Tailwind CSS integration for Nuxt

Check out the [Nuxt static deployment documentation](https://nuxt.com/docs/getting-started/deployment#static-hosting) for more information.
