<template>
    <div class="min-h-screen bg-gray-50">
      <!-- <AppSidebar /> -->
      <div class="lg:pl-64">
        <!-- <AppHeader /> -->
        <main class="p-4 md:p-6 lg:p-8">
          <div class="mb-6">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Vehicle Partners Dashboard</h1>
            <p class="text-gray-500 mt-1">Manage your vehicles, track earnings, and monitor performance</p>
          </div>
  
          <!-- Stats Overview -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Total Earnings" 
              value="₦1,245,890" 
              change="+12.5%" 
              icon="Banknote" 
              color="bg-emerald-100" 
              textColor="text-emerald-700" 
            />
            <StatCard 
              title="Active Vehicles" 
              value="24" 
              change="+2" 
              icon="Car" 
              color="bg-blue-100" 
              textColor="text-blue-700" 
            />
            <StatCard 
              title="Total Trips" 
              value="1,892" 
              change="+152" 
              icon="Route" 
              color="bg-purple-100" 
              textColor="text-purple-700" 
            />
            <StatCard 
              title="Pending Payouts" 
              value="₦89,500" 
              change="3 payouts" 
              icon="Wallet" 
              color="bg-amber-100" 
              textColor="text-amber-700" 
            />
          </div>
  
          <!-- Main Content Tabs -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div class="border-b border-gray-200">
              <nav class="flex -mb-px overflow-x-auto">
                <button 
                  v-for="tab in tabs" 
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'py-4 px-6 text-sm font-medium whitespace-nowrap',
                    activeTab === tab.id 
                      ? 'border-b-2 border-primary-600 text-primary-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  <component :is="tab.icon" class="w-4 h-4 inline-block mr-2" />
                  {{ tab.name }}
                </button>
              </nav>
            </div>
  
            <div class="p-4 md:p-6">
              <!-- Earnings Dashboard -->
              <EarningsDashboard v-if="activeTab === 'earnings'" />
              
              <!-- Vehicle Performance -->
              <VehiclePerformance v-else-if="activeTab === 'performance'" />
              
              <!-- Payout Management -->
              <PayoutManagement v-else-if="activeTab === 'payouts'" />
              
              <!-- Vehicle & Driver Management -->
              <VehicleManagement v-else-if="activeTab === 'vehicles'" />
              
              <!-- Support & Communication -->
              <SupportCommunication v-else-if="activeTab === 'support'" />
              
              <!-- Vehicle Tracking -->
              <VehicleTracking v-else-if="activeTab === 'tracking'" />
            </div>
          </div>
          
          <!-- Notifications -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Recent Notifications</h2>
              <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All
              </button>
            </div>
            <div class="space-y-4">
              <NotificationItem 
                v-for="notification in notifications" 
                :key="notification.id" 
                :notification="notification" 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { 
    LineChart, 
    BarChart, 
    Car, 
    Route, 
    Wallet, 
    Banknote, 
    Users, 
    MessageSquare, 
    MapPin 
  } from 'lucide-vue-next'
  
  // Define tabs
  const tabs = [
    { id: 'earnings', name: 'Earnings Dashboard', icon: LineChart },
    { id: 'performance', name: 'Vehicle Performance', icon: BarChart },
    { id: 'payouts', name: 'Payout Management', icon: Wallet },
    { id: 'vehicles', name: 'Vehicle & Driver Management', icon: Car },
    { id: 'support', name: 'Support & Communication', icon: MessageSquare },
    { id: 'tracking', name: 'Vehicle Tracking', icon: MapPin }
  ]
  
  const activeTab = ref('earnings')
  
  // Sample notifications data
  const notifications = ref([
    {
      id: 1,
      title: 'Maintenance Alert',
      message: 'Vehicle LG-234-KJA is due for service in 3 days',
      time: '2 hours ago',
      type: 'warning',
      read: false
    },
    {
      id: 2,
      title: 'Payout Completed',
      message: 'Your payout of ₦45,000 has been processed',
      time: '1 day ago',
      type: 'success',
      read: false
    },
    {
      id: 3,
      title: 'New Driver Assigned',
      message: 'John Doe has been assigned to your vehicle LG-567-ABC',
      time: '2 days ago',
      type: 'info',
      read: true
    },
    {
      id: 4,
      title: 'Trip Milestone Reached',
      message: 'Your vehicle LG-234-KJA has completed 500 trips!',
      time: '3 days ago',
      type: 'success',
      read: true
    }
  ])

  </script>
  
  <style scoped>
  /* Custom animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
  </style>