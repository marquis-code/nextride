<template>
    <div class="space-y-6 fade-in">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Vehicle Tracking</h2>
          <p class="text-gray-500 mt-1">Real-time location tracking of your vehicles</p>
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
            @click="refreshMap"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <RefreshCw class="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>
  
      <!-- Map Container -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="h-[500px] w-full" ref="mapContainer"></div>
      </div>
  
      <!-- Vehicle Status List -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Vehicle Status</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="vehicle in filteredVehicles" :key="vehicle.id">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Car class="h-5 w-5 text-gray-500" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ vehicle.name }}</div>
                      <div class="text-sm text-gray-500">{{ vehicle.licensePlate }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ vehicle.driver }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <span 
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      vehicle.status === 'Moving' ? 'bg-green-100 text-green-800' : 
                      vehicle.status === 'Idle' ? 'bg-amber-100 text-amber-800' : 
                      vehicle.status === 'Stopped' ? 'bg-gray-100 text-gray-800' : 
                      'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ vehicle.status }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ vehicle.lastUpdated }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ vehicle.speed }} km/h</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <button 
                    @click="centerOnVehicle(vehicle)"
                    class="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Locate
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Trip History -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Trip History</h3>
          <div class="flex gap-2">
            <div class="relative">
              <select 
                v-model="selectedTripVehicle" 
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
</div>
</div>
</div>
</div>
</template>