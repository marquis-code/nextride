<template>
    <div class="tracking-page">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Vehicle Tracking</h1>
        <div class="flex space-x-2">
          <button 
            @click="exportCSV" 
            class="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <DownloadIcon class="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button 
            @click="refreshVehicles" 
            class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCwIcon class="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Vehicle List -->
        <div class="lg:col-span-1 bg-white rounded-lg shadow-md p-4 h-[calc(100vh-12rem)] overflow-y-auto">
          <div class="mb-4">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search vehicles..." 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div class="space-y-3">
            <div 
              v-for="vehicle in filteredVehicles" 
              :key="vehicle.id" 
              @click="selectVehicle(vehicle)"
              class="p-3 border rounded-md cursor-pointer transition-all duration-200 hover:bg-gray-50"
              :class="selectedVehicle?.id === vehicle.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div 
                    class="w-3 h-3 rounded-full mr-3" 
                    :class="vehicle.status === 'active' ? 'bg-green-500' : vehicle.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'"
                  ></div>
                  <span class="font-medium">{{ vehicle.name }}</span>
                </div>
                <ChevronRightIcon class="w-4 h-4 text-gray-400" />
              </div>
              <div class="mt-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <MapPinIcon class="w-4 h-4 mr-1" />
                  <span>{{ vehicle.location }}</span>
                </div>
                <div class="flex items-center mt-1">
                  <GaugeIcon class="w-4 h-4 mr-1" />
                  <span>{{ vehicle.speed }} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Map Container -->
        <div class="lg:col-span-3 bg-white rounded-lg shadow-md p-4 h-[calc(100vh-12rem)]">
          <div v-if="mapLoading" class="h-full flex items-center justify-center">
            <div class="flex flex-col items-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p class="mt-4 text-gray-600">Loading map...</p>
            </div>
          </div>
          <div v-else class="h-full">
            <div id="map" class="h-full rounded-md"></div>
            
            <!-- Vehicle Details Popup -->
            <div 
              v-if="selectedVehicle" 
              class="absolute bottom-8 left-8 bg-white p-4 rounded-lg shadow-lg max-w-md"
            >
              <div class="flex justify-between items-start">
                <h3 class="text-lg font-bold">{{ selectedVehicle.name }}</h3>
                <button @click="selectedVehicle = null" class="text-gray-500 hover:text-gray-700">
                  <XIcon class="w-5 h-5" />
                </button>
              </div>
              
              <div class="mt-3 space-y-2">
                <div class="flex items-center">
                  <UserIcon class="w-4 h-4 mr-2 text-gray-500" />
                  <span>Driver: {{ selectedVehicle.driver }}</span>
                </div>
                <div class="flex items-center">
                  <PhoneIcon class="w-4 h-4 mr-2 text-gray-500" />
                  <span>Contact: {{ selectedVehicle.contact }}</span>
                </div>
                <div class="flex items-center">
                  <FuelIcon class="w-4 h-4 mr-2 text-gray-500" />
                  <span>Fuel: {{ selectedVehicle.fuel }}%</span>
                </div>
                <div class="flex items-center">
                  <BatteryIcon class="w-4 h-4 mr-2 text-gray-500" />
                  <span>Battery: {{ selectedVehicle.battery }}%</span>
                </div>
                <div class="flex items-center">
                  <ClockIcon class="w-4 h-4 mr-2 text-gray-500" />
                  <span>Last Updated: {{ formatTime(selectedVehicle.lastUpdated) }}</span>
                </div>
              </div>
              
              <div class="mt-4 flex space-x-2">
                <button 
                  @click="contactDriver(selectedVehicle)" 
                  class="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  <PhoneCallIcon class="w-3.5 h-3.5 mr-1" />
                  Contact
                </button>
                <button 
                  @click="showRouteHistory(selectedVehicle)" 
                  class="flex items-center px-3 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
                >
                  <HistoryIcon class="w-3.5 h-3.5 mr-1" />
                  History
                </button>
                <button 
                  @click="navigateToVehicleDetails(selectedVehicle)" 
                  class="flex items-center px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
                >
                  <InfoIcon class="w-3.5 h-3.5 mr-1" />
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Route History Modal -->
      <Teleport to="body">
        <div v-if="showHistoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div class="p-4 border-b flex justify-between items-center">
              <h3 class="text-lg font-bold">Route History: {{ selectedVehicle?.name }}</h3>
              <button @click="showHistoryModal = false" class="text-gray-500 hover:text-gray-700">
                <XIcon class="w-5 h-5" />
              </button>
            </div>
            
            <div class="p-4 max-h-[calc(80vh-8rem)] overflow-y-auto">
              <div class="space-y-4">
                <div v-for="(entry, index) in routeHistory" :key="index" class="border-l-2 border-blue-500 pl-4 pb-4">
                  <div class="flex items-center">
                    <div class="w-2 h-2 rounded-full bg-blue-500 -ml-5"></div>
                    <span class="font-medium ml-3">{{ formatTime(entry.timestamp) }}</span>
                  </div>
                  <div class="mt-2 ml-1 text-sm text-gray-600">
                    <div class="flex items-start">
                      <MapPinIcon class="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                      <span>{{ entry.location }}</span>
                    </div>
                    <div class="flex items-center mt-1">
                      <GaugeIcon class="w-4 h-4 mr-2 text-gray-500" />
                      <span>Speed: {{ entry.speed }} km/h</span>
                    </div>
                    <div class="flex items-center mt-1">
                      <ActivityIcon class="w-4 h-4 mr-2 text-gray-500" />
                      <span>Status: {{ entry.status }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="p-4 border-t bg-gray-50 flex justify-end">
              <button 
                @click="exportRouteHistory" 
                class="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <DownloadIcon class="w-4 h-4 mr-2" />
                Export History
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { 
    MapPinIcon, ChevronRightIcon, RefreshCwIcon, DownloadIcon, 
    XIcon, UserIcon, PhoneIcon, FuelIcon, BatteryIcon, ClockIcon,
    PhoneCallIcon, HistoryIcon, InfoIcon, GaugeIcon, ActivityIcon
  } from 'lucide-vue-next'
  import { useVehicleTracking } from '~/composables/useVehicleTracking'
  
  // Vehicle tracking composable
  const { 
    vehicles, 
    getVehicles, 
    getVehicleRouteHistory, 
    exportVehiclesCSV,
    exportRouteHistoryCSV
  } = useVehicleTracking()
  
  // Local state
  const searchQuery = ref('')
  const selectedVehicle = ref<any>(null)
  const mapLoading = ref(true)
  const showHistoryModal = ref(false)
  const routeHistory = ref<any[]>([])
  let map: any = null
  let markers: any[] = []
  let refreshInterval: any = null
  
  // Computed properties
  const filteredVehicles = computed(() => {
    if (!searchQuery.value) return vehicles.value
    
    const query = searchQuery.value.toLowerCase()
    return vehicles.value.filter(vehicle => 
      vehicle.name.toLowerCase().includes(query) || 
      vehicle.driver.toLowerCase().includes(query) ||
      vehicle.location.toLowerCase().includes(query)
    )
  })
  
  // Methods
  const initMap = () => {
    if (window.google && window.google.maps) {
      map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })
      
      mapLoading.value = false
      updateMapMarkers()
    }
  }
  
  const updateMapMarkers = () => {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    markers = []
    
    // Add markers for each vehicle
    vehicles.value.forEach(vehicle => {
      // Parse coordinates from dummy data
      const [lat, lng] = vehicle.coordinates.split(',').map(Number)
      
      const markerIcon = {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: vehicle.status === 'active' ? '#10B981' : vehicle.status === 'idle' ? '#F59E0B' : '#EF4444',
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: '#FFFFFF',
        scale: 8
      }
      
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: vehicle.name,
        icon: markerIcon
      })
      
      marker.addListener('click', () => {
        selectVehicle(vehicle)
      })
      
      markers.push(marker)
    })
    
    // If a vehicle is selected, center the map on it
    if (selectedVehicle.value) {
      const [lat, lng] = selectedVehicle.value.coordinates.split(',').map(Number)
      map.setCenter({ lat, lng })
      map.setZoom(14)
    } else if (markers.length > 0) {
      // Otherwise, fit bounds to show all vehicles
      const bounds = new window.google.maps.LatLngBounds()
      markers.forEach(marker => bounds.extend(marker.getPosition()))
      map.fitBounds(bounds)
    }
  }
  
  const loadGoogleMapsScript = () => {
    if (window.google && window.google.maps) {
      initMap()
      return
    }
    
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initGoogleMaps`
    script.async = true
    script.defer = true
    
    window.initGoogleMaps = initMap
    
    document.head.appendChild(script)
  }
  
  const refreshVehicles = async () => {
    await getVehicles()
    updateMapMarkers()
  }
  
  const selectVehicle = (vehicle: any) => {
    selectedVehicle.value = vehicle
    
    if (map) {
      const [lat, lng] = vehicle.coordinates.split(',').map(Number)
      map.setCenter({ lat, lng })
      map.setZoom(15)
    }
  }
  
  const showRouteHistory = async (vehicle: any) => {
    routeHistory.value = await getVehicleRouteHistory(vehicle.id)
    showHistoryModal.value = true
  }
  
  const exportCSV = () => {
    exportVehiclesCSV()
  }
  
  const exportRouteHistory = () => {
    if (selectedVehicle.value) {
      exportRouteHistoryCSV(selectedVehicle.value.id)
    }
  }
  
  const contactDriver = (vehicle: any) => {
    // In a real app, this would initiate a call or messaging
    alert(`Contacting driver: ${vehicle.driver} at ${vehicle.contact}`)
  }
  
  const navigateToVehicleDetails = (vehicle: any) => {
    // In a real app, this would navigate to the vehicle details page
    alert(`Navigating to details for vehicle: ${vehicle.name}`)
  }
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }
  
  // Lifecycle hooks
  onMounted(() => {
    getVehicles()
    loadGoogleMapsScript()
    
    // Set up auto-refresh interval
    refreshInterval = setInterval(refreshVehicles, 30000) // Refresh every 30 seconds
  })
  
  onUnmounted(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
  })
  
  // Watch for changes to vehicles data
  watch(vehicles, () => {
    if (map) {
      updateMapMarkers()
    }
  })
  </script>
  
  <style scoped>
  .tracking-page {
    @apply p-6;
  }
  </style>