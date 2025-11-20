import { useState } from 'react'
import { useGetAllLeadsQuery, useUpdateLeadMutation } from '@/features/leads/leadsApiSlice'
import { useSendMessageMutation } from '@/features/whatsapp/whatsappApiSlice'
import toast from 'react-hot-toast'
import { FaPlus, FaEllipsisV, FaWhatsapp, FaEye, FaEdit } from 'react-icons/fa'
import { motion } from 'framer-motion'

const CRMBoard = () => {
  const { data: leads, isLoading } = useGetAllLeadsQuery()
  const [updateLead] = useUpdateLeadMutation()
  const [sendMessage] = useSendMessageMutation()
  const [draggedItem, setDraggedItem] = useState(null)
  const [selectedLead, setSelectedLead] = useState(null)

  const stages = [
    { id: 'new', title: 'New Leads', color: 'bg-blue-500', icon: '📋' },
    { id: 'contacted', title: 'Contacted', color: 'bg-purple-500', icon: '📞' },
    { id: 'qualified', title: 'Qualified', color: 'bg-indigo-500', icon: '💰' },
    { id: 'converted', title: 'Converted', color: 'bg-green-500', icon: '🚚' },
    { id: 'lost', title: 'Lost', color: 'bg-gray-500', icon: '✖️' },
  ]

  const getLeadsByStage = (stage) => {
    return leads?.filter((lead) => (lead.status || 'new') === stage) || []
  }

  const handleDragStart = (e, lead) => {
    setDraggedItem(lead)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, newStage) => {
    e.preventDefault()
    
    if (!draggedItem) return

    try {
      await updateLead({ id: draggedItem.id, status: newStage }).unwrap()
      toast.success(`Lead moved to ${stages.find((s) => s.id === newStage)?.title}`)
      setDraggedItem(null)
    } catch (error) {
      toast.error('Failed to update stage')
    }
  }

  const handleSendWhatsApp = async (lead) => {
    try {
      await sendMessage({
        phoneNumber: lead.phone,
        message: `Hello ${lead.buyer_name}, Thank you for your inquiry about ${lead.product_interest}. We will get back to you shortly!`
      }).unwrap()
      toast.success('WhatsApp message sent!')
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  const getTotalValue = () => {
    return leads?.reduce((sum, lead) => sum + (parseFloat(lead.target_price) || 0), 0).toFixed(2)
  }

  if (isLoading) {
    return <div className="p-6">Loading CRM board...</div>
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">CRM Pipeline</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Drag and drop leads to update their status
            </p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <FaPlus />
            <span>Add New Lead</span>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card bg-blue-50 dark:bg-blue-900/20">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Leads</p>
            <p className="text-2xl font-bold text-blue-600">{leads?.length || 0}</p>
          </div>
          <div className="card bg-green-50 dark:bg-green-900/20">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pipeline Value</p>
            <p className="text-2xl font-bold text-green-600">${getTotalValue()}</p>
          </div>
          <div className="card bg-purple-50 dark:bg-purple-900/20">
            <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
            <p className="text-2xl font-bold text-purple-600">
              {leads?.length ? ((getLeadsByStage('converted').length / leads.length) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="card bg-orange-50 dark:bg-orange-900/20">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Leads</p>
            <p className="text-2xl font-bold text-orange-600">{(leads || []).filter((lead) => lead.status !== 'lost').length}</p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.id)
            const stageValue = stageLeads.reduce((sum, lead) => sum + (parseFloat(lead.target_price) || 0), 0)

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-shrink-0 w-80"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                {/* Stage Header */}
                <div className={`${stage.color} text-white px-4 py-3 rounded-t-lg`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{stage.icon}</span>
                      <span className="font-semibold">{stage.title}</span>
                    </div>
                    <span className="bg-white/20 px-2 py-1 rounded text-sm font-bold">
                      {stageLeads.length}
                    </span>
                  </div>
                  <p className="text-xs text-white/80">Total: ${stageValue.toFixed(2)}</p>
                </div>

                {/* Stage Cards */}
                <div className="bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-b-lg min-h-[600px] max-h-[600px] overflow-y-auto p-3 space-y-3">
                  {stageLeads.length > 0 ? (
                    stageLeads.map((lead) => (
                      <motion.div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead)}
                        whileHover={{ scale: 1.02 }}
                        className="card cursor-move hover:shadow-lg transition-shadow bg-white dark:bg-dark-bg"
                      >
                        {/* Lead Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-sm mb-1">
                              {lead.buyer_name || 'Unnamed Lead'}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {lead.company_name || 'No Company'}
                            </p>
                          </div>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-dark-card rounded">
                            <FaEllipsisV className="text-gray-400" />
                          </button>
                        </div>

                        {/* Lead Details */}
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Product:</span>
                            <span className="font-medium">{lead.product_interest || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                            <span className="font-medium">{lead.quantity || 0} pcs</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Value:</span>
                            <span className="font-bold text-green-600">${lead.target_price || 0}</span>
                          </div>
                        </div>

                        {/* Priority Badge */}
                        <div className="mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lead.priority === 'high' ? 'bg-red-100 text-red-800' :
                            lead.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {lead.priority || 'low'} priority
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="flex-1 text-xs py-2 px-3 bg-primary-100 text-primary-600 hover:bg-primary-200 rounded flex items-center justify-center space-x-1"
                            title="View Details"
                          >
                            <FaEye />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleSendWhatsApp(lead)}
                            className="flex-1 text-xs py-2 px-3 bg-green-100 text-green-600 hover:bg-green-200 rounded flex items-center justify-center space-x-1"
                            title="Send WhatsApp"
                          >
                            <FaWhatsapp />
                            <span>Chat</span>
                          </button>
                        </div>

                        {/* Timestamp */}
                        <p className="text-xs text-gray-500 mt-2">
                          Created: {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">No leads in this stage</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
              <h2 className="text-2xl font-bold">Lead Details</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Buyer Name</label>
                  <p className="font-medium">{selectedLead.buyer_name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Company</label>
                  <p className="font-medium">{selectedLead.company_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                  <p className="font-medium">{selectedLead.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Phone</label>
                  <p className="font-medium">{selectedLead.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Product</label>
                  <p className="font-medium">{selectedLead.product_interest}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Quantity</label>
                  <p className="font-medium">{selectedLead.quantity} pieces</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Target Price</label>
                  <p className="font-medium text-green-600">${selectedLead.target_price}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Stage</label>
                  <p className="font-medium capitalize">{selectedLead.status || 'new'}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Notes</label>
                <p className="font-medium">{selectedLead.notes || 'No notes available'}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="btn-primary flex-1">
                  <FaEdit className="inline mr-2" />
                  Edit Lead
                </button>
                <button
                  onClick={() => handleSendWhatsApp(selectedLead)}
                  className="btn-secondary flex-1"
                >
                  <FaWhatsapp className="inline mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CRMBoard
