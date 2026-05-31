<template>
  <!-- Shared filter fields used by both mobile and desktop ProductFilters surfaces. -->
  <!-- Price Range -->
  <div class="mb-6">
    <h4 class="font-medium mb-3">{{ $t('filters.priceRange') }}</h4>
    <div class="space-y-2">
      <input
        v-model="filters.minPrice"
        type="number"
        :placeholder="$t('filters.minPrice')"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        @input="$emit('update')"
      >
      <input
        v-model="filters.maxPrice"
        type="number"
        :placeholder="$t('filters.maxPrice')"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        @input="$emit('update')"
      >
    </div>
  </div>

  <!-- Categories -->
  <div class="mb-6" v-if="categories.length > 0">
    <h4 class="font-medium mb-3">{{ $t('filters.categories') }}</h4>
    <div class="space-y-2 max-h-40 overflow-y-auto">
      <label
        v-for="category in categories"
        :key="category.id"
        class="flex items-center"
      >
        <input
          type="checkbox"
          :value="category.id"
          v-model="filters.categories"
          @change="$emit('update')"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        >
        <span class="ml-2 text-sm">{{ category.name }} ({{ category.count }})</span>
      </label>
    </div>
  </div>

  <!-- Product Attributes (these come from WooCommerce, names stay as-is) -->
  <div v-for="attribute in attributes" :key="attribute.id" class="mb-6">
    <h4 class="font-medium mb-3">{{ attribute.name }}</h4>
    <div class="space-y-2 max-h-40 overflow-y-auto">
      <label
        v-for="term in attribute.terms"
        :key="term.id"
        class="flex items-center"
      >
        <input
          type="checkbox"
          :value="term.slug"
          v-model="filters.attributes[attribute.slug]"
          @change="$emit('update')"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        >
        <span class="ml-2 text-sm">{{ term.name }}</span>
      </label>
    </div>
  </div>

  <!-- Stock Status -->
  <div class="mb-6">
    <h4 class="font-medium mb-3">{{ $t('filters.availability') }}</h4>
    <div class="space-y-2">
      <label class="flex items-center">
        <input
          type="checkbox"
          value="instock"
          v-model="filters.stockStatus"
          @change="$emit('update')"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        >
        <span class="ml-2 text-sm">{{ $t('filters.inStock') }}</span>
      </label>
      <label class="flex items-center">
        <input
          type="checkbox"
          value="onbackorder"
          v-model="filters.stockStatus"
          @change="$emit('update')"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        >
        <span class="ml-2 text-sm">{{ $t('filters.onBackorder') }}</span>
      </label>
    </div>
  </div>

  <!-- On Sale -->
  <div class="mb-6">
    <label class="flex items-center">
      <input
        type="checkbox"
        v-model="filters.onSale"
        @change="$emit('update')"
        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      >
      <span class="ml-2 text-sm font-medium">{{ $t('filters.onSale') }}</span>
    </label>
  </div>

  <!-- Featured -->
  <div class="mb-6">
    <label class="flex items-center">
      <input
        type="checkbox"
        v-model="filters.featured"
        @change="$emit('update')"
        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      >
      <span class="ml-2 text-sm font-medium">{{ $t('filters.featured') }}</span>
    </label>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  attributes: { type: Array, default: () => [] },
  filters: { type: Object, required: true }
})

defineEmits(['update'])
</script>
