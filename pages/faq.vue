<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
      <p class="text-lg text-gray-600">Find answers to common questions about our store and services.</p>
    </div>

    <div class="space-y-8">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Ordering & Payment</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-medium text-gray-900 mb-2">How do I place an order?</h3>
            <p class="text-gray-600">Browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or log in to complete your purchase.</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p class="text-gray-600">We accept all major credit cards, PayPal, and other secure payment methods through our payment processor.</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">Is my payment information secure?</h3>
            <p class="text-gray-600">Yes, all payment information is encrypted and processed through secure payment gateways. We never store your payment details on our servers.</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Shipping & Delivery</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-medium text-gray-900 mb-2">How long does shipping take?</h3>
            <p class="text-gray-600">Standard shipping typically takes 3-7 business days. Express shipping options are available at checkout for faster delivery.</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">Do you ship internationally?</h3>
            <p class="text-gray-600">Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">How can I track my order?</h3>
            <p class="text-gray-600">Once your order ships, you'll receive a tracking number via email. You can also check your order status in your account dashboard.</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Returns & Exchanges</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-medium text-gray-900 mb-2">What is your return policy?</h3>
            <p class="text-gray-600">We offer a 30-day return policy for most items. Products must be in original condition with tags attached.</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">How do I return an item?</h3>
            <p class="text-gray-600">Contact our customer service team to initiate a return. We'll provide you with a return label and instructions.</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">When will I receive my refund?</h3>
            <p class="text-gray-600">Refunds are processed within 5-7 business days after we receive your returned item.</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Account & Support</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-medium text-gray-900 mb-2">How do I create an account?</h3>
            <p class="text-gray-600">Click on the user icon in the top right corner and select "Register" to create a new account.</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">I forgot my password. What should I do?</h3>
            <p class="text-gray-600">On the login page, click "Forgot Password" and follow the instructions to reset your password.</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">How can I contact customer support?</h3>
            <p class="text-gray-600">You can reach us through our <NuxtLink to="/contact" class="text-blue-600 hover:text-blue-800">contact page</NuxtLink> or email us directly at support@store.com.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12 text-center">
      <p class="text-gray-600 mb-4">Still have questions?</p>
      <NuxtLink to="/contact" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
        Contact Us
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'FAQ - Store',
  meta: [
    { name: 'description', content: 'Frequently asked questions about our store, shipping, returns, and customer service.' }
  ]
})
</script>