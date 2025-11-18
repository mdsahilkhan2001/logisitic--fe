import { FaFileAlt, FaDownload, FaEdit, FaEye } from 'react-icons/fa'
import toast from 'react-hot-toast'

const DocumentTemplates = () => {
  const templates = [
    {
      id: 1,
      name: 'Proforma Invoice',
      description: 'Standard PI template for export orders',
      type: 'PI',
      lastModified: '2025-01-10',
      uses: 234,
      format: 'PDF'
    },
    {
      id: 2,
      name: 'Commercial Invoice',
      description: 'Final invoice for shipment',
      type: 'Invoice',
      lastModified: '2025-01-08',
      uses: 189,
      format: 'PDF'
    },
    {
      id: 3,
      name: 'Packing List',
      description: 'Detailed packing information',
      type: 'Packing List',
      lastModified: '2025-01-12',
      uses: 198,
      format: 'PDF'
    },
    {
      id: 4,
      name: 'Quality Certificate',
      description: 'QC inspection certificate',
      type: 'QC',
      lastModified: '2025-01-05',
      uses: 167,
      format: 'PDF'
    },
    {
      id: 5,
      name: 'Shipping Label',
      description: 'Shipping and logistics label',
      type: 'Label',
      lastModified: '2025-01-11',
      uses: 203,
      format: 'PDF'
    },
    {
      id: 6,
      name: 'Purchase Order',
      description: 'Internal purchase order template',
      type: 'PO',
      lastModified: '2025-01-09',
      uses: 145,
      format: 'PDF'
    },
  ]

  const handleDownload = (template) => {
    toast.success(`Downloading ${template.name}...`)
  }

  const handlePreview = (template) => {
    toast.success(`Opening preview for ${template.name}`)
  }

  const handleEdit = (template) => {
    toast.success(`Opening editor for ${template.name}`)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Document Templates</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and customize document templates</p>
        </div>
        <button className="btn-primary">
          + Create New Template
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-blue-50 dark:bg-blue-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Templates</p>
          <p className="text-2xl font-bold text-blue-600">{templates.length}</p>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Uses</p>
          <p className="text-2xl font-bold text-green-600">
            {templates.reduce((sum, t) => sum + t.uses, 0)}
          </p>
        </div>
        <div className="card bg-purple-50 dark:bg-purple-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">Most Used</p>
          <p className="text-2xl font-bold text-purple-600">PI Template</p>
        </div>
        <div className="card bg-orange-50 dark:bg-orange-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
          <p className="text-2xl font-bold text-orange-600">Today</p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="card hover:shadow-xl transition-shadow">
            {/* Icon */}
            <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FaFileAlt className="text-3xl text-primary-600" />
            </div>

            {/* Info */}
            <h3 className="text-lg font-bold mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {template.description}
            </p>

            {/* Meta */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <span className="font-medium">{template.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Format:</span>
                <span className="font-medium">{template.format}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Uses:</span>
                <span className="font-medium">{template.uses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Modified:</span>
                <span className="font-medium">{template.lastModified}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handlePreview(template)}
                className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                title="Preview"
              >
                <FaEye />
                <span>Preview</span>
              </button>
              <button
                onClick={() => handleEdit(template)}
                className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                title="Edit"
              >
                <FaEdit />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDownload(template)}
                className="btn-primary text-sm py-2 px-3"
                title="Download"
              >
                <FaDownload />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DocumentTemplates
