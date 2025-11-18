import { useState } from 'react'
import { useGetMyOrdersQuery } from '@/features/orders/ordersApiSlice'
import { FaSearch, FaFilter, FaEye, FaDownload, FaShoppingCart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const MyOrders = () => {
  const { data: orders, isLoading } = useGetMyOrdersQuery()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'production', label: 'In Production' },
    { value: 'qc', label: 'Quality Check' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
  ]

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchQuery) ||
      order.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'production':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'qc':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage all your orders
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <FaShoppingCart />
          <span>New Order</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or product..."
              className="input-field pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            <select
              className="input-field w-full md:w-48"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : filteredOrders && filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold">Order #{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status || 'pending'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        {order.product_name || 'Product Name'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Placed on {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Quantity</p>
                      <p className="font-semibold">{order.quantity || 0} pieces</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Amount</p>
                      <p className="font-semibold text-green-600">${order.total_amount || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Delivery Date</p>
                      <p className="font-semibold">
                        {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'TBD'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Progress</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all" 
                            style={{ width: `${order.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{order.progress || 0}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2">
                  <Link
                    to={`/buyer/orders/${order.id}`}
                    className="flex-1 lg:flex-none btn-primary text-sm py-2 px-4 text-center flex items-center justify-center space-x-2"
                  >
                    <FaEye />
                    <span>View Details</span>
                  </Link>
                  <button className="flex-1 lg:flex-none btn-secondary text-sm py-2 px-4 flex items-center justify-center space-x-2">
                    <FaDownload />
                    <span>Invoice</span>
                  </button>
                </div>
              </div>

              {/* Timeline (for active orders) */}
              {(order.status === 'production' || order.status === 'qc' || order.status === 'shipped') && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
                  <div className="flex items-center justify-between text-xs">
                    {['Order Placed', 'Production', 'QC', 'Shipped', 'Delivered'].map((step, index) => {
                      const statusIndex = ['pending', 'production', 'qc', 'shipped', 'delivered'].indexOf(order.status)
                      const isCompleted = index <= statusIndex
                      
                      return (
                        <div key={index} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                            isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                          }`}>
                            {isCompleted ? '✓' : index + 1}
                          </div>
                          <span className={isCompleted ? 'font-medium' : 'text-gray-400'}>{step}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No orders found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || filterStatus !== 'all' 
              ? 'Try adjusting your filters' 
              : "You haven't placed any orders yet"}
          </p>
          {!searchQuery && filterStatus === 'all' && (
            <button className="btn-primary">
              Place Your First Order
            </button>
          )}
        </div>
      )}

      {/* Summary */}
      {filteredOrders && filteredOrders.length > 0 && (
        <div className="card mt-6">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{filteredOrders.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {filteredOrders.filter(o => o.status === 'production').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Production</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {filteredOrders.filter(o => o.status === 'delivered').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                ${filteredOrders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyOrders
