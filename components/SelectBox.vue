<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger Button -->
    <button @click="toggleDropdown" :disabled="disabled" :class="[
      'flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2 font-medium text-gray-900 transition-colors',
      size === 'xs' ? 'text-xs sm:text-sm' : 'text-sm',
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200',
      buttonClass
    ]">
      <div class="flex items-center space-x-2">
        <Icon v-if="selectedOption.icon" :name="selectedOption.icon" class="h-4 w-4 text-gray-600" />
        <span v-if="!hideLabel" :class="size === 'xs' ? 'hidden xs:inline' : ''">
          {{ selectedOption.label }}
        </span>
        <span v-if="size === 'xs' && hideLabel" class="xs:hidden">
          {{ placeholder }}
        </span>
      </div>
      <Icon name="heroicons:chevron-down" class="h-4 w-4 text-gray-600 flex-shrink-0 ml-2" />
    </button>

    <!-- Dropdown Menu -->
    <div v-if="isOpen" :class="[
      'absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50',
      position === 'left' ? 'left-0' : 'right-0',
      size === 'xs' ? 'w-48' : 'w-56',
      menuClass
    ]">
      <div class="py-1">
        <button v-for="option in options" :key="option.value" @click="selectOption(option)" :class="[
          'flex items-center w-full px-3 py-2 text-sm text-left transition-colors',
          modelValue === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700',
          option.danger ? 'text-red-600 hover:bg-red-50' : 'hover:bg-gray-50'
        ]">
          <Icon v-if="option.icon" :name="option.icon" :class="[
            'h-4 w-4 mr-3',
            option.danger ? 'text-red-500' : 'text-gray-500'
          ]" />
          {{ option.label }}
          <Icon v-if="modelValue === option.value" name="heroicons:check" class="h-4 w-4 ml-auto text-blue-600" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // Current selected value
  modelValue: {
    type: [String, Number],
    required: true
  },

  // Array of options
  // Each option should have: { value, label, icon? }
  options: {
    type: Array,
    required: true,
    validator: (options) => {
      return options.every(option =>
        typeof option === 'object' &&
        option.value !== undefined &&
        option.label !== undefined
      )
    }
  },

  // Size variant
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm'].includes(value)
  },

  // Dropdown position
  position: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'right'].includes(value)
  },

  // Placeholder text for mobile when hideLabel is true
  placeholder: {
    type: String,
    default: 'Select'
  },

  // Hide the selected label on mobile
  hideLabel: {
    type: Boolean,
    default: false
  },

  // Custom classes for the trigger button
  buttonClass: {
    type: String,
    default: ''
  },

  // Custom classes for the dropdown menu
  menuClass: {
    type: String,
    default: ''
  },

  // Disabled state
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// Reactive state
const isOpen = ref(false)
const dropdownRef = ref(null)

// Computed
const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue) || props.options[0] || {}
})

// Methods
const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  emit('change', option)
  isOpen.value = false
}

const closeDropdown = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

// Close dropdown when pressing escape
const handleEscape = (event) => {
  if (event.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>