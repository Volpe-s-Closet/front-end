<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
      <p class="text-lg text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Contact Form -->
      <div class="bg-white rounded-lg shadow-sm border p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>
        <form @submit.prevent="submitForm" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              id="subject"
              v-model="form.subject"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="order">Order Support</option>
              <option value="shipping">Shipping Question</option>
              <option value="return">Return/Exchange</option>
              <option value="technical">Technical Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="6"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please describe your inquiry in detail..."
            ></textarea>
          </div>
          <BaseButton
            action="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            text="Send Message"
            full-width
            size="lg"
          />
        </form>
        
        <div v-if="submitted" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p class="text-green-800">Thank you for your message! We'll get back to you within 24 hours.</p>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="space-y-8">
        <div class="bg-white rounded-lg shadow-sm border p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Get in touch</h2>
          <div class="space-y-6">
            <div class="flex items-start">
              <Icon name="heroicons:envelope" class="h-6 w-6 text-blue-600 mt-1 mr-4" />
              <div>
                <h3 class="font-medium text-gray-900">Email</h3>
                <p class="text-gray-600">support@store.com</p>
                <p class="text-sm text-gray-500">We typically respond within 24 hours</p>
              </div>
            </div>
            <div class="flex items-start">
              <Icon name="heroicons:phone" class="h-6 w-6 text-blue-600 mt-1 mr-4" />
              <div>
                <h3 class="font-medium text-gray-900">Phone</h3>
                <p class="text-gray-600">+1 (555) 123-4567</p>
                <p class="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</p>
              </div>
            </div>
            <div class="flex items-start">
              <Icon name="heroicons:map-pin" class="h-6 w-6 text-blue-600 mt-1 mr-4" />
              <div>
                <h3 class="font-medium text-gray-900">Address</h3>
                <p class="text-gray-600">123 Commerce Street<br>Business District<br>City, State 12345</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Business Hours</h2>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Monday - Friday</span>
              <span class="font-medium">9:00 AM - 6:00 PM</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Saturday</span>
              <span class="font-medium">10:00 AM - 4:00 PM</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Sunday</span>
              <span class="font-medium">Closed</span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-4">All times are in Eastern Standard Time (EST)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Contact Us - Store',
  meta: [
    { name: 'description', content: 'Get in touch with our customer support team. We\'re here to help with any questions or concerns.' }
  ]
})

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