import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FaUser, FaLock, FaEye, FaEyeSlash, FaShoppingBag, FaUserTag, FaTimes } from 'react-icons/fa'

import { useLoginMutation } from '@/features/auth/authApiSlice'
import { setCredentials } from '@/features/auth/authSlice'

const showWelcomeToast = (user) => {
  const displayName = user?.first_name || user?.username || 'there'
  const roleLabel = user?.role ? user.role.replace(/_/g, ' ') : 'user'

  toast.custom(
    (t) => (
      <div
        className={`pointer-events-auto w-[320px] overflow-hidden rounded-2xl border border-emerald-200 bg-white text-gray-900 shadow-xl shadow-emerald-500/20 transition-all duration-300 dark:bg-gray-900 dark:text-gray-100 dark:border-emerald-400/40 ${
          t.visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      >
        <div className="flex items-start gap-3 px-4 pt-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40">
            <FaUser className="text-lg" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold tracking-wide uppercase text-emerald-600 dark:text-emerald-400">Logged in</p>
            <p className="text-base font-semibold">Welcome back, {displayName}!</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">You are signed in as <span className="font-semibold capitalize">{roleLabel}</span>.</p>
          </div>
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="mt-1 text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Dismiss notification"
          >
            <FaTimes />
          </button>
        </div>
        <div className="mt-4 h-1 w-full bg-emerald-100 dark:bg-emerald-950/50">
          <div className="h-1 bg-emerald-500 animate-toast-shrink origin-left" />
        </div>
      </div>
    ),
    { duration: 2800 },
  )
}

const Login = ({ onSuccess, onRegister, isModal = false }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [login, { isLoading, error }] = useLoginMutation()

  const [formData, setFormData] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const quickLogins = [
    { username: 'buyer', role: 'Buyer', icon: '🛒', color: 'bg-blue-500 hover:bg-blue-600', description: 'View & track orders' },
    { username: 'salesman', role: 'Salesman', icon: '💼', color: 'bg-green-500 hover:bg-green-600', description: 'Manage leads & sales' },
    { username: 'designer', role: 'Designer', icon: '🎨', color: 'bg-purple-500 hover:bg-purple-600', description: 'Upload designs' },
    { username: 'admin', role: 'Admin', icon: '👑', color: 'bg-red-500 hover:bg-red-600', description: 'Full system access' },
  ]

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const result = await login(formData).unwrap()
      dispatch(setCredentials(result))

      showWelcomeToast(result.user)

      const role = result.user?.role
      const fromLocation = location.state?.from
      const fallbackRedirect = role ? (role === 'buyer' ? '/' : `/${role}`) : '/dashboard'
      const redirectTo = fromLocation && fromLocation !== '/login' ? fromLocation : fallbackRedirect

      setTimeout(() => {
        navigate(redirectTo)
        onSuccess?.(result.user)
      }, 400)
    } catch (err) {
      const message =
        err?.data?.detail ||
        err?.data?.message ||
        (err?.status === 401 ? 'Invalid username or password' : '') ||
        (err?.status === 500 ? 'Server error. Please try again later.' : '') ||
        (err?.status === 'FETCH_ERROR' ? 'Cannot connect to server. Please check if backend is running.' : '') ||
        'Login failed. Please try again.'

      toast.error(message, {
        duration: 5000,
        style: { background: '#ef4444', color: '#fff', fontWeight: 'bold' },
      })
    }
  }

  const handleQuickLogin = async (username) => {
    try {
      const result = await login({ username, password: 'password' }).unwrap()
      dispatch(setCredentials(result))

      showWelcomeToast(result.user)

      const fromLocation = location.state?.from
      const role = result.user?.role
      const fallbackRedirect = role ? (role === 'buyer' ? '/' : `/${role}`) : '/dashboard'
      const redirectTo = fromLocation && fromLocation !== '/login' ? fromLocation : fallbackRedirect

      setTimeout(() => {
        navigate(redirectTo)
        onSuccess?.(result.user)
      }, 400)
    } catch (err) {
      toast.error('Quick login failed. User may not exist in database.')
    }
  }

  useEffect(() => {
    if (error) {
      console.error('Login API error:', error)
    }
  }, [error])

  const handleRegisterNavigate = (event) => {
    if (onRegister) {
      event.preventDefault()
      onRegister()
    }
  }

  const headingSpacing = isModal ? 'mb-6' : 'mb-8'
  const cardPadding = isModal ? 'p-6' : 'p-8'
  const quickGridClass = isModal ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'grid grid-cols-1 gap-4'
  const quickButtonPadding = isModal ? 'p-3' : 'p-4'
  const footerMargin = isModal ? 'mt-4' : 'mt-6'

  const content = (
    <>
      <div className={`text-center ${headingSpacing}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <FaShoppingBag className="text-3xl text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
        <p className="text-gray-600 dark:text-gray-400">Sign in to your account to continue</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl ${cardPadding}`}>
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded text-xs">
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Backend URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}
            </p>
          </div>
        </div>

        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl ${cardPadding}`}>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <FaUserTag className="text-blue-600 text-xl" />
            <h2 className="text-2xl font-bold">Quick Login (Demo)</h2>
          </div>

          <div className={quickGridClass}>
            {quickLogins.map((option) => (
              <button
                key={option.username}
                onClick={() => handleQuickLogin(option.username)}
                disabled={isLoading}
                className={`${option.color} text-white ${quickButtonPadding} rounded-lg font-medium transition text-left flex items-center space-x-4 disabled:opacity-50`}
              >
                <span className="text-3xl">{option.icon}</span>
                <div>
                  <p className="text-lg font-bold">Login as {option.role}</p>
                  <p className="text-sm opacity-90">{option.description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-400 text-center">
            <strong>Test Credentials:</strong><br />
            Username: buyer/salesman/designer/admin<br />
            Password: password
          </div>
        </div>
      </div>

      <p className={`text-center text-sm text-gray-600 dark:text-gray-400 ${footerMargin}`}>
        Don't have an account?{' '}
        {onRegister ? (
          <button type="button" onClick={handleRegisterNavigate} className="text-blue-600 hover:text-blue-700 font-medium">
            Register here
          </button>
        ) : (
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Register here
          </Link>
        )}
      </p>
    </>
  )

  const animatedContent = (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={isModal ? 'space-y-6' : 'w-full max-w-5xl'}>
      {content}
    </motion.div>
  )

  if (isModal) {
    return animatedContent
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      {animatedContent}
    </div>
  )
}

export default Login
