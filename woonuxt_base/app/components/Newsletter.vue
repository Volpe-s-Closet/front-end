<script setup>
import { ref } from 'vue';

const email = ref('');
const isSubmitting = ref(false);
const isSubmitted = ref(false);

const handleSubmit = async () => {
  if (!email.value) return;

  isSubmitting.value = true;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  isSubmitted.value = true;
  isSubmitting.value = false;
  email.value = '';

  // Reset after 3 seconds
  setTimeout(() => {
    isSubmitted.value = false;
  }, 3000);
};
</script>

<template>
  <section class="bg-gray-900 py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center text-white">
        <!-- Title -->
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>

        <!-- Description -->
        <p class="text-xl mb-8 opacity-90">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris.
        </p>

        <!-- Additional Text -->
        <p class="text-lg mb-8 opacity-80">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
          sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <!-- Newsletter Form -->
        <div class="max-w-md mx-auto">
          <form @submit.prevent="handleSubmit" class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email address"
                required
                class="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50" />
            </div>
            <button
              type="submit"
              :disabled="isSubmitting || isSubmitted"
              class="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="isSubmitting">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subscribing...
              </span>
              <span v-else-if="isSubmitted">
                <svg class="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                Subscribed!
              </span>
              <span v-else>Subscribe</span>
            </button>
          </form>

          <!-- Privacy Notice -->
          <p class="text-sm mt-4 opacity-70">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. We respect your privacy and will never share your information.
          </p>
        </div>

        <!-- Features List -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div class="text-center">
            <div class="w-12 h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h3 class="font-semibold mb-2">Weekly Updates</h3>
            <p class="text-sm opacity-80">Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.</p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="font-semibold mb-2">Exclusive Offers</h3>
            <p class="text-sm opacity-80">Tempor incididunt ut labore et dolore magna aliqua enim ad minim.</p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="font-semibold mb-2">Quality Content</h3>
            <p class="text-sm opacity-80">Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
