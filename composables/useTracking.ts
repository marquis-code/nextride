import { ref, computed } from 'vue'

export function useTracking() {
  // Sample vehicle tracking data
  const trackingVehicles = ref([
    { 
      id: 1, 
      name: 'Toyota Camry', 
      licensePlate: 'LG-234-KJA', 
      driver: 'John Doe',
      status: 'Moving',
      lastUpdated: '2 mins ago',
      speed: 45,
      location: { lat: 6.5244, lng: 3.3792 } // Lagos
    },
    { 
      id: 2, 
      name: 'Honda Accord', 
      licensePlate: 'LG-567-ABC', 
      driver: 'Jane Smith',
      status: 'Idle',
      lastUpdated: '5 mins ago',
      speed: 0,
      location: { lat: 6.5143, lng: 3.3900 } // Lagos
    },
    { 
      id: 3, 
      name: 'Toyota Corolla', 
      licensePlate: 'LG-789-XYZ', 
      driver: 'Not assigned',
      status: 'Stopped',
      lastUpdated: '1 hour ago',
      speed: 0,
      location: { lat: 6.5055, lng: 3.3841 } // Lagos
    },
    { 
      id: 4, 
      name: 'Kia Sportage', 
      licensePlate: 'LG-901-DEF', 
      driver: 'Michael Johnson',
      status: 'Moving',
      lastUpdated: '1 min ago',
      speed: 32,
      location: { lat: 6.5344, lng: 3.3792 } // Lagos
    },
    { 
      id: 5, 
      name: 'Hyundai Elantra', 
      licensePlate: 'LG-345-GHI', 
      driver: 'Not assigned',
      status: 'Offline',
      lastUpdated: '2 days ago',
      speed: 0,
      location: { lat: 6.5144, lng: 3.3692 } // Lagos
    }
  ])

  // Sample trip history data
  const tripHistory = ref([
    { 
      id: 'TRP-001', 
      vehicle: 'Toyota Camry (LG-234-KJA)', 
      startTime: '2025-03-14 08:30 AM', 
      endTime: '2025-03-14 09:15 AM', 
      duration: '45 mins', 
      distance: 18.5,
      route: [
        { lat: 6.5244, lng: 3.3792 },
        { lat: 6.5300, lng: 3.3800 },
        { lat: 6.5350, lng: 3.3850 },
        { lat: 6.5400, lng: 3.3900 }
      ]
    },
    { 
      id: 'TRP-002', 
      vehicle: 'Honda Accord (LG-567-ABC)', 
      startTime: '2025-03-14 09:00 AM', 
      endTime: '2025-03-14 09:45 AM', 
      duration: '45 mins', 
      distance: 15.2,
      route: [
        { lat: 6.5143, lng: 3.3900 },
        { lat: 6.5200, lng: 3.3950 },
        { lat: 6.5250, lng: 3.4000 },
        { lat: 6.5300, lng: 3.4050 }
      ]
    },
    { 
      id: 'TRP-003', 
      vehicle: 'Kia Sportage (LG-901-DEF)', 
      startTime: '2025-03-14 08:15 AM', 
      endTime: '2025-03-14 09:00 AM', 
      duration: '45 mins', 
      distance: 16.8,
      route: [
        { lat: 6.5344, lng: 3.3792 },
        { lat: 6.5400, lng: 3.3800 },
        { lat: 6.5450, lng: 3.3850 },
        { lat: 6.5500, lng: 3.3900 }
      ]
    },
    { 
      id: 'TRP-004', 
      vehicle: 'Toyota Camry (LG-234-KJA)', 
      startTime: '2025-03-13 17:30 PM', 
      endTime: '2025-03-13 18:15 PM', 
      duration: '45 mins', 
      distance: 17.3,
      route: [
        { lat: 6.5244, lng: 3.3792 },
        { lat: 6.5200, lng: 3.3750 },
        { lat: 6.5150, lng: 3.3700 },
        { lat: 6.5100, lng: 3.3650 }
      ]
    },
    { 
      id: 'TRP-005', 
      vehicle: 'Honda Accord (LG-567-ABC)', 
      startTime: '2025-03-13 16:00 PM', 
      endTime: '2025-03-13 16:45 PM', 
      duration: '45 mins', 
      distance: 14.9,
      route: [
        { lat: 6.5143, lng: 3.3900 },
        { lat: 6.5100, lng: 3.3850 },
        { lat: 6.5050, lng: 3.3800 },
        { lat: 6.5000, lng: 3.3750 }
      ]
    }
  ])

  // Get vehicle by ID
  const getVehicleById = (id: number) => {
    return trackingVehicles.value.find(vehicle => vehicle.id === id)
  }

  // Get trips for a specific vehicle
  const getTripsForVehicle = (vehicleId: number) => {
    const vehicle = trackingVehicles.value.find(v => v.id === vehicleId)
    if (!vehicle) return []
    
    return tripHistory.value.filter(trip => 
      trip.vehicle.includes(vehicle.licensePlate)
    )
  }

  // Get moving vehicles
  const movingVehicles = computed(() => {
    return trackingVehicles.value.filter(vehicle => vehicle.status === 'Moving')
  })

  // Get idle vehicles
  const idleVehicles = computed(() => {
    return trackingVehicles.value.filter(vehicle => vehicle.status === 'Idle')
  })

  // Get stopped vehicles
  const stoppedVehicles = computed(() => {
    return trackingVehicles.value.filter(vehicle => vehicle.status === 'Stopped')
  })

  // Get offline vehicles
  const offlineVehicles = computed(() => {
    return trackingVehicles.value.filter(vehicle => vehicle.status === 'Offline')
  })

  // Update vehicle location
  const updateVehicleLocation = (id: number, location: { lat: number, lng: number }) => {
    const index = trackingVehicles.value.findIndex(vehicle => vehicle.id === id)
    if (index !== -1) {
      trackingVehicles.value[index].location = location
      trackingVehicles.value[index].lastUpdated = 'Just now'
      return true
    }
    return false
  }

  // Update vehicle status
  const updateVehicleStatus = (id: number, status: string, speed: number = 0) => {
    const index = trackingVehicles.value.findIndex(vehicle => vehicle.id === id)
    if (index !== -1) {
      trackingVehicles.value[index].status = status
      trackingVehicles.value[index].speed = speed
      trackingVehicles.value[index].lastUpdated = 'Just now'
      return true
    }
    return false
  }

  return {
    trackingVehicles,
    tripHistory,
    getVehicleById,
    getTripsForVehicle,
    movingVehicles,
    idleVehicles,
    stoppedVehicles,
    offlineVehicles,
    updateVehicleLocation,
    updateVehicleStatus
  }
}