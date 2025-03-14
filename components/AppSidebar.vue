<template>
    <div>
      <!-- Mobile sidebar toggle -->
      <div class="fixed inset-0 flex z-40 lg:hidden" v-if="sidebarOpen">
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="sidebarOpen = false"></div>
        <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div class="absolute top-0 right-0 -mr-12 pt-2">
            <button 
              @click="sidebarOpen = false"
              class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span class="sr-only">Close sidebar</span>
              <X class="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>
  
      <!-- Static sidebar for desktop -->
      <div class="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <SidebarContent />
      </div>
  
      <!-- Mobile menu button -->
      <div class="lg:hidden fixed bottom-4 right-4 z-20">
        <button 
          @click="sidebarOpen = true"
          class="flex items-center justify-center h-14 w-14 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Menu class="h-6 w-6" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Menu, X } from 'lucide-vue-next'
  
  const sidebarOpen = ref(false)
  </script>