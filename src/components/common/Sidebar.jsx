import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaHome,
  FaUsers,
  FaChartLine,
  FaCog,
  FaBox,
  FaFileAlt,
  FaTruck,
  FaPalette,
  FaMoneyBill,
  FaClipboardCheck,
  FaChevronRight,
  FaHeart,
  FaFileInvoiceDollar,
  FaSignOutAlt,
} from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import { useDispatch } from 'react-redux'
import { logout } from '@/features/auth/authSlice'
import buyerNavItems from '@/constants/buyerNavItems'
import sellerNavItems from '@/constants/sellerNavItems'

const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const locationSearch = new URLSearchParams(location.search)
  const currentBuyerView = locationSearch.get('view') || ''

  const formatTarget = (target) => {
    if (!target) return undefined
    if (typeof target === 'string') return target
    return {
      pathname: target.pathname,
      search: target.search,
    }
  }

  const deriveActivePath = (target) => {
    if (!target) return ''
    if (typeof target === 'string') return target
    return target.pathname || ''
  }

  const menuItems = {
    buyer: buyerNavItems.map((item) => {
      const target = item.sidebarTo || item.overlayTo
      return {
        id: item.id,
        icon: item.icon,
        label: item.label,
        to: formatTarget(target),
        activePath: deriveActivePath(target),
        view: item.view,
      }
    }),
    seller: sellerNavItems.map((item) => {
      const target = item.sidebarTo || item.overlayTo
      return {
        id: item.id,
        icon: item.icon,
        label: item.label,
        to: formatTarget(target),
        activePath: deriveActivePath(target),
        view: item.view,
      }
    }),
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

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

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
          const to = item.to || item.path
          const activePath = item.activePath || (typeof to === 'string' ? to : to?.pathname)
          const isBuyerRole = user?.role === 'buyer'
          const isBuyerNav = isBuyerRole && item.view
          let isActive = false

          if (isBuyerNav) {
            isActive = location.pathname === '/buyer' && currentBuyerView === item.view
          } else if (isBuyerRole && location.pathname === '/buyer') {
            isActive = !currentBuyerView && activePath === '/buyer'
          } else if (activePath) {
            isActive = location.pathname === activePath
          }

          return (
            <Link
              key={item.id || activePath || item.label}
              to={to}
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
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
