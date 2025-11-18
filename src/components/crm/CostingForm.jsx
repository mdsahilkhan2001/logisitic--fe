import { useState } from 'react'
import { useCreateCostingMutation } from '@/features/leads/leadsApiSlice'
import toast from 'react-hot-toast'
import { FaTimes, FaCalculator, FaInfoCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'

const CostingForm = ({ lead, onClose, onSuccess }) => {
  const [createCosting, { isLoading }] = useCreateCostingMutation()
  
  const [formData, setFormData] = useState({
    fabric_cost: '',
    labor_cost: '',
    accessories_cost: '',
    overhead_cost: '',
    packaging_cost: '',
    shipping_cost: '',
    profit_margin: '20',
    notes: '',
  })

  const [showBreakdown, setShowBreakdown] = useState(true)

  // Calculate totals
  const totalMaterialCost = 
    parseFloat(formData.fabric_cost || 0) +
    parseFloat(formData.accessories_cost || 0)

  const totalOperationalCost = 
    parseFloat(formData.labor_cost || 0) +
    parseFloat(formData.overhead_cost || 0) +
    parseFloat(formData.packaging_cost || 0) +
    parseFloat(formData.shipping_cost || 0)

  const totalCost = totalMaterialCost + totalOperationalCost
  const profitMarginValue = parseFloat(formData.profit_margin || 0)
  const profitAmount = (totalCost * profitMarginValue) / 100
  const quotedPrice = totalCost + profitAmount
  const pricePerUnit = lead?.quantity ? (quotedPrice / lead.quantity).toFixed(2) : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await createCosting({
        leadId: lead.id,
        ...formData,
        total_cost: totalCost.toFixed(2),
        quoted_price: quotedPrice.toFixed(2),
        price_per_unit: pricePerUnit,
      }).unwrap()
      
      toast.success('Costing created successfully!')
      onSuccess && onSuccess()
      onClose()
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create costing')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-dark-card rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
              <FaCalculator className="text-2xl text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Create Costing Sheet</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lead: {lead?.buyer_name} - {lead?.product_interest}
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
                {/* Material Costs */}
                <div className="card bg-blue-50 dark:bg-blue-900/10">
                  <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                    <span className="text-blue-600">📦</span>
                    <span>Material Costs</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Fabric Cost ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field"
                        placeholder="0.00"
                        value={formData.fabric_cost}
                        onChange={(e) => setFormData({ ...formData, fabric_cost: e.target.value })}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Raw fabric material cost</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Accessories Cost ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field"
                        placeholder="0.00"
                        value={formData.accessories_cost}
                        onChange={(e) => setFormData({ ...formData, accessories_cost: e.target.value })}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Buttons, zippers, threads, etc.</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white dark:bg-dark-bg rounded">
                    <p className="text-sm font-medium">
                      Total Material Cost: <span className="text-blue-600 font-bold">${totalMaterialCost.toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                {/* Operational Costs */}
                <div className="card bg-green-50 dark:bg-green-900/10">
                  <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                    <span className="text-green-600">⚙️</span>
                    <span>Operational Costs</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Labor Cost ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field"
                        placeholder="0.00"
                        value={formData.labor_cost}
                        onChange={(e) => setFormData({ ...formData, labor_cost: e.target.value })}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Manufacturing labor charges</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Overhead Cost ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field"
                        placeholder="0.00"
                        value={formData.overhead_cost}
                        onChange={(e) => setFormData({ ...formData, overhead_cost: e.target.value })}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Utilities, rent, admin costs</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Packaging Cost ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field"
                        placeholder="0.00"
                        value={formData.packaging_cost}
                        onChange={(e) => setFormData({ ...formData, packaging_cost: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">Boxes, labels, wrapping</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Shipping Cost ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field"
                        placeholder="0.00"
                        value={formData.shipping_cost}
                        onChange={(e) => setFormData({ ...formData, shipping_cost: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">Logistics and freight</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white dark:bg-dark-bg rounded">
                    <p className="text-sm font-medium">
                      Total Operational Cost: <span className="text-green-600 font-bold">${totalOperationalCost.toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                {/* Profit Margin */}
                <div className="card bg-yellow-50 dark:bg-yellow-900/10">
                  <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                    <span className="text-yellow-600">💰</span>
                    <span>Profit Margin</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Profit Margin (%) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        className="input-field"
                        placeholder="20"
                        value={formData.profit_margin}
                        onChange={(e) => setFormData({ ...formData, profit_margin: e.target.value })}
                        required
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={formData.profit_margin}
                        onChange={(e) => setFormData({ ...formData, profit_margin: e.target.value })}
                        className="w-full mt-2"
                      />
                    </div>
                    <div className="p-3 bg-white dark:bg-dark-bg rounded">
                      <p className="text-sm font-medium">
                        Profit Amount: <span className="text-yellow-600 font-bold">${profitAmount.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    className="input-field"
                    rows="3"
                    placeholder="Special considerations, discounts, terms..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className="space-y-4">
                {/* Order Details */}
                <div className="card bg-gray-50 dark:bg-dark-bg">
                  <h3 className="font-bold mb-3">Order Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Product:</span>
                      <span className="font-medium">{lead?.product_interest}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                      <span className="font-medium">{lead?.quantity || 0} pcs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Target Price:</span>
                      <span className="font-medium">${lead?.target_price || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Cost Summary */}
                <div className="card bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
                  <h3 className="font-bold mb-4 flex items-center justify-between">
                    <span>Cost Summary</span>
                    <button
                      type="button"
                      onClick={() => setShowBreakdown(!showBreakdown)}
                      className="text-xs text-primary-600 hover:text-primary-700"
                    >
                      {showBreakdown ? 'Hide' : 'Show'} Details
                    </button>
                  </h3>
                  
                  {showBreakdown && (
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Material:</span>
                        <span className="font-medium">${totalMaterialCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Operational:</span>
                        <span className="font-medium">${totalOperationalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                        <span className="font-bold">Subtotal:</span>
                        <span className="font-bold">${totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span className="font-medium">Profit ({profitMarginValue}%):</span>
                        <span className="font-bold">+${profitAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-primary-600 text-white p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">Total Quote:</span>
                      <span className="text-2xl font-bold">${quotedPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-primary-100">
                      <span>Price per unit:</span>
                      <span className="font-medium">${pricePerUnit}</span>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="card bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-start space-x-2 mb-2">
                    <FaInfoCircle className="text-blue-600 mt-1" />
                    <h3 className="font-bold text-sm">Tips</h3>
                  </div>
                  <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <li>• Include all material costs</li>
                    <li>• Factor in quality control</li>
                    <li>• Consider bulk discounts</li>
                    <li>• Add buffer for variations</li>
                    <li>• Review market rates</li>
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
            {isLoading ? 'Creating...' : 'Create Costing'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default CostingForm
