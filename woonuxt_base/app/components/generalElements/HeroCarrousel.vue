<template>
  <div class="relative mx-auto overflow-hidden">
    <div
      ref="carouselContainer"
      class="flex cursor-grab active:cursor-grabbing"
      :class="{ 'transition-transform duration-500 ease-out': !isDragging }"
      :style="{ transform: `translateX(-${translateX}%)` }"
      @mousedown="startDrag"
      @touchstart="startDrag"
      @mousemove="onDrag"
      @touchmove="onDrag"
      @mouseup="endDrag"
      @touchend="endDrag"
      @mouseleave="endDrag"
      @transitionend="handleTransitionEnd">
      <!-- Clone last slide at the beginning -->
      <div class="relative w-full flex-shrink-0">
        <NuxtImg
          width="1400"
          height="800"
          class="object-cover w-full h-[420px] lg:h-[560px] xl:h-[640px]"
          :src="slides[slides.length - 1].image"
          :alt="slides[slides.length - 1].alt"
          loading="lazy"
          sizes="sm:100vw md:1400px"
          fetchpriority="auto"
          placeholder
          placeholder-class="blur-xl" />
        <div class="container absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-l from-gray-200 md:bg-none">
          <h1 class="text-3xl font-bold md:mb-4 md:text-4xl lg:text-6xl">{{ slides[slides.length - 1].title }}</h1>
          <h2 class="text-lg font-bold md:mb-4 lg:text-3xl">{{ slides[slides.length - 1].subtitle }}</h2>
          <div class="max-w-sm mb-8 text-md font-light lg:max-w-md text-balance">
            <p>{{ slides[slides.length - 1].description }}</p>
          </div>
          <NuxtLink class="px-6 py-3 font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-800 transition-colors" :to="slides[slides.length - 1].linkUrl">
            {{ slides[slides.length - 1].linkText }}
          </NuxtLink>
        </div>
      </div>
      <!-- Original slides -->
      <div v-for="(slide, index) in slides" :key="`original-${index}`" class="relative w-full flex-shrink-0">
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
      <!-- Clone first slide at the end -->
      <div class="relative w-full flex-shrink-0">
        <NuxtImg
          width="1400"
          height="800"
          class="object-cover w-full h-[420px] lg:h-[560px] xl:h-[640px]"
          :src="slides[0].image"
          :alt="slides[0].alt"
          loading="lazy"
          sizes="sm:100vw md:1400px"
          fetchpriority="auto"
          placeholder
          placeholder-class="blur-xl" />
        <div class="container absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-l from-gray-200 md:bg-none">
          <h1 class="text-3xl font-bold md:mb-4 md:text-4xl lg:text-6xl">{{ slides[0].title }}</h1>
          <h2 class="text-lg font-bold md:mb-4 lg:text-3xl">{{ slides[0].subtitle }}</h2>
          <div class="max-w-sm mb-8 text-md font-light lg:max-w-md text-balance">
            <p>{{ slides[0].description }}</p>
          </div>
          <NuxtLink class="px-6 py-3 font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-800 transition-colors" :to="slides[0].linkUrl">
            {{ slides[0].linkText }}
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
      @click="previousSlideManual"
      aria-label="Previous slide">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <button
      class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
      @click="nextSlideManual"
      aria-label="Next slide">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const carouselContainer = ref(null);
const currentIndex = ref(0); // Start at 0 for first slide
const autoplayInterval = ref(null);
const dragStartX = ref(0);
const dragStartY = ref(0);
const dragCurrentX = ref(0);
const dragCurrentY = ref(0);
const isDragging = ref(false);
const dragThreshold = 100;
const swipeDirectionThreshold = 30;
const isHorizontalSwipe = ref(false);
const isTransitioning = ref(false);

