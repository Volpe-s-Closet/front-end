<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">{{ $t('common.store') }}</h3>
          <p class="text-gray-400">{{ $t('footer.tagline') }}</p>
        </div>
        <div>
          <h4 class="text-sm font-semibold mb-4 uppercase tracking-wider">{{ $t('footer.shop') }}</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/categories" class="text-gray-400 hover:text-white">{{ $t('footer.categories') }}</NuxtLink></li>
            <li><NuxtLink to="/search" class="text-gray-400 hover:text-white">{{ $t('footer.allProducts') }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-semibold mb-4 uppercase tracking-wider">{{ $t('footer.account') }}</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/account" class="text-gray-400 hover:text-white">{{ $t('footer.myAccount') }}</NuxtLink></li>
            <li><NuxtLink to="/account/orders" class="text-gray-400 hover:text-white">{{ $t('footer.orderHistory') }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-semibold mb-4 uppercase tracking-wider">{{ $t('footer.support') }}</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/contact" class="text-gray-400 hover:text-white">{{ $t('footer.contactUs') }}</NuxtLink></li>
            <li><NuxtLink to="/faq" class="text-gray-400 hover:text-white">{{ $t('footer.faq') }}</NuxtLink></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-gray-400">{{ $t('footer.copyright') }}</p>
          <div class="flex space-x-6">
            <NuxtLink to="/privacy" class="text-gray-400 hover:text-white text-sm">{{ $t('footer.privacy') }}</NuxtLink>
            <NuxtLink to="/terms" class="text-gray-400 hover:text-white text-sm">{{ $t('footer.terms') }}</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
