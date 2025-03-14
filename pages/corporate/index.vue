<template>
  <div>
    <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Corporate Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Overview of your mobility operations</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative">
          <Calendar class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select
            v-model="selectedPeriod"
            class="rounded-md border border-gray-300 bg-white py-2 pl-10 pr-8 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <button
          @click="exportData"
          class="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          <Download class="mr-2 h-4 w-4" />
          Export
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.name }}</p>
            <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ stat.value }}</p>
          </div>
          <div
            :class="`rounded-full p-3 ${stat.bgColor} text-white`"
          >
            <component :is="stat.icon" class="h-5 w-5" />
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <component
            :is="stat.trend === 'up' ? TrendingUp : TrendingDown"
            :class="`mr-1 h-4 w-4 ${
              stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`"
          />
          <span
            :class="`text-sm font-medium ${
              stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`"
          >
            {{ stat.percentage }}
          </span>
          <span class="ml-1 text-sm text-gray-500 dark:text-gray-400">vs last period</span>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <!-- Trip Usage Chart -->
      <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Trip Usage</h2>
          <div class="flex items-center space-x-2">
            <button
              v-for="(period, index) in ['Day', 'Week', 'Month']"
              :key="index"
              @click="tripChartPeriod = period.toLowerCase()"
              :class="[
                'rounded-md px-3 py-1 text-xs font-medium',
                tripChartPeriod === period.toLowerCase()
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              ]"
            >
              {{ period }}
            </button>
          </div>
        </div>
        <div class="h-64">
          <canvas ref="tripUsageChart"></canvas>
        </div>
      </div>

      <!-- Expenses Chart -->
      <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Expenses Breakdown</h2>
          <div class="flex items-center space-x-2">
            <button
              v-for="(period, index) in ['Week', 'Month', 'Quarter']"
              :key="index"
              @click="expenseChartPeriod = period.toLowerCase()"
              :class="[
                'rounded-md px-3 py-1 text-xs font-medium',
                expenseChartPeriod === period.toLowerCase()
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              ]"
            >
              {{ period }}
            </button>
          </div>
        </div>
        <div class="h-64">
          <canvas ref="expensesChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Active Bookings and Recent Trips -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <!-- Active Bookings -->
      <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Active Bookings</h2>
          <NuxtLink
            to="/trips"
            class="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            View all
          </NuxtLink>
        </div>
        <div class="overflow-hidden">
          <div v-if="activeBookings.length === 0" class="py-8 text-center">
            <Car class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No active bookings</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new booking.</p>
            <div class="mt-6">
              <NuxtLink
                to="/trips/new"
                class="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                <Plus class="mr-2 h-4 w-4" />
                New Booking
              </NuxtLink>
            </div>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="(booking, index) in activeBookings"
              :key="index"
              class="flex items-center justify-between rounded-md border border-gray-200 p-4 dark:border-gray-700"
            >
              <div class="flex items-center space-x-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800">
                  <component :is="booking.icon" class="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ booking.employee }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ booking.destination }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ booking.time }}</p>
                <p :class="`text-xs ${getStatusColor(booking.status)}`">{{ booking.status }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Trips -->
      <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Recent Trips</h2>
          <NuxtLink
            to="/trips"
            class="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            View all
          </NuxtLink>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Employee
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Route
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(trip, index) in recentTrips" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="whitespace-nowrap px-4 py-3">
                  <div class="flex items-center">
                    <div class="h-8 w-8 flex-shrink-0">
                      <img
                        :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(trip.employee)}&background=0D8ABC&color=fff`"
                        alt=""
                        class="h-8 w-8 rounded-full"
                      />
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ trip.employee }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ trip.department }}</p>
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {{ trip.date }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {{ trip.route }}
                </td>
                <td class="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                  {{ trip.cost }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { 
  Calendar, 
  Download, 
  Car, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  Users,
  CreditCard,
  MapPin
} from 'lucide-vue-next';
import Chart from 'chart.js/auto';
// import { useExportData } from '@/composables/useExportCsv';

// Refs for chart canvases
const tripUsageChart = ref<HTMLCanvasElement | null>(null);
const expensesChart = ref<HTMLCanvasElement | null>(null);

// Chart instances
let tripChart: Chart | null = null;
let expenseChart: Chart | null = null;

// Chart periods
const tripChartPeriod = ref('week');
const expenseChartPeriod = ref('month');

// Selected time period for dashboard data
const selectedPeriod = ref('month');

// Stats data
const stats = ref([
  {
    name: 'Total Trips',
    value: '1,284',
    icon: Car,
    trend: 'up',
    percentage: '12.5%',
    bgColor: 'bg-emerald-500'
  },
  {
    name: 'Active Employees',
    value: '342',
    icon: Users,
    trend: 'up',
    percentage: '8.2%',
    bgColor: 'bg-blue-500'
  },
  {
    name: 'Monthly Expenses',
    value: '$24,895',
    icon: CreditCard,
    trend: 'down',
    percentage: '3.1%',
    bgColor: 'bg-purple-500'
  },
  {
    name: 'Avg. Trip Distance',
    value: '12.8 km',
    icon: MapPin,
    trend: 'up',
    percentage: '5.4%',
    bgColor: 'bg-amber-500'
  }
]);

