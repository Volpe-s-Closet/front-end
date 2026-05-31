<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ $t('privacy.title') }}</h1>
      <p class="text-lg text-gray-600">{{ $t('privacy.lastUpdated', { date: $t('privacy.lastUpdatedDate') }) }}</p>
    </div>

    <div class="prose prose-lg max-w-none">
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <p class="text-green-800 mb-0">{{ $t('privacy.intro') }}</p>
      </div>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('privacy.sections.collect.heading') }}</h2>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('privacy.sections.collect.personalSubheading') }}</h3>
        <p class="text-gray-700 mb-4">{{ $t('privacy.sections.collect.personalIntro') }}</p>
        <ul class="list-disc pl-6 text-gray-700 mb-4">
          <li v-for="(item, idx) in tm('privacy.sections.collect.personal')" :key="`p-${idx}`">{{ rt(item) }}</li>
        </ul>

        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('privacy.sections.collect.autoSubheading') }}</h3>
        <p class="text-gray-700 mb-4">{{ $t('privacy.sections.collect.autoIntro') }}</p>
        <ul class="list-disc pl-6 text-gray-700 mb-4">
          <li v-for="(item, idx) in tm('privacy.sections.collect.auto')" :key="`a-${idx}`">{{ rt(item) }}</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('privacy.sections.use.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('privacy.sections.use.intro') }}</p>
        <ul class="list-disc pl-6 text-gray-700 mb-4">
          <li v-for="(item, idx) in tm('privacy.sections.use.items')" :key="`u-${idx}`">{{ rt(item) }}</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('privacy.sections.sharing.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('privacy.sections.sharing.intro') }}</p>
        <ul class="list-disc pl-6 text-gray-700 mb-4">
          <li v-for="(item, idx) in tm('privacy.sections.sharing.items')" :key="`s-${idx}`">{{ rt(item) }}</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('privacy.sections.security.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('privacy.sections.security.intro') }}</p>
        <ul class="list-disc pl-6 text-gray-700 mb-4">
          <li v-for="(item, idx) in tm('privacy.sections.security.items')" :key="`sec-${idx}`">{{ rt(item) }}</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('privacy.sections.cookies.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('privacy.sections.cookies.intro') }}</p>
        <ul class="list-disc pl-6 text-gray-700 mb-4">
          <li v-for="(item, idx) in tm('privacy.sections.cookies.items')" :key="`c-${idx}`">{{ rt(item) }}</li>
        </ul>
        <p class="text-gray-700 mb-4">{{ $t('privacy.sections.cookies.outro') }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('privacy.sections.rights.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('privacy.sections.rights.intro') }}</p>
        <ul class="list-disc pl-6 text-gray-700 mb-4">
          <li v-for="(item, idx) in tm('privacy.sections.rights.items')" :key="`r-${idx}`">{{ rt(item) }}</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('privacy.sections.thirdParty.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('privacy.sections.thirdParty.body') }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('privacy.sections.children.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('privacy.sections.children.body') }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('privacy.sections.international.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('privacy.sections.international.body') }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('privacy.sections.changes.heading') }}</h2>
        <p class="text-gray-700 mb-4">{{ $t('privacy.sections.changes.body') }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ $t('privacy.sections.contact.heading') }}</h2>
        <p class="text-gray-700 mb-4">
          {{ $t('privacy.sections.contact.pre') }}
          <NuxtLink to="/contact" class="text-blue-600 hover:text-blue-800">{{ $t('privacy.sections.contact.linkText') }}</NuxtLink>
          {{ $t('privacy.sections.contact.post') }}
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
const { t, tm, rt } = useI18n()

useHead({
  title: () => t('privacy.metaTitle'),
  meta: [
    { name: 'description', content: () => t('privacy.metaDescription') }
  ]
})
</script>
