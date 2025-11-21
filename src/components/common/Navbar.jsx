import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaChevronDown,
  FaUserCircle,
  FaBell,
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

import ThemeToggle from './ThemeToggle'
import { useAuth } from '../../hooks/useAuth'
import { useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'

import { useAuthModal } from '../../context/AuthModalContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const { isAuthenticated, user } = useAuth()
  const { openLogin, openRegister, requireAuth } = useAuthModal()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isBuyer = isAuthenticated && user?.role === 'buyer'
  const isSeller = isAuthenticated && user?.role === 'seller'

  // Scroll detection for navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isProfileOpen && !e.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileOpen])

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/products', label: 'Products', requiresAuth: true },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
  ]

  const openBuyerDashboard = () => {
    navigate("/buyer?view=dashboard")
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }

  const openSellerDashboard = () => {
    navigate("/salesman")
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }

  const handleProfileNavigate = () => {
    navigate(isBuyer ? '/buyer?view=profile' : '/profile')
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' 
          : 'bg-white dark:bg-gray-900 shadow-sm'
      } border-b border-gray-200 dark:border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg shadow-md"
            >
              <FaShoppingBag className="text-lg text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                GarmentExport
              </span>
              <span className="hidden sm:block text-[9px] text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase">
                Premium Quality
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => {
                  if (link.requiresAuth && !isAuthenticated) {
                    e.preventDefault()
                    requireAuth()
                  }
                }}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary-600 group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex items-center space-x-3">

            {/* Notifications */}
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Notifications"
              >
                <FaBell className="text-gray-600 dark:text-gray-300" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                  3
                </span>
              </motion.button>
            )}

            <ThemeToggle />

            {/* IF LOGGED IN - Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative profile-dropdown">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                    {user?.username ? (
                      <span className="font-semibold text-white text-xs">
                        {user.username.slice(0, 2).toUpperCase()}
                      </span>
                    ) : (
                      <FaUserCircle className="text-base text-white" />
                    )}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                      {user?.first_name || user?.username}
                    </p>
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                      {isBuyer ? "Buyer" : "Seller"}
                    </p>
                  </div>
                  <FaChevronDown className={`text-gray-500 dark:text-gray-400 text-xs transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.first_name || user?.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
                      </div>
                      
                      <div className="p-2">
                        <button
                          onClick={handleProfileNavigate}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          👤 View Profile
                        </button>
                        <button
                          onClick={isBuyer ? openBuyerDashboard : openSellerDashboard}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          📊 Dashboard
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          ⚙️ Settings
                        </button>
                      </div>

                      <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 rounded-md bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2"
                        >
                          <FaSignOutAlt /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openLogin}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary-600 text-primary-600 dark:text-primary-400 font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-sm"
                >
                  <FaSignInAlt /> Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openRegister}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-md transition-all text-sm"
                >
                  <FaUserPlus /> Register
                </motion.button>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Notifications"
              >
                <FaBell className="text-gray-600 dark:text-gray-300 text-sm" />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-semibold">
                  3
                </span>
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => {
                    if (link.requiresAuth && !isAuthenticated) {
                      e.preventDefault()
                      requireAuth()
                    }
                    setIsMenuOpen(false)
                  }}
                  className="block px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium text-gray-700 dark:text-gray-300"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-2">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.first_name || user?.username}</p>
                      <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">{isBuyer ? "Buyer" : "Seller"} Account</p>
                    </div>
                    
                    <button
                      onClick={handleProfileNavigate}
                      className="w-full text-left px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      👤 Profile
                    </button>
                    <button
                      onClick={isBuyer ? openBuyerDashboard : openSellerDashboard}
                      className="w-full text-left px-4 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm"
                    >
                      📊 Open Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        openLogin()
                        setIsMenuOpen(false)
                      }}
                      className="w-full border border-primary-600 text-primary-600 px-4 py-2.5 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-sm"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        openRegister()
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-primary-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar