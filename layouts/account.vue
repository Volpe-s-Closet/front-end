<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">{{ pageTitle }}</h1>
      <p class="text-gray-600 mt-2">{{ pageDescription }}</p>
    </div>

    <!-- Account Navigation -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Sidebar Navigation -->
      <div class="lg:col-span-1">
        <nav class="bg-white rounded-lg shadow-sm p-6">
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/account"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                :class="$route.path === '/account' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                <Icon name="heroicons:user" class="h-5 w-5 mr-3" />
                {{ $t('account.nav.profile') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/account/password"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                :class="$route.path === '/account/password' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                <Icon name="heroicons:lock-closed" class="h-5 w-5 mr-3" />
                {{ $t('account.nav.password') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/account/orders"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                :class="$route.path === '/account/orders' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                <Icon name="heroicons:shopping-bag" class="h-5 w-5 mr-3" />
                {{ $t('account.nav.orders') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/account/addresses"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                :class="$route.path === '/account/addresses' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                <Icon name="heroicons:map-pin" class="h-5 w-5 mr-3" />
                {{ $t('account.nav.addresses') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/account/payment-methods"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
                :class="$route.path === '/account/payment-methods' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                <Icon name="heroicons:credit-card" class="h-5 w-5 mr-3" />
                {{ $t('account.nav.paymentMethods') }}
              </NuxtLink>
            </li>
            <li>
              <BaseButton
                @click="logout"
                variant="danger"
                size="sm"
                icon="heroicons:arrow-right-on-rectangle"
                :text="$t('account.nav.logout')"
                full-width
              />
            </li>
          </ul>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-3">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const { logout } = useAuth()
const { t } = useI18n()
const route = useRoute()

// Page metadata derived from the current route — reactive to locale changes.
const pageTitle = computed(() => {
  const map = {
    '/account': t('account.pageTitles.profile'),
    '/account/password': t('account.pageTitles.password'),
    '/account/orders': t('account.pageTitles.orders'),
    '/account/addresses': t('account.pageTitles.addresses'),
    '/account/payment-methods': t('account.pageTitles.paymentMethods')
  }
  return map[route.path] || t('account.pageTitles.profile')
})

const pageDescription = computed(() => {
  const map = {
    '/account': t('account.pageDescriptions.profile'),
    '/account/password': t('account.pageDescriptions.password'),
    '/account/orders': t('account.pageDescriptions.orders'),
    '/account/addresses': t('account.pageDescriptions.addresses'),
    '/account/payment-methods': t('account.pageDescriptions.paymentMethods')
  }
  return map[route.path] || t('account.pageDescriptions.profile')
})
</script>