// Active bookings data
const activeBookings = ref([
  {
    employee: 'Sarah Johnson',
    destination: 'Downtown Office → Airport',
    time: '10:30 AM',
    status: 'In Progress',
    icon: Car
  },
  {
    employee: 'Michael Chen',
    destination: 'HQ → Client Meeting',
    time: '11:45 AM',
    status: 'Scheduled',
    icon: Calendar
  },
  {
    employee: 'Emily Rodriguez',
    destination: 'Branch Office → HQ',
    time: '2:15 PM',
    status: 'Scheduled',
    icon: Calendar
  }
]);

// Recent trips data
const recentTrips = ref([
  {
    employee: 'David Wilson',
    department: 'Sales',
    date: 'Today, 9:15 AM',
    route: 'HQ → Client Office',
    cost: '$45.20'
  },
  {
    employee: 'Lisa Thompson',
    department: 'Marketing',
    date: 'Today, 8:30 AM',
    route: 'Home → HQ',
    cost: '$32.75'
  },
  {
    employee: 'Robert Garcia',
    department: 'Executive',
    date: 'Yesterday, 4:45 PM',
    route: 'HQ → Airport',
    cost: '$78.50'
  },
  {
    employee: 'Jennifer Lee',
    department: 'Finance',
    date: 'Yesterday, 2:20 PM',
    route: 'Branch Office → HQ',
    cost: '$28.90'
  },
  {
    employee: 'Kevin Brown',
    department: 'IT',
    date: 'Mar 12, 10:10 AM',
    route: 'Home → HQ',
    cost: '$35.40'
  }
]);

// Helper function for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Progress':
      return 'text-blue-600 dark:text-blue-400';
    case 'Scheduled':
      return 'text-amber-600 dark:text-amber-400';
    case 'Completed':
      return 'text-green-600 dark:text-green-400';
    case 'Cancelled':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

// Initialize charts
const initCharts = () => {
  // Trip Usage Chart
  if (tripUsageChart.value) {
    const tripCtx = tripUsageChart.value.getContext('2d');
    if (tripCtx) {
      tripChart = new Chart(tripCtx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'This Week',
              data: [18, 25, 20, 30, 40, 25, 15],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Last Week',
              data: [15, 20, 18, 25, 30, 20, 10],
              borderColor: '#94a3b8',
              backgroundColor: 'rgba(148, 163, 184, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                drawBorder: false
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }
  }

  // Expenses Chart
  if (expensesChart.value) {
    const expenseCtx = expensesChart.value.getContext('2d');
    if (expenseCtx) {
      expenseChart = new Chart(expenseCtx, {
        type: 'doughnut',
        data: {
          labels: ['Executive', 'Sales', 'Marketing', 'Finance', 'IT', 'Other'],
          datasets: [
            {
              data: [30, 25, 15, 10, 12, 8],
              backgroundColor: [
                '#10b981', // emerald
                '#3b82f6', // blue
                '#8b5cf6', // purple
                '#f59e0b', // amber
                '#ef4444', // red
                '#94a3b8'  // gray
              ],
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                usePointStyle: true,
                padding: 20
              }
            }
          },
          cutout: '70%'
        }
      });
    }
  }
};

// Update charts when period changes
watch([tripChartPeriod, expenseChartPeriod], () => {
  // In a real app, you would fetch new data based on the period
  // For this example, we'll just update with random data
  
  if (tripChart) {
    const newData1 = Array.from({ length: 7 }, () => Math.floor(Math.random() * 40) + 10);
    const newData2 = Array.from({ length: 7 }, () => Math.floor(Math.random() * 30) + 5);
    
    tripChart.data.datasets[0].data = newData1;
    tripChart.data.datasets[1].data = newData2;
    tripChart.update();
  }
  
  if (expenseChart) {
    const newData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 30) + 5);
    expenseChart.data.datasets[0].data = newData;
    expenseChart.update();
  }
});

// Export data functionality
// const { exportToCsv } = useExportData();

const exportData = () => {
  const data = [
    ['Period', selectedPeriod.value],
    ['Total Trips', stats.value[0].value],
    ['Active Employees', stats.value[1].value],
    ['Monthly Expenses', stats.value[2].value],
    ['Avg. Trip Distance', stats.value[3].value],
    [''],
    ['Recent Trips'],
    ['Employee', 'Department', 'Date', 'Route', 'Cost']
  ];
  
  recentTrips.value.forEach(trip => {
    data.push([
      trip.employee,
      trip.department,
      trip.date,
      trip.route,
      trip.cost
    ]);
  });
  
  // exportToCsv(data, `mobility-dashboard-${selectedPeriod.value}-${new Date().toISOString().split('T')[0]}.csv`);
};

// Initialize charts on component mount
onMounted(() => {
  initCharts();
});

definePageMeta({
  layout: 'corporate'
})
</script>
