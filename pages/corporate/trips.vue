<template>
    <div>
      <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Trip Management</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">View and manage all trips</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search trips..."
              class="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div class="relative">
            <Filter class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <select
              v-model="statusFilter"
              class="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-8 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button
            @click="exportTrips"
            class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <Download class="mr-2 h-4 w-4" />
            Export
          </button>
          <NuxtLink
            to="/trips/new"
            class="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            <Plus class="mr-2 h-4 w-4" />
            New Trip
          </NuxtLink>
        </div>
      </div>
  
      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul class="flex flex-wrap -mb-px">
          <li v-for="(tab, index) in tabs" :key="index" class="mr-2">
            <button
              @click="activeTab = tab.value"
              :class="[
                'inline-block py-4 px-4 text-sm font-medium border-b-2 rounded-t-lg',
                activeTab === tab.value
                  ? 'text-emerald-600 border-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
                  : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              {{ tab.label }}
              <span
                v-if="tab.count"
                :class="[
                  'ml-2 rounded-full px-2 py-0.5 text-xs font-medium',
                  activeTab === tab.value
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                ]"
              >
                {{ tab.count }}
              </span>
            </button>
          </li>
        </ul>
      </div>
  
      <!-- Trips Table -->
      <div class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  v-for="(column, index) in columns"
                  :key="index"
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  <div class="flex items-center">
                    {{ column.label }}
                    <button v-if="column.sortable" @click="sortBy(column.key)" class="ml-1">
                      <component
                        :is="getSortIcon(column.key)"
                        class="h-4 w-4"
                      />
                    </button>
                  </div>
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              <tr
                v-for="(trip, index) in filteredTrips"
                :key="index"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <img
                        :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(trip.employee)}&background=0D8ABC&color=fff`"
                        alt=""
                        class="h-10 w-10 rounded-full"
                      />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ trip.employee }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ trip.department }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">{{ trip.date }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ trip.time }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">{{ trip.pickup }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ trip.destination }}</div>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">{{ trip.vehicle }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ trip.driver }}</div>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    :class="[
                      'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                      getStatusClass(trip.status)
                    ]"
                  >
                    {{ trip.status }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="viewTrip(trip)"
                      class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                      <Eye class="h-5 w-5" />
                    </button>
                    <button
                      @click="editTrip(trip)"
                      class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                      <Edit class="h-5 w-5" />
                    </button>
                    <button
                      @click="deleteTrip(trip)"
                      class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700 dark:hover:text-red-400"
                    >
                      <Trash2 class="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredTrips.length === 0">
                <td colspan="6" class="px-6 py-10 text-center">
                  <div class="flex flex-col items-center">
                    <Calendar class="h-12 w-12 text-gray-400" />
                    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No trips found</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {{ searchQuery ? 'Try adjusting your search or filter.' : 'Get started by creating a new trip.' }}
                    </p>
                    <div class="mt-6" v-if="!searchQuery">
                      <NuxtLink
                        to="/trips/new"
                        class="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                      >
                        <Plus class="mr-2 h-4 w-4" />
                        New Trip
                      </NuxtLink>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800 sm:px-6">
          <div class="flex flex-1 justify-between sm:hidden">
            <button
              @click="currentPage > 1 ? currentPage-- : null"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Previous
            </button>
            <button
              @click="currentPage < totalPages ? currentPage++ : null"
              :disabled="currentPage === totalPages"
              class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Showing
                <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                to
                <span class="font-medium">
                  {{ Math.min(currentPage * itemsPerPage, filteredTrips.length) }}
                </span>
                of
                <span class="font-medium">{{ filteredTrips.length }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  @click="currentPage > 1 ? currentPage-- : null"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                >
                  <span class="sr-only">Previous</span>
                  <ChevronLeft class="h-5 w-5" />
                </button>
                <button
                  v-for="page in paginationRange"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'relative inline-flex items-center border px-4 py-2 text-sm font-medium',
                    currentPage === page
                      ? 'z-10 border-emerald-500 bg-emerald-50 text-emerald-600 dark:border-emerald-400 dark:bg-emerald-900 dark:text-emerald-200'
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="currentPage < totalPages ? currentPage++ : null"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                >
                  <span class="sr-only">Next</span>
                  <ChevronRight class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
  
      <!-- View Trip Modal -->
      <Teleport to="body">
        <div v-if="viewTripModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="viewTripModal = false"></div>
          <div class="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Trip Details</h3>
              <button
                @click="viewTripModal = false"
                class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <XIcon class="h-6 w-6" />
              </button>
            </div>
            <div v-if="selectedTrip" class="space-y-4">
              <div class="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div class="w-full sm:w-1/2">
                  <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <h4 class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Employee Information</h4>
                    <div class="flex items-center">
                      <div class="h-12 w-12 flex-shrink-0">
                        <img
                          :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedTrip.employee)}&background=0D8ABC&color=fff`"
                          alt=""
                          class="h-12 w-12 rounded-full"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ selectedTrip.employee }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          {{ selectedTrip.department }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w-full sm:w-1/2">
                  <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <h4 class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Trip Status</h4>
                    <div class="flex items-center">
                      <span
                        :class="[
                          'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                          getStatusClass(selectedTrip.status)
                        ]"
                      >
                        {{ selectedTrip.status }}
                      </span>
                      <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {{ selectedTrip.date }} at {{ selectedTrip.time }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h4 class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Route Information</h4>
                <div class="space-y-2">
                  <div class="flex items-start">
                    <MapPin class="mr-2 h-5 w-5 text-emerald-500" />
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">Pickup Location</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ selectedTrip.pickup }}</div>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <MapPin class="mr-2 h-5 w-5 text-red-500" />
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">Destination</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ selectedTrip.destination }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h4 class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Vehicle & Driver</h4>
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedTrip.vehicle }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">License: {{ selectedTrip.license || 'N/A' }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedTrip.driver }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Driver ID: {{ selectedTrip.driverId || 'N/A' }}</div>
                  </div>
                </div>
              </div>
              
              <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h4 class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Trip Details</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Distance</div>
                    <div class="text-sm text-gray-900 dark:text-white">{{ selectedTrip.distance || '12.5 km' }}</div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</div>
                    <div class="text-sm text-gray-900 dark:text-white">{{ selectedTrip.duration || '35 mins' }}</div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Cost</div>
                    <div class="text-sm text-gray-900 dark:text-white">{{ selectedTrip.cost || '$45.20' }}</div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</div>
                    <div class="text-sm text-gray-900 dark:text-white">{{ selectedTrip.paymentMethod || 'Corporate Account' }}</div>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button
                  @click="viewTripModal = false"
                  class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  @click="editTrip(selectedTrip)"
                  class="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  Edit Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
  
      <!-- Delete Confirmation Modal -->
      <Teleport to="body">
        <div v-if="deleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="deleteModal = false"></div>
          <div class="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div class="mb-4 text-center">
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <AlertTriangle class="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 class="mt-3 text-lg font-medium text-gray-900 dark:text-white">Delete Trip</h3>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this trip? This action cannot be undone.
              </p>
            </div>
            <div class="mt-5 flex justify-center space-x-3 sm:mt-6">
              <button
                @click="deleteModal = false"
                class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                @click="confirmDelete"
                class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { 
    Search, 
    Filter, 
    Download, 
    Plus, 
    Eye, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    ChevronUp,
    ChevronDown,
    X as XIcon,
    Calendar,
    MapPin,
    AlertTriangle
  } from 'lucide-vue-next';
  // import { useExportData } from '~/composables/useExportData';
  
  // Tabs
  const tabs = [
    { label: 'All Trips', value: 'all', count: 45 },
    { label: 'Upcoming', value: 'upcoming', count: 12 },
    { label: 'In Progress', value: 'in-progress', count: 5 },
    { label: 'Completed', value: 'completed', count: 28 },
  ];
  const activeTab = ref('all');
  
  // Table columns
  const columns = [
    { key: 'employee', label: 'Employee', sortable: true },
    { key: 'date', label: 'Date & Time', sortable: true },
    { key: 'route', label: 'Route', sortable: false },
    { key: 'vehicle', label: 'Vehicle & Driver', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];
  
  // Sorting
  const sortColumn = ref('date');
  const sortDirection = ref('desc');
  
  // Filtering
  const searchQuery = ref('');
  const statusFilter = ref('all');
  
  // Pagination
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  
  // Modals
  const viewTripModal = ref(false);
  const deleteModal = ref(false);
  const selectedTrip = ref<any>(null);
  
  // Sample trip data
  const trips = ref([
    {
      id: 1,
      employee: 'Sarah Johnson',
      department: 'Marketing',
      date: 'Mar 14, 2025',
      time: '10:30 AM',
      pickup: 'Corporate HQ, 123 Business Ave',
      destination: 'Airport Terminal 2',
      vehicle: 'Tesla Model Y',
      driver: 'Michael Rodriguez',
      license: 'ABC-1234',
      driverId: 'DR-5678',
      status: 'Scheduled',
      cost: '$78.50'
    },
    {
      id: 2,
      employee: 'David Wilson',
      department: 'Sales',
      date: 'Mar 14, 2025',
      time: '09:15 AM',
      pickup: 'Corporate HQ, 123 Business Ave',
      destination: 'Client Office, 456 Market St',
      vehicle: 'BMW 5 Series',
      driver: 'James Thompson',
      license: 'XYZ-5678',
      driverId: 'DR-9012',
      status: 'In Progress',
      cost: '$45.20'
    },
    {
      id: 3,
      employee: 'Emily Rodriguez',
      department: 'Finance',
      date: 'Mar 14, 2025',
      time: '02:15 PM',
      pickup: 'Branch Office, 789 Finance Blvd',
      destination: 'Corporate HQ, 123 Business Ave',
      vehicle: 'Audi Q5',
      driver: 'Robert Chen',
      license: 'DEF-9012',
      driverId: 'DR-3456',
      status: 'Scheduled',
      cost: '$35.75'
    },
    {
      id: 4,
      employee: 'Michael Chen',
      department: 'Executive',
      date: 'Mar 13, 2025',
      time: '11:45 AM',
      pickup: 'Corporate HQ, 123 Business Ave',
      destination: 'Downtown Conference Center',
      vehicle: 'Mercedes S-Class',
      driver: 'Lisa Johnson',
      license: 'GHI-3456',
      driverId: 'DR-7890',
      status: 'Completed',
      cost: '$92.30'
    },
    {
      id: 5,
      employee: 'Jennifer Lee',
      department: 'HR',
      date: 'Mar 13, 2025',
      time: '09:30 AM',
      pickup: 'Home Address',
      destination: 'Corporate HQ, 123 Business Ave',
      vehicle: 'Toyota Camry',
      driver: 'David Smith',
      license: 'JKL-7890',
      driverId: 'DR-1234',
      status: 'Completed',
      cost: '$28.90'
    },
    {
      id: 6,
      employee: 'Robert Garcia',
      department: 'IT',
      date: 'Mar 12, 2025',
      time: '04:45 PM',
      pickup: 'Corporate HQ, 123 Business Ave',
      destination: 'Airport Terminal 1',
      vehicle: 'Tesla Model 3',
      driver: 'Sarah Williams',
      license: 'MNO-1234',
      driverId: 'DR-5678',
      status: 'Completed',
      cost: '$65.40'
    },
    {
      id: 7,
      employee: 'Lisa Thompson',
      department: 'Marketing',
      date: 'Mar 12, 2025',
      time: '10:00 AM',
      pickup: 'Home Address',
      destination: 'Client Meeting, 567 Client Ave',
      vehicle: 'Lexus RX',
      driver: 'John Davis',
      license: 'PQR-5678',
      driverId: 'DR-9012',
      status: 'Completed',
      cost: '$52.80'
    },
    {
      id: 8,
      employee: 'Kevin Brown',
      department: 'Sales',
      date: 'Mar 15, 2025',
      time: '08:30 AM',
      pickup: 'Home Address',
      destination: 'Corporate HQ, 123 Business Ave',
      vehicle: 'Honda Accord',
      driver: 'Emily Chen',
      license: 'STU-9012',
      driverId: 'DR-3456',
      status: 'Scheduled',
      cost: '$32.50'
    },
    {
      id: 9,
      employee: 'Amanda Wilson',
      department: 'Legal',
      date: 'Mar 15, 2025',
      time: '01:30 PM',
      pickup: 'Corporate HQ, 123 Business Ave',
      destination: 'Courthouse, 789 Justice Rd',
      vehicle: 'Cadillac XT5',
      driver: 'Michael Brown',
      license: 'VWX-3456',
      driverId: 'DR-7890',
      status: 'Scheduled',
      cost: '$48.60'
    },
    {
      id: 10,
      employee: 'Thomas Martinez',
      department: 'Executive',
      date: 'Mar 11, 2025',
      time: '03:15 PM',
      pickup: 'Airport Terminal 3',
      destination: 'Corporate HQ, 123 Business Ave',
      vehicle: 'BMW 7 Series',
      driver: 'Jennifer Lopez',
      license: 'YZA-7890',
      driverId: 'DR-1234',
      status: 'Completed',
      cost: '$105.20'
    },
    {
      id: 11,
      employee: 'Jessica Taylor',
      department: 'Marketing',
      date: 'Mar 11, 2025',
      time: '11:30 AM',
      pickup: 'Corporate HQ, 123 Business Ave',
      destination: 'Media Studio, 456 Media Blvd',
      vehicle: 'Audi A6',
      driver: 'Robert Wilson',
      license: 'BCD-1234',
      driverId: 'DR-5678',
      status: 'Completed',
      cost: '$42.90'
    },
    {
      id: 12,
      employee: 'Daniel Johnson',
      department: 'IT',
      date: 'Mar 10, 2025',
      time: '09:45 AM',
      pickup: 'Home Address',
      destination: 'Data Center, 789 Server St',
      vehicle: 'Tesla Model Y',
      driver: 'Michael Rodriguez',
      license: 'ABC-1234',
      driverId: 'DR-5678',
      status: 'Completed',
      cost: '$38.70'
    }
  ]);
  
  // Generate more trips for pagination demo
  for (let i = 13; i <= 45; i++) {
    const departments = ['Sales', 'Marketing', 'Finance', 'IT', 'HR', 'Executive', 'Legal'];
    const statuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
    const vehicles = ['Tesla Model Y', 'BMW 5 Series', 'Audi Q5', 'Mercedes S-Class', 'Toyota Camry', 'Honda Accord', 'Lexus RX'];
    const randomDept = departments[Math.floor(Math.random() * departments.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    
    trips.value.push({
      id: i,
      employee: `Employee ${i}`,
      department: randomDept,
      date: `Mar ${Math.floor(Math.random() * 20) + 1}, 2025`,
      time: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 10)} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      pickup: 'Corporate HQ, 123 Business Ave',
      destination: 'Various Locations',
      vehicle: randomVehicle,
      driver: `Driver ${i}`,
      license: `LIC-${i}`,
      driverId: `DR-${i}`,
      status: randomStatus,
      cost: `$${(Math.random() * 100 + 20).toFixed(2)}`
    });
  }
  
  // Filtered and sorted trips
  const filteredTrips = computed(() => {
    let result = [...trips.value];
    
    // Filter by tab
    if (activeTab.value !== 'all') {
      const statusMap: Record<string, string> = {
        'upcoming': 'Scheduled',
        'in-progress': 'In Progress',
        'completed': 'Completed'
      };
      result = result.filter(trip => trip.status === statusMap[activeTab.value]);
    }
    
    // Filter by status
    if (statusFilter.value !== 'all') {
      const statusMap: Record<string, string> = {
        'scheduled': 'Scheduled',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
      };
      result = result.filter(trip => trip.status === statusMap[statusFilter.value]);
    }
    
    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(trip => 
        trip.employee.toLowerCase().includes(query) ||
        trip.department.toLowerCase().includes(query) ||
        trip.pickup.toLowerCase().includes(query) ||
        trip.destination.toLowerCase().includes(query) ||
        trip.vehicle.toLowerCase().includes(query) ||
        trip.driver.toLowerCase().includes(query)
      );
    }
    
    // Sort
    result.sort((a, b) => {
      let aValue = a[sortColumn.value as keyof typeof a];
      let bValue = b[sortColumn.value as keyof typeof b];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  });
  
  // Pagination
  const totalPages = computed(() => Math.ceil(filteredTrips.value.length / itemsPerPage.value));
  const paginationRange = computed(() => {
    const range = [];
    const maxPages = 5;
    
    if (totalPages.value <= maxPages) {
      for (let i = 1; i <= totalPages.value; i++) {
        range.push(i);
      }
    } else {
      let start = Math.max(1, currentPage.value - 2);
      let end = Math.min(totalPages.value, start + maxPages - 1);
      
      if (end - start < maxPages - 1) {
        start = Math.max(1, end - maxPages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
    }
    
    return range;
  });
  
  // Reset page when filters change
  watch([searchQuery, statusFilter, activeTab], () => {
    currentPage.value = 1;
  });
  
  // Sort function
  const sortBy = (column: string) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn.value = column;
      sortDirection.value = 'asc';
    }
  };
  
  // Get sort icon
  const getSortIcon = (column: string) => {
    if (sortColumn.value !== column) return ChevronUp;
    return sortDirection.value === 'asc' ? ChevronUp : ChevronDown;
  };
  
  // Status class helper
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Trip actions
  const viewTrip = (trip: any) => {
    selectedTrip.value = trip;
    viewTripModal.value = true;
  };
  
  const editTrip = (trip: any) => {
    // In a real app, you would navigate to an edit page or open an edit modal
    // For this demo, we'll just log the action
    console.log('Edit trip:', trip);
    // You could navigate with:
    // navigateTo(`/trips/edit/${trip.id}`);
  };
  
  const deleteTrip = (trip: any) => {
    selectedTrip.value = trip;
    deleteModal.value = true;
  };
  
  const confirmDelete = () => {
    if (selectedTrip.value) {
      trips.value = trips.value.filter(trip => trip.id !== selectedTrip.value.id);
      deleteModal.value = false;
      selectedTrip.value = null;
    }
  };
  
  // Export functionality
  // const { exportToCsv } = useExportData();
  
  const exportTrips = () => {
    const data = [
      ['Employee', 'Department', 'Date', 'Time', 'Pickup', 'Destination', 'Vehicle', 'Driver', 'Status', 'Cost']
    ];
    
    filteredTrips.value.forEach(trip => {
      data.push([
        trip.employee,
        trip.department,
        trip.date,
        trip.time,
        trip.pickup,
        trip.destination,
        trip.vehicle,
        trip.driver,
        trip.status,
        trip.cost
      ]);
    });
    
    // exportToCsv(data, `trips-export-${new Date().toISOString().split('T')[0]}.csv`);
  };

  definePageMeta({
  layout: 'corporate'
})
  </script>