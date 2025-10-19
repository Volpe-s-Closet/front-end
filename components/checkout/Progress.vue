<template>
  <div class="mb-8">
    <div class="flex items-center justify-center space-x-4">
      <div class="flex items-center">
        <div
          class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
          1
        </div>
        <span class="ml-2 text-sm font-medium text-gray-900">Information</span>
      </div>
      <div class="w-16 h-0.5 bg-gray-300"></div>
      <div class="flex items-center">
        <div :class="[
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
          currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
        ]">
          2
        </div>
        <span class="ml-2 text-sm font-medium" :class="currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'">
          Payment
        </span>
      </div>
      <div class="w-16 h-0.5 bg-gray-300"></div>
      <div class="flex items-center">
        <div :class="[
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
          currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
        ]">
          3
        </div>
        <span class="ml-2 text-sm font-medium" :class="currentStep >= 3 ? 'text-gray-900' : 'text-gray-500'">
          Review
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true
  }
})
</script>