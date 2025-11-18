import { useState } from 'react'
import { useCreateQCMutation } from '@/features/orders/ordersApiSlice'
import toast from 'react-hot-toast'
import { FaTimes, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa'
import { motion } from 'framer-motion'

const QCForm = ({ order, onClose, onSuccess }) => {
  const [createQC, { isLoading }] = useCreateQCMutation()
  
  const [formData, setFormData] = useState({
    inspection_date: new Date().toISOString().split('T')[0],
    inspector_name: '',
    total_pieces: order?.quantity || 0,
    passed_pieces: '',
    rejected_pieces: '',
    inspection_type: 'final',
    aql_level: '2.5',
    defects: [],
    measurements_ok: true,
    color_accuracy: true,
    stitching_quality: true,
    packaging_quality: true,
    labeling_correct: true,
    fabric_quality: true,
    remarks: '',
    corrective_actions: '',
  })

  const [defectEntry, setDefectEntry] = useState({ type: '', count: '', severity: 'minor' })

  const defectTypes = [
    'Stitching defect',
    'Fabric defect',
    'Color mismatch',
    'Size variation',
    'Measurement error',
    'Loose threads',
    'Stain/Mark',
    'Button/Zipper issue',
    'Label error',
    'Packaging defect',
    'Other',
  ]

  const handleAddDefect = () => {
    if (defectEntry.type && defectEntry.count) {
      setFormData({
        ...formData,
        defects: [...formData.defects, { ...defectEntry }]
      })
      setDefectEntry({ type: '', count: '', severity: 'minor' })
    }
  }

  const handleRemoveDefect = (index) => {
    setFormData({
      ...formData,
      defects: formData.defects.filter((_, i) => i !== index)
    })
  }

  const passedPieces = parseInt(formData.passed_pieces || 0)
  const rejectedPieces = parseInt(formData.rejected_pieces || 0)
  const totalInspected = passedPieces + rejectedPieces
  const passRate = totalInspected > 0 ? ((passedPieces / totalInspected) * 100).toFixed(2) : 0
  const isApproved = parseFloat(passRate) >= 95 // 95% pass rate for approval

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (totalInspected > formData.total_pieces) {
      toast.error('Inspected pieces cannot exceed total pieces')
      return
    }

    try {
      await createQC({
        orderId: order.id,
        ...formData,
        pass_rate: passRate,
        approved: isApproved,
      }).unwrap()
      
      toast.success('QC report created successfully!')
      onSuccess && onSuccess()
      onClose()
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create QC report')
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
            <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
              <FaCheckCircle className="text-2xl text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Quality Control Inspection</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order #{order?.id} - {order?.product_name}
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
                {/* Inspection Details */}
                <div className="card">
                  <h3 className="font-bold text-lg mb-4">Inspection Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Inspection Date *</label>
                      <input
                        type="date"
                        className="input-field"
                        value={formData.inspection_date}
                        onChange={(e) => setFormData({ ...formData, inspection_date: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Inspector Name *</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Full name"
                        value={formData.inspector_name}
                        onChange={(e) => setFormData({ ...formData, inspector_name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Inspection Type</label>
                      <select
                        className="input-field"
                        value={formData.inspection_type}
                        onChange={(e) => setFormData({ ...formData, inspection_type: e.target.value })}
                      >
                        <option value="pre-production">Pre-Production</option>
                        <option value="in-line">In-Line</option>
                        <option value="final">Final Inspection</option>
                        <option value="random">Random Check</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">AQL Level</label>
                      <select
                        className="input-field"
                        value={formData.aql_level}
                        onChange={(e) => setFormData({ ...formData, aql_level: e.target.value })}
                      >
                        <option value="0.65">0.65 (Critical)</option>
                        <option value="1.0">1.0 (Major)</option>
                        <option value="2.5">2.5 (Standard)</option>
                        <option value="4.0">4.0 (Minor)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Quantity Check */}
                <div className="card bg-blue-50 dark:bg-blue-900/10">
                  <h3 className="font-bold text-lg mb-4">Quantity Check</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Total Pieces</label>
                      <input
                        type="number"
                        className="input-field"
                        value={formData.total_pieces}
                        onChange={(e) => setFormData({ ...formData, total_pieces: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Passed *</label>
                      <input
                        type="number"
                        className="input-field"
                        placeholder="0"
                        value={formData.passed_pieces}
                        onChange={(e) => setFormData({ ...formData, passed_pieces: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Rejected *</label>
                      <input
                        type="number"
                        className="input-field"
                        placeholder="0"
                        value={formData.rejected_pieces}
                        onChange={(e) => setFormData({ ...formData, rejected_pieces: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white dark:bg-dark-bg rounded">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Pass Rate:</span>
                      <span className={`text-xl font-bold ${
                        parseFloat(passRate) >= 95 ? 'text-green-600' :
                        parseFloat(passRate) >= 80 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {passRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quality Checkpoints */}
                <div className="card">
                  <h3 className="font-bold text-lg mb-4">Quality Checkpoints</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'measurements_ok', label: 'Measurements within tolerance' },
                      { key: 'color_accuracy', label: 'Color accuracy approved' },
                      { key: 'stitching_quality', label: 'Stitching quality acceptable' },
                      { key: 'fabric_quality', label: 'Fabric quality meets standards' },
                      { key: 'packaging_quality', label: 'Packaging quality approved' },
                      { key: 'labeling_correct', label: 'Labeling correct and complete' },
                    ].map((checkpoint) => (
                      <label key={checkpoint.key} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <input
                          type="checkbox"
                          checked={formData[checkpoint.key]}
                          onChange={(e) => setFormData({ ...formData, [checkpoint.key]: e.target.checked })}
                          className="w-5 h-5 text-primary-600 rounded"
                        />
                        <span className="flex-1">{checkpoint.label}</span>
                        {formData[checkpoint.key] ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <FaTimesCircle className="text-red-500" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Defects */}
                <div className="card">
                  <h3 className="font-bold text-lg mb-4">Defects Found</h3>
                  
                  {/* Add Defect */}
                  <div className="grid grid-cols-12 gap-2 mb-4">
                    <select
                      className="input-field col-span-5"
                      value={defectEntry.type}
                      onChange={(e) => setDefectEntry({ ...defectEntry, type: e.target.value })}
                    >
                      <option value="">Select defect type</option>
                      {defectTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="input-field col-span-3"
                      placeholder="Count"
                      value={defectEntry.count}
                      onChange={(e) => setDefectEntry({ ...defectEntry, count: e.target.value })}
                    />
                    <select
                      className="input-field col-span-3"
                      value={defectEntry.severity}
                      onChange={(e) => setDefectEntry({ ...defectEntry, severity: e.target.value })}
                    >
                      <option value="minor">Minor</option>
                      <option value="major">Major</option>
                      <option value="critical">Critical</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddDefect}
                      className="btn-primary col-span-1 px-2"
                    >
                      +
                    </button>
                  </div>

                  {/* Defects List */}
                  {formData.defects.length > 0 ? (
                    <div className="space-y-2">
                      {formData.defects.map((defect, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FaExclamationTriangle className={
                              defect.severity === 'critical' ? 'text-red-600' :
                              defect.severity === 'major' ? 'text-orange-600' :
                              'text-yellow-600'
                            } />
                            <div>
                              <p className="font-medium">{defect.type}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Count: {defect.count} • Severity: {defect.severity}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDefect(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">No defects added</p>
                  )}
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-sm font-medium mb-2">Inspection Remarks</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    placeholder="Overall observations, general comments..."
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  />
                </div>

                {/* Corrective Actions */}
                <div>
                  <label className="block text-sm font-medium mb-2">Corrective Actions Required</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    placeholder="Actions needed to address issues..."
                    value={formData.corrective_actions}
                    onChange={(e) => setFormData({ ...formData, corrective_actions: e.target.value })}
                  />
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className="space-y-4">
                {/* Order Info */}
                <div className="card">
                  <h3 className="font-bold mb-3">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Product</p>
                      <p className="font-medium">{order?.product_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Order Quantity</p>
                      <p className="font-medium">{order?.quantity} pieces</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Buyer</p>
                      <p className="font-medium">{order?.buyer_name}</p>
                    </div>
                  </div>
                </div>

                {/* QC Result */}
                <div className={`card ${
                  isApproved 
                    ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20' 
                    : 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20'
                }`}>
                  <div className="text-center mb-3">
                    {isApproved ? (
                      <FaCheckCircle className="text-5xl text-green-600 mx-auto mb-3" />
                    ) : (
                      <FaTimesCircle className="text-5xl text-red-600 mx-auto mb-3" />
                    )}
                    <h3 className="font-bold text-lg mb-1">
                      {isApproved ? 'APPROVED' : 'REJECTED'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pass Rate: {passRate}%
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Inspected:</span>
                      <span className="font-bold">{totalInspected} pcs</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Passed:</span>
                      <span className="font-bold">{passedPieces} pcs</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Rejected:</span>
                      <span className="font-bold">{rejectedPieces} pcs</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>Defects:</span>
                      <span className="font-bold">{formData.defects.length}</span>
                    </div>
                  </div>
                </div>

                {/* Guidelines */}
                <div className="card bg-yellow-50 dark:bg-yellow-900/20">
                  <h3 className="font-bold mb-3 text-sm">📋 QC Guidelines</h3>
                  <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <li>• Pass rate ≥95% = Approved</li>
                    <li>• Pass rate 80-94% = Conditional</li>
                    <li>• Pass rate &lt;80% = Rejected</li>
                    <li>• Critical defects = Auto reject</li>
                    <li>• Document all major issues</li>
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
            className={`flex-1 font-bold py-3 rounded-lg transition ${
              isApproved
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : `Submit ${isApproved ? 'APPROVED' : 'REJECTED'} Report`}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default QCForm
