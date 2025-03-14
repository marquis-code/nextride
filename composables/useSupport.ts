import { ref, computed } from 'vue'

export function useSupport() {
  // Sample support tickets
  const tickets = ref([
    { 
      id: 'TKT-001', 
      subject: 'Vehicle maintenance schedule issue', 
      date: '2025-03-12', 
      status: 'Open', 
      lastUpdate: '2025-03-12',
      category: 'Vehicle Maintenance',
      priority: 'Medium',
      message: 'I am having issues with the maintenance schedule for my Toyota Camry. The app shows that service is due in 2 days, but I just had it serviced last week.',
      conversation: [
        {
          sender: 'you',
          text: 'I am having issues with the maintenance schedule for my Toyota Camry. The app shows that service is due in 2 days, but I just had it serviced last week.',
          time: '2025-03-12, 10:23 AM'
        },
        {
          sender: 'support',
          text: 'Thank you for reaching out. I understand your concern about the maintenance schedule. Let me check the service records for your vehicle and get back to you shortly.',
          time: '2025-03-12, 11:05 AM'
        }
      ]
    },
    { 
      id: 'TKT-002', 
      subject: 'Payment not reflecting in account', 
      date: '2025-03-10', 
      status: 'In Progress', 
      lastUpdate: '2025-03-11',
      category: 'Billing & Payments',
      priority: 'High',
      message: 'I made a payment of ₦45,000 on March 8th, but it is not showing in my account balance. Transaction reference: PAY-12345.',
      conversation: [
        {
          sender: 'you',
          text: 'I made a payment of ₦45,000 on March 8th, but it is not showing in my account balance. Transaction reference: PAY-12345.',
          time: '2025-03-10, 09:15 AM'
        },
        {
          sender: 'support',
          text: 'Thank you for your message. I apologize for the inconvenience. I will check with our finance team regarding your payment and update you as soon as possible.',
          time: '2025-03-10, 10:30 AM'
        },
        {
          sender: 'support',
          text: 'Our finance team is currently investigating your payment. They have confirmed that the transaction was received by our payment processor and are working to reconcile it with your account. We should have this resolved within 24 hours.',
          time: '2025-03-11, 02:45 PM'
        },
        {
          sender: 'you',
          text: 'Thank you for the update. I will wait for the resolution.',
          time: '2025-03-11, 03:20 PM'
        }
      ]
    },
    { 
      id: 'TKT-003', 
      subject: 'Driver assignment request', 
      date: '2025-03-08', 
      status: 'Resolved', 
      lastUpdate: '2025-03-09',
      category: 'Driver Related',
      priority: 'Medium',
      message: 'I would like to request a new driver for my Toyota Corolla. The current driver has been consistently late for the past week.',
      conversation: [
        {
          sender: 'you',
          text: 'I would like to request a new driver for my Toyota Corolla. The current driver has been consistently late for the past week.',
          time: '2025-03-08, 11:45 AM'
        },
        {
          sender: 'support',
          text: 'Thank you for bringing this to our attention. I understand your concern about the driver\'s punctuality. I will escalate this to our driver management team right away.',
          time: '2025-03-08, 12:30 PM'
        },
        {
          sender: 'support',
          text: 'Our driver management team has reviewed your request and approved a driver change. You can now assign a new driver to your vehicle through the Vehicle & Driver Management section of your dashboard.',
          time: '2025-03-09, 09:15 AM'
        },
        {
          sender: 'you',
          text: 'Thank you for the quick resolution. I have assigned a new driver.',
          time: '2025-03-09, 10:05 AM'
        },
        {
          sender: 'support',
          text: 'You\'re welcome! I\'m glad we could resolve this issue for you. If you have any other concerns, please don\'t hesitate to reach out.',
          time: '2025-03-09, 10:20 AM'
        }
      ]
    },
    { 
      id: 'TKT-004', 
      subject: 'App login issues', 
      date: '2025-03-05', 
      status: 'Closed', 
      lastUpdate: '2025-03-06',
      category: 'Technical Issue',
      priority: 'High',
      message: 'I am unable to log into the mobile app. It keeps showing "Authentication failed" even though I am using the correct credentials.',
      conversation: [
        {
          sender: 'you',
          text: 'I am unable to log into the mobile app. It keeps showing "Authentication failed" even though I am using the correct credentials.',
          time: '2025-03-05, 08:30 AM'
        },
        {
          sender: 'support',
          text: 'I apologize for the inconvenience. Let\'s troubleshoot this issue. Have you tried resetting your password? Also, please confirm which version of the app you are using.',
          time: '2025-03-05, 09:15 AM'
        },
        {
          sender: 'you',
          text: 'I tried resetting my password but still having the same issue. I\'m using app version 2.3.1 on Android.',
          time: '2025-03-05, 09:45 AM'
        },
        {
          sender: 'support',
          text: 'Thank you for the information. We\'ve identified a bug in version 2.3.1 that affects some Android users. Please update to version 2.3.2 which was released yesterday. This should resolve your login issue.',
          time: '2025-03-05, 10:30 AM'
        },
        {
          sender: 'you',
          text: 'I updated the app and now I can log in. Thank you for your help!',
          time: '2025-03-06, 08:15 AM'
        },
        {
          sender: 'support',
          text: 'Great! I\'m glad to hear that resolved the issue. If you encounter any other problems, please let us know.',
          time: '2025-03-06, 09:00 AM'
        }
      ]
    }
  ])

  // Sample FAQs
  const faqs = ref([
    {
      question: 'How do I update my vehicle information?',
      answer: 'You can update your vehicle information in the Vehicle & Driver Management section of your dashboard. Click on the edit button next to the vehicle you want to update, make your changes, and save.',
      open: false
    },
    {
      question: 'When are payouts processed?',
      answer: 'Payouts are processed every Monday for the previous week\'s earnings. The funds typically appear in your bank account within 1-2 business days after processing.',
      open: false
    },
    {
      question: 'How do I schedule maintenance for my vehicle?',
      answer: 'You can schedule maintenance for your vehicle in the Vehicle Performance section. Click on the wrench icon next to the vehicle you want to service, select a date and service type, and submit the request.',
      open: false
    },
    {
      question: 'Can I assign multiple drivers to one vehicle?',
      answer: 'No, each vehicle can only have one active driver assigned at a time. If you need to rotate drivers, you\'ll need to unassign the current driver before assigning a new one.',
      open: false
    },
    {
      question: 'How are earnings calculated?',
      answer: 'Earnings are calculated based on the number of trips completed, distance traveled, and time spent on trips. The exact formula may vary depending on your agreement with Nextride.',
      open: false
    }
  ])

  // Get ticket by ID
  const getTicketById = (id: string) => {
    return tickets.value.find(ticket => ticket.id === id)
  }

  // Filter tickets by status
  const filterTicketsByStatus = (status: string) => {
    if (status === 'all') {
      return tickets.value
    }
    return tickets.value.filter(ticket => 
      ticket.status.toLowerCase() === status.replace('-', ' ').toLowerCase()
    )
  }

  return {
    tickets,
    faqs,
    getTicketById,
    filterTicketsByStatus
  }
}