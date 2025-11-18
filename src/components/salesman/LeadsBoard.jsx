import { useState } from 'react'
import { 
  useGetAllLeadsQuery, 
  useCreateLeadMutation, 
  useUpdateLeadMutation,
  useDeleteLeadMutation 
} from '@/features/leads/leadsApiSlice'
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const LeadsBoard = () => {
  const { data: leads, isLoading } = useGetAllLeadsQuery()
  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation()
  const [updateLead] = useUpdateLeadMutation()
  const [deleteLead] = useDeleteLeadMutation()
  
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [formData, setFormData] = useState({
    buyer_name: '',
    company_name: '',
    email: '',
    phone: '',
    product_interest: '',
    quantity: '',
    target_price: '',
    notes: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingLead) {
        await updateLead({ id: editingLead.id, ...formData }).unwrap()
        toast.success('Lead updated successfully!')
      } else {
        await createLead(formData).unwrap()
        toast.success('Lead created successfully!')
      }
      
      setShowModal(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to save lead')
    }
  }

  const handleEdit = (lead) => {
    setEditingLead(lead)
    setFormData({
      buyer_name: lead.buyer_name || '',
      company_name: lead.company_name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      product_interest: lead.product_interest || '',
      quantity: lead.quantity || '',
      target_price: lead.target_price || '',
      notes: lead.notes || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(id).unwrap()
        toast.success('Lead deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete lead')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      buyer_name: '',
      company_name: '',
      email: '',
      phone: '',
      product_interest: '',
      quantity: '',
      target_price: '',
      notes: '',
    })
    setEditingLead(null)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Leads Management</h1>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="card">
        {isLoading ? (
          <p className="text-center py-8">Loading leads...</p>
        ) : leads && leads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-dark-border">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Buyer Name</th>
                  <th className="text-left py-3 px-4">Company</th>
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">Quantity</th>
                  <th className="text-left py-3 px-4">Target Price</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg">
                    <td className="py-3 px-4">#{lead.id}</td>
                    <td className="py-3 px-4 font-medium">{lead.buyer_name || 'N/A'}</td>
                    <td className="py-3 px-4">{lead.company_name || 'N/A'}</td>
                    <td className="py-3 px-4">{lead.product_interest || 'N/A'}</td>
                    <td className="py-3 px-4">{lead.quantity || 0} pcs</td>
                    <td className="py-3 px-4">${lead.target_price || 0}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                        lead.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'lost' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status || 'new'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(lead)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <Link
                          to={`/salesman/costing/${lead.id}`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                          title="Create Costing"
                        >
                          <FaEye />
                        </Link>
                        <button
                          onClick={() => handleDelete(lead.id)}
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No leads found</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              Create Your First Lead
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-dark-border">
              <h2 className="text-2xl font-bold">
                {editingLead ? 'Edit Lead' : 'Add New Lead'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space
