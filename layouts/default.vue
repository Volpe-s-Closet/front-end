<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- Cart Sidebar -->
    <CartSidebar />
  </div>
</template>

<script setup>
// Layout is now simplified - all header and footer logic moved to components
</script>