import { useState } from 'react'
import { FaCog, FaCheckCircle, FaExclamationTriangle, FaEdit, FaEye } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useUpdateProductionMutation } from '@/features/orders/ordersApiSlice'
import toast from 'react-hot-toast'

const ProductionCard = ({ production, onView, onEdit }) => {
  const [updateProduction] = useUpdateProductionMutation()
  const [isUpdating, setIsUpdating] = useState(false)

  const stages = [
    { id: 'cutting', label: 'Cutting', icon: '✂️' },
    { id: 'stitching', label: 'Stitching', icon: '🧵' },
    { id: 'finishing', label: 'Finishing', icon: '✨' },
    { id: 'packaging', label: 'Packaging', icon: '📦' },
  ]

  const getStatusColor = () => {
    switch (production.status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'delayed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleQuickUpdate = async (field, value) => {
    setIsUpdating(true)
    try {
      await updateProduction({
        orderId: production.order_id,
        [field]: value,
      }).unwrap()
      toast.success('Production updated!')
    } catch (error) {
      toast.error('Failed to update')
    } finally {
      setIsUpdating(false)
    }
  }

  const currentStageIndex = stages.findIndex(s => s.id === production.current_stage) || 0
  const progress = production.progress || ((currentStageIndex + 1) / stages.length) * 100

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <FaCog className="text-blue-600 text-xl animate-spin-slow" />
            <h3 className="font-bold text-lg">Order #{production.order_id}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {production.product_name || 'Production Order'}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {production.status || 'pending'}
        </span>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Quantity</p>
          <p className="font-bold">{production.quantity || 0} pcs</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Produced</p>
          <p className="font-bold text-green-600">{production.quantity_produced || 0} pcs</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Start Date</p>
          <p className="text-sm font-medium">
            {production.start_date ? new Date(production.start_date).toLocaleDateString() : 'Not set'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Target Date</p>
          <p className="text-sm font-medium">
            {production.target_completion ? new Date(production.target_completion).toLocaleDateString() : 'Not set'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
          <span className="text-sm font-bold text-primary-600">{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
          />
        </div>
      </div>

      {/* Production Stages */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-3">Production Stages</p>
        <div className="space-y-2">
          {stages.map((stage, index) => {
            const isCompleted = index < currentStageIndex
            const isCurrent = stage.id === production.current_stage
            const isPending = index > currentStageIndex

            return (
              <div
                key={stage.id}
                className={`flex items-center space-x-3 p-2 rounded-lg transition ${
                  isCurrent ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700' :
                  isCompleted ? 'bg-green-50 dark:bg-green-900/20' :
                  'bg-gray-50 dark:bg-dark-bg'
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isCurrent ? 'bg-blue-500 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {isCompleted ? <FaCheckCircle /> : stage.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    isCurrent ? 'text-blue-700 dark:text-blue-400' : ''
                  }`}>
                    {stage.label}
                  </p>
                </div>
                {isCurrent && (
                  <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded-full animate-pulse">
                    Active
                  </span>
                )}
                {isCompleted && (
                  <FaCheckCircle className="text-green-500" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Designer Info */}
      {production.designer && (
        <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Assigned Designer</p>
          <p className="font-medium text-purple-700 dark:text-purple-400">
            {production.designer_name || `Designer #${production.designer}`}
          </p>
        </div>
      )}

      {/* Issues/Alerts */}
      {production.issues && production.issues.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-2 mb-2">
            <FaExclamationTriangle className="text-red-600" />
            <p className="text-sm font-bold text-red-700 dark:text-red-400">Issues Reported</p>
          </div>
          <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
            {production.issues.map((issue, index) => (
              <li key={index}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Files */}
      <div className="flex gap-2 mb-4">
        {production.design_file && (
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded flex items-center space-x-1">
            <span>📄</span>
            <span>Design</span>
          </span>
        )}
        {production.tech_pack && (
          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded flex items-center space-x-1">
            <span>📋</span>
            <span>Tech Pack</span>
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-dark-border">
        <button
          onClick={() => onView && onView(production)}
          className="flex-1 text-sm py-2 px-3 bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg flex items-center justify-center space-x-2 transition"
        >
          <FaEye />
          <span>View Details</span>
        </button>
        <button
          onClick={() => onEdit && onEdit(production)}
          className="flex-1 text-sm py-2 px-3 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg flex items-center justify-center space-x-2 transition"
          disabled={isUpdating}
        >
          <FaEdit />
          <span>Update</span>
        </button>
      </div>
    </motion.div>
  )
}

export default ProductionCard
