<template>
    <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Sidebar -->
      <div
        :class="[
          'transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-lg',
          isSidebarOpen ? 'w-64' : 'w-20',
          'md:w-64 fixed h-full z-30'
        ]"
      >
        <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div class="flex items-center">
            <img src="/logo.svg" alt="Nextride Logo" class="h-8 w-8 mr-2" />
            <h1
              :class="[
                'font-bold text-xl text-primary transition-opacity duration-200',
                isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden md:block md:opacity-100'
              ]"
            >
              Nextride
            </h1>
          </div>
          <button
            @click="toggleSidebar"
            class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden"
          >
            <Menu v-if="!isSidebarOpen" class="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <X v-else class="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
  
        <div class="py-4">
          <div class="px-4 mb-6">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size="16" />
              <input
                type="text"
                placeholder="Search..."
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                :class="{ 'hidden': !isSidebarOpen && !isDesktop }"
              />
            </div>
          </div>
  
          <div class="space-y-1">
            <!-- Dashboard Section -->
            <div class="px-3 mb-2">
              <h3
                class="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400"
                :class="{ 'hidden': !isSidebarOpen && !isDesktop }"
              >
                Dashboards
              </h3>
            </div>
  
            <NuxtLink
              to="/admin"
              class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
              :class="[
                route.path.includes('/admin')
                  ? 'text-white bg-primary'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                { 'justify-center': !isSidebarOpen && !isDesktop }
              ]"
            >
              <LayoutDashboard class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
              <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Internal Admin</span>
            </NuxtLink>
  
            <NuxtLink
              to="/corporate"
              class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
              :class="[
                route.path.includes('/corporate')
                  ? 'text-white bg-primary'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                { 'justify-center': !isSidebarOpen && !isDesktop }
              ]"
            >
              <Briefcase class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
              <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Corporate</span>
            </NuxtLink>
  
            <NuxtLink
              to="/partners"
              class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
              :class="[
                route.path.includes('/partners')
                  ? 'text-white bg-primary'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                { 'justify-center': !isSidebarOpen && !isDesktop }
              ]"
            >
              <Car class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
              <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Vehicle Partners</span>
            </NuxtLink>
  
            <!-- Admin Features Section -->
            <div v-if="route.path.includes('/admin')" class="mt-6">
              <div class="px-3 mb-2">
                <h3
                  class="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400"
                  :class="{ 'hidden': !isSidebarOpen && !isDesktop }"
                >
                  Admin Features
                </h3>
              </div>
  
              <NuxtLink
                to="/admin/users"
                class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                :class="[
                  route.path === '/admin/users'
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                  { 'justify-center': !isSidebarOpen && !isDesktop }
                ]"
              >
                <Users class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
                <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">User Management</span>
              </NuxtLink>
  
              <NuxtLink
                to="/admin/bookings"
                class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                :class="[
                  route.path === '/admin/bookings'
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                  { 'justify-center': !isSidebarOpen && !isDesktop }
                ]"
              >
                <CalendarCheck class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
                <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Bookings</span>
              </NuxtLink>
  
              <NuxtLink
                to="/admin/finance"
                class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                :class="[
                  route.path === '/admin/finance'
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                  { 'justify-center': !isSidebarOpen && !isDesktop }
                ]"
              >
                <DollarSign class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
                <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Financial Tracking</span>
              </NuxtLink>
  
              <NuxtLink
                to="/admin/vehicles"
                class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                :class="[
                  route.path === '/admin/vehicles'
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                  { 'justify-center': !isSidebarOpen && !isDesktop }
                ]"
              >
                <MapPin class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
                <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Vehicle Tracking</span>
              </NuxtLink>
  
              <NuxtLink
                to="/admin/support"
                class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                :class="[
                  route.path === '/admin/support'
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                  { 'justify-center': !isSidebarOpen && !isDesktop }
                ]"
              >
                <LifeBuoy class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
                <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Support</span>
              </NuxtLink>
  
              <NuxtLink
                to="/admin/analytics"
                class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                :class="[
                  route.path === '/admin/analytics'
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                  { 'justify-center': !isSidebarOpen && !isDesktop }
                ]"
              >
                <BarChart class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
                <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Analytics</span>
              </NuxtLink>
            </div>
  
            <!-- Corporate Features Section -->
            <div v-if="route.path.includes('/corporate')" class="mt-6">
              <div class="px-3 mb-2">
                <h3
                  class="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400"
                  :class="{ 'hidden': !isSidebarOpen && !isDesktop }"
                >
                  Corporate Features
                </h3>
              </div>
  
              <NuxtLink
                to="/corporate/trips"
                class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                :class="[
                  route.path === '/corporate/trips'
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                  { 'justify-center': !isSidebarOpen && !isDesktop }
                ]"
              >
                <Route class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
                <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Trip Management</span>
              </NuxtLink>
  
              <NuxtLink
                to="/corporate/billing"
                class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                :class="[
                  route.path === '/corporate/billing'
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                  { 'justify-center': !isSidebarOpen && !isDesktop }
                ]"
              >
                <Receipt class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
                <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Billing & Invoicing</span>
              </NuxtLink>
  
              <NuxtLink
                to="/corporate/employees"
                class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                :class="[
                  route.path === '/corporate/employees'
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                  { 'justify-center': !isSidebarOpen && !isDesktop }
                ]"
              >
                <UserPlus class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
                <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Employee Management</span>
              </NuxtLink>
  
              <NuxtLink
                to="/corporate/reports"
                class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                :class="[
                  route.path === '/corporate/reports'
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                  { 'justify-center': !isSidebarOpen && !isDesktop }
                ]"
              >
                <FileText class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
                <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Reports</span>
              </NuxtLink>
            </div>
  
            <!-- Partners Features Section -->
            <div v-if="route.path.includes('/partners')" class="mt-6">
              <div class="px-3 mb-2">
                <h3
                  class="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400"
                  :class="{ 'hidden': !isSidebarOpen && !isDesktop }"
                >
                  Partner Features
                </h3>
              </div>
  
              <NuxtLink
                to="/partners/earnings"
                class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                :class="[
                  route.path === '/partners/earnings'
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                  { 'justify-center': !isSidebarOpen && !isDesktop }
                ]"
              >
                <TrendingUp class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
                <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Earnings Dashboard</span>
              </NuxtLink>
  
              <NuxtLink
                to="/partners/performance"
                class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                :class="[
                  route.path === '/partners/performance'
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                  { 'justify-center': !isSidebarOpen && !isDesktop }
                ]"
              >
                <Activity class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
                <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Performance Metrics</span>
              </NuxtLink>
  
              <NuxtLink
                to="/partners/payouts"
                class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                :class="[
                  route.path === '/partners/payouts'
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                  { 'justify-center': !isSidebarOpen && !isDesktop }
                ]"
              >
                <CreditCard class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
                <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Payout Management</span>
              </NuxtLink>
  
              <NuxtLink
                to="/partners/vehicles"
                class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                :class="[
                  route.path === '/partners/vehicles'
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                  { 'justify-center': !isSidebarOpen && !isDesktop }
                ]"
              >
                <Truck class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
                <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Vehicle Management</span>
              </NuxtLink>
  
              <NuxtLink
                to="/partners/support"
                class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                :class="[
                  route.path === '/partners/support'
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
                  { 'justify-center': !isSidebarOpen && !isDesktop }
                ]"
              >
                <MessageSquare class="h-5 w-5 mr-3" :class="{ 'mr-0': !isSidebarOpen && !isDesktop }" />
                <span :class="{ 'hidden': !isSidebarOpen && !isDesktop }">Support</span>
              </NuxtLink>
            </div>
          </div>
        </div>
  
        <div class="absolute bottom-0 w-full p-4 border-t dark:border-gray-700">
          <div class="flex items-center">
            <img
              src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff"
              alt="User"
              class="h-8 w-8 rounded-full"
            />
            <div :class="{ 'hidden': !isSidebarOpen && !isDesktop, 'ml-3': isSidebarOpen || isDesktop }">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-200">Admin User</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">admin@nextride.com</p>
            </div>
            <button
              class="ml-auto p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              :class="{ 'hidden': !isSidebarOpen && !isDesktop }"
            >
              <LogOut class="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
  
      <!-- Main Content -->
      <div
        class="flex-1 transition-all duration-300 ease-in-out"
        :class="[isSidebarOpen ? 'md:ml-64' : 'md:ml-20', 'ml-0']"
      >
        <!-- Top Navigation -->
        <header class="bg-white dark:bg-gray-800 shadow-sm z-20 sticky top-0">
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center">
              <button
                @click="toggleSidebar"
                class="p-1 mr-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hidden md:block"
              >
                <Menu v-if="!isSidebarOpen" class="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <X v-else class="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
              <h1 class="text-xl font-semibold text-gray-800 dark:text-white">
                {{ pageTitle }}
              </h1>
            </div>
  
            <div class="flex items-center space-x-4">
              <button class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative">
                <Bell class="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <span
                  class="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"
                ></span>
              </button>
              <button @click="toggleDarkMode" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <Sun v-if="isDarkMode" class="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <Moon v-else class="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </header>
  
        <!-- Page Content -->
        <main class="p-4 md:p-6 bg-gray-100 dark:bg-gray-900 min-h-[calc(100vh-64px)]">
          <slot />
        </main>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import {
    Menu,
    X,
    Search,
    LayoutDashboard,
    Briefcase,
    Car,
    Users,
    CalendarCheck,
    DollarSign,
    MapPin,
    LifeBuoy,
    BarChart,
    Route,
    Receipt,
    UserPlus,
    FileText,
    TrendingUp,
    Activity,
    CreditCard,
    Truck,
    MessageSquare,
    Bell,
    Sun,
    Moon,
    LogOut
  } from 'lucide-vue-next'
  
  const route = useRoute()
  const isSidebarOpen = ref(true)
  const isDarkMode = ref(false)
  const isDesktop = ref(true)
  
  // Detect if we're on desktop
  onMounted(() => {
    checkIfDesktop()
    window.addEventListener('resize', checkIfDesktop)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkIfDesktop)
  })
  
  function checkIfDesktop() {
    isDesktop.value = window.innerWidth >= 768
    if (!isDesktop.value) {
      isSidebarOpen.value = false
    }
  }
  
  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }
  
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  // Compute page title based on route
  const pageTitle = computed(() => {
    const path = route.path
    
    if (path === '/admin') return 'Internal Admin Dashboard'
    if (path === '/admin/users') return 'User Management'
    if (path === '/admin/bookings') return 'Booking Management'
    if (path === '/admin/finance') return 'Financial Tracking'
    if (path === '/admin/vehicles') return 'Vehicle Tracking'
    if (path === '/admin/support') return 'Customer Support'
    if (path === '/admin/analytics') return 'Data Analytics'
    
    if (path === '/corporate') return 'Corporate Dashboard'
    if (path === '/corporate/trips') return 'Trip Management'
    if (path === '/corporate/billing') return 'Billing & Invoicing'
    if (path === '/corporate/employees') return 'Employee Management'
    if (path === '/corporate/reports') return 'Reports'
    
    if (path === '/partners') return 'Vehicle Partners Dashboard'
    if (path === '/partners/earnings') return 'Earnings Dashboard'
    if (path === '/partners/performance') return 'Performance Metrics'
    if (path === '/partners/payouts') return 'Payout Management'
    if (path === '/partners/vehicles') return 'Vehicle Management'
    if (path === '/partners/support') return 'Support & Communication'
    
    return 'Nextride Admin Portal'
  })
  </script>
  
  <style>
  :root {
    --primary: 99, 102, 241; /* Indigo-500 */
    --primary-foreground: 255, 255, 255;
    --secondary: 249, 115, 22; /* Orange-500 */
    --secondary-foreground: 255, 255, 255;
    --accent: 124, 58, 237; /* Purple-600 */
    --accent-foreground: 255, 255, 255;
    --success: 34, 197, 94; /* Green-500 */
    --warning: 234, 179, 8; /* Yellow-500 */
    --danger: 239, 68, 68; /* Red-500 */
    --info: 6, 182, 212; /* Cyan-500 */
  }
  
  .bg-primary {
    background-color: rgb(var(--primary));
  }
  
  .text-primary {
    color: rgb(var(--primary));
  }
  
  .bg-secondary {
    background-color: rgb(var(--secondary));
  }
  
  .text-secondary {
    color: rgb(var(--secondary));
  }
  
  .bg-accent {
    background-color: rgb(var(--accent));
  }
  
  .text-accent {
    color: rgb(var(--accent));
  }
  
  .bg-success {
    background-color: rgb(var(--success));
  }
  
  .bg-warning {
    background-color: rgb(var(--warning));
  }
  
  .bg-danger {
    background-color: rgb(var(--danger));
  }
  
  .bg-info {
    background-color: rgb(var(--info));
  }
  </style>