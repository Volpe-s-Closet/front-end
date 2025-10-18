// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss'
  ],

  runtimeConfig: {
    // Private keys (only available on server-side)
    woocommerceKey: '', // NUXT_WOOCOMMERCE_KEY
    woocommerceSecret: '', // NUXT_WOOCOMMERCE_SECRET
    
    // Public keys (exposed to client-side)
    // These will automatically map to NUXT_PUBLIC_* environment variables
    public: {
      woocommerceUrl: '', // NUXT_PUBLIC_WOOCOMMERCE_URL
      wordpressUrl: '' // NUXT_PUBLIC_WORDPRESS_URL
    }
  },

  nitro: {
    prerender: {
      routes: ['/']
    }
  },

  ssr: true // This is needed for proper pre-render without losing SEO benefits
})