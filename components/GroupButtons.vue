<template>
  <div :class="['flex items-center bg-gray-100 rounded-lg p-1', containerClass]">
    <button
      v-for="option in options"
      :key="option.value"
      @click="handleClick(option.value)"
      :class="[
        'flex items-center rounded-md font-medium transition-colors',
        size === 'xs' ? 'px-2 sm:px-3 py-2 text-xs sm:text-sm' : 'px-3 py-2 text-sm',
        modelValue === option.value 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900',
        buttonClass
      ]"
    >
      <Icon 
        v-if="option.icon" 
        :name="option.icon" 
        :class="[
          size === 'xs' ? 'h-4 w-4' : 'h-4 w-4',
          option.label && !hideLabels ? (size === 'xs' ? 'mr-1 sm:mr-2' : 'mr-2') : ''
        ]" 
      />
      <span 
        v-if="option.label && !hideLabels"
        :class="size === 'xs' ? 'hidden xs:inline' : ''"
      >
        {{ option.label }}
      </span>
    </button>
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
  // Each option should have: { value, label?, icon? }
  options: {
    type: Array,
    required: true,
    validator: (options) => {
      return options.every(option => 
        typeof option === 'object' && 
        option.value !== undefined
      )
    }
  },
  
  // Size variant
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm'].includes(value)
  },
  
  // Hide labels (show only icons)
  hideLabels: {
    type: Boolean,
    default: false
  },
  
  // Custom classes for the container
  containerClass: {
    type: String,
    default: ''
  },
  
  // Custom classes for buttons
  buttonClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleClick = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>