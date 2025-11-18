import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome } from 'react-icons/fa'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-4 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 btn-primary"
        >
          <FaHome />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound
