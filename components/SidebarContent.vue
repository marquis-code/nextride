<template>
    <div class="flex flex-col h-full bg-primary-900 text-white">
      <div class="flex items-center justify-center h-16 px-4 border-b border-primary-800">
        <div class="flex items-center">
          <Car class="h-8 w-8 text-primary-300" />
          <span class="ml-2 text-xl font-bold">Nextride</span>
        </div>
      </div>
      <div class="flex-1 flex flex-col overflow-y-auto">
        <nav class="flex-1 px-2 py-4 space-y-1">
          <NuxtLink 
            v-for="item in navigation" 
            :key="item.name" 
            :to="item.href" 
            :class="[
              item.current 
                ? 'bg-primary-800 text-white' 
                : 'text-primary-100 hover:bg-primary-700',
              'group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-150'
            ]"
          >
            <component :is="item.icon" class="mr-3 h-5 w-5 text-primary-300" />
            {{ item.name }}
          </NuxtLink>
        </nav>
      </div>
      <div class="p-4 border-t border-primary-800">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img class="h-10 w-10 rounded-full" src="/placeholder.svg?height=40&width=40" alt="User avatar" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-white">John Doe</p>
            <p class="text-xs text-primary-300">Vehicle Partner</p>
          </div>
        </div>
        <button class="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-primary-100 bg-primary-800 rounded-md hover:bg-primary-700">
          <LogOut class="mr-2 h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { 
    Home, 
    Car, 
    LineChart, 
    Wallet, 
    Users, 
    Settings, 
    HelpCircle, 
    MapPin, 
    LogOut 
  } from 'lucide-vue-next'
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: true },
    { name: 'Vehicles', href: '/vehicles', icon: Car, current: false },
    { name: 'Earnings', href: '/earnings', icon: LineChart, current: false },
    { name: 'Payouts', href: '/payouts', icon: Wallet, current: false },
    { name: 'Drivers', href: '/drivers', icon: Users, current: false },
    { name: 'Tracking', href: '/tracking', icon: MapPin, current: false },
    { name: 'Support', href: '/support', icon: HelpCircle, current: false },
    { name: 'Settings', href: '/settings', icon: Settings, current: false },
  ]
  </script>