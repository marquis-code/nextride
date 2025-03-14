<template>
    <div class="space-y-6 fade-in">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Support & Communication</h2>
          <p class="text-gray-500 mt-1">Contact Nextride support for queries or disputes</p>
        </div>
        <button 
          @click="showNewTicketModal = true"
          class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus class="h-4 w-4 mr-1" />
          New Support Ticket
        </button>
      </div>
  
      <!-- Support Tickets -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Support Tickets</h3>
          <div class="flex gap-2">
            <div class="relative">
              <select 
                v-model="filterTicketStatus" 
                class="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
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
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="ticket in filteredTickets" :key="ticket.id">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ ticket.id }}</td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ ticket.subject }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ ticket.date }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <span 
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' : 
                      ticket.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 
                      ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ ticket.status }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ ticket.lastUpdate }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <button 
                    @click="viewTicket(ticket)"
                    class="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="filteredTickets.length === 0" class="py-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Inbox class="h-8 w-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">No tickets found</h3>
          <p class="mt-1 text-sm text-gray-500">
            You don't have any support tickets matching your filters.
          </p>
          <button 
            @click="showNewTicketModal = true"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus class="h-4 w-4 mr-1" />
            Create a new ticket
          </button>
        </div>
      </div>
  
      <!-- FAQ Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div class="space-y-4">
          <div v-for="(faq, index) in faqs" :key="index" class="border border-gray-200 rounded-lg">
            <button 
              @click="toggleFaq(index)"
              class="flex justify-between items-center w-full px-4 py-3 text-left text-sm font-medium text-gray-900 focus:outline-none"
            >
              <span>{{ faq.question }}</span>
              <ChevronDown 
                :class="[
                  'h-5 w-5 text-gray-500 transition-transform',
                  faq.open ? 'transform rotate-180' : ''
                ]" 
              />
            </button>
            <div v-if="faq.open" class="px-4 pb-4">
              <p class="text-sm text-gray-600">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Contact Information -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-start p-4 border border-gray-200 rounded-lg">
            <div class="flex-shrink-0 bg-primary-100 p-2 rounded-full">
              <Phone class="h-5 w-5 text-primary-600" />
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Phone Support</h4>
              <p class="mt-1 text-sm text-gray-600">+234 (0) 800-NEXTRIDE</p>
              <p class="mt-1 text-xs text-gray-500">Mon-Fri, 8am-6pm</p>
            </div>
          </div>
          <div class="flex items-start p-4 border border-gray-200 rounded-lg">
            <div class="flex-shrink-0 bg-primary-100 p-2 rounded-full">
              <Mail class="h-5 w-5 text-primary-600" />
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Email Support</h4>
              <p class="mt-1 text-sm text-gray-600">support@nextride.com</p>
              <p class="mt-1 text-xs text-gray-500">24/7 support</p>
            </div>
          </div>
          <div class="flex items-start p-4 border border-gray-200 rounded-lg">
            <div class="flex-shrink-0 bg-primary-100 p-2 rounded-full">
              <MessageSquare class="h-5 w-5 text-primary-600" />
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Live Chat</h4>
              <p class="mt-1 text-sm text-gray-600">Available in-app</p>
              <p class="mt-1 text-xs text-gray-500">Mon-Fri, 9am-5pm</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- New Ticket Modal -->
      <div v-if="showNewTicketModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" @click="showNewTicketModal = false">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Create New Support Ticket
                  </h3>
                  <div class="mt-2 space-y-4">
                    <div>
                      <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        v-model="newTicket.subject"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Brief description of your issue"
                      />
                    </div>
                    <div>
                      <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                      <select 
                        id="category" 
                        v-model="newTicket.category"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="vehicle">Vehicle Maintenance</option>
                        <option value="driver">Driver Related</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
                      <select 
                        id="priority" 
                        v-model="newTicket.priority"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
                      <textarea 
                        id="message" 
                        v-model="newTicket.message"
                        rows="4"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Please describe your issue in detail"
                      ></textarea>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Attachments</label>
                      <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div class="space-y-1 text-center">
                          <Upload class="mx-auto h-12 w-12 text-gray-400" />
                          <div class="flex text-sm text-gray-600">
                            <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                              <span>Upload a file</span>
                              <input id="file-upload" name="file-upload" type="file" class="sr-only" />
                            </label>
                            <p class="pl-1">or drag and drop</p>
                          </div>
                          <p class="text-xs text-gray-500">
                            PNG, JPG, PDF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="submitTicket"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Submit Ticket
              </button>
              <button 
                @click="showNewTicketModal = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- View Ticket Modal -->
      <div v-if="showViewTicketModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" @click="showViewTicketModal = false">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      Ticket #{{ selectedTicket?.id }}
                    </h3>
                    <span 
                      :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        selectedTicket?.status === 'Open' ? 'bg-blue-100 text-blue-800' : 
                        selectedTicket?.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 
                        selectedTicket?.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ selectedTicket?.status }}
                    </span>
                  </div>
                  <div class="mt-2 space-y-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Subject</h4>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedTicket?.subject }}</p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Date</h4>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedTicket?.date }}</p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Category</h4>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedTicket?.category }}</p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Priority</h4>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedTicket?.priority }}</p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Message</h4>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedTicket?.message }}</p>
                    </div>
                    
                    <!-- Conversation Thread -->
                    <div class="mt-6">
                      <h4 class="text-sm font-medium text-gray-700 mb-2">Conversation</h4>
                      <div class="space-y-4">
                        <div v-for="(message, index) in selectedTicket?.conversation" :key="index" 
                          :class="[
                            'p-3 rounded-lg',
                            message.sender === 'support' ? 'bg-gray-100' : 'bg-primary-50'
                          ]"
                        >
                          <div class="flex items-start">
                            <div 
                              :class="[
                                'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
                                message.sender === 'support' ? 'bg-primary-100' : 'bg-gray-200'
                              ]"
                            >
                              <User v-if="message.sender === 'support'" class="h-4 w-4 text-primary-600" />
                              <User v-else class="h-4 w-4 text-gray-600" />
                            </div>
                            <div class="ml-3">
                              <p class="text-xs font-medium text-gray-900">
                                {{ message.sender === 'support' ? 'Support Agent' : 'You' }}
                                <span class="ml-2 font-normal text-gray-500">{{ message.time }}</span>
                              </p>
                              <p class="mt-1 text-sm text-gray-900">{{ message.text }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Reply Form -->
                    <div class="mt-4">
                      <label for="reply" class="block text-sm font-medium text-gray-700">Reply</label>
                      <textarea 
                        id="reply" 
                        v-model="ticketReply"
                        rows="3"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Type your reply here..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="sendReply"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Send Reply
              </button>
              <button 
                v-if="selectedTicket?.status === 'Open' || selectedTicket?.status === 'In Progress'"
                @click="closeTicket"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close Ticket
              </button>
              <button 
                @click="showViewTicketModal = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Back
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
    Plus, 
    Inbox, 
    Phone, 
    Mail, 
    MessageSquare, 
    Upload, 
    User 
  } from 'lucide-vue-next'
  
  // Filter status
  const filterTicketStatus = ref('all')
  
  // Modals
  const showNewTicketModal = ref(false)
  const showViewTicketModal = ref(false)
  
  // Selected ticket
  const selectedTicket = ref<any>(null)
  const ticketReply = ref('')
  
  // New ticket form
  const newTicket = ref({
    subject: '',
    category: 'technical',
    priority: 'medium',
    message: ''
  })
  
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
  
  // Filtered tickets based on status
  const filteredTickets = computed(() => {
    if (filterTicketStatus.value === 'all') {
      return tickets.value
    } else {
      return tickets.value.filter(ticket => 
        ticket.status.toLowerCase() === filterTicketStatus.value.replace('-', ' ')
      )
    }
  })
  
  // Toggle FAQ accordion
  const toggleFaq = (index: number) => {
    faqs.value[index].open = !faqs.value[index].open
  }
  
  // View ticket details
  const viewTicket = (ticket: any) => {
    selectedTicket.value = ticket
    showViewTicketModal.value = true
    ticketReply.value = ''
  }
  
  // Submit new ticket
  const submitTicket = () => {
    // Validate form
    if (!newTicket.value.subject || !newTicket.value.message) {
      alert('Please fill in all required fields')
      return
    }
    
    // Generate ticket ID
    const ticketId = `TKT-${String(tickets.value.length + 1).padStart(3, '0')}`
    
    // Get current date
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Create new ticket
    tickets.value.unshift({
      id: ticketId,
      subject: newTicket.value.subject,
      date: currentDate,
      status: 'Open',
      lastUpdate: currentDate,
      category: newTicket.value.category,
      priority: newTicket.value.priority,
      message: newTicket.value.message,
      conversation: [
        {
          sender: 'you',
          text: newTicket.value.message,
          time: new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        }
      ]
    })
    
    // Reset form and close modal
    newTicket.value = {
      subject: '',
      category: 'technical',
      priority: 'medium',
      message: ''
    }
    showNewTicketModal.value = false
  }
  
  // Send reply to ticket
  const sendReply = () => {
    if (!ticketReply.value) {
      alert('Please enter a reply')
      return
    }
    
    if (selectedTicket.value) {
      // Add reply to conversation
      selectedTicket.value.conversation.push({
        sender: 'you',
        text: ticketReply.value,
        time: new Date().toLocaleString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      })
      
      // Update last update timestamp
      selectedTicket.value.lastUpdate = new Date().toISOString().split('T')[0]
      
      // Reset reply field
      ticketReply.value = ''
      
      // Simulate support response after a delay
      setTimeout(() => {
        if (selectedTicket.value) {
          selectedTicket.value.conversation.push({
            sender: 'support',
            text: 'Thank you for your message. Our support team will review your reply and get back to you as soon as possible.',
            time: new Date().toLocaleString('en-US', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
          })
        }
      }, 1000)
    }
  }
  
  // Close ticket
  const closeTicket = () => {
    if (selectedTicket.value) {
      selectedTicket.value.status = 'Closed'
      selectedTicket.value.lastUpdate = new Date().toISOString().split('T')[0]
      showViewTicketModal.value = false
    }
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