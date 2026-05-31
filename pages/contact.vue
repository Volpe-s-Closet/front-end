<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ $t('contact.title') }}</h1>
      <p class="text-lg text-gray-600">{{ $t('contact.subtitle') }}</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Contact Form -->
      <div class="bg-white rounded-lg shadow-sm border p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">{{ $t('contact.sendMessage') }}</h2>
        <form @submit.prevent="submitForm" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">{{ $t('contact.fullName') }}</label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">{{ $t('contact.emailAddress') }}</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">{{ $t('contact.subject') }}</label>
            <SelectBox
              v-model="form.subject"
              :options="subjectOptions"
              :placeholder="$t('contact.subjects.select')"
              button-class="w-full"
            />
          </div>
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-2">{{ $t('contact.message') }}</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="6"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :placeholder="$t('contact.messagePlaceholder')"
            ></textarea>
          </div>
          <BaseButton
            action="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            :text="$t('contact.send')"
            full-width
            size="lg"
          />
        </form>

        <div v-if="submitted" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p class="text-green-800">{{ $t('contact.success') }}</p>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="space-y-8">
        <div class="bg-white rounded-lg shadow-sm border p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">{{ $t('contact.getInTouch') }}</h2>
          <div class="space-y-6">
            <div class="flex items-start">
              <Icon name="heroicons:envelope" class="h-6 w-6 text-blue-600 mt-1 mr-4" />
              <div>
                <h3 class="font-medium text-gray-900">{{ $t('contact.email') }}</h3>
                <p class="text-gray-600">{{ $t('contact.emailValue') }}</p>
                <p class="text-sm text-gray-500">{{ $t('contact.emailHint') }}</p>
              </div>
            </div>
            <div class="flex items-start">
              <Icon name="heroicons:phone" class="h-6 w-6 text-blue-600 mt-1 mr-4" />
              <div>
                <h3 class="font-medium text-gray-900">{{ $t('contact.phone') }}</h3>
                <p class="text-gray-600">{{ $t('contact.phoneValue') }}</p>
                <p class="text-sm text-gray-500">{{ $t('contact.phoneHint') }}</p>
              </div>
            </div>
            <div class="flex items-start">
              <Icon name="heroicons:map-pin" class="h-6 w-6 text-blue-600 mt-1 mr-4" />
              <div>
                <h3 class="font-medium text-gray-900">{{ $t('contact.address') }}</h3>
                <p class="text-gray-600 whitespace-pre-line">{{ $t('contact.addressValue') }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">{{ $t('contact.businessHours') }}</h2>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">{{ $t('contact.monFri') }}</span>
              <span class="font-medium">{{ $t('contact.monFriHours') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">{{ $t('contact.saturday') }}</span>
              <span class="font-medium">{{ $t('contact.saturdayHours') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">{{ $t('contact.sunday') }}</span>
              <span class="font-medium">{{ $t('contact.sundayClosed') }}</span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-4">{{ $t('contact.timezoneNote') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()

useHead({
  title: () => t('contact.metaTitle'),
  meta: [
    { name: 'description', content: () => t('contact.metaDescription') }
  ]
})

const subjectOptions = computed(() => [
  { value: '', label: t('contact.subjects.select') },
  { value: 'general', label: t('contact.subjects.general') },
  { value: 'order', label: t('contact.subjects.order') },
  { value: 'shipping', label: t('contact.subjects.shipping') },
  { value: 'return', label: t('contact.subjects.return') },
  { value: 'technical', label: t('contact.subjects.technical') },
  { value: 'other', label: t('contact.subjects.other') }
])

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submitted = ref(false)

const submitForm = async () => {
  isSubmitting.value = true

  try {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Reset form
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }

    submitted.value = true

    // Hide success message after 5 seconds
    setTimeout(() => {
      submitted.value = false
    }, 5000)
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
