<template>
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="flex justify-between items-center px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex-1 flex">
          <form class="w-full flex md:ml-0" action="#" method="GET">
            <label for="search-field" class="sr-only">Search</label>
            <div class="relative w-full text-gray-400 focus-within:text-gray-600">
              <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <Search class="h-5 w-5" />
              </div>
              <input
                id="search-field"
                class="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Search vehicles, drivers..."
                type="search"
                name="search"
              />
            </div>
          </form>
        </div>
        <div class="flex items-center space-x-4">
          <button class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <span class="sr-only">View notifications</span>
            <div class="relative">
              <Bell class="h-6 w-6" />
              <span class="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
                3
              </span>
            </div>
          </button>
          <button class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <span class="sr-only">View messages</span>
            <MessageSquare class="h-6 w-6" />
          </button>
          <div class="border-l border-gray-200 h-6 mx-2"></div>
          <div class="flex items-center">
            <img class="h-8 w-8 rounded-full" src="/placeholder.svg?height=32&width=32" alt="User avatar" />
            <span class="ml-2 text-sm font-medium text-gray-700 hidden md:block">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { Search, Bell, MessageSquare } from 'lucide-vue-next'
  </script>