import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaShoppingBag, FaShippingFast, FaCheckCircle, FaUsers } from 'react-icons/fa'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import BuyerDashboard from '../components/buyer/BuyerDashboard'
import { useAuth } from '@/hooks/useAuth'

const HomePage = () => {
  const { isAuthenticated, user } = useAuth()
  const isBuyer = isAuthenticated && user?.role === 'buyer'
  const [searchParams, setSearchParams] = useSearchParams()
  const viewMode = searchParams.get('view')
  const showBuyerDashboard = isBuyer && viewMode === 'dashboard'

  useEffect(() => {
    if (viewMode === 'dashboard' && !isBuyer) {
      setSearchParams({}, { replace: true })
    }
  }, [viewMode, isBuyer, setSearchParams])

  const handleExitDashboard = () => {
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {showBuyerDashboard ? (
          <div className="bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Buyer Dashboard</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Curated view for {user?.username || 'buyer'}</p>
                </div>
                <button
                  onClick={handleExitDashboard}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Back to home
                </button>
              </div>
            </div>
            <BuyerDashboard />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 px-4">
              <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                      Premium Wholesale Garment Exports
                    </h1>
                    <p className="text-xl mb-8 text-blue-100">
                      Your trusted partner for quality apparel manufacturing and global distribution
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/products" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition text-center">
                        Browse Products
                      </Link>
                      <Link to="/contact" className="border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition text-center">
                        Get Quote
                      </Link>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hidden lg:block"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80"
                      alt="Garments"
                      className="rounded-lg shadow-2xl"
                    />
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
              <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center mb-16">Why Choose Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { icon: FaShoppingBag, title: 'Quality Products', desc: 'Premium garments' },
                    { icon: FaShippingFast, title: 'Fast Delivery', desc: 'Global shipping' },
                    { icon: FaCheckCircle, title: 'Quality Assurance', desc: 'Rigorous QC' },
                    { icon: FaUsers, title: 'Expert Team', desc: 'Professionals' },
                  ].map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="card text-center"
                      >
                        <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="text-3xl text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
