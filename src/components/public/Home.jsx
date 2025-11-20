import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaShoppingBag,
  FaShippingFast,
  FaCheckCircle,
  FaUsers,
  FaClipboardCheck,
  FaHeart,
  FaFileAlt,
  FaUserCircle,
} from 'react-icons/fa'
import BuyerDashboard from '@/components/buyer/BuyerDashboard'
import MyOrders from '@/components/buyer/MyOrders'
import Wishlist from '@/components/buyer/Wishlist'
import TrackShipment from '@/components/buyer/TrackShipment'
import DocumentsView from '@/components/buyer/DocumentsView'
import ProfilePage from '@/pages/ProfilePage'
import { useAuth } from '@/hooks/useAuth'
import { useAuthModal } from '@/context/AuthModalContext'
import buyerNavItems from '@/constants/buyerNavItems'

const FEATURES = [
  { icon: FaShoppingBag, title: 'Quality Products', desc: 'Premium garments delivered globally' },
  { icon: FaShippingFast, title: 'Fast Delivery', desc: 'Streamlined logistics for every order' },
  { icon: FaCheckCircle, title: 'Quality Assurance', desc: 'Rigorous QC across each stage' },
  { icon: FaUsers, title: 'Expert Team', desc: 'Dedicated merchandising specialists' },
]

const BUYER_VIEWS = [
  { id: 'dashboard', label: 'Dashboard', icon: FaClipboardCheck, component: BuyerDashboard },
  { id: 'orders', label: 'Orders', icon: FaShoppingBag, component: MyOrders },
  { id: 'wishlist', label: 'Wishlist', icon: FaHeart, component: Wishlist },
  { id: 'trackorder', label: 'Track Order', icon: FaShippingFast, component: TrackShipment },
  { id: 'documents', label: 'Documents', icon: FaFileAlt, component: DocumentsView },
  { id: 'profile', label: 'Profile', icon: FaUserCircle, component: ProfilePage },
]
const BUYER_VIEW_IDS = BUYER_VIEWS.map((view) => view.id)
const VIEW_ALIAS_MAP = {
  dashboard: 'dashboard',
  dash: 'dashboard',
  orders: 'orders',
  wishlist: 'wishlist',
  'track-order': 'trackorder',
  trackorder: 'trackorder',
  tracking: 'trackorder',
  'track-orders': 'trackorder',
  documents: 'documents',
  'download-document': 'documents',
  'download-documents': 'documents',
  'downloaddocuments': 'documents',
  'download-documentation': 'documents',
  profile: 'profile',
}

const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const isBuyer = isAuthenticated && user?.role === 'buyer'
  const [searchParams, setSearchParams] = useSearchParams()
  const rawViewParam = searchParams.get('view') || ''
  const aliasKey = rawViewParam.trim().toLowerCase().replace(/\s+/g, '-')
  const normalizedView = VIEW_ALIAS_MAP[aliasKey] || aliasKey
  const hasValidView = BUYER_VIEW_IDS.includes(normalizedView)
  const showBuyerView = isBuyer && hasValidView
  const navigate = useNavigate()
  const { requireAuth } = useAuthModal()
  const activeViewConfig = BUYER_VIEWS.find((view) => view.id === (hasValidView ? normalizedView : 'dashboard')) || BUYER_VIEWS[0]
  const ActiveComponent = activeViewConfig.component

  useEffect(() => {
    if (!isBuyer && rawViewParam) {
      setSearchParams({}, { replace: true })
    }
  }, [rawViewParam, isBuyer, setSearchParams])

  useEffect(() => {
    if (isBuyer && rawViewParam && !hasValidView) {
      setSearchParams({ view: 'dashboard' }, { replace: true })
    }
  }, [hasValidView, isBuyer, rawViewParam, setSearchParams])

  const handleExitDashboard = () => {
    setSearchParams({}, { replace: true })
  }

  const handleTabChange = (viewId) => {
    setSearchParams({ view: viewId }, { replace: true })
  }

  const handleBuyerAction = (action) => {
    if (!isAuthenticated) {
      requireAuth()
      return
    }

    if (!isBuyer) {
      navigate('/unauthorized')
      return
    }

    if (action.view) {
      handleTabChange(action.view)
      return
    }

    if (action.overlayTo) {
      navigate(action.overlayTo)
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {showBuyerView ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Buyer Workspace</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeViewConfig.label} for {user?.username || 'buyer'}
              </p>
            </div>
            <button
              onClick={handleExitDashboard}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Back to home
            </button>
          </div>
          <div className="mt-6">
            <div className="flex flex-wrap gap-3">
              {BUYER_VIEWS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeViewConfig.id === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                      isActive
                        ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-600/20'
                        : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:text-primary-600'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span className="font-semibold text-sm sm:text-base">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <ActiveComponent />
            </div>
          </div>
        </div>
      ) : (
        <>
          <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                    Premium Wholesale Garment Exports
                  </h1>
                  <p className="text-xl mb-8 text-blue-100">
                    Your trusted partner for quality apparel manufacturing and global distribution
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/products"
                      className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition text-center"
                    >
                      Browse Products
                    </Link>
                    <Link
                      to="/contact"
                      className="border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition text-center"
                    >
                      Get Quote
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="hidden lg:block"
                >
                  <img
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80"
                    alt="Garments"
                    className="rounded-lg shadow-2xl"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          <section className="py-20 px-4 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">Why Choose Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {FEATURES.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="card text-center"
                    >
                      <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="text-3xl text-primary-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Buyer quick actions</h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Sign in as a buyer to unlock ordering workflows directly from this hub.
                  </p>
                </div>
                {!isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => requireAuth()}
                    className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition"
                  >
                    Login to continue
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {buyerNavItems
                  .filter((action) => Boolean(action.view))
                  .map((action) => {
                    const Icon = action.icon
                    const buttonLabel = isBuyer ? 'Open' : (isAuthenticated ? 'Buyer only' : 'Login required')

                    return (
                      <motion.div
                        key={action.id}
                        whileHover={{ y: -4 }}
                        className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 mb-4">
                          <Icon className="text-xl" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{action.label}</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                        <button
                          type="button"
                          onClick={() => handleBuyerAction(action)}
                          className="mt-6 inline-flex items-center rounded-lg bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                          disabled={isAuthenticated && !isBuyer}
                        >
                          {buttonLabel}
                        </button>
                      </motion.div>
                    )
                  })}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default Home
