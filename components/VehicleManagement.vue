<template>
    <div class="space-y-6 fade-in">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Vehicle & Driver Management</h2>
          <p class="text-gray-500 mt-1">Update vehicle details, assign drivers</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button 
            @click="showAddVehicleModal = true"
            class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus class="h-4 w-4 mr-1" />
            Add Vehicle
          </button>
          <button 
            @click="exportVehicles"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Download class="h-4 w-4 mr-1" />
            Export CSV
          </button>
        </div>
      </div>
  
      <!-- Vehicle List -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div class="relative flex-1">
            <input 
              type="text" 
              placeholder="Search vehicles..." 
              v-model="searchQuery"
              class="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search class="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div class="flex gap-2">
            <div class="relative">
              <select 
                v-model="filterStatus" 
                class="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDown class="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Service</th>
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
                      <div class="text-sm font-medium text-gray-900">{{ vehicle.make }} {{ vehicle.model }}</div>
                      <div class="text-sm text-gray-500">{{ vehicle.year }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ vehicle.licensePlate }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div v-if="vehicle.driver" class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User class="h-4 w-4 text-gray-500" />
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ vehicle.driver.name }}</div>
                      <div class="text-sm text-gray-500">{{ vehicle.driver.phone }}</div>
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-500">Not assigned</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <span 
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      vehicle.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      vehicle.status === 'Inactive' ? 'bg-gray-100 text-gray-800' : 
                      'bg-amber-100 text-amber-800'
                    ]"
                  >
                    {{ vehicle.status }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ vehicle.lastService }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <div class="flex space-x-2">
                    <button 
                      @click="editVehicle(vehicle)"
                      class="text-primary-600 hover:text-primary-700"
                      title="Edit Vehicle"
                    >
                      <Edit class="h-4 w-4" />
                    </button>
                    <button 
                      @click="assignDriver(vehicle)"
                      class="text-blue-600 hover:text-blue-700"
                      title="Assign Driver"
                    >
                      <UserPlus class="h-4 w-4" />
                    </button>
                    <button 
                      @click="scheduleService(vehicle)"
                      class="text-amber-600 hover:text-amber-700"
                      title="Schedule Service"
                    >
                      <Wrench class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4">
          <div class="text-sm text-gray-500">
            Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredVehicles.length }}</span> of <span class="font-medium">{{ filteredVehicles.length }}</span> results
          </div>
          <div class="flex space-x-2">
            <button 
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Previous
            </button>
            <button 
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Next
            </button>
          </div>
        </div>
      </div>
  
      <!-- Driver Management -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Driver Management</h3>
          <button 
            @click="showAddDriverModal = true"
            class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <UserPlus class="h-4 w-4 mr-1" />
            Add Driver
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Vehicle</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="driver in drivers" :key="driver.id">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User class="h-5 w-5 text-gray-500" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ driver.name }}</div>
                      <div class="text-sm text-gray-500">ID: {{ driver.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ driver.phone }}</div>
                  <div class="text-sm text-gray-500">{{ driver.email }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ driver.license }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <span 
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      driver.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ driver.status }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ driver.assignedVehicle || 'Not assigned' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <div class="flex space-x-2">
                    <button 
                      @click="editDriver(driver)"
                      class="text-primary-600 hover:text-primary-700"
                      title="Edit Driver"
                    >
                      <Edit class="h-4 w-4" />
                    </button>
                    <button 
                      class="text-red-600 hover:text-red-700"
                      title="Remove Driver"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Add Vehicle Modal -->
      <div v-if="showAddVehicleModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" @click="showAddVehicleModal = false">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Add New Vehicle
                  </h3>
                  <div class="mt-2 space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label for="make" class="block text-sm font-medium text-gray-700">Make</label>
                        <input 
                          type="text" 
                          id="make" 
                          v-model="newVehicle.make"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label for="model" class="block text-sm font-medium text-gray-700">Model</label>
                        <input 
                          type="text" 
                          id="model" 
                          v-model="newVehicle.model"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
                        <input 
                          type="number" 
                          id="year" 
                          v-model="newVehicle.year"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label for="licensePlate" class="block text-sm font-medium text-gray-700">License Plate</label>
                        <input 
                          type="text" 
                          id="licensePlate" 
                          v-model="newVehicle.licensePlate"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                      <select 
                        id="status" 
                        v-model="newVehicle.status"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="addVehicle"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Add Vehicle
              </button>
              <button 
                @click="showAddVehicleModal = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Add Driver Modal -->
      <div v-if="showAddDriverModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" @click="showAddDriverModal = false">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Add New Driver
                  </h3>
                  <div class="mt-2 space-y-4">
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        v-model="newDriver.name"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input 
                          type="text" 
                          id="phone" 
                          v-model="newDriver.phone"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                          type="email" 
                          id="email" 
                          v-model="newDriver.email"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label for="license" class="block text-sm font-medium text-gray-700">Driver's License</label>
                      <input 
                        type="text" 
                        id="license" 
                        v-model="newDriver.license"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label for="driverStatus" class="block text-sm font-medium text-gray-700">Status</label>
                      <select 
                        id="driverStatus" 
                        v-model="newDriver.status"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="addDriver"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Add Driver
              </button>
              <button 
                @click="showAddDriverModal = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Assign Driver Modal -->
      <div v-if="showAssignDriverModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" @click="showAssignDriverModal = false">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Assign Driver to {{ selectedVehicle?.make }} {{ selectedVehicle?.model }}
                  </h3>
                  <div class="mt-2 space-y-4">
                    <div>
                      <label for="assignDriver" class="block text-sm font-medium text-gray-700">Select Driver</label>
                      <select 
                        id="assignDriver" 
                        v-model="selectedDriverId"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="">-- Select a driver --</option>
                        <option 
                          v-for="driver in availableDrivers" 
                          :key="driver.id" 
                          :value="driver.id"
                        >
                          {{ driver.name }} ({{ driver.phone }})
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="confirmAssignDriver"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Assign Driver
              </button>
              <button 
                @click="showAssignDriverModal = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { 
    ChevronDown, 
    Download, 
    Plus, 
    Search, 
    Car, 
    User, 
    Edit, 
    UserPlus, 
    Wrench, 
    Trash2 
  } from 'lucide-vue-next'
  
  // Search and filter
  const searchQuery = ref('')
  const filterStatus = ref('all')
  
  // Modals
  const showAddVehicleModal = ref(false)
  const showAddDriverModal = ref(false)
  const showAssignDriverModal = ref(false)
  
  // Selected items
  const selectedVehicle = ref<any>(null)
  const selectedDriverId = ref('')
  
  // New vehicle form
  const newVehicle = ref({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    status: 'Active'
  })
  
  // New driver form
  const newDriver = ref({
    name: '',
    phone: '',
    email: '',
    license: '',
    status: 'Active'
  })
  
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
  
  // Filtered vehicles based on search query and status filter
  const filteredVehicles = computed(() => {
    return vehicles.value.filter(vehicle => {
      const matchesSearch = 
        vehicle.make.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        vehicle.licensePlate.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (vehicle.driver?.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || false)
      
      const matchesStatus = filterStatus.value === 'all' || vehicle.status.toLowerCase() === filterStatus.value.toLowerCase()
      
      return matchesSearch && matchesStatus
    })
  })
  
  // Available drivers for assignment (not already assigned to a vehicle)
  const availableDrivers = computed(() => {
    return drivers.value.filter(driver => 
      driver.status === 'Active' && 
      (!driver.assignedVehicle || 
       (selectedVehicle.value && 
        driver.assignedVehicle === `${selectedVehicle.value.make} ${selectedVehicle.value.model} (${selectedVehicle.value.licensePlate})`))
    )
  })
  
  // Add a new vehicle
  const addVehicle = () => {
    const id = vehicles.value.length + 1
    vehicles.value.push({
      id,
      make: newVehicle.value.make,
      model: newVehicle.value.model,
      year: newVehicle.value.year,
      licensePlate: newVehicle.value.licensePlate,
      status: newVehicle.value.status,
      lastService: new Date().toISOString().split('T')[0],
      driver: null
    })
    
    // Reset form and close modal
    newVehicle.value = {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      status: 'Active'
    }
    showAddVehicleModal.value = false
  }
  
  // Add a new driver
  const addDriver = () => {
    const id = `DRV-${String(drivers.value.length + 1).padStart(3, '0')}`
    drivers.value.push({
      id,
      name: newDriver.value.name,
      phone: newDriver.value.phone,
      email: newDriver.value.email,
      license: newDriver.value.license,
      status: newDriver.value.status,
      assignedVehicle: null
    })
    
    // Reset form and close modal
    newDriver.value = {
      name: '',
      phone: '',
      email: '',
      license: '',
      status: 'Active'
    }
    showAddDriverModal.value = false
  }
  
  // Edit vehicle
  const editVehicle = (vehicle: any) => {
    selectedVehicle.value = vehicle
    // In a real app, you would open an edit modal here
    alert(`Edit vehicle: ${vehicle.make} ${vehicle.model}`)
  }
  
  // Edit driver
  const editDriver = (driver: any) => {
    // In a real app, you would open an edit modal here
    alert(`Edit driver: ${driver.name}`)
  }
  
  // Assign driver to vehicle
  const assignDriver = (vehicle: any) => {
    selectedVehicle.value = vehicle
    selectedDriverId.value = vehicle.driver?.id || ''
    showAssignDriverModal.value = true
  }
  
  // Confirm driver assignment
  const confirmAssignDriver = () => {
    if (!selectedDriverId.value) {
      alert('Please select a driver')
      return
    }
    
    const driver = drivers.value.find(d => d.id === selectedDriverId.value)
    if (!driver) return
    
    // Update vehicle with new driver
    const vehicleIndex = vehicles.value.findIndex(v => v.id === selectedVehicle.value.id)
    if (vehicleIndex !== -1) {
      // If this driver was assigned to another vehicle, remove that assignment
      if (driver.assignedVehicle) {
        const previousVehicle = vehicles.value.find(v => 
          `${v.make} ${v.model} (${v.licensePlate})` === driver.assignedVehicle
        )
        if (previousVehicle) {
          previousVehicle.driver = null
        }
      }
      
      // Assign driver to this vehicle
      vehicles.value[vehicleIndex].driver = {
        id: driver.id,
        name: driver.name,
        phone: driver.phone
      }
      
      // Update driver's assigned vehicle
      driver.assignedVehicle = `${selectedVehicle.value.make} ${selectedVehicle.value.model} (${selectedVehicle.value.licensePlate})`
    }
    
    showAssignDriverModal.value = false
  }
  
  // Schedule service
  const scheduleService = (vehicle: any) => {
    // In a real app, you would open a service scheduling modal here
    alert(`Schedule service for: ${vehicle.make} ${vehicle.model}`)
  }
  
  // Export vehicles to CSV
  const exportVehicles = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Make,Model,Year,License Plate,Status,Last Service,Driver\n";
    
    // Add data rows
    filteredVehicles.value.forEach(vehicle => {
      csvContent += `${vehicle.id},${vehicle.make},${vehicle.model},${vehicle.year},${vehicle.licensePlate},${vehicle.status},${vehicle.lastService},${vehicle.driver ? vehicle.driver.name : 'Not assigned'}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vehicles_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
  }
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
  </style>