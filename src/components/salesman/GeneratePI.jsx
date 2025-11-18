import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGeneratePIMutation } from '@/features/leads/leadsApiSlice'
import { useGetLeadByIdQuery } from '@/features/leads/leadsApiSlice'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaFileInvoice } from 'react-icons/fa'

const GeneratePI = () => {
  const { leadId } = useParams()
  const navigate = useNavigate()
  const { data: lead } = useGetLeadByIdQuery(leadId, { skip: !leadId })
  const [generatePI, { isLoading }] = useGeneratePIMutation()
  
  const [formData, setFormData] = useState({
    payment_terms: '50% advance, 50% before shipment',
    delivery_terms: 'FOB Mumbai Port',
    delivery_date: '',
    validity_days: '30',
    notes: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!leadId) {
      toast.error('Lead ID is required')
      return
    }
    
    try {
      await generatePI({ leadId, ...formData }).unwrap()
      toast.success('Proforma Invoice generated successfully!')
      navigate('/salesman/leads')
    } catch (error) {
      toast.error('Failed to generate PI')
    }
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/salesman/leads')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <FaArrowLeft />
        <span>Back to Leads</span>
      </button>

      <div className="flex items-center space-x-3 mb-6">
        <FaFileInvoice className="text-3xl text-primary-600" />
        <div>
          <h1 className="text-3xl font-bold">Generate Proforma Invoice</h1>
          {lead && (
            <p className="text-gray-600">
              Lead: {lead.buyer_name} - {lead.product_interest}
            </p>
          )}
        </div>
      </div>

      <div className="card max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Payment Terms *</label>
            <select
              className="input-field"
              value={formData.payment_terms}
              onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
              required
            >
              <option>50% advance, 50% before shipment</option>
              <option>100% advance</option>
              <option>30% advance, 70% on delivery</option>
              <option>Letter of Credit (LC)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Delivery Terms *</label>
            <select
              className="input-field"
              value={formData.delivery_terms}
              onChange={(e) => setFormData({ ...formData, delivery_terms: e.target.value })}
              required
            >
              <option>FOB Mumbai Port</option>
              <option>CIF (Cost, Insurance, Freight)</option>
              <option>EXW (Ex Works)</option>
              <option>DDP (Delivered Duty Paid)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Expected Delivery Date *</label>
              <input
                type="date"
                className="input-field"
                value={formData.delivery_date}
                onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Validity (Days) *</label>
              <input
                type="number"
                className="input-field"
                value={formData.validity_days}
                onChange={(e) => setFormData({ ...formData, validity_days: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Notes</label>
            <textarea
              className="input-field"
              rows="4"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Special instructions, quality standards, packaging requirements..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate PI'}
            </button>
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={() => navigate('/salesman/leads')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GeneratePI
