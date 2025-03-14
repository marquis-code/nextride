<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
      <div class="mt-4 sm:mt-0">
        <button 
          @click="showAddUserModal = true"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
        >
          <UserPlus class="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-primary-500"
          />
          <Search class="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
        </div>
        
        <select 
          v-model="roleFilter"
          class="px-4 py-2 text-sm border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="driver">Driver</option>
          <option value="customer">Customer</option>
          <option value="support">Support</option>
        </select>
        
        <select 
          v-model="statusFilter"
          class="px-4 py-2 text-sm border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      
      <div class="flex space-x-2">
        <button 
          @click="exportToCSV"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <Download class="w-4 h-4 mr-2" />
          Export CSV
        </button>
        <button 
          @click="refreshUsers"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <RefreshCw class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                v-for="header in tableHeaders" 
                :key="header.key"
                scope="col" 
                class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
              >
                <div class="flex items-center space-x-1 cursor-pointer" @click="sortBy(header.key)">
                  <span>{{ header.label }}</span>
                  <ChevronUp v-if="sortColumn === header.key && sortDirection === 'asc'" class="w-4 h-4" />
                  <ChevronDown v-else-if="sortColumn === header.key && sortDirection === 'desc'" class="w-4 h-4" />
                </div>
              </th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 w-10 h-10">
                    <img class="w-10 h-10 rounded-full" :src="user.avatar" alt="" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    roleClasses[user.role] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  ]"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    statusClasses[user.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  ]"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                {{ user.lastLogin }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                {{ user.createdAt }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                <div class="flex justify-end space-x-2">
                  <button 
                    @click="editUser(user)"
                    class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <Edit class="w-5 h-5" />
                  </button>
                  <button 
                    v-if="user.status === 'active'"
                    @click="toggleUserStatus(user)"
                    class="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                  >
                    <Ban class="w-5 h-5" />
                  </button>
                  <button 
                    v-else
                    @click="toggleUserStatus(user)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <CheckCircle class="w-5 h-5" />
                  </button>
                  <button 
                    @click="deleteUser(user)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                No users found matching your criteria
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 sm:px-6">
        <div class="flex items-center">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Showing
            <span class="font-medium">{{ paginationStart }}</span>
            to
            <span class="font-medium">{{ paginationEnd }}</span>
            of
            <span class="font-medium">{{ filteredUsers.length }}</span>
            results
          </p>
        </div>
        <div class="flex space-x-2">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            :class="[
              'relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md',
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 bg-white hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700'
            ]"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button
            :disabled="paginationEnd >= filteredUsers.length"
            @click="currentPage++"
            :class="[
              'relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md',
              paginationEnd >= filteredUsers.length
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 bg-white hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700'
            ]"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddUserModal" class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="showAddUserModal = false"></div>
      <div class="relative z-50 w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ editingUser ? 'Edit User' : 'Add New User' }}
          </h3>
          <button @click="showAddUserModal = false" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="saveUser">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                id="name"
                v-model="userForm.name"
                type="text"
                required
                class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                id="email"
                v-model="userForm.email"
                type="email"
                required
                class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <select
                id="role"
                v-model="userForm.role"
                required
                class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="admin">Admin</option>
                <option value="driver">Driver</option>
                <option value="customer">Customer</option>
                <option value="support">Support</option>
              </select>
            </div>
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select
                id="status"
                v-model="userForm.status"
                required
                class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div v-if="!editingUser">
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                id="password"
                v-model="userForm.password"
                type="password"
                required
                class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
          <div class="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              @click="showAddUserModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
            >
              {{ editingUser ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="showDeleteModal = false"></div>
      <div class="relative z-50 w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Confirm Delete</h3>
          <button @click="showDeleteModal = false" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X class="w-5 h-5" />
          </button>
        </div>
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to delete the user "{{ userToDelete?.name }}"? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  UserPlus, Search, Download, RefreshCw, 
  Edit, Trash2, Ban, CheckCircle, 
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X
} from 'lucide-vue-next';
import { useUserManagement } from '~/composables/useUserManagement';

// Table headers
const tableHeaders = [
  { key: 'name', label: 'User' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'lastLogin', label: 'Last Login' },
  { key: 'createdAt', label: 'Created At' }
];

// Styling classes
const roleClasses = {
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  driver: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  customer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  support: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
};

const statusClasses = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
};

// User management composable
const { 
  users, 
  addUser, 
  updateUser, 
  deleteUserById, 
  toggleStatus 
} = useUserManagement();

// Filters and search
const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');

// Sorting
const sortColumn = ref('name');
const sortDirection = ref<'asc' | 'desc'>('asc');

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Modals
const showAddUserModal = ref(false);
const showDeleteModal = ref(false);
const editingUser = ref<any>(null);
const userToDelete = ref<any>(null);

// User form
const userForm = ref({
  id: '',
  name: '',
  email: '',
  role: 'customer',
  status: 'active',
  password: '',
  avatar: '/avatar.svg',
  lastLogin: '',
  createdAt: ''
});

// Filtered and sorted users
const filteredUsers = computed(() => {
  let result = [...users.value];
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }
  
  // Apply role filter
  if (roleFilter.value) {
    result = result.filter(user => user.role === roleFilter.value);
  }
  
  // Apply status filter
  if (statusFilter.value) {
    result = result.filter(user => user.status === statusFilter.value);
  }
  
  // Apply sorting
  result.sort((a, b) => {
    const aValue = a[sortColumn.value];
    const bValue = b[sortColumn.value];
    
    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  });
  
  return result;
});

// Pagination computed properties
const paginationStart = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, filteredUsers.value.length);
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

// Methods
const sortBy = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};

const refreshUsers = () => {
  // In a real app, this would fetch fresh data from the API
  console.log('Refreshing users...');
};

const editUser = (user: any) => {
  editingUser.value = user;
  userForm.value = { ...user, password: '' };
  showAddUserModal.value = true;
};

const deleteUser = (user: any) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  if (userToDelete.value) {
    deleteUserById(userToDelete.value.id);
    showDeleteModal.value = false;
    userToDelete.value = null;
  }
};

const toggleUserStatus = (user: any) => {
  toggleStatus(user.id);
};

const saveUser = () => {
  if (editingUser.value) {
    updateUser({
      ...userForm.value,
      id: editingUser.value.id
    });
  } else {
    addUser({
      ...userForm.value,
      id: `user-${Date.now()}`,
      lastLogin: 'Never',
      createdAt: new Date().toLocaleDateString()
    });
  }
  
  showAddUserModal.value = false;
  editingUser.value = null;
  userForm.value = {
    id: '',
    name: '',
    email: '',
    role: 'customer',
    status: 'active',
    password: '',
    avatar: '/avatar.svg',
    lastLogin: '',
    createdAt: ''
  };
};

const exportToCSV = () => {
  // Generate CSV content
  const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Last Login', 'Created At'];
  const csvContent = [
    headers.join(','),
    ...filteredUsers.value.map(user => [
      user.id,
      user.name,
      user.email,
      user.role,
      user.status,
      user.lastLogin,
      user.createdAt
    ].join(','))
  ].join('\n');
  
  // Create a blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'users.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(() => {
  // In a real app, this would fetch data from an API
  console.log('User management component mounted');
});

definePageMeta({
    layout: 'dashboard'
})
</script>