import { ref, computed } from 'vue'

export function useVehicles() {
  // Sample vehicles data
  const vehicles = ref([
    { 
      id: 1, 
      make: 'Toyota', 
      model: 'Camry', 
      year: 2022, 
      licensePlate: 'LG-234-KJA', 
      status: 'Active',
      lastService: '2025-02-15',
      driver: {
        id: 'DRV-001',
        name: 'John Doe',
        phone: '080-1234-5678'
      }
    },
    { 
      id: 2, 
      make: 'Honda', 
      model: 'Accord', 
      year: 2021, 
      licensePlate: 'LG-567-ABC', 
      status: 'Active',
      lastService: '2025-01-20',
      driver: {
        id: 'DRV-002',
        name: 'Jane Smith',
        phone: '080-8765-4321'
      }
    },
    { 
      id: 3, 
      make: 'Toyota', 
      model: 'Corolla', 
      year: 2023, 
      licensePlate: 'LG-789-XYZ', 
      status: 'Maintenance',
      lastService: '2025-03-05',
      driver: null
    },
    { 
      id: 4, 
      make: 'Kia', 
      model: 'Sportage', 
      year: 2022, 
      licensePlate: 'LG-901-DEF', 
      status: 'Active',
      lastService: '2025-02-28',
      driver: {
        id: 'DRV-003',
        name: 'Michael Johnson',
        phone: '080-2468-1357'
      }
    },
    { 
      id: 5, 
      make: 'Hyundai', 
      model: 'Elantra', 
      year: 2021, 
      licensePlate: 'LG-345-GHI', 
      status: 'Inactive',
      lastService: '2025-01-10',
      driver: null
    }
  ])

  // Get vehicle by ID
  const getVehicleById = (id: number) => {
    return vehicles.value.find(vehicle => vehicle.id === id)
  }

  // Add a new vehicle
  const addVehicle = (vehicle: any) => {
    const id = vehicles.value.length + 1
    vehicles.value.push({
      id,
      ...vehicle
    })
    return id
  }

  // Update a vehicle
  const updateVehicle = (id: number, data: any) => {
    const index = vehicles.value.findIndex(vehicle => vehicle.id === id)
    if (index !== -1) {
      vehicles.value[index] = { ...vehicles.value[index], ...data }
      return true
    }
    return false
  }

  // Delete a vehicle
  const deleteVehicle = (id: number) => {
    const index = vehicles.value.findIndex(vehicle => vehicle.id === id)
    if (index !== -1) {
      vehicles.value.splice(index, 1)
      return true
    }
    return false
  }

  // Get all active vehicles
  const activeVehicles = computed(() => {
    return vehicles.value.filter(vehicle => vehicle.status === 'Active')
  })

  return {
    vehicles,
    getVehicleById,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    activeVehicles
  }
}