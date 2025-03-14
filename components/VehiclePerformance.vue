<template>
    <div class="space-y-6 fade-in">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Vehicle Performance Metrics</h2>
          <p class="text-gray-500 mt-1">Distance covered, trips completed, maintenance alerts</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <div class="relative">
            <select 
              v-model="selectedVehicle" 
              class="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Vehicles</option>
              <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
                {{ vehicle.name }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <ChevronDown class="h-4 w-4" />
            </div>
          </div>
          <button 
            @click="exportPerformanceData"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Download class="h-4 w-4 mr-1" />
            Export CSV
          </button>
        </div>
      </div>
  
      <!-- Performance Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-500">Total Distance</h3>
            <Route class="h-5 w-5 text-primary-600" />
          </div>
          <p class="mt-2 text-2xl font-semibold text-gray-900">{{ totalDistance.toLocaleString() }} km</p>
          <div class="mt-2 flex items-center text-sm">
            <span class="text-green-600 font-medium">+{{ distanceChange }}%</span>
            <span class="ml-1 text-gray-500">from last month</span>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-500">Trips Completed</h3>
            <MapPin class="h-5 w-5 text-primary-600" />
          </div>
          <p class="mt-2 text-2xl font-semibold text-gray-900">{{ totalTrips.toLocaleString() }}</p>
          <div class="mt-2 flex items-center text-sm">
            <span class="text-green-600 font-medium">+{{ tripsChange }}%</span>
            <span class="ml-1 text-gray-500">from last month</span>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-500">Maintenance Alerts</h3>
            <AlertTriangle class="h-5 w-5 text-amber-500" />
          </div>
          <p class="mt-2 text-2xl font-semibold text-gray-900">{{ maintenanceAlerts }}</p>
          <div class="mt-2 flex items-center text-sm">
            <span :class="alertsChange > 0 ? 'text-red-600' : 'text-green-600'" class="font-medium">
              {{ alertsChange > 0 ? '+' : '' }}{{ alertsChange }}
            </span>
            <span class="ml-1 text-gray-500">from last month</span>
          </div>
        </div>
      </div>
  
      <!-- Performance Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Distance Covered (Last 7 Days)</h3>
          <div class="h-64">
            <canvas ref="distanceChart"></canvas>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Trips Completed (Last 7 Days)</h3>
          <div class="h-64">
            <canvas ref="tripsChart"></canvas>
          </div>
        </div>
      </div>
  
      <!-- Maintenance Alerts -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Maintenance Alerts</h3>
          <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert Type</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="alert in maintenanceAlertsList" :key="alert.id">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ alert.vehicle }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ alert.type }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ alert.dueDate }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <span 
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      alert.status === 'Urgent' ? 'bg-red-100 text-red-800' : 
                      alert.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    ]"
                  >
                    {{ alert.status }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <button class="text-primary-600 hover:text-primary-700 font-medium">
                    Schedule
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue'
  import { ChevronDown, Download, Route, MapPin, AlertTriangle } from 'lucide-vue-next'
  import Chart from 'chart.js/auto'
  
  // Chart references
  const distanceChart = ref<HTMLCanvasElement | null>(null)
  const tripsChart = ref<HTMLCanvasElement | null>(null)
  let distanceChartInstance: Chart | null = null
  let tripsChartInstance: Chart | null = null
  
  // Sample vehicles data
  const vehicles = ref([
    { id: 1, name: 'Toyota Camry (LG-234-KJA)' },
    { id: 2, name: 'Honda Accord (LG-567-ABC)' },
    { id: 3, name: 'Toyota Corolla (LG-789-XYZ)' },
    { id: 4, name: 'Kia Sportage (LG-901-DEF)' },
    { id: 5, name: 'Hyundai Elantra (LG-345-GHI)' }
  ])
  const selectedVehicle = ref('all')
  
  // Performance metrics
  const totalDistance = ref(12450)
  const distanceChange = ref(8.5)
  const totalTrips = ref(1892)
  const tripsChange = ref(12.3)
  const maintenanceAlerts = ref(5)
  const alertsChange = ref(2)
  
  // Sample maintenance alerts
  const maintenanceAlertsList = ref([
    { 
      id: 1, 
      vehicle: 'Toyota Camry (LG-234-KJA)', 
      type: 'Oil Change', 
      dueDate: '2025-03-17', 
      status: 'Urgent' 
    },
    { 
      id: 2, 
      vehicle: 'Honda Accord (LG-567-ABC)', 
      type: 'Tire Rotation', 
      dueDate: '2025-03-20', 
      status: 'Upcoming' 
    },
    { 
      id: 3, 
      vehicle: 'Toyota Corolla (LG-789-XYZ)', 
      type: 'Brake Inspection', 
      dueDate: '2025-03-25', 
      status: 'Upcoming' 
    },
    { 
      id: 4, 
      vehicle: 'Kia Sportage (LG-901-DEF)', 
      type: 'Air Filter', 
      dueDate: '2025-04-02', 
      status: 'Scheduled' 
    },
    { 
      id: 5, 
      vehicle: 'Hyundai Elantra (LG-345-GHI)', 
      type: 'Battery Check', 
      dueDate: '2025-03-18', 
      status: 'Urgent' 
    }
  ])
  
  // Sample chart data
  const chartData = {
    distance: {
      labels: ['Mar 8', 'Mar 9', 'Mar 10', 'Mar 11', 'Mar 12', 'Mar 13', 'Mar 14'],
      datasets: [
        {
          label: 'Distance (km)',
          data: [245, 278, 312, 289, 345, 298, 325],
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 2,
          tension: 0.4
        }
      ]
    },
    trips: {
      labels: ['Mar 8', 'Mar 9', 'Mar 10', 'Mar 11', 'Mar 12', 'Mar 13', 'Mar 14'],
      datasets: [
        {
          label: 'Trips',
          data: [42, 38, 45, 40, 48, 52, 47],
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderRadius: 4,
          borderSkipped: false
        }
      ]
    }
  }
  
  // Initialize charts
  onMounted(() => {
    // Distance chart
    if (distanceChart.value) {
      const ctx = distanceChart.value.getContext('2d')
      if (ctx) {
        distanceChartInstance = new Chart(ctx, {
          type: 'line',
          data: chartData.distance,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                }
              },
              y: {
                beginAtZero: true
              }
            }
          }
        })
      }
    }
    
    // Trips chart
    if (tripsChart.value) {
      const ctx = tripsChart.value.getContext('2d')
      if (ctx) {
        tripsChartInstance = new Chart(ctx, {
          type: 'bar',
          data: chartData.trips,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                }
              },
              y: {
                beginAtZero: true
              }
            }
          }
        })
      }
    }
  })
  
  // Export performance data to CSV
  const exportPerformanceData = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Distance (km),Trips\n";
    
    // Add data rows
    chartData.distance.labels.forEach((label, index) => {
      csvContent += `${label},${chartData.distance.datasets[0].data[index]},${chartData.trips.datasets[0].data[index]}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vehicle_performance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
  }
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
  </style>