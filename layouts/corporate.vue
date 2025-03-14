<template>
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Sidebar -->
      <div
        :class="[
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:relative lg:translate-x-0'
        ]"
      >
        <div class="flex h-16 items-center justify-between px-4">
          <div class="flex items-center space-x-2">
            <div class="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <Car class="h-5 w-5 text-white" />
            </div>
            <span class="text-xl font-bold text-gray-800 dark:text-white">MobiCorp</span>
          </div>
          <button
            @click="toggleSidebar"
            class="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 lg:hidden"
          >
            <XIcon class="h-6 w-6" />
          </button>
        </div>
  
        <div class="px-4 py-2">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              class="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-emerald-400"
            />
          </div>
        </div>
  
        <nav class="mt-4 px-2">
          <div class="space-y-1">
            <NuxtLink
              v-for="(item, index) in navigationItems"
              :key="index"
              :to="item.path"
              :class="[
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                $route.path === item.path
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              ]"
            >
              <component :is="item.icon" class="mr-3 h-5 w-5 flex-shrink-0" />
              {{ item.name }}
            </NuxtLink>
          </div>
        </nav>
  
        <div class="absolute bottom-0 w-full border-t border-gray-200 p-4 dark:border-gray-700">
          <div class="flex items-center space-x-3">
            <div class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700">
              <img
                src="https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff"
                alt="User avatar"
                class="h-full w-full rounded-full"
              />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">John Doe</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Fleet Manager</p>
            </div>
            <button class="ml-auto rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300">
              <LogOut class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
  
      <!-- Main Content -->
      <div class="flex flex-1 flex-col lg:ml-64">
        <!-- Top Navigation -->
        <header class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800">
          <button
            @click="toggleSidebar"
            class="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 lg:hidden"
          >
            <Menu class="h-6 w-6" />
          </button>
  
          <div class="flex items-center space-x-4">
            <button class="relative rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
              <Bell class="h-6 w-6" />
              <span class="absolute right-0 top-0 flex h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <button @click="toggleDarkMode" class="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
              <component :is="isDarkMode ? Sun : Moon" class="h-6 w-6" />
            </button>
          </div>
        </header>
  
        <!-- Page Content -->
        <main class="flex-1 overflow-auto p-4 lg:p-6">
          <slot />
        </main>
      </div>
  
      <!-- Mobile Sidebar Overlay -->
      <div
        v-if="isSidebarOpen"
        @click="toggleSidebar"
        class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
      ></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { 
    Menu, 
    X as XIcon, 
    Bell, 
    Search, 
    LogOut, 
    Sun, 
    Moon, 
    Car,
    LayoutDashboard,
    Calendar,
    FileText,
    Users,
    Map,
    Settings
  } from 'lucide-vue-next';
  
  const isSidebarOpen = ref(false);
  const isDarkMode = ref(false);
  
  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Trip Management', path: '/trips', icon: Calendar },
    { name: 'Billing & Invoicing', path: '/billing', icon: FileText },
    { name: 'Employee Management', path: '/employees', icon: Users },
    { name: 'Vehicle Tracking', path: '/tracking', icon: Map },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };
  
  onMounted(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      isDarkMode.value = true;
      document.documentElement.classList.add('dark');
    }
    
    // Check if we're on desktop and set sidebar accordingly
    if (window.innerWidth >= 1024) {
      isSidebarOpen.value = true;
    }
  });
  </script>