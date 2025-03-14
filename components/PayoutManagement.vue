<template>
    <div class="space-y-6 fade-in">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Payout Management</h2>
          <p class="text-gray-500 mt-1">View pending and completed payouts</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <div class="relative">
            <select 
              v-model="selectedStatus" 
              class="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <ChevronDown class="h-4 w-4" />
            </div>
          </div>
          <button 
            @click="exportPayouts"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Download class="h-4 w-4 mr-1" />
            Export CSV
          </button>
        </div>
      </div>
  
      <!-- Payout Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-500">Total Payouts</h3>
            <CreditCard class="h-5 w-5 text-primary-600" />
          </div>
          <p class="mt-2 text-2xl font-semibold text-gray-900">₦{{ totalPayouts.toLocaleString() }}</p>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-500">Pending</h3>
            <Clock class="h-5 w-5 text-amber-500" />
          </div>
          <p class="mt-2 text-2xl font-semibold text-gray-900">₦{{ pendingAmount.toLocaleString() }}</p>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-500">Processing</h3>
            <RefreshCw class="h-5 w-5 text-blue-500" />
          </div>
          <p class="mt-2 text-2xl font-semibold text-gray-900">₦{{ processingAmount.toLocaleString() }}</p>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-500">Completed</h3>
            <CheckCircle class="h-5 w-5 text-green-500" />
          </div>
          <p class="mt-2 text-2xl font-semibold text-gray-900">₦{{ completedAmount.toLocaleString() }}</p>
        </div>
      </div>
  
      <!-- Payout History -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Payout History</h3>
          <div class="relative">
            <input 
              type="text" 
              placeholder="Search payouts..." 
              v-model="searchQuery"
              class="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search class="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="payout in filteredPayouts" :key="payout.id">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#{{ payout.id }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ payout.date }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">₦{{ payout.amount.toLocaleString() }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ payout.method }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <span 
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      payout.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      payout.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      payout.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ payout.status }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <button 
                    class="text-primary-600 hover:text-primary-700 font-medium"
                    @click="viewPayoutDetails(payout.id)"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4">
          <div class="text-sm text-gray-500">
            Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">{{ payouts.length }}</span> results
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
  
      <!-- Payout Details Modal -->
      <div v-if="showPayoutModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" @click="showPayoutModal = false">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Payout Details
                  </h3>
                  <div class="mt-2 space-y-4">
                    <div class="flex justify-between border-b border-gray-200 pb-2">
                      <span class="text-sm text-gray-500">Payout ID:</span>
                      <span class="text-sm font-medium text-gray-900">#{{ selectedPayout?.id }}</span>
                    </div>
                    <div class="flex justify-between border-b border-gray-200 pb-2">
                      <span class="text-sm text-gray-500">Date:</span>
                      <span class="text-sm font-medium text-gray-900">{{ selectedPayout?.date }}</span>
                    </div>
                    <div class="flex justify-between border-b border-gray-200 pb-2">
                      <span class="text-sm text-gray-500">Amount:</span>
                      <span class="text-sm font-medium text-gray-900">₦{{ selectedPayout?.amount.toLocaleString() }}</span>
                    </div>
                    <div class="flex justify-between border-b border-gray-200 pb-2">
                      <span class="text-sm text-gray-500">Method:</span>
                      <span class="text-sm font-medium text-gray-900">{{ selectedPayout?.method }}</span>
                    </div>
                    <div class="flex justify-between border-b border-gray-200 pb-2">
                      <span class="text-sm text-gray-500">Status:</span>
                      <span 
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          selectedPayout?.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          selectedPayout?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          selectedPayout?.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'
                        ]"
                      >
                        {{ selectedPayout?.status }}
                      </span>
                    </div>
                    <div class="flex justify-between border-b border-gray-200 pb-2">
                      <span class="text-sm text-gray-500">Reference:</span>
                      <span class="text-sm font-medium text-gray-900">{{ selectedPayout?.reference }}</span>
                    </div>
                    <div class="flex justify-between border-b border-gray-200 pb-2">
                      <span class="text-sm text-gray-500">Account:</span>
                      <span class="text-sm font-medium text-gray-900">{{ selectedPayout?.account }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="showPayoutModal = false"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
              <button 
                v-if="selectedPayout?.status === 'Pending'"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Request Status
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
    CreditCard, 
    Clock, 
    RefreshCw, 
    CheckCircle, 
    Search 
  } from 'lucide-vue-next'
  
  // Filter status
  const selectedStatus = ref('all')
  const searchQuery = ref('')
  
  // Payout modal
  const showPayoutModal = ref(false)
  const selectedPayout = ref<any>(null)
  
  // Sample payouts data
  const payouts = ref([
    { 
      id: 'PAY-001', 
      date: '2025-03-14', 
      amount: 45000, 
      method: 'Bank Transfer', 
      status: 'Completed',
      reference: 'REF-12345',
      account: 'Access Bank - 0123456789'
    },
    { 
      id: 'PAY-002', 
      date: '2025-03-13', 
      amount: 38500, 
      method: 'Bank Transfer', 
      status: 'Completed',
      reference: 'REF-12346',
      account: 'GTBank - 9876543210'
    },
    { 
      id: 'PAY-003', 
      date: '2025-03-12', 
      amount: 42000, 
      method: 'Bank Transfer', 
      status: 'Processing',
      reference: 'REF-12347',
      account: 'Access Bank - 0123456789'
    },
    { 
      id: 'PAY-004', 
      date: '2025-03-11', 
      amount: 35000, 
      method: 'Bank Transfer', 
      status: 'Pending',
      reference: 'REF-12348',
      account: 'GTBank - 9876543210'
    },
    { 
      id: 'PAY-005', 
      date: '2025-03-10', 
      amount: 29500, 
      method: 'Bank Transfer', 
      status: 'Failed',
      reference: 'REF-12349',
      account: 'Access Bank - 0123456789'
    },
    { 
      id: 'PAY-006', 
      date: '2025-03-09', 
      amount: 31000, 
      method: 'Bank Transfer', 
      status: 'Completed',
      reference: 'REF-12350',
      account: 'GTBank - 9876543210'
    },
    { 
      id: 'PAY-007', 
      date: '2025-03-08', 
      amount: 27500, 
      method: 'Bank Transfer', 
      status: 'Completed',
      reference: 'REF-12351',
      account: 'Access Bank - 0123456789'
    },
    { 
      id: 'PAY-008', 
      date: '2025-03-07', 
      amount: 33000, 
      method: 'Bank Transfer', 
      status: 'Pending',
      reference: 'REF-12352',
      account: 'GTBank - 9876543210'
    },
    { 
      id: 'PAY-009', 
      date: '2025-03-06', 
      amount: 25000, 
      method: 'Bank Transfer', 
      status: 'Processing',
      reference: 'REF-12353',
      account: 'Access Bank - 0123456789'
    },
    { 
      id: 'PAY-010', 
      date: '2025-03-05', 
      amount: 28000, 
      method: 'Bank Transfer', 
      status: 'Completed',
      reference: 'REF-12354',
      account: 'GTBank - 9876543210'
    }
  ])
  
  // Filtered payouts based on status and search query
  const filteredPayouts = computed(() => {
    return payouts.value.filter(payout => {
      const matchesStatus = selectedStatus.value === 'all' || payout.status.toLowerCase() === selectedStatus.value.toLowerCase()
      const matchesSearch = payout.id.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                            payout.date.includes(searchQuery.value) ||
                            payout.amount.toString().includes(searchQuery.value) ||
                            payout.method.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            payout.status.toLowerCase().includes(searchQuery.value.toLowerCase())
      
      return matchesStatus && matchesSearch
    })
  })
  
  // Calculate summary amounts
  const totalPayouts = computed(() => {
    return payouts.value.reduce((total, payout) => total + payout.amount, 0)
  })
  
  const pendingAmount = computed(() => {
    return payouts.value
      .filter(payout => payout.status === 'Pending')
      .reduce((total, payout) => total + payout.amount, 0)
  })
  
  const processingAmount = computed(() => {
    return payouts.value
      .filter(payout => payout.status === 'Processing')
      .reduce((total, payout) => total + payout.amount, 0)
  })
  
  const completedAmount = computed(() => {
    return payouts.value
      .filter(payout => payout.status === 'Completed')
      .reduce((total, payout) => total + payout.amount, 0)
  })
  
  // View payout details
  const viewPayoutDetails = (id: string) => {
    selectedPayout.value = payouts.value.find(payout => payout.id === id)
    showPayoutModal.value = true
  }
  
  // Export payouts to CSV
  const exportPayouts = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Date,Amount,Method,Status,Reference,Account\n";
    
    // Add data rows
    filteredPayouts.value.forEach(payout => {
      csvContent += `${payout.id},${payout.date},${payout.amount},${payout.method},${payout.status},${payout.reference},${payout.account}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payouts_${new Date().toISOString().split('T')[0]}.csv`);
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