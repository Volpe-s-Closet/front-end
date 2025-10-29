<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            About Us
          </h1>
          <p class="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Discover the story behind our passion for bringing you the finest bags and accessories
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-white rounded-lg shadow-sm p-8 md:p-12">
        <!-- Our Story Section -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div class="prose prose-lg text-gray-600 max-w-none">
            <p class="mb-6">
              Founded with a passion for quality and style, our store has been dedicated to bringing you the finest 
              selection of bags and accessories. What started as a small dream has grown into a trusted destination 
              for fashion-conscious individuals who appreciate craftsmanship and attention to detail.
            </p>
            <p class="mb-6">
              We believe that the right bag or accessory can transform not just your outfit, but your entire day. 
              That's why we carefully curate each piece in our collection, ensuring that every item meets our high 
              standards for quality, durability, and style.
            </p>
          </div>
        </div>

        <!-- Our Mission Section -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <div class="prose prose-lg text-gray-600 max-w-none">
            <p class="mb-6">
              Our mission is simple: to provide our customers with exceptional products that combine functionality 
              with fashion. We're committed to offering a diverse range of bags and accessories that cater to 
              different lifestyles, preferences, and budgets.
            </p>
            <p class="mb-6">
              We strive to create a shopping experience that's not just about purchasing products, but about 
              discovering pieces that truly resonate with your personal style and enhance your daily life.
            </p>
          </div>
        </div>

        <!-- What Makes Us Different Section -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">What Makes Us Different</h2>
          <div class="grid md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon name="heroicons:heart" class="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Curated Selection</h3>
                  <p class="text-gray-600">
                    Every product is hand-picked for its quality, design, and functionality.
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon name="heroicons:shield-check" class="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
                  <p class="text-gray-600">
                    We stand behind every product with our commitment to quality and customer satisfaction.
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Icon name="heroicons:users" class="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Personal Service</h3>
                  <p class="text-gray-600">
                    Our team is dedicated to providing personalized assistance and expert advice.
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Icon name="heroicons:truck" class="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Local Delivery</h3>
                  <p class="text-gray-600">
                    Special delivery service in Tenerife for orders over €50 with convenient pickup points.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Section -->
        <div class="border-t border-gray-200 pt-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <div class="prose prose-lg text-gray-600 max-w-none">
            <p class="mb-6">
              We'd love to hear from you! Whether you have questions about our products, need styling advice, 
              or want to share your feedback, don't hesitate to reach out.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink 
                to="/contact" 
                class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                Contact Us
              </NuxtLink>
              <NuxtLink 
                to="/faq" 
                class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                View FAQ
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// SEO Meta
useHead({
  title: 'About Us - Store',
  meta: [
    {
      name: 'description',
      content: 'Learn about our story, mission, and commitment to bringing you the finest bags and accessories. Discover what makes us different and why quality matters to us.'
    },
    {
      property: 'og:title',
      content: 'About Us - Store'
    },
    {
      property: 'og:description',
      content: 'Learn about our story, mission, and commitment to bringing you the finest bags and accessories.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})
</script>