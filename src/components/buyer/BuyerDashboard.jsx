 import { FaBox, FaFileAlt, FaTruck, FaClock, FaCheckCircle, FaDollarSign } from 'react-icons/fa'
import { useGetMyOrdersQuery } from '@/features/orders/ordersApiSlice'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const BuyerDashboard = () => {
  const { data: orders, isLoading } = useGetMyOrdersQuery()

  const stats = [
    { 
      icon: FaBox, 
      label: 'Total Orders', 
      value: orders?.length || 0,
      change: '+3 this month',
      color: 'bg-blue-500' 
    },
    { 
      icon: FaClock, 
      label: 'In Production', 
      value: orders?.filter(o => o.status === 'production').length || 0,
      change: 'On schedule',
      color: 'bg-yellow-500' 
    },
    { 
      icon: FaTruck, 
      label: 'Shipped', 
      value: orders?.filter(o => o.status === 'shipped').length || 0,
      change: 'In transit',
      color: 'bg-green-500' 
    },
    { 
      icon: FaDollarSign, 
      label: 'Total Spent', 
      value: '$45,280',
      change: '+12% vs last month',
      color: 'bg-purple-500' 
    },
  ]

  const recentActivity = [
    { type: 'order', message: 'Order #1234 shipped', time: '2 hours ago', status: 'success' },
    { type: 'production', message: 'Order #1230 in production', time: '5 hours ago', status: 'info' },
    { type: 'document', message: 'Invoice available for Order #1228', time: '1 day ago', status: 'info' },
    { type: 'delivery', message: 'Order #1225 delivered', time: '2 days ago', status: 'success' },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your orders today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="text-white text-2xl" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link to="/buyer/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All →
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading orders...</p>
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-dark-border text-left">
                    <th className="py-3 px-4 text-sm font-semibold">Order ID</th>
                    <th className="py-3 px-4 text-sm font-semibold">Product</th>
                    <th className="py-3 px-4 text-sm font-semibold">Quantity</th>
                    <th className="py-3 px-4 text-sm font-semibold">Status</th>
                    <th className="py-3 px-4 text-sm font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg transition">
                      <td className="py-3 px-4">
                        <Link to={`/buyer/orders/${order.id}`} className="font-medium text-primary-600 hover:text-primary-700">
                          #{order.id}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{order.product_name || 'N/A'}</td>
                      <td className="py-3 px-4">{order.quantity || 0} pcs</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'production' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No orders yet</p>
              <button className="btn-primary">Place Your First Order</button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/buyer/orders" className="btn-primary w-full text-center block">
                View All Orders
              </Link>
              <Link to="/buyer/documents" className="btn-secondary w-full text-center block">
                My Documents
              </Link>
              <Link to="/buyer/shipments" className="btn-secondary w-full text-center block">
                Track Shipment
              </Link>
              <button className="btn-secondary w-full">
                Request Quote
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Card */}
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Our support team is here to assist you
            </p>
            <button className="btn-primary w-full text-sm">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-6">Order Processing Timeline</h2>
        <div className="flex items-center justify-between">
          {[
            { label: 'Order Placed', icon: FaCheckCircle, completed: true },
            { label: 'Production', icon: FaClock, completed: true },
            { label: 'Quality Check', icon: FaCheckCircle, completed: true },
            { label: 'Shipped', icon: FaTruck, completed: false },
            { label: 'Delivered', icon: FaCheckCircle, completed: false },
          ].map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}>
                  <Icon />
                </div>
                <p className="text-xs text-center font-medium">{step.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BuyerDashboard
