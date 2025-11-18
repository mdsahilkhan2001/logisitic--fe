 import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaHome, FaUsers, FaChartLine, FaCog, FaBox, 
  FaFileAlt, FaTruck, FaPalette, FaMoneyBill,
  FaClipboardCheck, FaChevronRight
} from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'

const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()

  const menuItems = {
    buyer: [
      { path: '/buyer', icon: FaHome, label: 'Dashboard' },
      { path: '/buyer/orders', icon: FaBox, label: 'My Orders' },
      { path: '/buyer/documents', icon: FaFileAlt, label: 'Documents' },
      { path: '/buyer/shipments', icon: FaTruck, label: 'Track Shipment' },
    ],
    salesman: [
      { path: '/salesman', icon: FaHome, label: 'Dashboard' },
      { path: '/salesman/leads', icon: FaUsers, label: 'Leads' },
      { path: '/salesman/costing', icon: FaMoneyBill, label: 'Costing' },
      { path: '/salesman/generate-pi', icon: FaFileAlt, label: 'Generate PI' },
      { path: '/salesman/reports', icon: FaChartLine, label: 'Reports' },
    ],
    designer: [
      { path: '/designer', icon: FaHome, label: 'Dashboard' },
      { path: '/designer/orders', icon: FaBox, label: 'Assigned Orders' },
      { path: '/designer/upload', icon: FaPalette, label: 'Upload Design' },
      { path: '/designer/timeline', icon: FaChartLine, label: 'Timeline' },
    ],
    admin: [
      { path: '/admin', icon: FaHome, label: 'Dashboard' },
      { path: '/admin/crm', icon: FaClipboardCheck, label: 'CRM Board' },
      { path: '/admin/users', icon: FaUsers, label: 'Users' },
      { path: '/admin/analytics', icon: FaChartLine, label: 'Analytics' },
      { path: '/admin/documents', icon: FaCog, label: 'Settings' },
    ],
  }

  const currentMenu = menuItems[user?.role] || []

  return (
    <aside className="w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border min-h-screen flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200 dark:border-dark-border">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-primary-600">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              {user?.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.role} Panel
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {currentMenu.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative group"
            >
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                    : 'hover:bg-gray-100 dark:hover:bg-dark-bg text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon className={`text-xl ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                <span className="font-medium flex-1">{item.label}</span>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <FaChevronRight className="text-sm" />
                  </motion.div>
                )}
              </motion.div>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-border">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-4 rounded-lg">
          <p className="text-sm font-semibold mb-1">Need Help?</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Contact support for assistance
          </p>
          <button className="w-full text-xs py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition">
            Get Support
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
