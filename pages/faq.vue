<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ $t('faq.title') }}</h1>
      <p class="text-lg text-gray-600">{{ $t('faq.subtitle') }}</p>
    </div>

    <div class="space-y-8">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('faq.ordering.title') }}</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-medium text-gray-900 mb-2">{{ $t('faq.ordering.q1') }}</h3>
            <p class="text-gray-600">{{ $t('faq.ordering.a1') }}</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">{{ $t('faq.ordering.q2') }}</h3>
            <p class="text-gray-600">{{ $t('faq.ordering.a2') }}</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">{{ $t('faq.ordering.q3') }}</h3>
            <p class="text-gray-600">{{ $t('faq.ordering.a3') }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('faq.shipping.title') }}</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-medium text-gray-900 mb-2">{{ $t('faq.shipping.q1') }}</h3>
            <p class="text-gray-600">{{ $t('faq.shipping.a1') }}</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">{{ $t('faq.shipping.q2') }}</h3>
            <p class="text-gray-600">{{ $t('faq.shipping.a2') }}</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">{{ $t('faq.shipping.q3') }}</h3>
            <p class="text-gray-600">{{ $t('faq.shipping.a3') }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('faq.returns.title') }}</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-medium text-gray-900 mb-2">{{ $t('faq.returns.q1') }}</h3>
            <p class="text-gray-600">{{ $t('faq.returns.a1') }}</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">{{ $t('faq.returns.q2') }}</h3>
            <p class="text-gray-600">{{ $t('faq.returns.a2') }}</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">{{ $t('faq.returns.q3') }}</h3>
            <p class="text-gray-600">{{ $t('faq.returns.a3') }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('faq.account.title') }}</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-medium text-gray-900 mb-2">{{ $t('faq.account.q1') }}</h3>
            <p class="text-gray-600">
              {{ $t('faq.account.a1Pre') }} "{{ $t('faq.account.a1Action') }}" {{ $t('faq.account.a1Post') }}
            </p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">{{ $t('faq.account.q2') }}</h3>
            <p class="text-gray-600">
              {{ $t('faq.account.a2Pre') }} "{{ $t('faq.account.a2Action') }}" {{ $t('faq.account.a2Post') }}
            </p>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 mb-2">{{ $t('faq.account.q3') }}</h3>
            <p class="text-gray-600">
              {{ $t('faq.account.a3Pre') }}
              <NuxtLink to="/contact" class="text-blue-600 hover:text-blue-800">{{ $t('faq.account.a3Link') }}</NuxtLink>
              {{ $t('faq.account.a3Post') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12 text-center">
      <p class="text-gray-600 mb-4">{{ $t('faq.stillQuestions') }}</p>
      <BaseButton
        to="/contact"
        :text="$t('faq.contactUs')"
        size="lg"
      />
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
useHead({
  title: () => t('faq.metaTitle'),
  meta: [
    { name: 'description', content: () => t('faq.metaDescription') }
  ]
})
</script>
