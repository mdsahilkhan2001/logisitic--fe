
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLock, FaArrowLeft } from 'react-icons/fa'

const Unauthorized = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="bg-red-100 dark:bg-red-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaLock className="text-5xl text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center space-x-2 btn-secondary"
          >
            <FaArrowLeft />
            <span>Go Back</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center space-x-2 btn-primary"
          >
            <span>Go to Home</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default Unauthorized
