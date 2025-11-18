import { useState } from 'react'
import { useCreateShipmentMutation } from '@/features/orders/ordersApiSlice'
import { useSendDocumentMutation } from '@/features/whatsapp/whatsappApiSlice'
import toast from 'react-hot-toast'
import { FaTimes, FaTruck, FaFileAlt, FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'

const ShipmentForm = ({ order, onClose, onSuccess }) => {
  const [createShipment, { isLoading }] = useCreateShipmentMutation()
  const [sendDocument] = useSendDocumentMutation()
  
  const [formData, setFormData] = useState({
    shipping_date: new Date().toISOString().split('T')[0],
    carrier: '',
    tracking_number: '',
    shipping_method: 'sea',
    container_number: '',
    seal_number: '',
    vessel_name: '',
    voyage_number: '',
    port_of_loading: 'Mumbai, India',
    port_of_discharge: '',
    estimated_delivery: '',
    freight_charges: '',
    insurance_amount: '',
    total_packages: '',
    gross_weight: '',
    net_weight: '',
    volume: '',
    hawb_mawb: '',
    customs_clearance: false,
    notify_buyer: true,
    special_instructions: '',
  })

  const carriers = [
    'Maersk Line',
    'MSC Mediterranean Shipping',
    'CMA CGM',
    'Hapag-Lloyd',
    'ONE (Ocean Network Express)',
    'Evergreen Line',
    'COSCO Shipping',
    'Yang Ming Marine',
    'DHL Express',
    'FedEx',
    'UPS',
    'Other',
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const result = await createShipment({
        orderId: order.id,
        ...formData,
      }).unwrap()
      
      toast.success('Shipment created successfully!')

      // Send WhatsApp notification if enabled
      if (formData.notify_buyer && order.buyer_phone) {
        try {
          await sendDocument({
            phoneNumber: order.buyer_phone,
            documentUrl: result.tracking_url,
            filename: `Shipment_${formData.tracking_number}.pdf`
          }).unwrap()
          toast.success('Shipment notification sent via WhatsApp!')
        } catch (error) {
          console.error('WhatsApp notification failed', error)
        }
      }
      
      onSuccess && onSuccess()
      onClose()
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create shipment')
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
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
              <FaTruck className="text-2xl text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Create Shipment</h2>
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
                {/* Basic Shipment Info */}
                <div className="card bg-blue-50 dark:bg-blue-900/10">
                  <h3 className="font-bold text-lg mb-4">Shipment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Shipping Date *</label>
                      <input
                        type="date"
                        className="input-field"
                        value={formData.shipping_date}
                        onChange={(e) => setFormData({ ...formData, shipping_date: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Shipping Method *</label>
                      <select
                        className="input-field"
                        value={formData.shipping_method}
                        onChange={(e) => setFormData({ ...formData, shipping_method: e.target.value })}
                        required
                      >
                        <option value="sea">Sea Freight</option>
                        <option value="air">Air Freight</option>
                        <option value="road">Road Transport</option>
                        <option value="rail">Rail Transport</option>
                        <option value="courier">Express Courier</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Carrier *</label>
                      <select
                        className="input-field"
                        value={formData.carrier}
                        onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                        required
                      >
                        <option value="">Select carrier</option>
                        {carriers.map((carrier) => (
                          <option key={carrier} value={carrier}>{carrier}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Tracking Number *</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="TRACK123456"
                        value={formData.tracking_number}
                        onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Estimated Delivery *</label>
                      <input
                        type="date"
                        className="input-field"
                        value={formData.estimated_delivery}
                        onChange={(e) => setFormData({ ...formData, estimated_delivery: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Container/Vessel Details (for Sea Freight) */}
                {formData.shipping_method === 'sea' && (
                  <div className="card">
                    <h3 className="font-bold text-lg mb-4">Container & Vessel Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Container Number</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="CONT123456"
                          value={formData.container_number}
                          onChange={(e) => setFormData({ ...formData, container_number: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Seal Number</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="SEAL123456"
                          value={formData.seal_number}
                          onChange={(e) => setFormData({ ...formData, seal_number: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Vessel Name</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Ship name"
                          value={formData.vessel_name}
                          onChange={(e) => setFormData({ ...formData, vessel_name: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Voyage Number</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="VOY123"
                          value={formData.voyage_number}
                          onChange={(e) => setFormData({ ...formData, voyage_number: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Ports */}
                <div className="card">
                  <h3 className="font-bold text-lg mb-4">Port Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Port of Loading *</label>
                      <input
                        type="text"
                        className="input-field"
                        value={formData.port_of_loading}
                        onChange={(e) => setFormData({ ...formData, port_of_loading: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Port of Discharge *</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Destination port"
                        value={formData.port_of_discharge}
                        onChange={(e) => setFormData({ ...formData, port_of_discharge: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Package Details */}
                <div className="card bg-green-50 dark:bg-green-900/10">
                  <h3 className="font-bold text-lg mb-4">Package Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Total Packages *</label>
                      <input
                        type="number"
                        className="input-field"
                        placeholder="Number of cartons/boxes"
                        value={formData.total_packages}
                        onChange={(e) => setFormData({ ...formData, total_packages: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Gross Weight (kg) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field"
                        placeholder="0.00"
                        value={formData.gross_weight}
                        onChange={(e) => setFormData({ ...formData, gross_weight: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Net Weight (kg) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field"
                        placeholder="0.00"
                        value={formData.net_weight}
                        onChange={(e) => setFormData({ ...formData, net_weight: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Volume (CBM)</label>
                      <input
                        type="number"
                        step="0.001"
                        className="input-field"
                        placeholder="0.000"
                        value={formData.volume}
                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Costs */}
                <div className="card">
                  <h3 className="font-bold text-lg mb-4">Shipping Costs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Freight Charges ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field"
                        placeholder="0.00"
                        value={formData.freight_charges}
                        onChange={(e) => setFormData({ ...formData, freight_charges: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Insurance Amount ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field"
                        placeholder="0.00"
                        value={formData.insurance_amount}
                        onChange={(e) => setFormData({ ...formData, insurance_amount: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Air Waybill (for Air Freight) */}
                {formData.shipping_method === 'air' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">HAWB/MAWB Number</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Air waybill number"
                      value={formData.hawb_mawb}
                      onChange={(e) => setFormData({ ...formData, hawb_mawb: e.target.value })}
                    />
                  </div>
                )}

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium mb-2">Special Instructions</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    placeholder="Handling instructions, special requirements..."
                    value={formData.special_instructions}
                    onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                  />
                </div>

                {/* Options */}
                <div className="card">
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.customs_clearance}
                        onChange={(e) => setFormData({ ...formData, customs_clearance: e.target.checked })}
                        className="w-5 h-5 text-primary-600 rounded"
                      />
                      <span>Customs clearance arranged</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notify_buyer}
                        onChange={(e) => setFormData({ ...formData, notify_buyer: e.target.checked })}
                        className="w-5 h-5 text-primary-600 rounded"
                      />
                      <div className="flex items-center space-x-2">
                        <span>Send notification to buyer</span>
                        <FaWhatsapp className="text-green-500" />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className="space-y-4">
                {/* Order Summary */}
                <div className="card">
                  <h3 className="font-bold mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Product</p>
                      <p className="font-medium">{order?.product_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Quantity</p>
                      <p className="font-medium">{order?.quantity} pieces</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Buyer</p>
                      <p className="font-medium">{order?.buyer_name}</p>
                      <p className="text-xs text-gray-500">{order?.buyer_company}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Destination</p>
                      <p className="font-medium">{order?.destination || 'To be set'}</p>
                    </div>
                  </div>
                </div>

                {/* Shipment Preview */}
                <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                  <h3 className="font-bold mb-3">Shipment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Method:</span>
                      <span className="font-medium capitalize">{formData.shipping_method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Carrier:</span>
                      <span className="font-medium">{formData.carrier || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tracking:</span>
                      <span className="font-medium">{formData.tracking_number || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Packages:</span>
                      <span className="font-medium">{formData.total_packages || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                      <span className="font-medium">{formData.gross_weight || 0} kg</span>
                    </div>
                    {formData.freight_charges && (
                      <div className="flex justify-between pt-2 border-t border-green-300 dark:border-green-700">
                        <span className="font-medium">Freight:</span>
                        <span className="font-bold text-green-600">${formData.freight_charges}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="card">
                  <h3 className="font-bold mb-3 flex items-center space-x-2">
                    <FaFileAlt className="text-blue-600" />
                    <span>Documents</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Commercial Invoice</span>
                      <span className="text-green-600 font-medium">✓ Ready</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Packing List</span>
                      <span className="text-green-600 font-medium">✓ Ready</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Certificate of Origin</span>
                      <span className="text-yellow-600 font-medium">⏳ Pending</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Bill of Lading</span>
                      <span className="text-gray-400">○ Generate</span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="card bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="font-bold mb-3 text-sm">📅 Timeline</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                      <span className="font-medium">{formData.shipping_date || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Estimated Arrival:</span>
                      <span className="font-medium">{formData.estimated_delivery || 'Not set'}</span>
                    </div>
                    {formData.shipping_date && formData.estimated_delivery && (
                      <div className="flex justify-between pt-2 border-t border-blue-300 dark:border-blue-700">
                        <span className="font-medium">Transit Time:</span>
                        <span className="font-bold">
                          {Math.ceil((new Date(formData.estimated_delivery) - new Date(formData.shipping_date)) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                    )}
                  </div>
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
            className="btn-primary flex-1 bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Shipment'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ShipmentForm
