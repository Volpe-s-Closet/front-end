<template>
  <div class="relative mx-auto overflow-hidden">
    <div
      ref="carouselContainer"
      class="flex transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      @mousedown="startDrag"
      @touchstart="startDrag"
      @mousemove="onDrag"
      @touchmove="onDrag"
      @mouseup="endDrag"
      @touchend="endDrag"
      @mouseleave="endDrag">
      <div v-for="(slide, index) in slides" :key="index" class="relative w-full flex-shrink-0">
        <NuxtImg
          width="1400"
          height="800"
          class="object-cover w-full h-[420px] lg:h-[560px] xl:h-[640px]"
          :src="slide.image"
          :alt="slide.alt"
          :loading="index === 0 ? 'eager' : 'lazy'"
          sizes="sm:100vw md:1400px"
          :fetchpriority="index === 0 ? 'high' : 'auto'"
          :preload="index === 0"
          placeholder
          placeholder-class="blur-xl" />
        <div class="container absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-l from-gray-200 md:bg-none">
          <h1 class="text-3xl font-bold md:mb-4 md:text-4xl lg:text-6xl">{{ slide.title }}</h1>
          <h2 class="text-lg font-bold md:mb-4 lg:text-3xl">{{ slide.subtitle }}</h2>
          <div class="max-w-sm mb-8 text-md font-light lg:max-w-md text-balance">
            <p>{{ slide.description }}</p>
          </div>
          <NuxtLink class="px-6 py-3 font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-800 transition-colors" :to="slide.linkUrl">
            {{ slide.linkText }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Navigation dots -->
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        class="w-3 h-3 rounded-full transition-colors duration-300"
        :class="currentIndex === index ? 'bg-white' : 'bg-white/50'"
        @click="goToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`" />
    </div>

    <!-- Navigation arrows -->
    <button
      class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
      @click="previousSlide"
      aria-label="Previous slide">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <button
      class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
      @click="nextSlide"
      aria-label="Next slide">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const carouselContainer = ref(null);
const currentIndex = ref(0);
const autoplayInterval = ref(null);
const dragStartX = ref(0);
const dragStartY = ref(0);
const dragCurrentX = ref(0);
const dragCurrentY = ref(0);
const isDragging = ref(false);
const dragThreshold = 50;
const swipeDirectionThreshold = 30;
const isHorizontalSwipe = ref(false);

const slides = ref([
  {
    image: '/images/hero-4.jpg',
    alt: 'New Year Collection',
    title: 'Just landed.',
    subtitle: 'The New Year Collection',
    description: 'Our latest collection is here. Discover the latest trends and styles for the new year.',
    linkUrl: '/products',
    linkText: 'Shop now',
  },
  {
    image: '/images/hero-1.jpg',
    alt: 'Spring Collection',
    title: 'Fresh start.',
    subtitle: 'Spring Collection 2024',
    description: 'Embrace the season with our vibrant spring collection. Fresh colors and modern designs.',
    linkUrl: '/products?category=spring',
    linkText: 'Explore Spring',
  },
  {
    image: '/images/hero-2.jpg',
    alt: 'Summer Essentials',
    title: 'Stay cool.',
    subtitle: 'Summer Essentials',
    description: 'Beat the heat with our summer essentials. Lightweight fabrics and comfortable styles.',
    linkUrl: '/products?category=summer',
    linkText: 'Shop Summer',
  },
  {
    image: '/images/hero-3.jpg',
    alt: 'Exclusive Deals',
    title: 'Limited time.',
    subtitle: 'Exclusive Deals',
    description: "Don't miss out on our exclusive deals. Premium quality at unbeatable prices.",
    linkUrl: '/products?sale=true',
    linkText: 'View Deals',
  },
]);

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length;
};

const previousSlide = () => {
  currentIndex.value = currentIndex.value === 0 ? slides.value.length - 1 : currentIndex.value - 1;
};

const goToSlide = (index) => {
  currentIndex.value = index;
  resetAutoplay();
};

const startAutoplay = () => {
  autoplayInterval.value = setInterval(() => {
    nextSlide();
  }, 3000);
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
};

const resetAutoplay = () => {
  stopAutoplay();
  startAutoplay();
};

const getEventX = (event) => {
  return event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
};

const getEventY = (event) => {
  return event.type.includes('touch') ? event.touches[0].clientY : event.clientY;
};

const startDrag = (event) => {
  isDragging.value = true;
  dragStartX.value = getEventX(event);
  dragStartY.value = getEventY(event);
  dragCurrentX.value = dragStartX.value;
  dragCurrentY.value = dragStartY.value;
  isHorizontalSwipe.value = false;
  stopAutoplay();

  // Only prevent default for mouse events to avoid text selection
  // For touch events, we'll determine direction first
  if (!event.type.includes('touch')) {
    event.preventDefault();
  }
};

const onDrag = (event) => {
  if (!isDragging.value) return;

  dragCurrentX.value = getEventX(event);
  dragCurrentY.value = getEventY(event);

  // Determine swipe direction on first significant movement
  if (!isHorizontalSwipe.value && event.type.includes('touch')) {
    const deltaX = Math.abs(dragCurrentX.value - dragStartX.value);
    const deltaY = Math.abs(dragCurrentY.value - dragStartY.value);

    // If movement is significant enough to determine direction
    if (deltaX > swipeDirectionThreshold || deltaY > swipeDirectionThreshold) {
      isHorizontalSwipe.value = deltaX > deltaY;

      // Only prevent default if it's a horizontal swipe
      if (isHorizontalSwipe.value) {
        event.preventDefault();
      }
    }
  } else if (!event.type.includes('touch') || isHorizontalSwipe.value) {
    // Prevent default for mouse events or confirmed horizontal touch swipes
    event.preventDefault();
  }
};

const endDrag = () => {
  if (!isDragging.value) return;

  const dragDistance = dragCurrentX.value - dragStartX.value;

  // Only change slides if it was a horizontal swipe with sufficient distance
  if (isHorizontalSwipe.value && Math.abs(dragDistance) > dragThreshold) {
    if (dragDistance > 0) {
      previousSlide();
    } else {
      nextSlide();
    }
  }

  isDragging.value = false;
  dragStartX.value = 0;
  dragStartY.value = 0;
  dragCurrentX.value = 0;
  dragCurrentY.value = 0;
  isHorizontalSwipe.value = false;
  resetAutoplay();
};

onMounted(() => {
  startAutoplay();

  // Add keyboard navigation
  const handleKeydown = (event) => {
    if (event.key === 'ArrowLeft') {
      previousSlide();
      resetAutoplay();
    } else if (event.key === 'ArrowRight') {
      nextSlide();
      resetAutoplay();
    }
  };

  document.addEventListener('keydown', handleKeydown);

  // Pause autoplay on hover
  const container = carouselContainer.value?.parentElement;
  if (container) {
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
  }
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<style scoped>
.cursor-grab {
  cursor: grab;
}

.cursor-grab.active\:cursor-grabbing:active {
  cursor: grabbing;
}

/* Prevent text selection during drag */
.cursor-grab * {
  user-select: none;
}
</style>
