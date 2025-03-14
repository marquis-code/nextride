import { ref, computed } from 'vue'

export function usePayouts() {
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

  // Get payout by ID
  const getPayoutById = (id: string) => {
    return payouts.value.find(payout => payout.id === id)
  }

  // Filter payouts by status
  const filterPayoutsByStatus = (status: string) => {
    if (status === 'all') {
      return payouts.value
    }
    return payouts.value.filter(payout => 
      payout.status.toLowerCase() === status.toLowerCase()
    )
  }

  // Search payouts
  const searchPayouts = (query: string) => {
    if (!query) return payouts.value
    
    const lowerQuery = query.toLowerCase()
    return payouts.value.filter(payout => 
      payout.id.toLowerCase().includes(lowerQuery) || 
      payout.date.includes(lowerQuery) ||
      payout.amount.toString().includes(lowerQuery) ||
      payout.method.toLowerCase().includes(lowerQuery) ||
      payout.status.toLowerCase().includes(lowerQuery) ||
      payout.reference.toLowerCase().includes(lowerQuery) ||
      payout.account.toLowerCase().includes(lowerQuery)
    )
  }

  return {
    payouts,
    totalPayouts,
    pendingAmount,
    processingAmount,
    completedAmount,
    getPayoutById,
    filterPayoutsByStatus,
    searchPayouts
  }
}