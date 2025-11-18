import { motion } from 'framer-motion'
import { FaShoppingBag, FaSpinner } from 'react-icons/fa'

const Loader = ({ fullScreen = true, size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-5xl',
    large: 'text-7xl',
  }

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl',
  }

  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg'
    : 'flex items-center justify-center py-8'

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className="inline-block mb-4"
        >
          <FaShoppingBag className={`${sizeClasses[size]} text-primary-600`} />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 font-medium`}>
            {text}
          </p>
        </motion.div>

        {/* Loading Dots */}
        <div className="flex items-center justify-center space-x-2 mt-4">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.2
              }}
              className="w-2 h-2 bg-primary-600 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Spinner variant
export const Spinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  }

  return (
    <FaSpinner className={`${sizeClasses[size]} animate-spin text-primary-600 ${className}`} />
  )
}

// Inline loader
export const InlineLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Spinner size="small" />
      <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
    </div>
  )
}

// Skeleton loader
export const SkeletonLoader = ({ lines = 3 }) => {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(lines)].map((_, index) => (
        <div 
          key={index}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  )
}

export default Loader
