 import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '../../features/auth/authApiSlice'
import { setCredentials } from '../../features/auth/authSlice'
import toast from 'react-hot-toast'
import { FaUser, FaLock, FaEye, FaEyeSlash, FaShoppingBag, FaUserTag } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading, error }] = useLoginMutation()
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  // Quick login options (for demo/testing)
  const quickLogins = [
    { 
      username: 'buyer', 
      role: 'Buyer', 
      icon: '🛒', 
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'View & track orders'
    },
    { 
      username: 'salesman', 
      role: 'Salesman', 
      icon: '💼', 
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Manage leads & sales'
    },
    { 
      username: 'designer', 
      role: 'Designer', 
      icon: '🎨', 
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'Upload designs'
    },
    { 
      username: 'admin', 
      role: 'Admin', 
      icon: '👑', 
      color: 'bg-red-500 hover:bg-red-600',
      description: 'Full system access'
    },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      console.log('Attempting login with:', { username: formData.username })
      
      const result = await login(formData).unwrap()
      
      console.log('Login successful:', result)
      
      // Store credentials in Redux
      dispatch(setCredentials(result))
      
      // Show success message with user role
      toast.success(`✅ Welcome ${result.user?.username}! Logged in as ${result.user?.role?.toUpperCase()}`, {
        duration: 4000,
        style: {
          background: '#10b981',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '16px',
        },
      })
      
      // Redirect based on role
      const role = result.user?.role
      if (role) {
        setTimeout(() => {
          navigate(`/${role}`)
        }, 500)
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      
      let errorMessage = 'Login failed. Please try again.'
      
      if (error?.data?.detail) {
        errorMessage = error.data.detail
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.status === 401) {
        errorMessage = 'Invalid username or password'
      } else if (error?.status === 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (error?.status === 'FETCH_ERROR') {
        errorMessage = 'Cannot connect to server. Please check if backend is running.'
      }
      
      toast.error(errorMessage, {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: 'bold',
        },
      })
    }
  }

  const handleQuickLogin = async (username) => {
    try {
      const result = await login({ username, password: 'password' }).unwrap()
      
      dispatch(setCredentials(result))
      
      toast.success(`✅ Logged in as ${result.user?.role?.toUpperCase()}!`, {
        duration: 4000,
        style: {
          background: '#10b981',
          color: '#fff',
          fontWeight: 'bold',
        },
      })
      
      setTimeout(() => {
        navigate(`/${result.user?.role}`)
      }, 500)
    } catch (error) {
      console.error('Quick login error:', error)
      toast.error('Quick login failed. User may not exist in database.')
    }
  }

  // Show error if API call fails
  useEffect(() => {
    if (error) {
      console.error('API Error:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <FaShoppingBag className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Login Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
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
                    className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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

            {/* Backend Status */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded text-xs">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Backend URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}
              </p>
            </div>
          </div>

          {/* Quick Login */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <FaUserTag className="text-blue-600 text-xl" />
              <h2 className="text-2xl font-bold">Quick Login (Demo)</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {quickLogins.map((option) => (
                <button
                  key={option.username}
                  onClick={() => handleQuickLogin(option.username)}
                  disabled={isLoading}
                  className={`${option.color} text-white p-4 rounded-lg font-medium transition text-left flex items-center space-x-4 disabled:opacity-50`}
                >
                  <span className="text-4xl">{option.icon}</span>
                  <div>
                    <p className="text-lg font-bold">Login as {option.role}</p>
                    <p className="text-sm opacity-90">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-400 text-center">
                <strong>Test Credentials:</strong><br/>
                Username: buyer/salesman/designer/admin<br/>
                Password: password
              </p>
            </div>
          </div>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Login
