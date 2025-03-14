<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="(stat, index) in stats" :key="index" 
        class="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div :class="`p-3 rounded-full ${stat.bgColor}`">
            <component :is="stat.icon" class="w-6 h-6 text-white" />
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.name }}</h3>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stat.value }}</p>
            <p :class="`text-xs ${stat.changeColor}`">
              <component :is="stat.changeIcon" class="inline w-3 h-3 mr-1" />
              {{ stat.change }} from last month
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Revenue Chart -->
      <div class="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Revenue Overview</h2>
          <div class="flex space-x-2">
            <button 
              v-for="period in ['Day', 'Week', 'Month', 'Year']" 
              :key="period"
              @click="revenueChartPeriod = period.toLowerCase()"
              :class="[
                'px-2 py-1 text-xs font-medium rounded',
                revenueChartPeriod === period.toLowerCase()
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              ]"
            >
              {{ period }}
            </button>
          </div>
        </div>
        <div class="h-64">
          <!-- Chart would be rendered here -->
          <div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Revenue Chart ({{ revenueChartPeriod }})
          </div>
        </div>
      </div>

      <!-- Bookings Chart -->
      <div class="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Booking Trends</h2>
          <div class="flex space-x-2">
            <button 
              v-for="period in ['Day', 'Week', 'Month', 'Year']" 
              :key="period"
              @click="bookingChartPeriod = period.toLowerCase()"
              :class="[
                'px-2 py-1 text-xs font-medium rounded',
                bookingChartPeriod === period.toLowerCase()
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              ]"
            >
              {{ period }}
            </button>
          </div>
        </div>
        <div class="h-64">
          <!-- Chart would be rendered here -->
          <div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Booking Chart ({{ bookingChartPeriod }})
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
        <button class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
          View all
        </button>
      </div>
      <div class="overflow-hidden">
        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
          <li v-for="(activity, index) in recentActivities" :key="index" class="py-4">
            <div class="flex items-center space-x-4">
              <div :class="`p-2 rounded-full ${activity.bgColor}`">
                <component :is="activity.icon" class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ activity.title }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ activity.description }}
                </p>
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ activity.time }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Active Vehicles Map -->
    <div class="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Active Vehicles</h2>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ activeVehicles.length }} vehicles active</span>
          <button class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <RefreshCw class="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      <div class="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
        <!-- Google Map would be rendered here -->
        <div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          Google Map with {{ activeVehicles.length }} active vehicles
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  Users, Calendar, TruckIcon, DollarSign, 
  TrendingUp, TrendingDown, RefreshCw, 
  UserPlus, MapPin, AlertCircle, CheckCircle
} from 'lucide-vue-next';

// Chart periods
const revenueChartPeriod = ref('month');
const bookingChartPeriod = ref('month');

// Stats data
const stats = [
  {
    name: 'Total Users',
    value: '2,543',
    change: '+12.5%',
    changeColor: 'text-green-500 dark:text-green-400',
    changeIcon: TrendingUp,
    icon: Users,
    bgColor: 'bg-blue-500'
  },
  {
    name: 'Active Bookings',
    value: '187',
    change: '+8.2%',
    changeColor: 'text-green-500 dark:text-green-400',
    changeIcon: TrendingUp,
    icon: Calendar,
    bgColor: 'bg-purple-500'
  },
  {
    name: 'Active Vehicles',
    value: '42',
    change: '-3.1%',
    changeColor: 'text-red-500 dark:text-red-400',
    changeIcon: TrendingDown,
    icon: TruckIcon,
    bgColor: 'bg-green-500'
  },
  {
    name: 'Revenue (MTD)',
    value: '$48,395',
    change: '+18.7%',
    changeColor: 'text-green-500 dark:text-green-400',
    changeIcon: TrendingUp,
    icon: DollarSign,
    bgColor: 'bg-amber-500'
  }
];

// Recent activities
const recentActivities = [
  {
    title: 'New user registered',
    description: 'John Doe created a new account',
    time: '5 min ago',
    icon: UserPlus,
    bgColor: 'bg-blue-500'
  },
  {
    title: 'New booking created',
    description: 'Sarah Johnson booked a ride from Downtown to Airport',
    time: '15 min ago',
    icon: Calendar,
    bgColor: 'bg-purple-500'
  },
  {
    title: 'Vehicle maintenance alert',
    description: 'Vehicle #A123 requires maintenance check',
    time: '1 hour ago',
    icon: AlertCircle,
    bgColor: 'bg-red-500'
  },
  {
    title: 'Support ticket resolved',
    description: 'Ticket #45678 has been resolved',
    time: '2 hours ago',
    icon: CheckCircle,
    bgColor: 'bg-green-500'
  },
  {
    title: 'Vehicle location updated',
    description: 'Vehicle #B456 arrived at Central Station',
    time: '3 hours ago',
    icon: MapPin,
    bgColor: 'bg-amber-500'
  }
];

// Active vehicles data
const activeVehicles = [
  { id: 'V001', type: 'Sedan', location: { lat: 40.7128, lng: -74.0060 }, status: 'Available' },
  { id: 'V002', type: 'SUV', location: { lat: 40.7282, lng: -73.9942 }, status: 'On Trip' },
  { id: 'V003', type: 'Van', location: { lat: 40.7589, lng: -73.9851 }, status: 'On Trip' },
  { id: 'V004', type: 'Sedan', location: { lat: 40.7549, lng: -73.9840 }, status: 'Available' },
  { id: 'V005', type: 'SUV', location: { lat: 40.7489, lng: -73.9680 }, status: 'On Trip' },
];

definePageMeta({
    layout: 'dashboard'
})
</script>