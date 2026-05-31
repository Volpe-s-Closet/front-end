<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            {{ $t('about.title') }}
          </h1>
          <p class="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            {{ $t('about.heroSubtitle') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-white rounded-lg shadow-sm p-8 md:p-12">
        <!-- Our Story Section -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">{{ $t('about.ourStory') }}</h2>
          <div class="prose prose-lg text-gray-600 max-w-none">
            <p class="mb-6">{{ $t('about.ourStoryParagraph1') }}</p>
            <p class="mb-6">{{ $t('about.ourStoryParagraph2') }}</p>
          </div>
        </div>

        <!-- Our Mission Section -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">{{ $t('about.ourMission') }}</h2>
          <div class="prose prose-lg text-gray-600 max-w-none">
            <p class="mb-6">{{ $t('about.ourMissionParagraph1') }}</p>
            <p class="mb-6">{{ $t('about.ourMissionParagraph2') }}</p>
          </div>
        </div>

        <!-- What Makes Us Different Section -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">{{ $t('about.different') }}</h2>
          <div class="grid md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon name="heroicons:heart" class="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('about.features.curated.title') }}</h3>
                  <p class="text-gray-600">{{ $t('about.features.curated.description') }}</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon name="heroicons:shield-check" class="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('about.features.quality.title') }}</h3>
                  <p class="text-gray-600">{{ $t('about.features.quality.description') }}</p>
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
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('about.features.service.title') }}</h3>
                  <p class="text-gray-600">{{ $t('about.features.service.description') }}</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Icon name="heroicons:truck" class="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('about.features.delivery.title') }}</h3>
                  <p class="text-gray-600">{{ $t('about.features.delivery.description') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Section -->
        <div class="border-t border-gray-200 pt-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">{{ $t('about.getInTouch') }}</h2>
          <div class="prose prose-lg text-gray-600 max-w-none">
            <p class="mb-6">{{ $t('about.getInTouchParagraph') }}</p>
            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink
                to="/contact"
                class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                {{ $t('about.contactUs') }}
              </NuxtLink>
              <NuxtLink
                to="/faq"
                class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                {{ $t('about.viewFaq') }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()

useHead({
  title: () => t('about.metaTitle'),
  meta: [
    { name: 'description', content: () => t('about.metaDescription') },
    { property: 'og:title', content: () => t('about.metaTitle') },
    { property: 'og:description', content: () => t('about.metaDescription') },
    { property: 'og:type', content: 'website' }
  ]
})
</script>
