import { useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    password: '',
    status: 'active',
  })

  // Mock users data
  const [users, setUsers] = useState([
    { id: 1, username: 'john_buyer', email: 'john@example.com', role: 'buyer', status: 'active', lastLogin: '2025-01-14' },
    { id: 2, username: 'sales_mike', email: 'mike@company.com', role: 'salesman', status: 'active', lastLogin: '2025-01-14' },
    { id: 3, username: 'designer_priya', email: 'priya@company.com', role: 'designer', status: 'active', lastLogin: '2025-01-13' },
    { id: 4, username: 'admin_raj', email: 'raj@company.com', role: 'admin', status: 'active', lastLogin: '2025-01-14' },
    { id: 5, username: 'buyer_sarah', email: 'sarah@retail.com', role: 'buyer', status: 'inactive', lastLogin: '2025-01-10' },
  ])

  const roles = [
    { value: 'buyer', label: 'Buyer', color: 'bg-blue-100 text-blue-800' },
    { value: 'salesman', label: 'Salesman', color: 'bg-green-100 text-green-800' },
    { value: 'designer', label: 'Designer', color: 'bg-purple-100 text-purple-800' },
    { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-800' },
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingUser) {
      // Update user
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u))
      toast.success('User updated successfully!')
    } else {
      // Create new user
      const newUser = {
        id: users.length + 1,
        ...formData,
        lastLogin: 'Never',
      }
      setUsers([...users, newUser])
      toast.success('User created successfully!')
    }
    
    setShowModal(false)
    resetForm()
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: '',
      status: user.status,
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id))
      toast.success('User deleted successfully!')
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      role: '',
      password: '',
      status: 'active',
    })
    setEditingUser(null)
  }

  const getRoleColor = (role) => {
    return roles.find(r => r.value === role)?.color || 'bg-gray-100 text-gray-800'
  }

  const stats = [
    { label: 'Total Users', value: users.length, color: 'bg-blue-500' },
    { label: 'Buyers', value: users.filter(u => u.role === 'buyer').length, color: 'bg-green-500' },
    { label: 'Salesman', value: users.filter(u => u.role === 'salesman').length, color: 'bg-purple-500' },
    { label: 'Active Today', value: users.filter(u => u.lastLogin === '2025-01-14').length, color: 'bg-orange-500' },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <FaUserCircle className="text-white text-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="input-field pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="input-field w-full md:w-48"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-dark-border">
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Last Login</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                        <FaUserCircle className="text-primary-600 text-xl" />
                      </div>
                      <span className="font-medium">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-dark-border">
              <h2 className="text-2xl font-bold">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username *</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role *</label>
                <select
                  className="input-field"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password {editingUser && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  className="input-field"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  className="input-field"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
                <button
                  type="button"
                  className="btn-secondary flex-1"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
