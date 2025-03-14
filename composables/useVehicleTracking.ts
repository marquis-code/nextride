import { ref } from 'vue'

export function useVehicleTracking() {
  const vehicles = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch vehicles data
  const getVehicles = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // In a real app, this would be an API call
      // For now, we'll use dummy data
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      
      vehicles.value = [
        {
          id: 'v1',
          name: 'NextRide Van #1',
          driver: 'John Smith',
          contact: '+1 (555) 123-4567',
          status: 'active',
          location: 'Downtown Manhattan',
          coordinates: '40.7128,-74.0060',
          speed: 35,
          fuel: 78,
          battery: 92,
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'v2',
          name: 'NextRide SUV #3',
          driver: 'Maria Rodriguez',
          contact: '+1 (555) 234-5678',
          status: 'idle',
          location: 'Brooklyn Heights',
          coordinates: '40.6958,-73.9936',
          speed: 0,
          fuel: 45,
          battery: 87,
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'v3',
          name: 'NextRide Sedan #7',
          driver: 'David Johnson',
          contact: '+1 (555) 345-6789',
          status: 'active',
          location: 'Upper East Side',
          coordinates: '40.7736,-73.9566',
          speed: 28,
          fuel: 92,
          battery: 64,
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'v4',
          name: 'NextRide Van #4',
          driver: 'Sarah Williams',
          contact: '+1 (555) 456-7890',
          status: 'maintenance',
          location: 'Queens',
          coordinates: '40.7282,-73.7949',
          speed: 0,
          fuel: 12,
          battery: 23,
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'v5',
          name: 'NextRide SUV #9',
          driver: 'Michael Brown',
          contact: '+1 (555) 567-8901',
          status: 'active',
          location: 'Bronx',
          coordinates: '40.8448,-73.8648',
          speed: 42,
          fuel: 65,
          battery: 78,
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'v6',
          name: 'NextRide Sedan #2',
          driver: 'Jennifer Davis',
          contact: '+1 (555) 678-9012',
          status: 'idle',
          location: 'Staten Island',
          coordinates: '40.5795,-74.1502',
          speed: 0,
          fuel: 88,
          battery: 91,
          lastUpdated: new Date().toISOString()
        }
      ]
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch vehicles'
      console.error('Error fetching vehicles:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Get vehicle route history
  const getVehicleRouteHistory = async (vehicleId: string) => {
    // In a real app, this would be an API call
    // For now, we'll use dummy data
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay
    
    const now = new Date()
    
    // Generate dummy route history for the past 24 hours
    return Array.from({ length: 12 }, (_, i) => {
      const timestamp = new Date(now.getTime() - (i * 2 * 60 * 60 * 1000)) // Every 2 hours
      
      // Generate random coordinates near NYC
      const lat = 40.7128 + (Math.random() * 0.1 - 0.05)
      const lng = -74.0060 + (Math.random() * 0.1 - 0.05)
      
      // Random locations
      const locations = [
        'Downtown Manhattan',
        'Midtown East',
        'Upper West Side',
        'Brooklyn Heights',
        'Williamsburg',
        'Long Island City',
        'Astoria',
        'Harlem'
      ]
      
      // Random statuses
      const statuses = ['active', 'idle', 'charging', 'maintenance']
      
      return {
        timestamp: timestamp.toISOString(),
        location: locations[Math.floor(Math.random() * locations.length)],
        coordinates: `${lat.toFixed(4)},${lng.toFixed(4)}`,
        speed: Math.floor(Math.random() * 45),
        status: statuses[Math.floor(Math.random() * statuses.length)]
      }
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // Export vehicles data to CSV
  const exportVehiclesCSV = () => {
    if (vehicles.value.length === 0) return
    
    const headers = ['ID', 'Name', 'Driver', 'Contact', 'Status', 'Location', 'Coordinates', 'Speed', 'Fuel', 'Battery', 'Last Updated']
    
    const csvContent = [
      headers.join(','),
      ...vehicles.value.map(vehicle => [
        vehicle.id,
        `"${vehicle.name}"`,
        `"${vehicle.driver}"`,
        `"${vehicle.contact}"`,
        vehicle.status,
        `"${vehicle.location}"`,
        vehicle.coordinates,
        vehicle.speed,
        vehicle.fuel,
        vehicle.battery,
        vehicle.lastUpdated
      ].join(','))
    ].join('\n')
    
    downloadCSV(csvContent, 'nextride_vehicles.csv')
  }

  // Export route history to CSV
  const exportRouteHistoryCSV = async (vehicleId: string) => {
    const history = await getVehicleRouteHistory(vehicleId)
    
    if (history.length === 0) return
    
    const headers = ['Timestamp', 'Location', 'Coordinates', 'Speed', 'Status']
    
    const csvContent = [
      headers.join(','),
      ...history.map(entry => [
        entry.timestamp,
        `"${entry.location}"`,
        entry.coordinates,
        entry.speed,
        entry.status
      ].join(','))
    ].join('\n')
    
    const vehicle = vehicles.value.find(v => v.id === vehicleId)
    const filename = `nextride_history_${vehicle?.name.replace(/\s+/g, '_').toLowerCase() || vehicleId}.csv`
    
    downloadCSV(csvContent, filename)
  }

  // Helper function to download CSV
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    vehicles,
    isLoading,
    error,
    getVehicles,
    getVehicleRouteHistory,
    exportVehiclesCSV,
    exportRouteHistoryCSV
  }
}