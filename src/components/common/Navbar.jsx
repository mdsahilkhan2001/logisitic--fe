 import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaShoppingBag, FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../../hooks/useAuth'
import { useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userMenuRef = useRef(null)

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/products', label: 'Products' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDashboardRedirect = () => {
    if (user?.role) {
      navigate(`/${user.role}`)
      setShowUserMenu(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
    setShowUserMenu(false)
  }

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
                className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* User Info Display */}
                <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.username}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 capitalize">
                    {user?.role} Account
                  </p>
                </div>

                {/* User Menu Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                      >
                        {/* User Info in Dropdown */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold">{user?.username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {user?.role} Account
                          </p>
                        </div>

                        {/* Menu Items */}
                        <button
                          onClick={handleDashboardRedirect}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center space-x-2 transition"
                        >
                          <FaCog />
                          <span>Dashboard</span>
                        </button>

                        <button
                          onClick={() => {
                            navigate('/profile')
                            setShowUserMenu(false)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center space-x-2 transition"
                        >
                          <FaUser />
                          <span>Profile</span>
                        </button>

                        <hr className="my-2 border-gray-200 dark:border-gray-700" />

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm flex items-center space-x-2 text-red-600 transition"
                        >
                          <FaSignOutAlt />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dashboard Button */}
                <button
                  onClick={handleDashboardRedirect}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
                >
                  Dashboard
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <ThemeToggle />
            {isAuthenticated && (
              <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                <span className="font-medium capitalize">{user?.role}</span>
              </div>
            )}
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
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mx-4 mb-3">
                        <p className="text-sm font-medium">Signed in as</p>
                        <p className="text-lg font-bold text-blue-600">{user?.username}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                          {user?.role} Account
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          handleDashboardRedirect()
                          setIsMenuOpen(false)
                        }}
                        className="w-full mx-4 mb-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition"
                        style={{ width: 'calc(100% - 2rem)' }}
                      >
                        Go to Dashboard
                      </button>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsMenuOpen(false)
                        }}
                        className="w-full mx-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
                        style={{ width: 'calc(100% - 2rem)' }}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg mx-4 text-center font-medium transition"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
