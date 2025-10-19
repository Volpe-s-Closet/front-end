<template>
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-300 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <div 
      v-if="isOpen" 
      class="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-40 md:hidden overflow-y-auto"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Menu</h2>
        <BaseButton 
          @click="$emit('close')" 
          variant="ghost" 
          size="sm" 
          icon="heroicons:x-mark" 
          class="text-gray-500 hover:text-gray-700"
        />
      </div>



      <!-- Navigation Links -->
      <nav class="p-4">
        <div class="space-y-2">
          <NuxtLink 
            to="/categories" 
            class="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            @click="$emit('close')"
          >
            <ClientOnly>
              <Icon name="heroicons:squares-2x2" class="h-5 w-5 mr-3 text-gray-400" />
              <template #fallback>
                <div class="h-5 w-5 mr-3 bg-gray-200 rounded"></div>
              </template>
            </ClientOnly>
            Categories
          </NuxtLink>
          
          <NuxtLink 
            to="/search" 
            class="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            @click="$emit('close')"
          >
            <ClientOnly>
              <Icon name="heroicons:shopping-bag" class="h-5 w-5 mr-3 text-gray-400" />
              <template #fallback>
                <div class="h-5 w-5 mr-3 bg-gray-200 rounded"></div>
              </template>
            </ClientOnly>
            All Products
          </NuxtLink>
        </div>
      </nav>


    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

// Close sidebar when clicking outside or pressing escape
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && props.isOpen) {
      emit('close')
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>