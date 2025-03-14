import { ref, computed } from 'vue'

export function useEarnings() {
  // Sample earnings data
  const earningsByVehicle = ref([
    { id: 1, name: 'Toyota Camry (LG-234-KJA)', amount: 245000 },
    { id: 2, name: 'Honda Accord (LG-567-ABC)', amount: 198000 },
    { id: 3, name: 'Toyota Corolla (LG-789-XYZ)', amount: 176500 },
    { id: 4, name: 'Kia Sportage (LG-901-DEF)', amount: 152000 },
    { id: 5, name: 'Hyundai Elantra (LG-345-GHI)', amount: 124000 }
  ])

  // Sample transactions data
  const transactions = ref([
    { id: 1, date: '2025-03-14', vehicle: 'Toyota Camry (LG-234-KJA)', amount: 12500, status: 'Completed' },
    { id: 2, date: '2025-03-13', vehicle: 'Honda Accord (LG-567-ABC)', amount: 9800, status: 'Completed' },
    { id: 3, date: '2025-03-12', vehicle: 'Toyota Corolla (LG-789-XYZ)', amount: 11200, status: 'Pending' },
    { id: 4, date: '2025-03-11', vehicle: 'Kia Sportage (LG-901-DEF)', amount: 8900, status: 'Completed' },
    { id: 5, date: '2025-03-10', vehicle: 'Hyundai Elantra (LG-345-GHI)', amount: 7600, status: 'Failed' }
  ])

  // Sample chart data
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

  // Calculate total earnings
  const totalEarnings = computed(() => {
    return earningsByVehicle.value.reduce((total, vehicle) => total + vehicle.amount, 0)
  })

  // Calculate max earnings (for progress bars)
  const maxEarnings = computed(() => {
    return Math.max(...earningsByVehicle.value.map(v => v.amount))
  })

  // Get earnings for a specific vehicle
  const getEarningsForVehicle = (vehicleId: number) => {
    const vehicle = earningsByVehicle.value.find(v => v.id === vehicleId)
    return vehicle ? vehicle.amount : 0
  }

  // Get transactions for a specific vehicle
  const getTransactionsForVehicle = (vehicleId: number) => {
    const vehicle = earningsByVehicle.value.find(v => v.id === vehicleId)
    if (!vehicle) return []
    
    return transactions.value.filter(t => t.vehicle === vehicle.name)
  }

  return {
    earningsByVehicle,
    transactions,
    chartData,
    totalEarnings,
    maxEarnings,
    getEarningsForVehicle,
    getTransactionsForVehicle
  }
}