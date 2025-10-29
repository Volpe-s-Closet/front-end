<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger Button -->
    <button @click="toggleDropdown" :disabled="disabled" :class="[
      'flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 font-medium text-gray-900 transition-colors',
      size === 'xs' ? 'text-xs sm:text-sm' : size === 'lg' ? 'text-base' : 'text-sm',
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200',
      buttonClass
    ]">
      <Icon v-if="triggerIcon" :name="triggerIcon" :class="[
        'text-gray-600',
        size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
      ]" />
      <span v-if="!hideLabel" :class="size === 'xs' ? 'hidden xs:inline' : ''">
        {{ triggerLabel }}
      </span>
      <span v-if="size === 'xs' && hideLabel" class="xs:hidden">
        {{ placeholder }}
      </span>
      <Icon v-if="!hideChevron" name="heroicons:chevron-down" class="h-4 w-4 text-gray-600" />
    </button>

    <!-- Dropdown Menu -->
    <div v-if="isOpen" :class="[
      'absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-fit whitespace-nowrap',
      position === 'left' ? 'left-0' : 'right-0',
      menuClass
    ]">
      <div class="py-1">
        <template v-for="(item, index) in items" :key="item.key || item.label || index">
          <button @click="handleItemClick(item)" :disabled="item.disabled" :class="[
            'flex items-center w-full px-3 py-2 text-sm text-left transition-colors',
            item.disabled ? 'opacity-50 cursor-not-allowed' : '',
            item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'
          ]">
            <Icon v-if="item.icon" :name="item.icon" :class="[
              'h-4 w-4 mr-3',
              item.danger ? 'text-red-500' : 'text-gray-500'
            ]" />
            {{ item.label }}
          </button>

          <!-- Divider after item (if specified and not last item) -->
          <div v-if="item.divider && index < items.length - 1" class="border-t border-gray-200 my-1"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // Array of menu items
  // Each item should have: { label, icon?, action?, danger?, disabled?, divider? }
  items: {
    type: Array,
    required: true,
    validator: (items) => {
      return items.every(item =>
        typeof item === 'object' &&
        item.label !== undefined
      )
    }
  },

  // Trigger button label
  triggerLabel: {
    type: String,
    default: 'Menu'
  },

  // Trigger button icon
  triggerIcon: {
    type: String,
    default: null
  },

  // Size variant
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm', 'lg'].includes(value)
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
    default: 'Menu'
  },

  // Hide the trigger label on mobile
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
  },

  // Hide the chevron icon
  hideChevron: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['item-click'])

// Reactive state
const isOpen = ref(false)
const dropdownRef = ref(null)

// Methods
const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const handleItemClick = (item) => {
  if (item.disabled) return

  emit('item-click', item)

  // Execute item action if provided
  if (item.action && typeof item.action === 'function') {
    item.action()
  }

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