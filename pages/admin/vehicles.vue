<template>
    <div class="space-y-6">
      <!-- Header with actions -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Tracking</h1>
          <p class="text-gray-500 dark:text-gray-400">Monitor and manage your fleet in real-time</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <button @click="exportVehicleData" class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg flex items-center justify-center">
            <Download class="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button class="px-4 py-2 bg-primary text-white rounded-lg flex items-center justify-center">
            <RefreshCw class="h-4 w-4 mr-2" />
            Refresh Data
          </button>
        </div>
      </div>
  
      <!-- Filters and search -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size="16" />
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search vehicles..."
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <select
              v-model="filters.status"
              class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="idle">Idle</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
            <select
              v-model="filters.partner"
              class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Partners</option>
              <option value="City Fleet Services">City Fleet Services</option>
              <option value="Metro Mobility">Metro Mobility</option>
              <option value="Urban Transit">Urban Transit</option>
            </select>
            <button @click="resetFilters" class="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg flex items-center justify-center">
              <RefreshCw class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
  
      <!-- Map and Vehicle List -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Vehicle List -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Vehicles ({{ filteredVehicles.length }})</h2>
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center mr-3">
                <div class="h-2 w-2 rounded-full bg-success mr-1"></div>
                <span>Active</span>
              </div>
              <div class="flex items-center mr-3">
                <div class="h-2 w-2 rounded-full bg-warning mr-1"></div>
                <span>Idle</span>
              </div>
              <div class="flex items-center">
                <div class="h-2 w-2 rounded-full bg-danger mr-1"></div>
                <span>Maintenance</span>
              </div>
            </div>
          </div>
          <div class="p-4 h-[600px] overflow-y-auto">
            <div class="space-y-3">
              <div 
                v-for="vehicle in filteredVehicles" 
                :key="vehicle.id" 
                @click="selectVehicle(vehicle)"
                class="p-3 rounded-lg cursor-pointer transition-colors"
                :class="[
                  selectedVehicle?.id === vehicle.id 
                    ? 'bg-primary/10 border border-primary/30' 
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-transparent'
                ]"
              >
                <div class="flex justify-between items-start">
                  <div class="flex items-center">
                    <div class="p-2 rounded-full" :class="getVehicleStatusBgClass(vehicle.status)">
                      <Car class="h-4 w-4" :class="getVehicleStatusTextClass(vehicle.status)" />
                    </div>
                    <div class="ml-3">
                      <p class="font-medium text-gray-900 dark:text-white">{{ vehicle.make }} {{ vehicle.model }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ vehicle.licensePlate }}</p>
                    </div>
                  </div>
                  <span class="px-2 py-1 text-xs rounded-full" :class="getVehicleStatusClass(vehicle.status)">
                    {{ vehicle.status }}
                  </span>
                </div>
                <div class="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div class="flex items-center text-gray-500 dark:text-gray-400">
                    <User class="h-3 w-3 mr-1" />
                    <span>{{ vehicle.driver }}</span>
                  </div>
                  <div class="flex items-center text-gray-500 dark:text-gray-400">
                    <MapPin class="h-3 w-3 mr-1" />
                    <span>{{ vehicle.location }}</span>
                  </div>
                  <div class="flex items-center text-gray-500 dark:text-gray-400">
                    <Gauge class="h-3 w-3 mr-1" />
                    <span>{{ vehicle.speed }} mph</span>
                  </div>
                  <div class="flex items-center text-gray-500 dark:text-gray-400">
                    <Battery class="h-3 w-3 mr-1" />
                    <span>{{ vehicle.fuel }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Map -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Live Tracking</h2>
            <div class="flex space-x-2">
              <button class="px-3 py-1 text-xs bg-primary text-white rounded-md flex items-center">
                <MapPin class="h-3 w-3 mr-1" />
                Center Map
              </button>
              <button class="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md flex items-center">
                <Layers class="h-3 w-3 mr-1" />
                Layers
              </button>
            </div>
          </div>
          <div class="p-4">
            <div class="h-[600px] w-full relative">
              <div id="map" class="h-full w-full rounded-lg bg-gray-100 dark:bg-gray-700">
                <!-- Simulated map - in a real app, use Google Maps or another mapping library -->
                <div class="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img 
                    src="https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=13&size=800x600&maptype=roadmap" 
                    alt="Map" 
                    class="w-full h-full object-cover opacity-50"
                  />
                  
                  <!-- Vehicle markers -->
                  <div 
                    v-for="vehicle in filteredVehicles" 
                    :key="vehicle.id"
                    class="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    :style="{
                      top: `${(Math.random() * 80) + 10}%`,
                      left: `${(Math.random() * 80) + 10}%`
                    }"
                    @click="selectVehicle(vehicle)"
                  >
                    <div 
                      class="p-1 rounded-full"
                      :class="[
                        getVehicleStatusBgClass(vehicle.status),
                        selectedVehicle?.id === vehicle.id ? 'ring-2 ring-primary ring-offset-2' : ''
                      ]"
                    >
                      <Car class="h-4 w-4" :class="getVehicleStatusTextClass(vehicle.status)" />
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Vehicle Info Popup -->
              <div 
                v-if="selectedVehicle" 
                class="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-20 w-72"
              >
                <button @click="selectedVehicle = null" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X class="h-4 w-4" />
                </button>
                <div class="flex items-center mb-3">
                  <div class="p-2 rounded-full" :class="getVehicleStatusBgClass(selectedVehicle.status)">
                    <Car class="h-5 w-5" :class="getVehicleStatusTextClass(selectedVehicle.status)" />
                  </div>
                  <div class="ml-3">
                    <h3 class="font-medium text-gray-900 dark:text-white">{{ selectedVehicle.make }} {{ selectedVehicle.model }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ selectedVehicle.licensePlate }}</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-2 mb-3">
                  <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Status</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white capitalize">{{ selectedVehicle.status }}</p>
                  </div>
                  <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Driver</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedVehicle.driver }}</p>
                  </div>
                  <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Speed</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedVehicle.speed }} mph</p>
                  </div>
                  <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Fuel Level</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedVehicle.fuel }}%</p>
                  </div>
                </div>
                
                <div class="mb-3">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Location</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedVehicle.location }}</p>
                </div>
                
                <div class="flex space-x-2">
                  <button class="flex-1 bg-primary text-white text-sm py-2 rounded-lg flex items-center justify-center">
                    <PhoneCall class="h-4 w-4 mr-1" />
                    Contact
                  </button>
                  <button class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm py-2 rounded-lg flex items-center justify-center">
                    <Route class="h-4 w-4 mr-1" />
                    Route
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Vehicle Analytics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Vehicles</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ analytics.totalVehicles }}</p>
            </div>
            <div class="p-2 rounded-full bg-primary/10">
              <Car class="h-5 w-5 text-primary" />
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between text-xs">
            <div class="flex items-center">
              <div class="h-2 w-2 rounded-full bg-success mr-1"></div>
              <span class="text-gray-500 dark:text-gray-400">Active: {{ analytics.activeVehicles }}</span>
            </div>
            <div class="flex items-center">
              <div class="h-2 w-2 rounded-full bg-warning mr-1"></div>
              <span class="text-gray-500 dark:text-gray-400">Idle: {{ analytics.idleVehicles }}</span>
            </div>
            <div class="flex items-center">
              <div class="h-2 w-2 rounded-full bg-danger mr-1"></div>
              <span class="text-gray-500 dark:text-gray-400">Maintenance: {{ analytics.maintenanceVehicles }}</span>
            </div>
          </div>
        </div>
  
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Distance Today</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ analytics.totalDistance }} mi</p>
            </div>
            <div class="p-2 rounded-full bg-secondary/10">
              <Route class="h-5 w-5 text-secondary" />
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center">
              <TrendingUp class="h-4 w-4 text-success mr-1" />
              <span class="text-success">{{ analytics.distanceGrowth }}% increase from yesterday</span>
            </div>
          </div>
        </div>
  
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Average Speed</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ analytics.averageSpeed }} mph</p>
            </div>
            <div class="p-2 rounded-full bg-accent/10">
              <Gauge class="h-5 w-5 text-accent" />
            </div>
          </div>
          <div class="mt-4">
            <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-accent" :style="{ width: `${(analytics.averageSpeed / analytics.maxSpeed) * 100}%` }"></div>
            </div>
            <div class="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>0 mph</span>
              <span>Max: {{ analytics.maxSpeed }} mph</span>
            </div>
          </div>
        </div>
  
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Fuel Efficiency</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ analytics.fuelEfficiency }} mpg</p>
            </div>
            <div class="p-2 rounded-full bg-success/10">
              <Droplet class="h-5 w-5 text-success" />
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center">
              <TrendingUp class="h-4 w-4 text-success mr-1" />
              <span class="text-success">{{ analytics.fuelEfficiencyGrowth }}% better than last month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import {
    Search,
    Download,
    RefreshCw,
    Car,
    User,
    MapPin,
    Gauge,
    Battery,
    Layers,
    X,
    PhoneCall,
    Route,
    TrendingUp,
    Droplet
  } from 'lucide-vue-next'
  import { ref, reactive, computed } from 'vue'
  
  // Filters
  const filters = reactive({
    search: '',
    status: '',
    partner: ''
  })
  
  // Selected vehicle
  const selectedVehicle = ref(null)
  
  // Vehicle data
  const vehicles = ref([
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2021,
      licensePlate: 'ABC-1234',
      driver: 'John Doe',
      partner: 'City Fleet Services',
      status: 'active',
      speed: 35,
      fuel: 78,
      location: 'Downtown, Main St'
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Accord',
      year: 2020,
      licensePlate: 'XYZ-5678',
      driver: 'Jane Smith',
      partner: 'City Fleet Services',
      status: 'active',
      speed: 28,
      fuel: 65,
      location: 'Midtown, 5th Ave'
    },
    {
      id: 3,
      make: 'Ford',
      model: 'Fusion',
      year: 2019,
      licensePlate: 'DEF-9012',
      driver: 'Mike Johnson',
      partner: 'Metro Mobility',
      status: 'maintenance',
      speed: 0,
      fuel: 45,
      location: 'Service Center, Industrial Blvd'
    },
    {
      id: 4,
      make: 'Chevrolet',
      model: 'Malibu',
      year: 2022,
      licensePlate: 'GHI-3456',
      driver: 'Sarah Williams',
      partner: 'Metro Mobility',
      status: 'active',
      speed: 42,
      fuel: 92,
      location: 'Uptown, Park Ave'
    },
    {
      id: 5,
      make: 'Nissan',
      model: 'Altima',
      year: 2020,
      licensePlate: 'JKL-7890',
      driver: 'David Brown',
      partner: 'Urban Transit',
      status: 'idle',
      speed: 0,
      fuel: 34,
      location: 'East Side, River Rd'
    },
    {
      id: 6,
      make: 'Hyundai',
      model: 'Sonata',
      year: 2021,
      licensePlate: 'MNO-1234',
      driver: 'Emily Davis',
      partner: 'Urban Transit',
      status: 'active',
      speed: 38,
      fuel: 82,
      location: 'West End, Market St'
    },
    {
      id: 7,
      make: 'Kia',
      model: 'Optima',
      year: 2019,
      licensePlate: 'PQR-5678',
      driver: 'Robert Wilson',
      partner: 'City Fleet Services',
      status: 'idle',
      speed: 0,
      fuel: 56,
      location: 'North Side, Oak St'
    },
    {
      id: 8,
      make: 'Mazda',
      model: 'Mazda6',
      year: 2022,
      licensePlate: 'STU-9012',
      driver: 'Jennifer Taylor',
      partner: 'Metro Mobility',
      status: 'active',
      speed: 31,
      fuel: 73,
      location: 'South Side, Pine St'
    }
  ])
  
  // Analytics data
  const analytics = reactive({
    totalVehicles: 8,
    activeVehicles: 5,
    idleVehicles: 2,
    maintenanceVehicles: 1,
    totalDistance: 1248,
    distanceGrowth: 12,
    averageSpeed: 35,
    maxSpeed: 65,
    fuelEfficiency: 28.5,
    fuelEfficiencyGrowth: 5.2
  })
  
  // Filtered vehicles based on search and filters
  const filteredVehicles = computed(() => {
    return vehicles.value.filter(vehicle => {
      const matchesSearch = !filters.search || 
        vehicle.make.toLowerCase().includes(filters.search.toLowerCase()) || 
        vehicle.model.toLowerCase().includes(filters.search.toLowerCase()) || 
        vehicle.licensePlate.toLowerCase().includes(filters.search.toLowerCase()) ||
        vehicle.driver.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesStatus = !filters.status || vehicle.status === filters.status
      const matchesPartner = !filters.partner || vehicle.partner === filters.partner
      
      return matchesSearch && matchesStatus && matchesPartner
    })
  })
  
  // Reset filters
  function resetFilters() {
    filters.search = ''
    filters.status = ''
    filters.partner = ''
  }

  definePageMeta({
    layout: 'dashboard'
})
  
  // Select vehicle
  </script>