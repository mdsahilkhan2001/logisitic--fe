import { useState } from 'react'
import {
  useGetAllLeadsQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
} from '@/features/leads/leadsApiSlice'
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const defaultFormState = {
  buyer_name: '',
  company_name: '',
  email: '',
  phone: '',
  product_interest: '',
  quantity: '',
  target_price: '',
  target_currency: 'USD',
  status: 'new',
  priority: 'medium',
  notes: '',
}

const LeadsBoard = () => {
  const { data: leads, isLoading } = useGetAllLeadsQuery()
  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation()
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation()
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation()

  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [formData, setFormData] = useState(defaultFormState)

  const handleChange = (field) => (event) => {
    const { value } = event.target
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const closeModal = () => {
    setShowModal(false)
    setFormData(defaultFormState)
    setEditingLead(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      ...formData,
      quantity: formData.quantity ? Number(formData.quantity) : 0,
      target_price: formData.target_price !== '' ? Number(formData.target_price) : null,
    }

    try {
      if (editingLead) {
        await updateLead({ id: editingLead.id, ...payload }).unwrap()
        toast.success('Lead updated successfully!')
      } else {
        await createLead(payload).unwrap()
        toast.success('Lead created successfully!')
      }
      closeModal()
    } catch (error) {
      toast.error(error?.data?.detail || 'Failed to save lead')
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
      quantity: lead.quantity !== undefined && lead.quantity !== null ? String(lead.quantity) : '',
      target_price:
        lead.target_price !== undefined && lead.target_price !== null ? String(lead.target_price) : '',
      target_currency: lead.target_currency || 'USD',
      status: lead.status || 'new',
      priority: lead.priority || 'medium',
      notes: lead.notes || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return

    try {
      await deleteLead(id).unwrap()
      toast.success('Lead deleted successfully!')
    } catch (error) {
      toast.error(error?.data?.detail || 'Failed to delete lead')
    }
  }

  const saving = isCreating || isUpdating

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Leads Management</h1>
        <button
          onClick={() => {
            setFormData(defaultFormState)
            setEditingLead(null)
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
                  <th className="text-left py-3 px-4">Priority</th>
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
                    <td className="py-3 px-4">
                      {lead.target_price ? `${lead.target_currency || 'USD'} ${lead.target_price}` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          lead.status === 'converted'
                            ? 'bg-green-100 text-green-800'
                            : lead.status === 'qualified'
                            ? 'bg-blue-100 text-blue-800'
                            : lead.status === 'lost'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {lead.status || 'new'}
                      </span>
                    </td>
                    <td className="py-3 px-4 capitalize">{lead.priority || 'medium'}</td>
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
                          className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                          title="Delete"
                          disabled={isDeleting}
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
              onClick={() => {
                setFormData(defaultFormState)
                setEditingLead(null)
                setShowModal(true)
              }}
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
          <div className="bg-white dark:bg-dark-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
              <h2 className="text-2xl font-bold">{editingLead ? 'Edit Lead' : 'Add New Lead'}</h2>
              <button onClick={closeModal} className="text-sm text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Buyer Name *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.buyer_name}
                    onChange={handleChange('buyer_name')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input type="text" className="input" value={formData.company_name} onChange={handleChange('company_name')} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="input" value={formData.email} onChange={handleChange('email')} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" className="input" value={formData.phone} onChange={handleChange('phone')} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Product Interest</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.product_interest}
                    onChange={handleChange('product_interest')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    className="input"
                    value={formData.quantity}
                    onChange={handleChange('quantity')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input"
                    value={formData.target_price}
                    onChange={handleChange('target_price')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.target_currency}
                    onChange={handleChange('target_currency')}
                    maxLength={8}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select className="input" value={formData.status} onChange={handleChange('status')}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select className="input" value={formData.priority} onChange={handleChange('priority')}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  className="input h-28"
                  value={formData.notes}
                  onChange={handleChange('notes')}
                  placeholder="Additional details, requirements, or follow-up plan"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 border-t border-gray-200 dark:border-dark-border pt-4">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingLead ? 'Update Lead' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeadsBoard
