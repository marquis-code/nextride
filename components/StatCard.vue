<template>
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all duration-200 hover:shadow-md">
      <div class="flex items-center">
        <div :class="[color, 'p-3 rounded-lg']">
          <component :is="iconComponent" :class="[textColor, 'h-6 w-6']" />
        </div>
        <div class="ml-4">
          <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
          <div class="flex items-baseline">
            <p class="text-xl font-semibold text-gray-900">{{ value }}</p>
            <p :class="[
              change.startsWith('+') ? 'text-green-600' : change.startsWith('-') ? 'text-red-600' : 'text-gray-500',
              'ml-2 text-xs font-medium'
            ]">
              {{ change }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import * as LucideIcons from 'lucide-vue-next'
  
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    change: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'bg-primary-100'
    },
    textColor: {
      type: String,
      default: 'text-primary-700'
    }
  })
  
  const iconComponent = computed(() => {
    return LucideIcons[props.icon as keyof typeof LucideIcons]
  })
  </script>