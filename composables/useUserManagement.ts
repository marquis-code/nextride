import { ref } from 'vue';

export function useUserManagement() {
  // Mock user data
  const users = ref([
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-03-14 09:45 AM',
      createdAt: '2024-10-15',
      avatar: '/avatar.svg'
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'driver',
      status: 'active',
      lastLogin: '2025-03-13 02:30 PM',
      createdAt: '2024-11-05',
      avatar: '/avatar.svg'
    },
    {
      id: 'user-3',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      role: 'customer',
      status: 'active',
      lastLogin: '2025-03-12 10:15 AM',
      createdAt: '2024-12-20',
      avatar: '/avatar.svg'
    },
    {
      id: 'user-4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      role: 'support',
      status: 'inactive',
      lastLogin: '2025-02-28 11:20 AM',
      createdAt: '2025-01-10',
      avatar: '/avatar.svg'
    },
    {
      id: 'user-5',
      name: 'Michael Wilson',
      email: 'michael.wilson@example.com',
      role: 'driver',
      status: 'active',
      lastLogin: '2025-03-14 08:05 AM',
      createdAt: '2025-01-15',
      avatar: '/avatar.svg'
    },
    {
      id: 'user-6',
      name: 'Sarah Brown',
      email: 'sarah.brown@example.com',
      role: 'customer',
      status: 'pending',
      lastLogin: 'Never',
      createdAt: '2025-03-10',
      avatar: '/avatar.svg'
    },
    {
      id: 'user-7',
      name: 'David Miller',
      email: 'david.miller@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-03-13 04:45 PM',
      createdAt: '2024-09-22',
      avatar: '/avatar.svg'
    },
    {
      id: 'user-8',
      name: 'Jennifer Taylor',
      email: 'jennifer.taylor@example.com',
      role: 'support',
      status: 'active',
      lastLogin: '2025-03-14 01:30 PM',
      createdAt: '2024-11-30',
      avatar: '/avatar.svg'
    },
    {
      id: 'user-9',
      name: 'Thomas Anderson',
      email: 'thomas.anderson@example.com',
      role: 'driver',
      status: 'inactive',
      lastLogin: '2025-02-20 09:15 AM',
      createdAt: '2024-10-05',
      avatar: '/avatar.svg'
    },
    {
      id: 'user-10',
      name: 'Lisa Martinez',
      email: 'lisa.martinez@example.com',
      role: 'customer',
      status: 'active',
      lastLogin: '2025-03-11 03:20 PM',
      createdAt: '2025-01-25',
      avatar: '/avatar.svg'
    },
    {
      id: 'user-11',
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      role: 'driver',
      status: 'active',
      lastLogin: '2025-03-13 11:45 AM',
      createdAt: '2024-12-10',
      avatar: '/avatar.svg'
    },
    {
      id: 'user-12',
      name: 'Patricia Moore',
      email: 'patricia.moore@example.com',
      role: 'customer',
      status: 'pending',
      lastLogin: 'Never',
      createdAt: '2025-03-05',
      avatar: '/avatar.svg'
    }
  ]);

  // Add a new user
  const addUser = (user: any) => {
    users.value.push(user);
  };

  // Update an existing user
  const updateUser = (updatedUser: any) => {
    const index = users.value.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      users.value[index] = updatedUser;
    }
  };

  // Delete a user by ID
  const deleteUserById = (userId: string) => {
    users.value = users.value.filter(user => user.id !== userId);
  };

  // Toggle user status (active/inactive)
  const toggleStatus = (userId: string) => {
    const index = users.value.findIndex(user => user.id === userId);
    if (index !== -1) {
      const user = users.value[index];
      user.status = user.status === 'active' ? 'inactive' : 'active';
      users.value[index] = { ...user };
    }
  };

  return {
    users,
    addUser,
    updateUser,
    deleteUserById,
    toggleStatus
  };
}