 import { useState } from 'react'
import { FaWhatsapp, FaPhone, FaEnvelope, FaEye, FaEdit, FaTrash, FaDollarSign } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useUpdateLeadMutation, useDeleteLeadMutation } from '@/features/leads/leadsApiSlice'
import { useSendMessageMutation } from '@/features/whatsapp/whatsappApiSlice'
import toast from 'react-hot-toast'

const LeadCard = ({ lead, onView, onEdit }) => {
  const [updateLead] = useUpdateLeadMutation()
  const [deleteLead] = useDeleteLeadMutation()
  const [sendMessage] = useSendMessageMutation()
  const [showMenu, setShowMenu] = useState(false)

  const handleWhatsApp = async (e) => {
    e.stopPropagation()
    try {
      await sendMessage({
        phoneNumber: lead.phone,
        message: `Hello ${lead.buyer_name}, Thank you for your inquiry about ${lead.product_interest}. We will get back to you shortly with a detailed quote.`
      }).unwrap()
      toast.success('WhatsApp message sent!')
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(lead.id).unwrap()
        toast.success('Lead deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete lead')
      }
    }
    setShowMenu(false)
  }

  const getPriorityColor = () => {
    switch (lead.priority) {
      case 'high':
        return 'border-l-4 border-red-500'
      case 'medium':
        return 'border-l-4 border-yellow-500'
      case 'low':
        return 'border-l-4 border-green-500'
      default:
        return 'border-l-4 border-gray-300'
    }
  }

  const getStatusColor = () => {
    switch (lead.status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'contacted':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'qualified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'converted':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400'
      case 'lost':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`card hover:shadow-lg transition-all cursor-pointer ${getPriorityColor()}`}
      onClick={() => onView && onView(lead)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg truncate mb-1">
            {lead.buyer_name || 'Unnamed Lead'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {lead.company_name || 'No Company'}
          </p>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg transition"
          >
            <FaEdit className="text-gray-400" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-dark-card shadow-lg rounded-lg border border-gray-200 dark:border-dark-border z-10 min-w-[150px]">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(lead)
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-bg text-sm flex items-center space-x-2"
              >
                <FaEdit />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-bg text-sm flex items-center space-x-2 text-red-600"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="mb-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {lead.product_interest || 'Product inquiry'}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Qty: {lead.quantity || 0} pcs</span>
          <span className="flex items-center space-x-1 font-bold text-green-600">
            <FaDollarSign />
            <span>{lead.target_price || 0}</span>
          </span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-3">
        {lead.email && (
          <div className="flex items-center space-x-2 text-sm">
            <FaEnvelope className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-400 truncate">{lead.email}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center space-x-2 text-sm">
            <FaPhone className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">{lead.phone}</span>
          </div>
        )}
      </div>

      {/* Status & Priority */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {lead.status || 'new'}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
          lead.priority === 'high' ? 'bg-red-100 text-red-800' :
          lead.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {lead.priority || 'low'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-dark-border">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onView(lead)
          }}
          className="flex-1 text-xs py-2 px-3 bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg flex items-center justify-center space-x-1 transition"
        >
          <FaEye />
          <span>View</span>
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex-1 text-xs py-2 px-3 bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-lg flex items-center justify-center space-x-1 transition"
        >
          <FaWhatsapp />
          <span>Chat</span>
        </button>
      </div>

      {/* Timestamp */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-border">
        <p className="text-xs text-gray-500">
          Created: {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'Unknown'}
        </p>
      </div>
    </motion.div>
  )
}

export default LeadCard
