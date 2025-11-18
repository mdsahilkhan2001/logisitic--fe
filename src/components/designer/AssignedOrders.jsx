import { useState } from 'react'
import { useGetDesignerOrdersQuery } from '@/features/orders/ordersApiSlice'
import { FaEye, FaUpload, FaCalendar, FaFileAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const AssignedOrders = () => {
  const { data: orders, isLoading } = useGetDesignerOrdersQuery()
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredOrders = orders?.filter(order => {
    if (filterStatus === 'all') return true
    return order.status === filterStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'review':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Assigned Orders</h1>
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Under Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : filteredOrders && filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {order.product_name || `Order #${order.id}`}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Order ID: #{order.id}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status || 'pending'}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Buyer:</span>
                  <span className="font-medium">{order.buyer_name || 'N/A'}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                  <span className="font-medium">{order.quantity || 0} pieces</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Delivery Date:</span>
                  <span className="font-medium flex items-center space-x-1">
                    <FaCalendar className="text-primary-600" />
                    <span>
                      {order.delivery_date 
                        ? new Date(order.delivery_date).toLocaleDateString() 
                        : 'TBD'}
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                  <span className={`font-bold uppercase ${getPriorityColor(order.priority)}`}>
                    {order.priority || 'medium'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium">{order.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${order.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Design Status */}
              <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <FaFileAlt className={order.design_file ? 'text-green-500' : 'text-gray-400'} />
                  <span className={order.design_file ? 'text-green-600 font-medium' : 'text-gray-500'}>
                    {order.design_file ? 'Design Uploaded' : 'Design Pending'}
                  </span>
                </div>
                {order.tech_pack && (
                  <div className="flex items-center space-x-2 text-sm mt-2">
                    <FaFileAlt className="text-blue-500" />
                    <span className="text-blue-600 font-medium">Tech Pack Available</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link
                  to={`/designer/upload/${order.id}`}
                  className="btn-primary flex-1 text-center flex items-center justify-center space-x-2"
                >
                  <FaUpload />
                  <span>Upload Design</span>
                </Link>
                <Link
                  to={`/designer/timeline/${order.id}`}
                  className="btn-secondary flex items-center justify-center px-4"
                  title="View Timeline"
                >
                  <FaEye />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            {filterStatus === 'all' 
              ? 'No orders assigned yet' 
              : `No ${filterStatus} orders found`}
          </p>
        </div>
      )}
    </div>
  )
}

export default AssignedOrders
