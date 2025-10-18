<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :type="computedType"
    :disabled="computedDisabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <Icon 
      v-if="loading" 
      name="heroicons:arrow-path" 
      :class="iconClasses"
    />
    <Icon 
      v-else-if="computedIcon" 
      :name="computedIcon" 
      :class="iconClasses"
    />
    <span v-if="slots.default || computedText">
      <slot>{{ computedText }}</slot>
    </span>
  </component>
</template>

<script setup>
const props = defineProps({
  // Content
  text: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  
  // Behavior
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  
  // Navigation
  to: {
    type: [String, Object],
    default: null
  },
  href: {
    type: String,
    default: null
  },
  
  // HTML attributes
  type: {
    type: String,
    default: 'button'
  },
  
  // Styling
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => [
      'primary', 
      'secondary', 
      'outline', 
      'ghost', 
      'danger', 
      'success',
      'link'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'full'].includes(value)
  },
  
  // Form-specific props
  action: {
    type: String,
    default: null,
    validator: (value) => !value || [
      // Form actions
      'submit', 'reset', 'cancel', 'save', 'delete',
      // Cart actions  
      'add', 'remove', 'increase', 'decrease', 'clear'
    ].includes(value)
  },
  
  // Form validation
  isValid: {
    type: Boolean,
    default: true
  },
  
  // Cart-specific props
  product: {
    type: Object,
    default: null
  },
  quantity: {
    type: Number,
    default: 1
  },
  variation: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'click', 
  // Form events
  'submit', 'reset', 'cancel', 'save', 'delete',
  // Cart events
  'added', 'removed', 'updated'
])

const slots = useSlots()

// Cart composable (only used if cart actions are needed)
let cartComposable = null
if (props.action && ['add', 'remove', 'increase', 'decrease', 'clear'].includes(props.action)) {
  cartComposable = useCart()
}

// Computed properties for action-based defaults
const computedText = computed(() => {
  if (props.text) return props.text
  if (!props.action) return ''
  
  const texts = {
    // Form actions
    submit: 'Submit',
    reset: 'Reset',
    cancel: 'Cancel',
    save: 'Save Changes',
    delete: 'Delete',
    // Cart actions
    add: 'Add to Cart',
    remove: '',
    increase: '',
    decrease: '',
    clear: 'Clear Cart'
  }
  return texts[props.action] || ''
})

const computedIcon = computed(() => {
  if (props.icon) return props.icon
  if (!props.action) return ''
  
  const icons = {
    // Form actions
    submit: '',
    reset: 'heroicons:arrow-path',
    cancel: 'heroicons:x-mark',
    save: 'heroicons:check',
    delete: 'heroicons:trash',
    // Cart actions
    add: '',
    remove: 'heroicons:trash',
    increase: 'heroicons:plus',
    decrease: 'heroicons:minus',
    clear: 'heroicons:trash'
  }
  return icons[props.action] || ''
})

const computedVariant = computed(() => {
  if (props.variant !== 'primary') return props.variant
  if (!props.action) return 'primary'
  
  const variants = {
    // Form actions
    submit: 'primary',
    reset: 'secondary',
    cancel: 'outline',
    save: 'primary',
    delete: 'danger',
    // Cart actions
    add: 'primary',
    remove: 'danger',
    increase: 'ghost',
    decrease: 'ghost',
    clear: 'danger'
  }
  return variants[props.action] || 'primary'
})

const computedType = computed(() => {
  if (props.type !== 'button') return props.type
  if (!props.action) return 'button'
  
  const types = {
    // Form actions
    submit: 'submit',
    reset: 'reset',
    cancel: 'button',
    save: 'submit',
    delete: 'button',
    // Cart actions (all buttons)
    add: 'button',
    remove: 'button',
    increase: 'button',
    decrease: 'button',
    clear: 'button'
  }
  return types[props.action] || 'button'
})

const computedDisabled = computed(() => {
  let baseDisabled = props.disabled || props.loading
  
  // Form validation
  if (props.action && ['submit', 'save'].includes(props.action)) {
    baseDisabled = baseDisabled || !props.isValid
  }
  
  // Cart-specific disable logic
  if (props.action === 'decrease' && props.quantity <= 1) {
    baseDisabled = true
  }
  
  return baseDisabled
})

// Determine the component tag
const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})

// Handle click events
const handleClick = async (event) => {
  if (computedDisabled.value) return
  
  // Handle cart actions
  if (props.action && cartComposable) {
    const { addToCart, removeFromCart, updateQuantity, clearCart, openCart } = cartComposable
    
    try {
      switch (props.action) {
        case 'add':
          if (props.product) {
            addToCart(props.product, props.quantity, props.variation)
            openCart()
            emit('added', { product: props.product, quantity: props.quantity, variation: props.variation })
          }
          break
          
        case 'remove':
          if (props.product) {
            removeFromCart(props.product.id, props.variation)
            emit('removed', { product: props.product, variation: props.variation })
          }
          break
          
        case 'increase':
          if (props.product) {
            updateQuantity(props.product.id, props.quantity + 1, props.variation)
            emit('updated', { product: props.product, quantity: props.quantity + 1, variation: props.variation })
          }
          break
          
        case 'decrease':
          if (props.product && props.quantity > 1) {
            updateQuantity(props.product.id, props.quantity - 1, props.variation)
            emit('updated', { product: props.product, quantity: props.quantity - 1, variation: props.variation })
          }
          break
          
        case 'clear':
          clearCart()
          emit('removed', { all: true })
          break
      }
    } catch (error) {
      console.error('Cart action error:', error)
    }
  }
  
  // Emit action-specific events
  if (props.action) {
    emit(props.action, event)
  }
  
  // Always emit click
  emit('click', event)
}

// Base classes
const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

// Size classes
const sizeClasses = computed(() => {
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  return sizes[props.size]
})

// Variant classes
const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-gray-400',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 disabled:bg-gray-300',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500 disabled:bg-gray-100',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500 disabled:text-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-gray-400',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 disabled:bg-gray-400',
    link: 'bg-transparent hover:underline text-blue-600 hover:text-blue-800 focus:ring-blue-500 disabled:text-gray-400'
  }
  return variants[computedVariant.value]
})

// Rounded classes
const roundedClasses = computed(() => {
  const rounded = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }
  return rounded[props.rounded]
})

// Width classes
const widthClasses = computed(() => {
  return props.fullWidth ? 'w-full' : ''
})

// Disabled classes
const disabledClasses = computed(() => {
  return computedDisabled.value ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
})

// Icon classes
const iconClasses = computed(() => {
  const baseIconClasses = props.loading ? 'animate-spin' : ''
  const sizeIconClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6'
  }
  
  const spacingClasses = (computedText.value || slots.default) ? 'mr-2' : ''
  
  return `${baseIconClasses} ${sizeIconClasses[props.size]} ${spacingClasses}`.trim()
})

// Combine all classes
const buttonClasses = computed(() => {
  return [
    baseClasses,
    sizeClasses.value,
    variantClasses.value,
    roundedClasses.value,
    widthClasses.value,
    disabledClasses.value
  ].join(' ')
})
</script>