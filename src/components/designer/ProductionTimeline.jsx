import { useParams, useNavigate } from 'react-router-dom'
import { useGetOrderByIdQuery } from '@/features/orders/ordersApiSlice'
import { FaArrowLeft, FaCheckCircle, FaClock, FaCircle } from 'react-icons/fa'

const ProductionTimeline = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { data: order, isLoading } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  })

  const timelineStages = [
    {
      id: 1,
      stage: 'Order Received',
      description: 'Order assigned to designer',
      date: order?.created_at,
      status: 'completed',
    },
    {
      id: 2,
      stage: 'Design Creation',
      description: 'Creating design mockups and sketches',
      date: order?.design_start_date,
      status: order?.design_file ? 'completed' : 'in_progress',
    },
    {
      id: 3,
      stage: 'Design Upload',
      description: 'Design files and tech pack uploaded',
      date: order?.design_upload_date,
      status: order?.design_file ? 'completed' : 'pending',
    },
    {
      id: 4,
      stage: 'Client Approval',
      description: 'Waiting for buyer approval',
      date: order?.approval_date,
      status: order?.approved ? 'completed' : 'pending',
    },
    {
      id: 5,
      stage: 'Sample Production',
      description: 'Creating sample pieces',
      date: order?.sample_date,
      status: order?.sample_ready ? 'completed' : 'pending',
    },
    {
      id: 6,
      stage: 'Bulk Production',
      description: 'Full order manufacturing',
      date: order?.production_start_date,
      status: order?.status === 'production' ? 'in_progress' : 'pending',
    },
    {
      id: 7,
      stage: 'Quality Check',
      description: 'Final quality inspection',
      date: order?.qc_date,
      status: order?.qc_approved ? 'completed' : 'pending',
    },
    {
      id: 8,
      stage: 'Ready for Shipment',
      description: 'Order completed and ready',
      date: order?.completion_date,
      status: order?.status === 'completed' ? 'completed' : 'pending',
    },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500 text-2xl" />
      case 'in_progress':
        return <FaClock className="text-yellow-500 text-2xl animate-pulse" />
      default:
        return <FaCircle className="text-gray-300 text-2xl" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500'
      case 'in_progress':
        return 'border-yellow-500'
      default:
        return 'border-gray-300'
    }
  }

  if (isLoading) {
    return <div className="p-6">Loading timeline...</div>
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/designer/orders')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6"
      >
        <FaArrowLeft />
        <span>Back to Orders</span>
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Production Timeline</h1>
        {order && (
          <p className="text-gray-600 dark:text-gray-400">
            Order #{order.id} - {order.product_name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2 card">
          <div className="relative">
            {timelineStages.map((stage, index) => (
              <div key={stage.id} className="flex mb-8 last:mb-0">
                {/* Icon */}
                <div className="flex flex-col items-center mr-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 ${getStatusColor(stage.status)} bg-white dark:bg-dark-card`}>
                    {getStatusIcon(stage.status)}
                  </div>
                  {index < timelineStages.length - 1 && (
                    <div className={`w-1 h-16 ${stage.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{stage.stage}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {stage.description}
                      </p>
                      {stage.date && (
                        <p className="text-xs text-gray-500">
                          {new Date(stage.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      stage.status === 'completed' ? 'bg-green-100 text-green-800' :
                      stage.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {stage.status === 'completed' ? 'Done' :
                       stage.status === 'in_progress' ? 'In Progress' :
                       'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Overall Progress</h3>
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-primary-600 mb-2">
                {order?.progress || 0}%
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${order?.progress || 0}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="font-medium capitalize">{order?.status || 'pending'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Started:</span>
                <span className="font-medium">
                  {order?.created_at 
                    ? new Date(order.created_at).toLocaleDateString() 
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Expected Delivery:</span>
                <span className="font-medium">
                  {order?.delivery_date 
                    ? new Date(order.delivery_date).toLocaleDateString() 
                    : 'TBD'}
                </span>
              </div>
            </div>
          </div>

          {/* Stage Summary */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Stage Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-500" />
                  <span className="text-sm">Completed</span>
                </div>
                <span className="font-bold text-green-600">
                  {timelineStages.filter(s => s.status === 'completed').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaClock className="text-yellow-500" />
                  <span className="text-sm">In Progress</span>
                </div>
                <span className="font-bold text-yellow-600">
                  {timelineStages.filter(s => s.status === 'in_progress').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaCircle className="text-gray-300" />
                  <span className="text-sm">Pending</span>
                </div>
                <span className="font-bold text-gray-600">
                  {timelineStages.filter(s => s.status === 'pending').length}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card bg-blue-50 dark:bg-blue-900/20">
            <h3 className="text-lg font-bold mb-3">Notes</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {order?.notes || 'No special notes for this order.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductionTimeline
