<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
      <p class="text-lg text-gray-600">Last updated: {{ lastUpdated }}</p>
    </div>

    <div class="prose prose-lg max-w-none">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <p class="text-blue-800 mb-0">
          Please read these Terms and Conditions carefully before using our service. By accessing or using our service, you agree to be bound by these Terms.
        </p>
      </div>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
        <p class="text-gray-700 mb-4">
          By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
        <p class="text-gray-700 mb-4">
          Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul class="list-disc pl-6 text-gray-700 mb-4">
          <li>modify or copy the materials</li>
          <li>use the materials for any commercial purpose or for any public display</li>
          <li>attempt to reverse engineer any software contained on the website</li>
          <li>remove any copyright or other proprietary notations from the materials</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">3. Product Information</h2>
        <p class="text-gray-700 mb-4">
          We strive to provide accurate product information, including descriptions, pricing, and availability. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">4. Pricing and Payment</h2>
        <p class="text-gray-700 mb-4">
          All prices are subject to change without notice. We reserve the right to modify or discontinue products at any time. Payment must be received before products are shipped. We accept various payment methods as displayed during checkout.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">5. Shipping and Delivery</h2>
        <p class="text-gray-700 mb-4">
          We will make every effort to ship products within the timeframe specified. However, delivery dates are estimates and we are not responsible for delays caused by shipping carriers or other circumstances beyond our control.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">6. Returns and Refunds</h2>
        <p class="text-gray-700 mb-4">
          We offer a 30-day return policy for most items. Products must be returned in original condition with all packaging and tags. Refunds will be processed to the original payment method within 5-7 business days of receiving the returned item.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">7. User Accounts</h2>
        <p class="text-gray-700 mb-4">
          When you create an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">8. Privacy Policy</h2>
        <p class="text-gray-700 mb-4">
          Your privacy is important to us. Please review our <NuxtLink to="/privacy" class="text-blue-600 hover:text-blue-800">Privacy Policy</NuxtLink>, which also governs your use of the website, to understand our practices.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
        <p class="text-gray-700 mb-4">
          In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
        <p class="text-gray-700 mb-4">
          These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
        <p class="text-gray-700 mb-4">
          We reserve the right to revise these terms at any time without notice. By using this website, you are agreeing to be bound by the then current version of these Terms and Conditions.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
        <p class="text-gray-700 mb-4">
          If you have any questions about these Terms and Conditions, please <NuxtLink to="/contact" class="text-blue-600 hover:text-blue-800">contact us</NuxtLink>.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Terms and Conditions - Store',
  meta: [
    { name: 'description', content: 'Read our terms and conditions for using our ecommerce store and services.' }
  ]
})

const lastUpdated = 'January 1, 2025'
</script>