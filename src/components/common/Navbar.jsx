import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaSearch,
  FaAlignJustify,
  FaUserCircle,
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../../hooks/useAuth'
import { useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { useAuthModal } from '@/context/AuthModalContext'
import buyerNavItems from '@/constants/buyerNavItems'
import sellerNavItems from '@/constants/sellerNavItems'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDashboardOpen, setIsDashboardOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const { openLogin, openRegister, requireAuth } = useAuthModal()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isBuyer = isAuthenticated && user?.role === 'buyer'
  const isSeller = isAuthenticated && user?.role === 'seller'

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/products', label: 'Products', requiresAuth: true },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
  ]

  const buyerDashboardMenuItem = buyerNavItems.find((item) => item.id === 'dashboard')
  const sellerDashboardMenuItem = sellerNavItems.find((item) => item.id === 'overview')

  const handleDashboardNavigation = (item) => {
    const target = item?.overlayTo || item?.sidebarTo || item?.to
    setIsDashboardOpen(false)
    setIsMenuOpen(false)
    if (!target) {
      return
    }

    navigate(target)
  }

  const handleProfileNavigate = () => {
    if (isBuyer) {
      navigate({ pathname: '/buyer', search: '?view=profile' })
    } else if (isSeller) {
      navigate('/profile')
    } else {
      navigate('/profile')
    }
    setIsDashboardOpen(false)
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    dispatch(logout())
    setIsDashboardOpen(false)
    setIsMenuOpen(false)
    navigate('/')
  }

  const showDashboardPanel = (isBuyer || isSeller) && isDashboardOpen
  const activeDashboardItems = isBuyer ? buyerNavItems : isSeller ? sellerNavItems : []
  const dashboardTitle = isBuyer ? 'Buyer Dashboard' : 'Seller Workspace'
  const dashboardSubtitle = isBuyer
    ? 'Quick access to your essentials'
    : 'Manage your catalog, leads, and orders in one place'
  const profileSubtitle = isBuyer ? 'View profile details' : 'Update your seller profile'
  const anonymousRoleLabel = isBuyer ? 'Buyer' : 'Seller'

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaShoppingBag className="text-2xl text-blue-600 group-hover:text-blue-700" />
            </motion.div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              GarmentExport
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => {
                  if (link.requiresAuth && !isAuthenticated) {
                    e.preventDefault()
                    requireAuth()
                    return
                  }
                  if (!link.requiresAuth && link.path === '/' && !isAuthenticated) {
                    setIsMenuOpen(false)
                  }
                  setIsDashboardOpen(false)
                }}
                className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search for products, brands and more"
                className="w-72 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
            <ThemeToggle />

            {isAuthenticated ? (
              isBuyer ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleProfileNavigate}
                    className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      {user?.profile_picture ? (
                        <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                      ) : user?.username ? (
                        <span className="text-sm font-semibold text-primary-600">
                          {user.username.slice(0, 2).toUpperCase()}
                        </span>
                      ) : (
                        <FaUserCircle className="text-xl text-primary-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold leading-tight">{user?.first_name || user?.username || 'Buyer'}</p>
                      <p className="text-xs text-gray-500 capitalize">View profile</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setIsDashboardOpen(true)}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 hover:bg-primary-700 text-white transition"
                    aria-label="Open dashboard"
                  >
                    <FaAlignJustify className="text-xl" />
                  </button>
                </div>
              ) : isSeller ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleProfileNavigate}
                    className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      {user?.profile_picture ? (
                        <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                      ) : user?.username ? (
                        <span className="text-sm font-semibold text-primary-600">
                          {user.username.slice(0, 2).toUpperCase()}
                        </span>
                      ) : (
                        <FaUserCircle className="text-xl text-primary-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold leading-tight">{user?.first_name || user?.username || 'Seller'}</p>
                      <p className="text-xs text-gray-500 capitalize">Manage profile</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setIsDashboardOpen(true)}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 hover:bg-primary-700 text-white transition"
                    aria-label="Open seller workspace"
                  >
                    <FaAlignJustify className="text-xl" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              )
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={openLogin}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white transition"
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </button>
                <button
                  onClick={openRegister}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary-600 text-primary-600 hover:bg-primary-50 transition"
                >
                  <FaUserPlus />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={(e) => {
                      if (link.requiresAuth && !isAuthenticated) {
                        e.preventDefault()
                        requireAuth()
                        return
                      }
                      setIsMenuOpen(false)
                      setIsDashboardOpen(false)
                    }}
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  {isAuthenticated ? (
                    isBuyer ? (
                      <div className="flex flex-col gap-3 px-4">
                        <button
                          onClick={() => {
                            handleProfileNavigate()
                            setIsMenuOpen(false)
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold transition hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <span>Profile</span>
                          <FaUserCircle className="text-lg" />
                        </button>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false)
                            if (buyerDashboardMenuItem) {
                              handleDashboardNavigation(buyerDashboardMenuItem)
                            } else {
                              setIsDashboardOpen(true)
                            }
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition"
                        >
                          <span>Open Dashboard</span>
                          <FaAlignJustify />
                        </button>
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsMenuOpen(false)
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                        >
                          <span>Logout</span>
                          <FaSignOutAlt />
                        </button>
                      </div>
                    ) : isSeller ? (
                      <div className="flex flex-col gap-3 px-4">
                        <button
                          onClick={() => {
                            handleProfileNavigate()
                            setIsMenuOpen(false)
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold transition hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <span>Profile</span>
                          <FaUserCircle className="text-lg" />
                        </button>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false)
                            if (sellerDashboardMenuItem) {
                              handleDashboardNavigation(sellerDashboardMenuItem)
                            } else {
                              setIsDashboardOpen(true)
                            }
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition"
                        >
                          <span>Open Workspace</span>
                          <FaAlignJustify />
                        </button>
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsMenuOpen(false)
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                        >
                          <span>Logout</span>
                          <FaSignOutAlt />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsMenuOpen(false)
                        }}
                        className="block w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg mx-4 text-center font-semibold transition"
                        style={{ width: 'calc(100% - 2rem)' }}
                      >
                        Logout
                      </button>
                    )
                  ) : (
                    <div className="flex flex-col gap-3 px-4">
                      <button
                        onClick={() => { openLogin(); setIsMenuOpen(false) }}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-semibold transition"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => { openRegister(); setIsMenuOpen(false) }}
                        className="w-full border border-primary-600 text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-lg font-semibold transition"
                      >
                        Register
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showDashboardPanel && (
          <motion.div
            key="role-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex justify-end"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsDashboardOpen(false)}
            ></motion.div>
            <motion.aside
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl border-l border-gray-200 dark:border-gray-800"
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{dashboardTitle}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{dashboardSubtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDashboardOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="px-6 pt-6">
                  <button
                    type="button"
                    onClick={handleProfileNavigate}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30 transition hover:from-primary-500 hover:to-primary-600"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
                      {user?.profile_picture ? (
                        <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                      ) : user?.username ? (
                        <span className="text-lg font-semibold">
                          {user.username.slice(0, 2).toUpperCase()}
                        </span>
                      ) : (
                        <FaUserCircle className="text-2xl" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-xs uppercase tracking-wide opacity-80">Signed in as</p>
                      <p className="text-lg font-semibold leading-tight">{user?.first_name || user?.username || anonymousRoleLabel}</p>
                      <p className="text-sm opacity-80">{profileSubtitle}</p>
                    </div>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2">
                  {activeDashboardItems
                    .filter((item) => item.id !== 'profile')
                    .map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleDashboardNavigation(item)}
                        className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 text-left hover:border-primary-500 hover:bg-primary-50/80 dark:hover:bg-primary-900/10 transition"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                          <Icon className="text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.aside>

          </motion.div>
        )}
      </AnimatePresence>
      {/* Removed Login/Register Modals */}
    </nav>
  )
}

export default Navbar
