import { Routes, Route } from 'react-router-dom'
import { FaPalette, FaBox, FaCheckCircle, FaClock } from 'react-icons/fa'
import { useGetDesignerOrdersQuery } from '@/features/orders/ordersApiSlice'
import { Link } from 'react-router-dom'

const DesignerDashboard = () => {
  const { data: orders, isLoading } = useGetDesignerOrdersQuery()

  const stats = [
    { 
      icon: FaBox, 
      label: 'Assigned Orders', 
      value: orders?.length || 0, 
      color: 'bg-blue-500' 
    },
    { 
      icon: FaClock, 
      label: 'In Progress', 
      value: orders?.filter(o => o.status === 'in_progress').length || 0, 
      color: 'bg-yellow-500' 
    },
    { 
      icon: FaCheckCircle, 
      label: 'Completed', 
      value: orders?.filter(o => o.status === 'completed').length || 0, 
      color: 'bg-green-500' 
    },
    { 
      icon: FaPalette, 
      label: 'Total Designs', 
      value: orders?.filter(o => o.design_file).length || 0, 
      color: 'bg-purple-500' 
    },
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Designer Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Projects */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Current Projects</h2>
            <Link to="/designer/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 4).map((order) => {
                const progress = order.progress || 0
                return (
                  <div key={order.id} className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{order.product_name || `Order #${order.id}`}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status || 'pending'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Due: {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'TBD'}
                      </span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No orders assigned yet</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/designer/orders" className="w-full btn-primary text-left block">
              View Assigned Orders
            </Link>
            <Link to="/designer/upload" className="w-full btn-secondary text-left block">
              Upload Design
            </Link>
            <Link to="/designer/timeline" className="w-full btn-secondary text-left block">
              Production Timeline
            </Link>
            <button className="w-full btn-secondary text-left">
              Design Gallery
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
            <div>
              <p className="text-sm">Design uploaded for Order #234</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
            <div>
              <p className="text-sm">New order assigned: T-Shirt Design</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
            <div>
              <p className="text-sm">Tech pack approved for Order #198</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Design Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="card text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">24</div>
          <p className="text-gray-600 dark:text-gray-400">Designs This Month</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
          <p className="text-gray-600 dark:text-gray-400">Approval Rate</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">3.2</div>
          <p className="text-gray-600 dark:text-gray-400">Avg Days/Design</p>
        </div>
      </div>
    </div>
  )
}

export default DesignerDashboard
