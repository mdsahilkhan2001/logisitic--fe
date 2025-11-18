import { useState } from 'react'
import { useGetDocumentsByOrderQuery } from '@/features/documents/documentsApiSlice'
import { FaFileAlt, FaFilePdf, FaDownload, FaEye, FaSearch, FaFilter } from 'react-icons/fa'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const DocumentsView = () => {
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const { data: documents, isLoading } = useGetDocumentsByOrderQuery(selectedOrderId, {
    skip: !selectedOrderId
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  // Mock data for demonstration
  const mockDocuments = [
    {
      id: 1,
      name: 'Proforma Invoice',
      type: 'PI',
      order_id: 1234,
      date: '2025-01-10',
      size: '245 KB',
      status: 'available'
    },
    {
      id: 2,
      name: 'Commercial Invoice',
      type: 'Invoice',
      order_id: 1234,
      date: '2025-01-12',
      size: '312 KB',
      status: 'available'
    },
    {
      id: 3,
      name: 'Packing List',
      type: 'Packing',
      order_id: 1234,
      date: '2025-01-12',
      size: '198 KB',
      status: 'available'
    },
    {
      id: 4,
      name: 'Quality Certificate',
      type: 'QC',
      order_id: 1230,
      date: '2025-01-08',
      size: '523 KB',
      status: 'available'
    },
    {
      id: 5,
      name: 'Bill of Lading',
      type: 'BOL',
      order_id: 1234,
      date: '2025-01-13',
      size: '421 KB',
      status: 'available'
    },
    {
      id: 6,
      name: 'Certificate of Origin',
      type: 'COO',
      order_id: 1230,
      date: '2025-01-09',
      size: '276 KB',
      status: 'pending'
    },
  ]

  const documentTypes = [
    { value: 'all', label: 'All Documents' },
    { value: 'PI', label: 'Proforma Invoice' },
    { value: 'Invoice', label: 'Commercial Invoice' },
    { value: 'Packing', label: 'Packing List' },
    { value: 'QC', label: 'Quality Certificate' },
    { value: 'BOL', label: 'Bill of Lading' },
    { value: 'COO', label: 'Certificate of Origin' },
  ]

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.order_id.toString().includes(searchQuery)
    const matchesType = filterType === 'all' || doc.type === filterType
    return matchesSearch && matchesType
  })

  const handleDownload = (doc) => {
    toast.success(`Downloading ${doc.name}...`)
  }

  const handlePreview = (doc) => {
    toast.success(`Opening ${doc.name}...`)
  }

  const getDocIcon = (type) => {
    return <FaFilePdf className="text-red-500 text-3xl" />
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Documents</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Access all your order documents and invoices
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-blue-50 dark:bg-blue-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Documents</p>
          <p className="text-2xl font-bold text-blue-600">{mockDocuments.length}</p>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Invoices</p>
          <p className="text-2xl font-bold text-green-600">
            {mockDocuments.filter(d => d.type === 'Invoice' || d.type === 'PI').length}
          </p>
        </div>
        <div className="card bg-purple-50 dark:bg-purple-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Certificates</p>
          <p className="text-2xl font-bold text-purple-600">
            {mockDocuments.filter(d => d.type === 'QC' || d.type === 'COO').length}
          </p>
        </div>
        <div className="card bg-yellow-50 dark:bg-yellow-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {mockDocuments.filter(d => d.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents or order ID..."
              className="input-field pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            <select
              className="input-field w-full md:w-64"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-lg transition-shadow"
            >
              {/* Document Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getDocIcon(doc.type)}
                  <div>
                    <h3 className="font-bold text-lg">{doc.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Order #{doc.order_id}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  doc.status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doc.status}
                </span>
              </div>

              {/* Document Details */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="font-medium">{doc.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium">{doc.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Size:</span>
                  <span className="font-medium">{doc.size}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handlePreview(doc)}
                  className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-2"
                  disabled={doc.status !== 'available'}
                >
                  <FaEye />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="flex-1 btn-primary text-sm py-2 flex items-center justify-center space-x-2"
                  disabled={doc.status !== 'available'}
                >
                  <FaDownload />
                  <span>Download</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No documents found</h3>
          <p className="text-gray-500">
            {searchQuery || filterType !== 'all' 
              ? 'Try adjusting your filters' 
              : "Documents will appear here once your orders are processed"}
          </p>
        </div>
      )}

      {/* Help Section */}
      <div className="card mt-6 bg-blue-50 dark:bg-blue-900/20">
        <h3 className="font-semibold mb-3">📄 Document Information</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>• <strong>Proforma Invoice (PI):</strong> Initial quote and order details</p>
          <p>• <strong>Commercial Invoice:</strong> Final invoice for payment</p>
          <p>• <strong>Packing List:</strong> Detailed list of shipped items</p>
          <p>• <strong>Quality Certificate:</strong> QC inspection report</p>
          <p>• <strong>Bill of Lading:</strong> Shipping document</p>
          <p>• <strong>Certificate of Origin:</strong> Product origin certification</p>
        </div>
      </div>
    </div>
  )
}

export default DocumentsView
