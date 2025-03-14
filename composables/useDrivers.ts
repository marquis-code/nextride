import { ref, computed } from 'vue'

export function useDrivers() {
  // Sample drivers data
  const drivers = ref([
    { 
      id: 'DRV-001', 
      name: 'John Doe', 
      phone: '080-1234-5678', 
      email: 'john.doe@example.com', 
      license: 'DL-12345678', 
      status: 'Active',
      assignedVehicle: 'Toyota Camry (LG-234-KJA)'
    },
    { 
      id: 'DRV-002', 
      name: 'Jane Smith', 
      phone: '080-8765-4321', 
      email: 'jane.smith@example.com', 
      license: 'DL-87654321', 
      status: 'Active',
      assignedVehicle: 'Honda Accord (LG-567-ABC)'
    },
    { 
      id: 'DRV-003', 
      name: 'Michael Johnson', 
      phone: '080-2468-1357', 
      email: 'michael.johnson@example.com', 
      license: 'DL-13579246', 
      status: 'Active',
      assignedVehicle: 'Kia Sportage (LG-901-DEF)'
    },
    { 
      id: 'DRV-004', 
      name: 'Sarah Williams', 
      phone: '080-1357-2468', 
      email: 'sarah.williams@example.com', 
      license: 'DL-24681357', 
      status: 'Inactive',
      assignedVehicle: null
    },
    { 
      id: 'DRV-005', 
      name: 'David Brown', 
      phone: '080-9753-1246', 
      email: 'david.brown@example.com', 
      license: 'DL-97531246', 
      status: 'Active',
      assignedVehicle: null
    }
  ])

  // Get driver by ID
  const getDriverById = (id: string) => {
    return drivers.value.find(driver => driver.id === id)
  }

  // Add a new driver
  const addDriver = (driver: any) => {
    const id = `DRV-${String(drivers.value.length + 1).padStart(3, '0')}`
    drivers.value.push({
      id,
      ...driver
    })
    return id
  }

  // Update a driver
  const updateDriver = (id: string, data: any) => {
    const index = drivers.value.findIndex(driver => driver.id === id)
    if (index !== -1) {
      drivers.value[index] = { ...drivers.value[index], ...data }
      return true
    }
    return false
  }

  // Delete a driver
  const deleteDriver = (id: string) => {
    const index = drivers.value.findIndex(driver => driver.id === id)
    if (index !== -1) {
      drivers.value.splice(index, 1)
      return true
    }
    return false
  }

  // Get all active drivers
  const activeDrivers = computed(() => {
    return drivers.value.filter(driver => driver.status === 'Active')
  })

  // Get available drivers (not assigned to a vehicle)
  const availableDrivers = computed(() => {
    return drivers.value.filter(driver => 
      driver.status === 'Active' && !driver.assignedVehicle
    )
  })

  return {
    drivers,
    getDriverById,
    addDriver,
    updateDriver,
    deleteDriver,
    activeDrivers,
    availableDrivers
  }
}