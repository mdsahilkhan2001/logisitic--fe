import { useState } from 'react'
import { useGeneratePIMutation } from '@/features/leads/leadsApiSlice'
import toast from 'react-hot-toast'
import { FaTimes, FaFileInvoice, FaCalendar } from 'react-icons/fa'
import { motion } from 'framer-motion'

const PIForm = ({ lead, costing, onClose, onSuccess }) => {
  const [generatePI, { isLoading }] = useGeneratePIMutation()
  
  const [formData, setFormData] = useState({
    pi_number: `PI-${Date.now()}`,
    issue_date: new Date().toISOString().split('T')[0],
    valid_until: '',
    payment_terms: '50% advance, 50% before shipment',
    delivery_terms: 'FOB Mumbai Port',
    delivery_date: '',
    incoterms: 'FOB',
    port_of_loading: 'Mumbai, India',
    port_of_discharge: '',
    currency: 'USD',
    bank_details: '',
    special_terms: '',
    notes: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await generatePI({
        leadId: lead.id,
        ...formData,
        quoted_price: costing?.quoted_price || lead.target_price,
        quantity: lead.quantity,
        product: lead.product_interest,
      }).unwrap()
      
      toast.success('Proforma Invoice generated successfully!')
      onSuccess && onSuccess()
      onClose()
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to generate PI')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-dark-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 dark:bg-indigo-900/20 p-3 rounded-lg">
              <FaFileInvoice className="text-2xl text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Generate Proforma Invoice</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lead?.buyer_name} - {lead?.product_interest}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg transition"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* PI Details */}
                <div className="card">
                  <h3 className="font-bold text-lg mb-4">PI Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">PI Number *</label>
                      <input
                        type="text"
                        className="input-field"
                        value={formData.pi_number}
                        onChange={(e) => setFormData({ ...formData, pi_number: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Issue Date *</label>
                      <input
                        type="date"
                        className="input-field"
                        value={formData.issue_date}
                        onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Valid Until *</label>
                      <input
                        type="date"
                        className="input-field"
                        value={formData.valid_until}
                        onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Currency</label>
                      <select
                        className="input-field"
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Terms */}
                <div className="card">
                  <h3 className="font-bold text-lg mb-4">Payment & Delivery Terms</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Payment Terms *</label>
                      <select
                        className="input-field"
                        value={formData.payment_terms}
                        onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                        required
                      >
                        <option>50% advance, 50% before shipment</option>
                        <option>100% advance payment</option>
                        <option>30% advance, 70% on delivery</option>
                        <option>Letter of Credit (LC)</option>
                        <option>30 days credit terms</option>
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
                        <option>CFR (Cost and Freight)</option>
                      </select>
                    </div>

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
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="card">
                  <h3 className="font-bold text-lg mb-4">Shipping Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Incoterms</label>
                      <select
                        className="input-field"
                        value={formData.incoterms}
                        onChange={(e) => setFormData({ ...formData, incoterms: e.target.value })}
                      >
                        <option value="FOB">FOB</option>
                        <option value="CIF">CIF</option>
                        <option value="EXW">EXW</option>
                        <option value="DDP">DDP</option>
                        <option value="CFR">CFR</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Port of Loading</label>
                      <input
                        type="text"
                        className="input-field"
                        value={formData.port_of_loading}
                        onChange={(e) => setFormData({ ...formData, port_of_loading: e.target.value })}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Port of Discharge</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Destination port"
                        value={formData.port_of_discharge}
                        onChange={(e) => setFormData({ ...formData, port_of_discharge: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div>
                  <label className="block text-sm font-medium mb-2">Bank Details</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    placeholder="Bank name, account number, SWIFT code..."
                    value={formData.bank_details}
                    onChange={(e) => setFormData({ ...formData, bank_details: e.target.value })}
                  />
                </div>

                {/* Special Terms */}
                <div>
                  <label className="block text-sm font-medium mb-2">Special Terms & Conditions</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    placeholder="Quality standards, inspection requirements, warranties..."
                    value={formData.special_terms}
                    onChange={(e) => setFormData({ ...formData, special_terms: e.target.value })}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Additional Notes</label>
                  <textarea
                    className="input-field"
                    rows="2"
                    placeholder="Any special instructions or remarks..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className="space-y-4">
                {/* PI Preview */}
                <div className="card bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
                  <h3 className="font-bold mb-4">PI Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">PI Number</p>
                      <p className="font-bold">{formData.pi_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Buyer</p>
                      <p className="font-medium">{lead?.buyer_name}</p>
                      <p className="text-xs text-gray-500">{lead?.company_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Product</p>
                      <p className="font-medium">{lead?.product_interest}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Quantity</p>
                        <p className="font-medium">{lead?.quantity} pcs</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Unit Price</p>
                        <p className="font-medium">
                          ${costing?.price_per_unit || (lead?.target_price / lead?.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-indigo-200 dark:border-indigo-700">
                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        ${costing?.quoted_price || lead?.target_price}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Timeline */}
                <div className="card">
                  <h3 className="font-bold mb-3 flex items-center space-x-2">
                    <FaCalendar className="text-orange-600" />
                    <span>Timeline</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Issue Date:</span>
                      <span className="font-medium">{formData.issue_date || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Valid Until:</span>
                      <span className="font-medium">{formData.valid_until || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Delivery:</span>
                      <span className="font-medium">{formData.delivery_date || 'Not set'}</span>
                    </div>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="card bg-yellow-50 dark:bg-yellow-900/20">
                  <h3 className="font-bold mb-3 text-sm">⚠️ Important</h3>
                  <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <li>• Verify all details before generating</li>
                    <li>• PI number must be unique</li>
                    <li>• Check payment terms carefully</li>
                    <li>• Confirm delivery dates</li>
                    <li>• Include bank details for payment</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-dark-border flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate PI'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default PIForm