// Computed property for translateX to handle infinite scrolling
const translateX = computed(() => {
  // Add 1 to account for the cloned slide at the beginning
  const baseTranslate = (currentIndex.value + 1) * 100;
  if (isDragging.value && isHorizontalSwipe.value) {
    const dragDistance = dragCurrentX.value - dragStartX.value;
    const containerWidth = carouselContainer.value?.offsetWidth || window.innerWidth;
    const dragPercentage = (dragDistance / containerWidth) * 100;
    return baseTranslate - dragPercentage;
  }
  return baseTranslate;
});

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
  if (isTransitioning.value) return;
  console.log(`Advancing from slide ${currentIndex.value} to ${(currentIndex.value + 1) % slides.value.length}`);
  isTransitioning.value = true;
  currentIndex.value = (currentIndex.value + 1) % slides.value.length;
};

const nextSlideManual = () => {
  nextSlide();
  // Reset autoplay counter when user manually clicks next
  resetAutoplay();
};

const previousSlideManual = () => {
  previousSlide();
  // Reset autoplay counter when user manually clicks previous
  resetAutoplay();
};

const previousSlide = () => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  currentIndex.value = currentIndex.value === 0 ? slides.value.length - 1 : currentIndex.value - 1;
};

const goToSlide = (index) => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  currentIndex.value = index;
  // Reset autoplay counter when user manually selects a slide
  resetAutoplay();
};

const startAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
  }
  console.log('Starting autoplay with 5 second interval');
  autoplayInterval.value = setInterval(() => {
    console.log('Autoplay advancing slide');
    nextSlide();
  }, 5000);
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    console.log('Stopping autoplay');
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
};

const resetAutoplay = () => {
  console.log('Resetting autoplay');
  stopAutoplay();
  setTimeout(() => {
    if (!autoplayInterval.value) {
      startAutoplay();
    }
  }, 100);
};

const getEventX = (event) => {
  return event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
};

const getEventY = (event) => {
  return event.type.includes('touch') ? event.touches[0].clientY : event.clientY;
};

const startDrag = (event) => {
  if (isTransitioning.value) return;

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

  const newX = getEventX(event);
  const newY = getEventY(event);

  // Always update current position for visual feedback
  dragCurrentX.value = newX;
  dragCurrentY.value = newY;

  // Determine swipe direction on first significant movement
  if (!isHorizontalSwipe.value && event.type.includes('touch')) {
    const deltaX = Math.abs(newX - dragStartX.value);
    const deltaY = Math.abs(newY - dragStartY.value);

    // If movement is significant enough to determine direction
    if (deltaX > swipeDirectionThreshold || deltaY > swipeDirectionThreshold) {
      isHorizontalSwipe.value = deltaX > deltaY;

      // Only prevent default if it's a horizontal swipe
      if (isHorizontalSwipe.value) {
        event.preventDefault();
      }
    }
  } else if (!event.type.includes('touch')) {
    // Prevent default for mouse events
    event.preventDefault();
    isHorizontalSwipe.value = true;
  } else if (isHorizontalSwipe.value) {
    // Prevent default for confirmed horizontal touch swipes
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
    // Reset autoplay counter when user manually swipes
    resetAutoplay();
  }

  isDragging.value = false;
  dragStartX.value = 0;
  dragStartY.value = 0;
  dragCurrentX.value = 0;
  dragCurrentY.value = 0;
  isHorizontalSwipe.value = false;
};

const handleTransitionEnd = () => {
  isTransitioning.value = false;
  // No need for infinite loop jumps since we're using modulo arithmetic
};

onMounted(() => {
  startAutoplay();

  // Add keyboard navigation
  const handleKeydown = (event) => {
    if (event.key === 'ArrowLeft') {
      previousSlide();
      // Reset autoplay counter when user uses keyboard navigation
      resetAutoplay();
    } else if (event.key === 'ArrowRight') {
      nextSlide();
      // Reset autoplay counter when user uses keyboard navigation
      resetAutoplay();
    }
  };

  document.addEventListener('keydown', handleKeydown);

  // Pause autoplay on hover
  const container = carouselContainer.value?.parentElement;
  if (container) {
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', () => {
      if (!autoplayInterval.value) {
        startAutoplay();
      }
    });
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
