 import { FaMoon, FaSun } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Toggle Circle */}
      <motion.div
        layout
        className="absolute top-1 w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-md flex items-center justify-center"
        animate={{
          x: isDark ? 28 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? (
          <FaMoon className="text-yellow-400 text-xs" />
        ) : (
          <FaSun className="text-yellow-500 text-xs" />
        )}
      </motion.div>

      {/* Background Icons */}
      <div className="flex items-center justify-between px-1">
        <FaSun className={`text-xs transition-opacity ${isDark ? 'opacity-50' : 'opacity-100'} text-yellow-500`} />
        <FaMoon className={`text-xs transition-opacity ${isDark ? 'opacity-100' : 'opacity-50'} text-blue-400`} />
      </div>
    </motion.button>
  )
}

// Alternative Toggle Button Style
export const ThemeToggleButton = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <FaSun className="text-yellow-400 text-xl" />
        ) : (
          <FaMoon className="text-gray-700 text-xl" />
        )}
      </motion.div>
    </motion.button>
  )
}

export default ThemeToggle
