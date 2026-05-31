<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ $t('terms.title') }}</h1>
      <p class="text-lg text-gray-600">{{ $t('terms.lastUpdated', { date: $t('terms.lastUpdatedDate') }) }}</p>
    </div>

    <div class="prose prose-lg max-w-none">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <p class="text-blue-800 mb-0">{{ $t('terms.intro') }}</p>
      </div>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('terms.sections.acceptance.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('terms.sections.acceptance.body') }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('terms.sections.license.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('terms.sections.license.intro') }}</p>
        <ul class="list-disc pl-6 text-gray-700 mb-4">
          <li v-for="(item, idx) in tm('terms.sections.license.items')" :key="`lic-${idx}`">{{ rt(item) }}</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('terms.sections.productInfo.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('terms.sections.productInfo.body') }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('terms.sections.pricing.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('terms.sections.pricing.body') }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('terms.sections.shipping.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('terms.sections.shipping.body') }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('terms.sections.returns.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('terms.sections.returns.body') }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('terms.sections.userAccounts.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('terms.sections.userAccounts.body') }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('terms.sections.privacy.heading') }}</h2>
        <p class="text-gray-700 mb-4">
          {{ $t('terms.sections.privacy.pre') }}
          <NuxtLink to="/privacy" class="text-blue-600 hover:text-blue-800">{{ $t('terms.sections.privacy.linkText') }}</NuxtLink>{{ $t('terms.sections.privacy.post') }}
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('terms.sections.liability.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('terms.sections.liability.body') }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('terms.sections.law.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('terms.sections.law.body') }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('terms.sections.changes.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('terms.sections.changes.body') }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('terms.sections.contact.heading') }}</h2>
        <p class="text-gray-700 mb-4">
          {{ $t('terms.sections.contact.pre') }}
          <NuxtLink to="/contact" class="text-blue-600 hover:text-blue-800">{{ $t('terms.sections.contact.linkText') }}</NuxtLink>{{ $t('terms.sections.contact.post') }}
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
const { t, tm, rt } = useI18n()

useHead({
  title: () => t('terms.metaTitle'),
  meta: [
    { name: 'description', content: () => t('terms.metaDescription') }
  ]
})
</script>
