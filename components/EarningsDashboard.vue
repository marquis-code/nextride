<template>
    <div class="space-y-6 fade-in">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Earnings Dashboard</h2>
          <p class="text-gray-500 mt-1">Real-time tracking of revenue generated</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <div class="relative">
            <select 
              v-model="selectedPeriod" 
              class="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option v-for="period in periods" :key="period.value" :value="period.value">
                {{ period.label }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <ChevronDown class="h-4 w-4" />
            </div>
          </div>
          <button 
            @click="exportToCSV"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Download class="h-4 w-4 mr-1" />
            Export CSV
          </button>
        </div>
      </div>
  
      <!-- Earnings Chart -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="h-80">
          <canvas ref="earningsChart"></canvas>
        </div>
      </div>
  
      <!-- Earnings Breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Earnings by Vehicle</h3>
          <div class="space-y-4">
            <div v-for="vehicle in earningsByVehicle" :key="vehicle.id" class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <Car class="h-5 w-5 text-gray-500" />
              </div>
              <div class="ml-3 flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900">{{ vehicle.name }}</p>
                  <p class="text-sm font-semibold text-gray-900">₦{{ vehicle.amount.toLocaleString() }}</p>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    class="bg-primary-600 h-2 rounded-full" 
                    :style="{ width: `${(vehicle.amount / maxEarnings) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div class="overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="transaction in recentTransactions" :key="transaction.id">
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ transaction.date }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ transaction.vehicle }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">₦{{ transaction.amount.toLocaleString() }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm">
                    <span 
                      :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ transaction.status }}
                    </span>
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
  import { ref, onMounted, computed } from 'vue'
  import { ChevronDown, Download, Car } from 'lucide-vue-next'
  import Chart from 'chart.js/auto'
  
  // Chart reference
  const earningsChart = ref<HTMLCanvasElement | null>(null)
  let chart: Chart | null = null
  
  // Filter periods
  const periods = [
    { label: 'Last 7 days', value: '7days' },
    { label: 'Last 30 days', value: '30days' },
    { label: 'Last 3 months', value: '3months' },
    { label: 'Last 6 months', value: '6months' },
    { label: 'Last year', value: 'year' }
  ]
  const selectedPeriod = ref('30days')
  
  // Sample data for earnings by vehicle
  const earningsByVehicle = ref([
    { id: 1, name: 'Toyota Camry (LG-234-KJA)', amount: 245000 },
    { id: 2, name: 'Honda Accord (LG-567-ABC)', amount: 198000 },
    { id: 3, name: 'Toyota Corolla (LG-789-XYZ)', amount: 176500 },
    { id: 4, name: 'Kia Sportage (LG-901-DEF)', amount: 152000 },
    { id: 5, name: 'Hyundai Elantra (LG-345-GHI)', amount: 124000 }
  ])
  
  // Calculate max earnings for progress bars
  const maxEarnings = computed(() => {
    return Math.max(...earningsByVehicle.value.map(v => v.amount))
  })
  
  // Sample data for recent transactions
  const recentTransactions = ref([
    { id: 1, date: '2025-03-14', vehicle: 'Toyota Camry (LG-234-KJA)', amount: 12500, status: 'Completed' },
    { id: 2, date: '2025-03-13', vehicle: 'Honda Accord (LG-567-ABC)', amount: 9800, status: 'Completed' },
    { id: 3, date: '2025-03-12', vehicle: 'Toyota Corolla (LG-789-XYZ)', amount: 11200, status: 'Pending' },
    { id: 4, date: '2025-03-11', vehicle: 'Kia Sportage (LG-901-DEF)', amount: 8900, status: 'Completed' },
    { id: 5, date: '2025-03-10', vehicle: 'Hyundai Elantra (LG-345-GHI)', amount: 7600, status: 'Failed' }
  ])
  
  // Sample data for earnings chart
  const chartData = {
    '7days': {
      labels: ['Mar 8', 'Mar 9', 'Mar 10', 'Mar 11', 'Mar 12', 'Mar 13', 'Mar 14'],
      data: [12500, 15800, 14200, 16500, 13800, 17200, 15900]
    },
    '30days': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [58000, 62500, 71200, 65800]
    },
    '3months': {
      labels: ['January', 'February', 'March'],
      data: [245000, 278000, 257500]
    },
    '6months': {
      labels: ['October', 'November', 'December', 'January', 'February', 'March'],
      data: [198000, 215000, 245000, 232000, 278000, 257500]
    },
    'year': {
      labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      data: [185000, 192000, 205000, 215000, 198000, 210000, 198000, 215000, 245000, 232000, 278000, 257500]
    }
  }
  
  // Initialize chart
  onMounted(() => {
    if (earningsChart.value) {
      const ctx = earningsChart.value.getContext('2d')
      if (ctx) {
        chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartData[selectedPeriod.value as keyof typeof chartData].labels,
            datasets: [{
              label: 'Earnings (₦)',
              data: chartData[selectedPeriod.value as keyof typeof chartData].data,
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              borderColor: 'rgba(79, 70, 229, 1)',
              borderWidth: 2,
              tension: 0.4,
              pointBackgroundColor: 'rgba(79, 70, 229, 1)',
              pointBorderColor: '#fff',
              pointRadius: 4,
              pointHoverRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += '₦' + context.parsed.y.toLocaleString();
                    }
                    return label;
                  }
                }
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                }
              },
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '₦' + value.toLocaleString();
                  }
                }
              }
            }
          }
        });
      }
    }
  })
  
  // Watch for period changes to update chart
  watch(selectedPeriod, (newPeriod) => {
    if (chart) {
      chart.data.labels = chartData[newPeriod as keyof typeof chartData].labels;
      chart.data.datasets[0].data = chartData[newPeriod as keyof typeof chartData].data;
      chart.update();
    }
  })
  
  // Export data to CSV
  const exportToCSV = () => {
    // Get the current data based on selected period
    const data = chartData[selectedPeriod.value as keyof typeof chartData];
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Earnings\n";
    
    // Add data rows
    data.labels.forEach((label, index) => {
      csvContent += `${label},${data.data[index]}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `earnings_${selectedPeriod.value}_${new Date().toISOString().split('T')[0]}.csv`);
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