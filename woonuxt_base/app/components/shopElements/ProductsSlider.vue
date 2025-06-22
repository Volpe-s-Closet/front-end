<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  products: { type: Array, default: null },
});

const currentIndex = ref(0);
const itemsPerView = ref(4);

const maxIndex = computed(() => {
  if (!props.products) return 0;
  return Math.max(0, props.products.length - itemsPerView.value);
});

const canGoPrevious = computed(() => currentIndex.value > 0);
const canGoNext = computed(() => currentIndex.value < maxIndex.value);

const goToPrevious = () => {
  if (canGoPrevious.value) {
    currentIndex.value--;
  }
};

const goToNext = () => {
  if (canGoNext.value) {
    currentIndex.value++;
  }
};

const translateX = computed(() => {
  return `translateX(-${currentIndex.value * (100 / itemsPerView.value)}%)`;
});
</script>

<template>
  <div v-if="products" class="relative">
    <!-- Navigation Buttons -->
    <button
      v-if="canGoPrevious"
      @click="goToPrevious"
      class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
      aria-label="Previous products">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <button
      v-if="canGoNext"
      @click="goToNext"
      class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
      aria-label="Next products">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Slider Container -->
    <div class="overflow-hidden mx-8">
      <div class="flex transition-transform duration-300 ease-in-out gap-4" :style="{ transform: translateX }">
        <div v-for="(node, i) in products" :key="node.databaseId" class="flex-shrink-0" :style="{ width: `calc(${100 / itemsPerView}% - 12px)` }">
          <ProductCard class="w-full h-full" :node="node" :index="i" />
        </div>
      </div>
    </div>

    <!-- Dots Indicator -->
    <div v-if="maxIndex > 0" class="flex justify-center mt-4 space-x-2">
      <button
        v-for="dot in maxIndex + 1"
        :key="dot - 1"
        @click="currentIndex = dot - 1"
        class="w-2 h-2 rounded-full transition-colors"
        :class="currentIndex === dot - 1 ? 'bg-gray-800' : 'bg-gray-300'"
        :aria-label="`Go to slide ${dot}`" />
    </div>
  </div>
</template>
