 import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCreateCostingMutation } from '@/features/leads/leadsApiSlice'
import { useGetLeadByIdQuery } from '@/features/leads/leadsApiSlice'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaCalculator } from 'react-icons/fa'

const CreateCosting = () => {
  const { leadId } = useParams()
  const navigate = useNavigate()
  const { data: lead, isLoading: loadingLead } = useGetLeadByIdQuery(leadId, {
    skip: !leadId,
  })
  const [createCosting, { isLoading }] = useCreateCostingMutation()
  
  const [formData, setFormData] = useState({
    fabric_cost: '',
    labor_cost: '',
    accessories_cost: '',
    overhead_cost: '',
    profit_margin: '20',
  })

  const totalCost = 
    parseFloat(formData.fabric_cost || 0) +
    parseFloat(formData.labor_cost || 0) +
    parseFloat(formData.accessories_cost || 0) +
    parseFloat(formData.overhead_cost || 0)

  const profitAmount = totalCost * (parseFloat(formData.profit_margin || 0) / 100)
  const quotedPrice = totalCost + profitAmount

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!leadId) {
      toast.error('Lead ID is required')
      return
    }
    
    try {
      await createCosting({
        leadId,
        ...formData,
        total_cost: totalCost.toFixed(2),
        quoted_price: quotedPrice.toFixed(2),
      }).unwrap()
      
      toast.success('Costing created successfully!')
      navigate('/salesman/leads')
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create costing')
    }
  }

  if (loadingLead) {
    return <div className="p-6">Loading lead details...</div>
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/salesman/leads')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6"
      >
        <FaArrowLeft />
        <span>Back to Leads</span>
      </button>

      <div className="flex items-center space-x-3 mb-6">
        <FaCalculator className="text-3xl text-primary-600" />
        <div>
          <h1 className="text-3xl font-bold">Create Costing Sheet</h1>
          {lead && (
            <p className="text-gray-600 dark:text-gray-400">
              Lead: {lead.buyer_name} - {lead.product_interest}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-xs text-gray-500 mt-1">Cost of raw fabric material</p>
              </div>

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

              <div className="md:col-span-2">
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
                <p className="text-xs text-gray-500 mt-1">Target profit margin percentage</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Costing'}
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

        {/* Summary */}
        <div className="space-y-6">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <h3 className="text-lg font-bold mb-4">Cost Breakdown</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Fabric Cost</span>
                <span className="font-semibold">${parseFloat(formData.fabric_cost || 0).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Labor Cost</span>
                <span className="font-semibold">${parseFloat(formData.labor_cost || 0).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Accessories</span>
                <span className="font-semibold">${parseFloat(formData.accessories_cost || 0).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Overhead</span>
                <span className="font-semibold">${parseFloat(formData.overhead_cost || 0).toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3">
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total Cost</span>
                  <span className="font-bold">${totalCost.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span className="font-medium">Profit ({formData.profit_margin}%)</span>
                <span className="font-semibold">${profitAmount.toFixed(2)}</span>
              </div>
              
              <div className="bg-primary-600 text-white p-4 rounded-lg mt-4">
                <div className="flex justify-between text-xl">
                  <span className="font-bold">Quoted Price</span>
                  <span className="font-bold">${quotedPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card bg-yellow-50 dark:bg-yellow-900/20">
            <h3 className="text-lg font-bold mb-3">💡 Tips</h3>
            <ul className="space-y-2 text-sm">
              <li>• Include all material costs in fabric section</li>
              <li>• Factor in quality control costs</li>
              <li>• Consider bulk order discounts</li>
              <li>• Account for shipping/packaging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCosting
