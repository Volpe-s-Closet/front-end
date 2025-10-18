<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Simplified Header for Checkout -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="text-2xl font-bold text-gray-900">
            Store
          </NuxtLink>
          <div class="text-sm text-gray-600">
            Secure Checkout
            <Icon name="heroicons:lock-closed" class="inline h-4 w-4 ml-1" />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Minimal Footer -->
    <footer class="bg-white border-t mt-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="text-center text-sm text-gray-500">
          <p>&copy; 2025 Store. Secure checkout powered by SSL encryption.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Checkout layout is minimal and focused
</script>