import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  useGetOrderByIdQuery, 
  useUploadDesignMutation,
  useUpdateProductionMutation 
} from '@/features/orders/ordersApiSlice'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaUpload, FaFile, FaTimes, FaImage } from 'react-icons/fa'

const UploadDesign = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { data: order, isLoading: loadingOrder } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  })
  const [uploadDesign, { isLoading }] = useUploadDesignMutation()
  const [updateProduction] = useUpdateProductionMutation()
  
  const [designFile, setDesignFile] = useState(null)
  const [techPackFile, setTechPackFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [formData, setFormData] = useState({
    design_notes: '',
    colors: '',
    fabric_type: '',
    measurements: '',
  })

  const handleDesignFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setDesignFile(file)
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleTechPackChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setTechPackFile(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!orderId) {
      toast.error('Order ID is required')
      return
    }

    if (!designFile) {
      toast.error('Please select a design file')
      return
    }

    const submitData = new FormData()
    submitData.append('design_file', designFile)
    if (techPackFile) submitData.append('tech_pack', techPackFile)
    submitData.append('design_notes', formData.design_notes)
    submitData.append('colors', formData.colors)
    submitData.append('fabric_type', formData.fabric_type)
    submitData.append('measurements', formData.measurements)
    
    try {
      await uploadDesign({ orderId, data: submitData }).unwrap()
      
      // Update production status
      await updateProduction({
        orderId,
        status: 'design_uploaded',
        progress: 25,
      }).unwrap()
      
      toast.success('Design uploaded successfully!')
      navigate('/designer/orders')
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to upload design')
    }
  }

  if (loadingOrder) {
    return <div className="p-6">Loading order details...</div>
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/designer/orders')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6"
      >
        <FaArrowLeft />
        <span>Back to Orders</span>
      </button>

      <div className="flex items-center space-x-3 mb-6">
        <FaUpload className="text-3xl text-primary-600" />
        <div>
          <h1 className="text-3xl font-bold">Upload Design</h1>
          {order && (
            <p className="text-gray-600 dark:text-gray-400">
              Order #{order.id} - {order.product_name}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2 card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Design File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Design File * (Image, AI, PSD, SVG)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition cursor-pointer">
                <input
                  type="file"
                  id="designFile"
                  className="hidden"
                  accept="image/*,.ai,.psd,.svg"
                  onChange={handleDesignFileChange}
                  required
                />
                <label htmlFor="designFile" className="cursor-pointer">
                  {previewUrl ? (
                    <div className="relative">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-64 mx-auto rounded"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          setDesignFile(null)
                          setPreviewUrl(null)
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : designFile ? (
                    <div className="flex items-center justify-center space-x-3">
                      <FaFile className="text-3xl text-primary-600" />
                      <div>
                        <p className="font-medium">{designFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(designFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <FaImage className="text-5xl text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Click to upload design file
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Supports: JPG, PNG, AI, PSD, SVG (Max 10MB)
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Tech Pack Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tech Pack (Optional) - PDF
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-primary-500 transition cursor-pointer">
                <input
                  type="file"
                  id="techPack"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleTechPackChange}
                />
                <label htmlFor="techPack" className="cursor-pointer flex items-center justify-center space-x-3">
                  {techPackFile ? (
                    <>
                      <FaFile className="text-2xl text-red-600" />
                      <div>
                        <p className="font-medium">{techPackFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(techPackFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <FaFile className="text-3xl text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Click to upload tech pack (PDF)
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Design Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Colors Used</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Navy Blue, White, Red"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fabric Type</label>
                <select
                  className="input-field"
                  value={formData.fabric_type}
                  onChange={(e) => setFormData({ ...formData, fabric_type: e.target.value })}
                >
                  <option value="">Select Fabric</option>
                  <option value="cotton">Cotton</option>
                  <option value="polyester">Polyester</option>
                  <option value="cotton_blend">Cotton Blend</option>
                  <option value="silk">Silk</option>
                  <option value="denim">Denim</option>
                  <option value="linen">Linen</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Measurements</label>
              <textarea
                className="input-field"
                rows="3"
                placeholder="e.g., S: Chest 36, M: Chest 38, L: Chest 40..."
                value={formData.measurements}
                onChange={(e) => setFormData({ ...formData, measurements: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Design Notes</label>
              <textarea
                className="input-field"
                rows="4"
                placeholder="Special instructions, design variations, embellishments..."
                value={formData.design_notes}
                onChange={(e) => setFormData({ ...formData, design_notes: e.target.value })}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isLoading || !designFile}
              >
                {isLoading ? 'Uploading...' : 'Upload Design'}
              </button>
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={() => navigate('/designer/orders')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Order Details Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Order Details</h3>
            {order && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                  <span className="font-medium">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Product:</span>
                  <span className="font-medium">{order.product_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                  <span className="font-medium">{order.quantity} pcs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Delivery:</span>
                  <span className="font-medium">
                    {order.delivery_date 
                      ? new Date(order.delivery_date).toLocaleDateString() 
                      : 'TBD'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {order.status}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="card bg-yellow-50 dark:bg-yellow-900/20">
            <h3 className="text-lg font-bold mb-3 flex items-center space-x-2">
              <span>📋</span>
              <span>Upload Guidelines</span>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• Use high-resolution images (300 DPI minimum)</li>
              <li>• Include front, back, and detail views</li>
              <li>• Specify exact color codes (Pantone/CMYK)</li>
              <li>• Add measurement specifications</li>
              <li>• Include fabric and material details</li>
              <li>• Mark placement for logos/prints</li>
            </ul>
          </div>

          {/* File Formats */}
          <div className="card bg-blue-50 dark:bg-blue-900/20">
            <h3 className="text-lg font-bold mb-3">Supported Formats</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Design:</strong> JPG, PNG, AI, PSD, SVG</p>
              <p><strong>Tech Pack:</strong> PDF only</p>
              <p><strong>Max Size:</strong> 10MB per file</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadDesign
