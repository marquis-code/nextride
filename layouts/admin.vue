<template>
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Sidebar -->
      <aside 
        :class="[
          'fixed inset-y-0 z-50 flex flex-col w-64 transition-all duration-300 transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700',
          isSidebarOpen ? 'left-0' : '-left-64 md:left-0'
        ]"
      >
        <div class="flex items-center justify-between px-4 py-4 border-b dark:border-gray-700">
          <div class="flex items-center space-x-2">
            <img src="/logo.svg" alt="Nextride Logo" class="w-8 h-8" />
            <h2 class="text-xl font-bold text-primary-600 dark:text-primary-400">Nextride</h2>
          </div>
          <button 
            @click="toggleSidebar" 
            class="p-1 rounded-md md:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X class="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div class="flex flex-col flex-1 overflow-y-auto">
          <nav class="flex-1 px-2 py-4 space-y-1">
            <div v-for="(section, index) in navigationItems" :key="index" class="mb-4">
              <p class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                {{ section.title }}
              </p>
              <div class="space-y-1">
                <NuxtLink
                  v-for="item in section.items"
                  :key="item.name"
                  :to="item.href"
                  :class="[
                    currentRoute === item.href
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
                  ]"
                >
                  <component :is="item.icon" class="w-5 h-5 mr-3" :class="currentRoute === item.href ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400'" />
                  {{ item.name }}
                </NuxtLink>
              </div>
            </div>
          </nav>
        </div>
        
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <img src="/avatar.svg" alt="User avatar" class="w-8 h-8 rounded-full" />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Admin User</p>
              <button @click="logout" class="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400">
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>
  
      <!-- Main Content -->
      <div :class="['flex flex-col flex-1', isSidebarOpen ? 'md:ml-64' : '']">
        <header class="z-10 py-4 bg-white shadow-sm dark:bg-gray-800">
          <div class="flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <button 
              @click="toggleSidebar" 
              class="p-1 mr-4 rounded-md md:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu class="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
            
            <h1 class="text-xl font-semibold text-gray-800 dark:text-white">{{ pageTitle }}</h1>
            
            <div class="flex items-center space-x-4">
              <button class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell class="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
              <button @click="toggleTheme" class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Sun v-if="isDarkMode" class="w-6 h-6 text-gray-500 dark:text-gray-400" />
                <Moon v-else class="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </header>
        
        <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
          <slot />
        </main>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { 
    Home, Users, Calendar, TruckIcon, DollarSign, 
    BarChart2, Settings, HelpCircle, Shield, 
    Menu, X, Bell, Sun, Moon
  } from 'lucide-vue-next';
  
  const route = useRoute();
  const isSidebarOpen = ref(false);
  const isDarkMode = ref(false);
  
  const navigationItems = [
    {
      title: 'Dashboard',
      items: [
        { name: 'Overview', href: '/', icon: Home },
        { name: 'Analytics', href: '/analytics', icon: BarChart2 },
      ]
    },
    {
      title: 'Management',
      items: [
        { name: 'Users', href: '/users', icon: Users },
        { name: 'Bookings', href: '/bookings', icon: Calendar },
        { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
        { name: 'Finances', href: '/finances', icon: DollarSign },
      ]
    },
    {
      title: 'Support',
      items: [
        { name: 'Customer Issues', href: '/support', icon: HelpCircle },
        { name: 'Settings', href: '/settings', icon: Settings },
        { name: 'Admin Logs', href: '/admin-logs', icon: Shield },
      ]
    }
  ];
  
  const currentRoute = computed(() => route.path);
  
  const pageTitle = computed(() => {
    const currentPath = route.path;
    for (const section of navigationItems) {
      for (const item of section.items) {
        if (item.href === currentPath) {
          return item.name;
        }
      }
    }
    return 'Dashboard';
  });
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const logout = () => {
    // Implement logout functionality
    alert('Logout functionality would be implemented here');
  };
  
  onMounted(() => {
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDarkMode.value = true;
      document.documentElement.classList.add('dark');
    }
    
    // For mobile, sidebar is closed by default
    isSidebarOpen.value = window.innerWidth >= 768;
  });
  </script>
  
  <style>
  :root {
    --primary-50: #f0f9ff;
    --primary-100: #e0f2fe;
    --primary-200: #bae6fd;
    --primary-300: #7dd3fc;
    --primary-400: #38bdf8;
    --primary-500: #0ea5e9;
    --primary-600: #0284c7;
    --primary-700: #0369a1;
    --primary-800: #075985;
    --primary-900: #0c4a6e;
    --primary-950: #082f49;
  }
  
  .dark {
    --primary-50: #082f49;
    --primary-100: #0c4a6e;
    --primary-200: #075985;
    --primary-300: #0369a1;
    --primary-400: #0284c7;
    --primary-500: #0ea5e9;
    --primary-600: #38bdf8;
    --primary-700: #7dd3fc;
    --primary-800: #bae6fd;
    --primary-900: #e0f2fe;
    --primary-950: #f0f9ff;
  }
  
  .text-primary-400 { color: var(--primary-400); }
  .text-primary-500 { color: var(--primary-500); }
  .text-primary-600 { color: var(--primary-600); }
  .bg-primary-50 { background-color: var(--primary-50); }
  .bg-primary-900\/30 { background-color: rgba(12, 74, 110, 0.3); }
  </style>