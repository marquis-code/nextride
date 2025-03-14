import { ref } from 'vue'

export interface Vehicle {
  id: number;
  lat: number;
  lng: number;
  status: string;
  driver: string;
  vehicle: string;
  speed: number;
}

export function useGoogleMaps() {
  const isLoaded = ref(false)
  const map = ref<any>(null)
  const markers = ref<any[]>([])
  
  // Initialize map
  function initMap(elementId: string, options: any = {}) {
    // In a real application, this would use the actual Google Maps API
    // This is a simulation for the UI prototype
    console.log(`Map initialized with element ID: ${elementId}`)
    
    const defaultOptions = {
      center: { lat: 40.7128, lng: -74.0060 },
      zoom: 14
    }
    
    map.value = {
      ...defaultOptions,
      ...options
    }
    
    isLoaded.value = true
    return map.value
  }
  
  // Add vehicle markers to the map
  function addVehicleMarkers(vehicles: Vehicle[]) {
    if (!isLoaded.value) return
    
    // Clear existing markers
    markers.value = []
    
    // Add new markers
    vehicles.forEach(vehicle => {
      // Simulate adding markers
      markers.value.push({
        id: vehicle.id,
        position: { lat: vehicle.lat, lng: vehicle.lng },
        vehicle: vehicle
      })
    })
    
    return markers.value
  }
  
  // Update vehicle marker positions
  function updateVehicleMarkers(vehicles: Vehicle[]) {
    if (!isLoaded.value) return
    
    vehicles.forEach(vehicle => {
      const marker = markers.value.find(m => m.id === vehicle.id)
      if (marker) {
        marker.position = { lat: vehicle.lat, lng: vehicle.lng }
        marker.vehicle = vehicle
      }
    })
    
    return markers.value
  }
  
  // Center map on a specific position
  function centerMap(position: { lat: number, lng: number }) {
    if (!isLoaded.value) return
    
    map.value.center = position
  }
  
  // Zoom in
  function zoomIn() {
    if (!isLoaded.value) return
    
    map.value.zoom = Math.min(20, map.value.zoom + 1)
  }
  
  // Zoom out
  function zoomOut() {
    if (!isLoaded.value) return
    
    map.value.zoom = Math.max(1, map.value.zoom - 1)
  }
  
  // Focus on a specific vehicle
  function focusVehicle(vehicle: Vehicle) {
    if (!isLoaded.value || !vehicle) return
    
    centerMap({ lat: vehicle.lat, lng: vehicle.lng })
    map.value.zoom = 16
  }
  
  return {
    isLoaded,
    map,
    markers,
    initMap,
    addVehicleMarkers,
    updateVehicleMarkers,
    centerMap,
    zoomIn,
    zoomOut,
    focusVehicle
  }
}