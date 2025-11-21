 import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FaUser, FaLock, FaEye, FaEyeSlash, FaTimes, FaShippingFast, FaGlobe } from 'react-icons/fa'

import { useLoginMutation } from '@/features/auth/authApiSlice'
import { setCredentials } from '@/features/auth/authSlice'

const showWelcomeToast = (user) => {
  const displayName = user?.first_name || user?.username || 'there'
  const roleLabel = user?.role ? user.role.replace(/_/g, ' ') : 'user'

  toast.custom(
    (t) => (
      <div
        className={`pointer-events-auto w-[350px] overflow-hidden rounded-2xl border border-emerald-200 bg-white text-gray-900 shadow-2xl shadow-emerald-500/30 transition-all duration-300 dark:bg-gray-900 dark:text-gray-100 dark:border-emerald-400/40 ${
          t.visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      >
        <div className="flex items-start gap-3 px-5 pt-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50">
            <FaUser className="text-lg" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
              Authentication Success
            </p>
            <p className="text-lg font-bold mt-0.5">Welcome, {displayName}!</p>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
              Logged in as <span className="font-semibold capitalize text-emerald-600 dark:text-emerald-400">{roleLabel}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Dismiss notification"
          >
            <FaTimes />
          </button>
        </div>
        <div className="mt-5 h-1.5 w-full bg-emerald-100 dark:bg-emerald-950/50">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 animate-toast-shrink origin-left" />
        </div>
      </div>
    ),
    { duration: 3000 }
  )
}

const Login = ({ onSuccess, onRegister, isModal = false }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [login, { isLoading, error }] = useLoginMutation()

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const result = await login({
        username: formData.username,
        password: formData.password
      }).unwrap()

      dispatch(setCredentials(result))

      if (rememberMe) {
        localStorage.setItem('rememberUser', formData.username)
      }

      showWelcomeToast(result.user)

      const role = result.user?.role
      const fromLocation = location.state?.from
      const fallbackRedirect = role ? (role === 'buyer' ? '/' : `/${role}`) : '/dashboard'
      const redirectTo = fromLocation && fromLocation !== '/login' ? fromLocation : fallbackRedirect

      setTimeout(() => {
        navigate(redirectTo)
        onSuccess?.(result.user)
      }, 500)
    } catch (err) {
      const message =
        err?.data?.detail ||
        err?.data?.message ||
        (err?.status === 401 ? 'Invalid credentials. Please check your username and password.' : '') ||
        (err?.status === 500 ? 'Server error. Please contact support.' : '') ||
        (err?.status === 'FETCH_ERROR' ? 'Unable to connect to server. Please try again.' : '') ||
        'Authentication failed. Please try again.'

      toast.error(message, {
        duration: 4000,
        style: {
          background: '#dc2626',
          color: '#fff',
          fontWeight: '600',
          padding: '16px',
          borderRadius: '12px'
        }
      })
    }
  }

  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberUser')
    if (savedUsername) {
      setFormData((prev) => ({ ...prev, username: savedUsername }))
      setRememberMe(true)
    }
  }, [])

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

  const content = (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden min-h-[600px]">
      {/* Left Brand Section */}
      <div className="hidden lg:flex lg:col-span-2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHptMTYgMTZjMCAyLjIxLTEuNzkgNC00IDRzLTQtMS43OS00LTQgMS43OS00IDQtNCA0IDEuNzkgNCA0em0tNCAxNmMwIDIuMjEtMS43OSA0LTQgNHMtNC0xLjc5LTQtNCAxLjc5LTQgNC00IDQgMS43OSA0IDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <FaShippingFast className="text-4xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">GarmentExport</h1>
              <p className="text-blue-100 text-sm">Global Trade Platform</p>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg mt-1">
                <FaGlobe className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Worldwide Distribution</h3>
                <p className="text-blue-100 text-sm mt-1">Export premium garments to over 50+ countries</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg mt-1">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Secure Platform</h3>
                <p className="text-blue-100 text-sm mt-1">Enterprise-grade security for your business</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg mt-1">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Real-time Processing</h3>
                <p className="text-blue-100 text-sm mt-1">Instant order tracking and management</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-blue-100 text-sm">
          <p>© 2025 GarmentExport. All rights reserved.</p>
        </div>
      </div>

      {/* Right Login Form Section */}
      <div className="lg:col-span-3 p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="bg-blue-600 p-3 rounded-xl">
              <FaShippingFast className="text-3xl text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GarmentExport</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Global Trade Platform</p>
            </div>
          </div>

          {/* Page Title */}
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-gray-600 dark:text-gray-400 text-base">Sign in to access your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  id="username"
                  type="text"
                  name="username"
                  className="w-full px-4 py-3.5 pl-11 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  autoComplete="username"
                  aria-label="Username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="w-full px-4 py-3.5 pl-11 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  aria-label="Remember me"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition select-none">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              {onRegister ? (
                <button
                  type="button"
                  onClick={handleRegisterNavigate}
                  className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                >
                  Create Account
                </button>
              ) : (
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                >
                  Create Account
                </Link>
              )}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed">
              Protected by enterprise-grade encryption. By signing in, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const animatedContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={isModal ? 'space-y-6' : 'w-full max-w-6xl'}
    >
      {content}
    </motion.div>
  )

  if (isModal) {
    return animatedContent
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 px-4 py-8">
      {animatedContent}
    </div>
  )
}

export default Login
