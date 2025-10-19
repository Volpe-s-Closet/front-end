<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">Store</h3>
          <p class="text-gray-400">Your trusted ecommerce destination for quality products.</p>
        </div>
        <div>
          <h4 class="text-sm font-semibold mb-4 uppercase tracking-wider">Shop</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/categories" class="text-gray-400 hover:text-white">Categories</NuxtLink></li>
            <li><NuxtLink to="/search" class="text-gray-400 hover:text-white">All Products</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-semibold mb-4 uppercase tracking-wider">Account</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/account" class="text-gray-400 hover:text-white">My Account</NuxtLink></li>
            <li><NuxtLink to="/account/orders" class="text-gray-400 hover:text-white">Order History</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-semibold mb-4 uppercase tracking-wider">Support</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/contact" class="text-gray-400 hover:text-white">Contact Us</NuxtLink></li>
            <li><NuxtLink to="/faq" class="text-gray-400 hover:text-white">FAQ</NuxtLink></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-gray-400">&copy; 2025 Store. All rights reserved.</p>
          <div class="flex space-x-6">
            <NuxtLink to="/privacy" class="text-gray-400 hover:text-white text-sm">Privacy Policy</NuxtLink>
            <NuxtLink to="/terms" class="text-gray-400 hover:text-white text-sm">Terms & Conditions</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>