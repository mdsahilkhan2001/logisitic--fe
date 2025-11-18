 import { FaUsers, FaDollarSign, FaBox, FaTruck, FaChartLine, FaClipboardCheck } from 'react-icons/fa'
import { useGetAllOrdersQuery } from '@/features/orders/ordersApiSlice'
import { useGetAllLeadsQuery } from '@/features/leads/leadsApiSlice'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const AdminDashboard = () => {
  const { data: orders } = useGetAllOrdersQuery()
  const { data: leads } = useGetAllLeadsQuery()

  const stats = [
    { 
      icon: FaBox, 
      label: 'Total Orders', 
      value: orders?.length || 0,
      change: '+12%',
      color: 'bg-blue-500' 
    },
    { 
      icon: FaDollarSign, 
      label: 'Revenue', 
      value: '$125,400',
      change: '+23%',
      color: 'bg-green-500' 
    },
    { 
      icon: FaUsers, 
      label: 'Active Users', 
      value: 48,
      change: '+5%',
      color: 'bg-purple-500' 
    },
    { 
      icon: FaTruck, 
      label: 'Shipments', 
      value: orders?.filter(o => o.status === 'shipped').length || 0,
      change: '+8%',
      color: 'bg-orange-500' 
    },
  ]

  const recentActivity = [
    { type: 'order', message: 'New order #1234 placed by John Doe', time: '2 mins ago', color: 'bg-blue-500' },
    { type: 'lead', message: 'Lead converted to order - ABC Corp', time: '15 mins ago', color: 'bg-green-500' },
    { type: 'shipment', message: 'Order #1220 shipped to USA', time: '1 hour ago', color: 'bg-orange-500' },
    { type: 'user', message: 'New designer registered - Priya S.', time: '2 hours ago', color: 'bg-purple-500' },
    { type: 'qc', message: 'QC completed for Order #1215', time: '3 hours ago', color: 'bg-yellow-500' },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/crm" className="btn-primary">
            View CRM
          </Link>
        </div>
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
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <p className="text-green-600 text-sm mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="text-white text-2xl" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Sales Overview</h2>
            <select className="input-field w-32">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div className="text-center">
              <FaChartLine className="text-6xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Chart: Install Chart.js or Recharts</p>
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Order Status</h2>
          <div className="space-y-4">
            {[
              { status: 'Pending', count: 12, color: 'bg-yellow-500', percentage: 15 },
              { status: 'In Production', count: 28, color: 'bg-blue-500', percentage: 35 },
              { status: 'Quality Check', count: 18, color: 'bg-purple-500', percentage: 22 },
              { status: 'Shipped', count: 22, color: 'bg-green-500', percentage: 28 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{item.status}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.count} orders</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all`} 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Link to="/admin/analytics" className="text-primary-600 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                <div className={`${activity.color} w-2 h-2 rounded-full mt-2`}></div>
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/crm" className="btn-primary w-full text-center block">
              <FaClipboardCheck className="inline mr-2" />
              CRM Board
            </Link>
            <Link to="/admin/users" className="btn-secondary w-full text-center block">
              <FaUsers className="inline mr-2" />
              Manage Users
            </Link>
            <Link to="/admin/analytics" className="btn-secondary w-full text-center block">
              <FaChartLine className="inline mr-2" />
              View Analytics
            </Link>
            <button className="btn-secondary w-full">
              Generate Report
            </button>
          </div>

          {/* Today's Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
            <h3 className="font-semibold mb-4">Today's Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">New Orders</span>
                <span className="font-bold">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">New Leads</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Orders Shipped</span>
                <span className="font-bold">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Revenue Today</span>
                <span className="font-bold text-green-600">$8,450</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-6">Top Performing Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-dark-border">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Orders</th>
                <th className="text-left py-3 px-4">Revenue</th>
                <th className="text-left py-3 px-4">Growth</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Cotton T-Shirts', orders: 145, revenue: '$8,700', growth: '+15%', status: 'High Demand' },
                { name: 'Formal Shirts', orders: 98, revenue: '$6,860', growth: '+8%', status: 'Steady' },
                { name: 'Summer Dresses', orders: 87, revenue: '$9,570', growth: '+22%', status: 'Trending' },
                { name: 'Denim Jeans', orders: 76, revenue: '$7,220', growth: '+5%', status: 'Steady' },
              ].map((product, index) => (
                <tr key={index} className="border-b dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg">
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4">{product.orders}</td>
                  <td className="py-3 px-4 font-bold">{product.revenue}</td>
                  <td className="py-3 px-4 text-green-600">{product.growth}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'Trending' ? 'bg-purple-100 text-purple-800' :
                      product.status === 'High Demand' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
