<template>
    <div class="space-y-6">
      <!-- Welcome Banner -->
      <div class="bg-gradient-to-r from-primary/90 to-accent/90 rounded-lg shadow p-6 text-white">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold">Welcome, {{ partnerInfo.name }}</h1>
            <p class="text-white/80">Vehicle Partner Dashboard</p>
          </div>
          <div class="flex space-x-3">
            <button class="px-4 py-2 bg-white text-primary rounded-lg flex items-center">
              <Car class="h-4 w-4 mr-2" />
              Add Vehicle
            </button>
            <button class="px-4 py-2 bg-white/20 text-white rounded-lg flex items-center">
              <MessageSquare class="h-4 w-4 mr-2" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
  
      <!-- Earnings Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Earnings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ earnings.total.toLocaleString() }}</p>
            </div>
            <div class="p-2 rounded-full bg-success/10">
              <DollarSign class="h-5 w-5 text-success" />
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center">
              <TrendingUp v-if="earnings.growth > 0" class="h-4 w-4 text-success mr-1" />
              <TrendingDown v-else class="h-4 w-4 text-danger mr-1" />
              <span :class="earnings.growth > 0 ? 'text-success' : 'text-danger'">
                {{ Math.abs(earnings.growth) }}% {{ earnings.growth > 0 ? 'increase' : 'decrease' }} from last month
              </span>
            </div>
          </div>
        </div>
  
        <!-- Pending Payout -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Payout</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ earnings.pending.toLocaleString() }}</p>
            </div>
            <div class="p-2 rounded-full bg-warning/10">
              <Clock class="h-5 w-5 text-warning" />
            </div>
          </div>
          <div class="mt-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">Next payout scheduled for {{ earnings.nextPayoutDate }}</p>
            <button class="mt-2 text-sm text-primary font-medium">View payout details</button>
          </div>
        </div>
  
        <!-- Vehicle Performance -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Vehicle Performance</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ performance.rating }}/5.0</p>
            </div>
            <div class="p-2 rounded-full bg-primary/10">
              <Star class="h-5 w-5 text-primary" />
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center">
              <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-primary" :style="{ width: `${performance.rating * 20}%` }"></div>
              </div>
              <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">{{ performance.totalRatings }} ratings</span>
            </div>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ performance.completionRate }}% trip completion rate</p>
          </div>
        </div>
      </div>
  
      <!-- Vehicle Status and Earnings Chart -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Vehicle Status -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-4 border-b dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Vehicle Status</h2>
          </div>
          <div class="p-4">
            <div class="space-y-4">
              <div v-for="vehicle in vehicles" :key="vehicle.id" class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="p-2 rounded-full" :class="getVehicleStatusClass(vehicle.status)">
                  <Car class="h-4 w-4" :class="getVehicleStatusTextClass(vehicle.status)" />
                </div>
                <div class="ml-3 flex-1">
                  <div class="flex justify-between">
                    <p class="font-medium text-gray-900 dark:text-white">{{ vehicle.make }} {{ vehicle.model }}</p>
                    <span class="text-xs font-medium" :class="getVehicleStatusTextClass(vehicle.status)">
                      {{ vehicle.status }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ vehicle.licensePlate }} • {{ vehicle.year }}</p>
                </div>
              </div>
            </div>
            <button class="mt-4 w-full py-2 text-sm text-primary font-medium border border-primary/30 rounded-lg">
              View All Vehicles
            </button>
          </div>
        </div>
  
        <!-- Earnings Chart -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Earnings History</h2>
            <div class="flex space-x-2">
              <button class="px-3 py-1 text-xs bg-primary text-white rounded-md">Weekly</button>
              <button class="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md">Monthly</button>
              <button class="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md">Yearly</button>
            </div>
          </div>
          <div class="p-4">
            <div class="h-[300px] w-full">
              <!-- Simulated chart - in a real app, use a chart library -->
              <div class="h-full w-full flex items-end justify-between space-x-2">
                <div v-for="(day, index) in earningsData" :key="index" class="flex-1 flex flex-col items-center">
                  <div class="w-full bg-primary/20 rounded-t-sm" :style="{ height: `${day.value}%` }"></div>
                  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ day.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Recent Trips -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Trips</h2>
          <button @click="exportTrips" class="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md flex items-center">
            <Download class="h-3 w-3 mr-1" />
            Export CSV
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trip ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vehicle
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Distance
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Earnings
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="trip in recentTrips" :key="trip.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  #{{ trip.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="p-1 rounded-full bg-gray-200 dark:bg-gray-700">
                      <Car class="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ trip.vehicle }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ trip.licensePlate }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ trip.date }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ trip.time }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ trip.distance }} miles
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${{ trip.earnings.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getTripStatusClass(trip.status)">
                    {{ trip.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-4 border-t dark:border-gray-700 flex justify-between items-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Showing <span class="font-medium">1</span> to <span class="font-medium">5</span> of <span class="font-medium">{{ recentTrips.length }}</span> trips
          </p>
          <div class="flex space-x-1">
            <button class="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md">
              Previous
            </button>
            <button class="px-3 py-1 text-xs bg-primary text-white rounded-md">
              Next
            </button>
          </div>
        </div>
      </div>
  
      <!-- Maintenance Alerts -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-4 border-b dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Maintenance Alerts</h2>
        </div>
        <div class="p-4">
          <div v-if="maintenanceAlerts.length > 0" class="space-y-4">
            <div v-for="alert in maintenanceAlerts" :key="alert.id" class="p-4 rounded-lg border" :class="getMaintenanceAlertClass(alert.priority)">
              <div class="flex items-start">
                <div class="p-2 rounded-full" :class="getMaintenanceAlertBgClass(alert.priority)">
                  <AlertTriangle v-if="alert.priority === 'high'" class="h-5 w-5 text-danger" />
                  <AlertCircle v-else-if="alert.priority === 'medium'" class="h-5 w-5 text-warning" />
                  <Info v-else class="h-5 w-5 text-info" />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ alert.title }}</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ alert.description }}</p>
                  <div class="mt-2 flex items-center">
                    <Car class="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ alert.vehicle }}</span>
                    <span class="mx-2 text-gray-300 dark:text-gray-600">•</span>
                    <Calendar class="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ alert.dueDate }}</span>
                  </div>
                </div>
                <button class="ml-auto p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X class="h-4 w-4" />
                </button>
              </div>
              <div class="mt-3 flex justify-end space-x-2">
                <button class="px-3 py-1 text-xs bg-primary text-white rounded-md">
                  Schedule Service
                </button>
                <button class="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-8">
            <div class="p-3 rounded-full bg-success/10 mb-3">
              <CheckCircle class="h-6 w-6 text-success" />
            </div>
            <p class="text-gray-500 dark:text-gray-400">No maintenance alerts at this time</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import {
    Car,
    MessageSquare,
    DollarSign,
    Clock,
    Star,
    TrendingUp,
    TrendingDown,
    Download,
    AlertTriangle,
    AlertCircle,
    Info,
    Calendar,
    X,
    CheckCircle
  } from 'lucide-vue-next'
  import { ref, reactive } from 'vue'
  
  // Partner info
  const partnerInfo = reactive({
    name: 'City Fleet Services',
    joinDate: 'Jan 15, 2022',
    totalVehicles: 8
  })
  
  // Earnings data
  const earnings = reactive({
    total: 24850,
    pending: 3250,
    growth: 12.5,
    nextPayoutDate: 'Mar 20, 2023'
  })
  
  // Performance data
  const performance = reactive({
    rating: 4.8,
    totalRatings: 342,
    completionRate: 98
  })
  
  // Vehicles data
  const vehicles = ref([
    { id: 1, make: 'Toyota', model: 'Camry', year: 2021, licensePlate: 'ABC-1234', status: 'active' },
    { id: 2, make: 'Honda', model: 'Accord', year: 2020, licensePlate: 'XYZ-5678', status: 'active' },
    { id: 3, make: 'Ford', model: 'Fusion', year: 2019, licensePlate: 'DEF-9012', status: 'maintenance' },
    { id: 4, make: 'Chevrolet', model: 'Malibu', year: 2022, licensePlate: 'GHI-3456', status: 'active' }
  ])
  
  // Earnings chart data
  const earningsData = ref([
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 80 },
    { label: 'Wed', value: 45 },
    { label: 'Thu', value: 70 },
    { label: 'Fri', value: 90 },
    { label: 'Sat', value: 30 },
    { label: 'Sun', value: 20 }
  ])
  
  // Recent trips data
  const recentTrips = ref([
    {
      id: 'T-5678',
      vehicle: 'Toyota Camry',
      licensePlate: 'ABC-1234',
      date: 'Mar 14, 2023',
      time: '10:30 AM',
      distance: 12.5,
      earnings: 45.99,
      status: 'completed'
    },
    {
      id: 'T-5677',
      vehicle: 'Honda Accord',
      licensePlate: 'XYZ-5678',
      date: 'Mar 14, 2023',
      time: '09:15 AM',
      distance: 18.2,
      earnings: 62.50,
      status: 'completed'
    },
    {
      id: 'T-5676',
      vehicle: 'Toyota Camry',
      licensePlate: 'ABC-1234',
      date: 'Mar 13, 2023',
      time: '04:45 PM',
      distance: 8.7,
      earnings: 32.75,
      status: 'completed'
    },
    {
      id: 'T-5675',
      vehicle: 'Chevrolet Malibu',
      licensePlate: 'GHI-3456',
      date: 'Mar 13, 2023',
      time: '01:20 PM',
      distance: 5.3,
      earnings: 22.25,
      status: 'cancelled'
    },
    {
      id: 'T-5674',
      vehicle: 'Honda Accord',
      licensePlate: 'XYZ-5678',
      date: 'Mar 12, 2023',
      time: '11:10 AM',
      distance: 4.2,
      earnings: 18.50,
      status: 'completed'
    }
  ])
  
  // Maintenance alerts
  const maintenanceAlerts = ref([
    {
      id: 1,
      title: 'Oil Change Required',
      description: 'Vehicle is due for an oil change. Current mileage: 5,230 miles since last service.',
      vehicle: 'Ford Fusion (DEF-9012)',
      dueDate: 'Mar 18, 2023',
      priority: 'medium'
    },
    {
      id: 2,
      title: 'Brake Inspection Required',
      description: 'Brake pads are showing signs of wear and should be inspected immediately.',
      vehicle: 'Toyota Camry (ABC-1234)',
      dueDate: 'Mar 15, 2023',
      priority: 'high'
    }
  ])
  
  // Export trips to CSV
  function exportTrips() {
    // In a real application, this would generate and download a CSV file
    const header = ['Trip ID', 'Vehicle', 'Date', 'Time', 'Distance', 'Earnings', 'Status']
    const data = recentTrips.value.map(trip => [
      trip.id,
      trip.vehicle,
      trip.date,
      trip.time,
      trip.distance,
      trip.earnings.toFixed(2),
      trip.status
    ])
    
    // Create CSV content
    const csvContent = [
      header.join(','),
      ...data.map(row => row.join(','))
    ].join('\n')
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'nextride_partner_trips.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // Helper functions for styling
  function getVehicleStatusClass(status: string) {
    switch (status) {
      case 'active':
        return 'bg-success/10'
      case 'maintenance':
        return 'bg-warning/10'
      case 'inactive':
        return 'bg-danger/10'
      default:
        return 'bg-gray-200 dark:bg-gray-700'
    }
  }
  
  function getVehicleStatusTextClass(status: string) {
    switch (status) {
      case 'active':
        return 'text-success'
      case 'maintenance':
        return 'text-warning'
      case 'inactive':
        return 'text-danger'
      default:
        return 'text-gray-500 dark:text-gray-400'
    }
  }
  
  function getTripStatusClass(status: string) {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success'
      case 'in-progress':
        return 'bg-warning/10 text-warning'
      case 'cancelled':
        return 'bg-danger/10 text-danger'
      default:
        return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
    }
  }
  
  function getMaintenanceAlertClass(priority: string) {
    switch (priority) {
      case 'high':
        return 'border-danger/30 bg-danger/5'
      case 'medium':
        return 'border-warning/30 bg-warning/5'
      case 'low':
        return 'border-info/30 bg-info/5'
      default:
        return 'border-gray-200 dark:border-gray-700'
    }
  }
  
  function getMaintenanceAlertBgClass(priority: string) {
    switch (priority) {
      case 'high':
        return 'bg-danger/10'
      case 'medium':
        return 'bg-warning/10'
      case 'low':
        return 'bg-info/10'
      default:
        return 'bg-gray-200 dark:bg-gray-700'
    }
  }

  definePageMeta({
      layout: 'dashboard'
  })
  </script>
  
  <style scoped>
  /* Additional styles if needed */
  </style>