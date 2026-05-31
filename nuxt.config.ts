// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n'
  ],

  i18n: {
    // Spanish is the default locale; UI is currently being developed in English,
    // so English remains a fully translated locale alongside Italian.
    locales: [
      { code: 'es', iso: 'es-ES', name: 'Español', flag: '🇪🇸', file: 'es.json' },
      { code: 'en', iso: 'en-GB', name: 'English', flag: '🇬🇧', file: 'en.json' },
      { code: 'it', iso: 'it-IT', name: 'Italiano', flag: '🇮🇹', file: 'it.json' }
    ],
    defaultLocale: 'es',
    // Keep URLs clean. The user picks a language via the existing SelectBox in
    // the header / mobile sidebar; preference is persisted in the cookie below.
    strategy: 'no_prefix',
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'es'
    },
    bundle: {
      optimizeTranslationDirective: false
    }
  },

  icon: {
    clientBundle: {
      icons: [
        'heroicons:arrow-down',
        'heroicons:arrow-left',
        'heroicons:arrow-path',
        'heroicons:arrow-right',
        'heroicons:arrow-right-on-rectangle',
        'heroicons:arrow-up',
        'heroicons:arrow-uturn-left',
        'heroicons:bars-3',
        'heroicons:check',
        'heroicons:check-circle',
        'heroicons:chevron-down',
        'heroicons:chevron-left',
        'heroicons:chevron-right',
        'heroicons:clock',
        'heroicons:cog-6-tooth',
        'heroicons:credit-card',
        'heroicons:currency-dollar',
        'heroicons:document',
        'heroicons:document-text',
        'heroicons:envelope',
        'heroicons:exclamation-circle',
        'heroicons:exclamation-triangle',
        'heroicons:fire',
        'heroicons:folder-open',
        'heroicons:funnel',
        'heroicons:heart',
        'heroicons:information-circle',
        'heroicons:list-bullet',
        'heroicons:lock-closed',
        'heroicons:magnifying-glass',
        'heroicons:map-pin',
        'heroicons:minus',
        'heroicons:pause-circle',
        'heroicons:phone',
        'heroicons:photo',
        'heroicons:plus',
        'heroicons:plus-circle',
        'heroicons:share',
        'heroicons:shield-check',
        'heroicons:shopping-bag',
        'heroicons:squares-2x2',
        'heroicons:squares-plus',
        'heroicons:star',
        'heroicons:star-solid',
        'heroicons:stop',
        'heroicons:tag',
        'heroicons:trash',
        'heroicons:truck',
        'heroicons:user',
        'heroicons:user-circle',
        'heroicons:users',
        'heroicons:view-columns',
        'heroicons:x-circle',
        'heroicons:x-mark'
      ]
    }
  },

  runtimeConfig: {
    // Private keys (only available on server-side)
    woocommerceKey: '', // NUXT_WOOCOMMERCE_KEY
    woocommerceSecret: '', // NUXT_WOOCOMMERCE_SECRET

    // Public keys (exposed to client-side)
    // These will automatically map to NUXT_PUBLIC_* environment variables
    public: {
      siteUrl: '' // NUXT_PUBLIC_SITE_URL (WordPress/WooCommerce base URL)
    }
  },

  nitro: {
    prerender: {
      routes: ['/']
    }
  },

  ssr: true // This is needed for proper pre-render without losing SEO benefits
})