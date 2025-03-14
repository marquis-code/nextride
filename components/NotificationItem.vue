<template>
    <div 
      :class="[
        'p-3 rounded-lg border transition-all duration-200',
        notification.read 
          ? 'bg-white border-gray-200' 
          : 'bg-blue-50 border-blue-200'
      ]"
    >
      <div class="flex items-start">
        <div 
          :class="[
            'p-2 rounded-full',
            typeClasses[notification.type].bg
          ]"
        >
          <component 
            :is="typeClasses[notification.type].icon" 
            :class="[typeClasses[notification.type].text, 'h-5 w-5']" 
          />
        </div>
        <div class="ml-3 flex-1">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
            <p class="text-xs text-gray-500">{{ notification.time }}</p>
          </div>
          <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { AlertTriangle, CheckCircle, Info } from 'lucide-vue-next'
  
  interface Notification {
    id: number
    title: string
    message: string
    time: string
    type: 'warning' | 'success' | 'info'
    read: boolean
  }
  
  const props = defineProps<{
    notification: Notification
  }>()
  
  const typeClasses = {
    warning: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      icon: AlertTriangle
    },
    success: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      icon: CheckCircle
    },
    info: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      icon: Info
    }
  }
  </script>