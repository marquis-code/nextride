import { ref } from 'vue';

export function useVehicleManagement() {
  // Mock vehicle data
  const vehicles = ref([
    {
      id: 'V001',
      name: 'Nextride Sedan #1',
      type: 'Sedan',
      model: 'Toyota Camry',
      status: 'Available',
      driver: 'Michael Wilson',
      driverId: 'user-5',
      lastUpdated: '2025-03-14 10:15 AM',
      location: { lat: 40.7128, lng: -74.0060 },
      speed: 0
    },
    {
      id: 'V002',
      name: 'Nextride SUV #1',
      type: 'SUV',
      model: 'Honda CR-V',
      status: 'On Trip',
      driver: 'Jane Smith',
      driverId: 'user-2',
      lastUpdated: '2025-03-14 10:30 AM',
      location: { lat: 40.7282, lng: -73.9942 },
      speed: 35
    },
    {
      id: 'V003',
      name: 'Nextride Van #1',
      type: 'Van',
      model: 'Ford Transit',
      status: 'On Trip',
      driver: 'James Wilson',
      driverId: 'user-11',
      lastUpdated: '2025-03-14 10:25 AM',
      location: { lat: 40.7589, lng: -73.9851 },
      speed: 28
    },
    {
      id: 'V004',
      name: 'Nextride Sedan #2',
      type: 'Sedan',
      model: 'Hyundai Sonata',
      status: 'Available',
      driver: '',
      driverId: '',
      lastUpdated: '2025-03-14 09:45 AM',
      location: { lat: 40.7549, lng: -73.9840 },
      speed: 0
    },
    {
      id: 'V005',
      name: 'Nextride SUV #2',
      type: 'SUV',
      model: 'Toyota RAV4',
      status: 'On Trip',
      driver: 'Thomas Anderson',
      driverId: 'user-9',
      lastUpdated: '2025-03-14 10:20 AM',
      location: { lat: 40.7489, lng: -73.9680 },
      speed: 42
    },
    {
      id: 'V006',
      name: 'Nextride Bus #1',
      type: 'Bus',
      model: 'Mercedes Sprinter',
      status: 'Maintenance',
      driver: '',
      driverId: '',
      lastUpdated: '2025-03-13 02:30 PM',
      location: { lat: 40.7420, lng: -73.9890 },
      speed: 0
    },
    {
      id: 'V007',
      name: 'Nextride Sedan #3',
      type: 'Sedan',
      model: 'Nissan Altima',
      status: 'Out of Service',
      driver: '',
      driverId: '',
      lastUpdated: '2025-03-12 11:15 AM',
      location: { lat: 40.7380, lng: -73.9910 },
      speed: 0
    },
    {
      id: 'V008',
      name: 'Nextride Van #2',
      type: 'Van',
      model: 'Chevrolet Express',
      status: 'Available',
      driver: '',
      driverId: '',
      lastUpdated: '2025-03-14 09:30 AM',
      location: { lat: 40.7350, lng: -73.9950 },
      speed: 0
    },
    {
      id: 'V009',
      name: 'Nextride SUV #3',
      type: 'SUV',
      model: 'Ford Explorer',
      status: 'On Trip',
      driver: 'Jane Smith',
      driverId: 'user-2',
      lastUpdated: '2025-03-14 10:10 AM',
      location: { lat: 40.7220, lng: -74.0120 },
      speed: 38
    },
    {
      id: 'V010',
      name: 'Nextride Bus #2',
      type: 'Bus',
      model: 'Ford Transit',
      status: 'Available',
      driver: '',
      driverId: '',
      lastUpdated: '2025-03-14 09:15 AM',
      location: { lat: 40.7180, lng: -74.0150 },
      speed: 0
    },
    {
      id: 'V011',
      name: 'Nextride Sedan #4',
      type: 'Sedan',
      model: 'Honda Accord',
      status: 'On Trip',
      driver: 'Michael Wilson',
      driverId: 'user-5',
      lastUpdated: '2025-03-14 10:05 AM',
      location: { lat: 40.7150, lng: -73.9980 },
      speed: 25
    },
    {
      id: 'V012',
      name: 'Nextride SUV #4',
      type: 'SUV',
      model: 'Jeep Grand Cherokee',
      status: 'Maintenance',
      driver: '',
      driverId: '',
      lastUpdated: '2025-03-13 04:45 PM',
      location: { lat: 40.7100, lng: -74.0050 },
      speed: 0
    }
  ]);

  // Add a new vehicle
  const addVehicle = (vehicle: any) => {
    vehicles.value.push(vehicle);
  };

  // Update an existing vehicle
  const updateVehicle = (updatedVehicle: any) => {
    const index = vehicles.value.findIndex(vehicle => vehicle.id === updatedVehicle.id);
    if (index !== -1) {
      vehicles.value[index] = updatedVehicle;
    }
  };

  // Delete a vehicle by ID
  const deleteVehicleById = (vehicleId: string) => {
    vehicles.value = vehicles.value.filter(vehicle => vehicle.id !== vehicleId);
  };

  return {
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicleById
  };
}