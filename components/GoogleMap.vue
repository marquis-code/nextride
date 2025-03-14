<template>
    <div class="relative h-full w-full">
      <div id="map" class="h-full w-full rounded-lg"></div>
      
      <!-- Map Controls -->
      <div class="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow p-2 z-10">
        <button @click="centerMap" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <MapPin class="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button @click="zoomIn" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <Plus class="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button @click="zoomOut" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <Minus class="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
      
      <!-- Vehicle List -->
      <div class="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow p-3 z-10 max-h-[200px] overflow-y-auto w-64">
        <h3 class="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Active Vehicles</h3>
        <div class="space-y-2">
          <div 
            v-for="vehicle in vehicles" 
            :key="vehicle.id" 
            @click="focusVehicle(vehicle)"
            class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{'bg-gray-100 dark:bg-gray-700': selectedVehicle?.id === vehicle.id}"
          >
            <div class="h-2 w-2 rounded-full mr-2" :class="getStatusColor(vehicle.status)"></div>
            <div>
              <p class="text-xs font-medium text-gray-900 dark:text-white">{{ vehicle.driver }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ vehicle.vehicle }}</p>
            </div>
            <div class="ml-auto text-xs">
              <span v-if="vehicle.speed > 0">{{ vehicle.speed }} mph</span>
              <span v-else class="text-gray-500 dark:text-gray-400">Idle</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Vehicle Info Popup -->
      <div 
        v-if="selectedVehicle" 
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-20 w-72"
      >
        <button @click="selectedVehicle = null" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <X class="h-4 w-4" />
        </button>
        <div class="flex items-center mb-3">
          <div class="p-2 rounded-full bg-primary/10 mr-3">
            <Car class="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">{{ selectedVehicle.vehicle }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Driver: {{ selectedVehicle.driver }}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-2 mb-3">
          <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-gray-400">Status</p>
            <p class="text-sm font-medium text-gray-900 dark:text-white capitalize">{{ selectedVehicle.status }}</p>
          </div>
          <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-gray-400">Speed</p>
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedVehicle.speed }} mph</p>
          </div>
        </div>
        
        <div class="flex space-x-2">
          <button class="flex-1 bg-primary text-white text-sm py-2 rounded-lg flex items-center justify-center">
            <PhoneCall class="h-4 w-4 mr-1" />
            Call Driver
          </button>
          <button class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm py-2 rounded-lg flex items-center justify-center">
            <Route class="h-4 w-4 mr-1" />
            Route
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { MapPin, Plus, Minus, Car, X, PhoneCall, Route } from 'lucide-vue-next'
  import { onMounted, ref, watch } from 'vue'
  
  const props = defineProps<{
    vehicles: Array<{
      id: number;
      lat: number;
      lng: number;
      status: string;
      driver: string;
      vehicle: string;
      speed: number;
    }>
  }>()
  
  const map = ref<any>(null)
  const markers = ref<any[]>([])
  const selectedVehicle = ref<any>(null)
  
  // Initialize map
  onMounted(() => {
    // Simulate Google Maps API
    setTimeout(() => {
      initMap()
      addVehicleMarkers()
    }, 500)
  })
  
  // Watch for changes in vehicles data
  watch(() => props.vehicles, () => {
    updateVehicleMarkers()
  }, { deep: true })
  
  function initMap() {
    // This is a simulation of Google Maps
    // In a real application, you would use the actual Google Maps API
    console.log('Map initialized')
    map.value = {
      zoom: 14,
      center: { lat: 40.7128, lng: -74.0060 }
    }
  }
  
  function addVehicleMarkers() {
    props.vehicles.forEach(vehicle => {
      // Simulate adding markers
      markers.value.push({
        id: vehicle.id,
        position: { lat: vehicle.lat, lng: vehicle.lng },
        vehicle: vehicle
      })
    })
  }
  
  function updateVehicleMarkers() {
    // Simulate updating marker positions
    props.vehicles.forEach(vehicle => {
      const marker = markers.value.find(m => m.id === vehicle.id)
      if (marker) {
        marker.position = { lat: vehicle.lat, lng: vehicle.lng }
        marker.vehicle = vehicle
      }
    })
  }
  
  function centerMap() {
    // Simulate centering the map
    if (selectedVehicle.value) {
      map.value.center = { lat: selectedVehicle.value.lat, lng: selectedVehicle.value.lng }
    } else if (props.vehicles.length > 0) {
      map.value.center = { lat: props.vehicles[0].lat, lng: props.vehicles[0].lng }
    }
  }
  
  function zoomIn() {
    // Simulate zooming in
    map.value.zoom = Math.min(20, map.value.zoom + 1)
  }
  
  function zoomOut() {
    // Simulate zooming out
    map.value.zoom = Math.max(1, map.value.zoom - 1)
  }
  
  function focusVehicle(vehicle: any) {
    selectedVehicle.value = vehicle
    map.value.center = { lat: vehicle.lat, lng: vehicle.lng }
    map.value.zoom = 16
  }
  
  function getStatusColor(status: string) {
    switch (status) {
      case 'active':
        return 'bg-success'
      case 'idle':
        return 'bg-warning'
      case 'maintenance':
        return 'bg-danger'
      default:
        return 'bg-gray-500'
    }
  }
  </script>
  
  <style scoped>
  #map {
    background-color: #f0f0f0;
    background-image: url('https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=13&size=600x400&maptype=roadmap');
    background-size: cover;
    background-position: center;
  }
  </style>