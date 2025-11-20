import {
  FaBox,
  FaTruck,
  FaClock,
  FaDollarSign,
  FaArrowRight,
  FaStar,
  FaHeart,
  FaShoppingBag,
} from 'react-icons/fa'
import { useGetMyOrdersQuery } from '@/features/orders/ordersApiSlice'
import { useGetProductsQuery } from '@/features/catalog/catalogApiSlice'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const BuyerDashboard = () => {
  const { data: orders, isLoading } = useGetMyOrdersQuery()
  const { data: products, isLoading: productsLoading } = useGetProductsQuery()

  const recentOrders = orders?.slice(0, 5) || []

  const stats = [
    { 
      icon: FaBox, 
      label: 'Total Orders', 
      value: orders?.length || 0,
      change: '+3 this month',
      color: 'bg-blue-500' 
    },
    { 
      icon: FaClock, 
      label: 'In Production', 
      value: orders?.filter(o => o.status === 'production').length || 0,
      change: 'On schedule',
      color: 'bg-yellow-500' 
    },
    { 
      icon: FaTruck, 
      label: 'Shipped', 
      value: orders?.filter(o => o.status === 'shipped').length || 0,
      change: 'In transit',
      color: 'bg-green-500' 
    },
    { 
      icon: FaDollarSign, 
      label: 'Total Spent', 
      value: '$45,280',
      change: '+12% vs last month',
      color: 'bg-purple-500' 
    },
  ]

  const categories = [
    {
      name: 'Womenswear',
      description: 'Elegant dresses, kurtis, co-ords',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
      count: '1200+ styles',
    },
    {
      name: 'Menswear',
      description: 'Smart casuals to business formals',
      image: 'https://images.unsplash.com/photo-1592878943614-8d972c127fde?w=400&q=80',
      count: '980+ styles',
    },
    {
      name: 'Kidswear',
      description: 'Playful outfits for every season',
      image: 'https://images.unsplash.com/photo-1515472071456-44cbb4602074?w=400&q=80',
      count: '650+ styles',
    },
    {
      name: 'Activewear',
      description: 'Performance wear for active lifestyles',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
      count: '400+ styles',
    },
  ]

  const trendingProducts = (products || []).slice(0, 8)

  return (
    <div className="p-6 space-y-10">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 text-white">
        <img
          src="https://images.unsplash.com/photo-1525171254930-643fc658b64e?w=1400&q=80"
          alt="Showroom"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 py-12">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
              <FaShoppingBag /> Premium Collections
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Discover the latest trends curated for your business
            </h1>
            <p className="text-blue-50 text-lg max-w-xl">
              Explore seasonal edits, best-selling categories and tailored recommendations designed for high-volume buyers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-primary-600 font-semibold shadow-lg hover:bg-blue-50 transition"
              >
                Shop Products
                <FaArrowRight />
              </Link>
              <Link
                to="/buyer/orders"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/70 text-white font-semibold hover:bg-white/10 transition"
              >
                View Orders
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="bg-white/15 p-6 rounded-2xl backdrop-blur-sm w-full max-w-sm space-y-4">
              <h3 className="text-xl font-semibold">Quick Snapshot</h3>
              <div className="space-y-3">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                      <div className={`${stat.color} rounded-full p-3 bg-opacity-80`}>
                        <Icon className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-blue-100">{stat.label}</p>
                        <p className="text-lg font-semibold">{stat.value}</p>
                      </div>
                      <span className="text-xs text-emerald-200">{stat.change}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Shop by Category</h2>
          <Link to="/products" className="text-primary-600 font-medium flex items-center gap-2">
            View All
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative overflow-hidden rounded-2xl group shadow-sm"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="text-xl font-semibold">{category.name}</h3>
                <p className="text-sm text-white/80">{category.description}</p>
                <p className="text-xs mt-3 inline-flex items-center gap-2">
                  {category.count}
                  <FaArrowRight />
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product Feed */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Trending Now</h2>
            <p className="text-gray-500 text-sm">Curated drops updated daily based on buyer demand</p>
          </div>
          <Link to="/buyer/wishlist" className="inline-flex items-center gap-2 text-primary-600 font-medium">
            <FaHeart /> Saved Items
          </Link>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="card animate-pulse h-80">&nbsp;</div>
            ))}
          </div>
        ) : trendingProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ translateY: -6 }}
                className="card p-0 overflow-hidden group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-xs text-gray-700 px-3 py-1 rounded-full">
                    <FaStar className="text-amber-500" />
                    Bestseller
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 h-10 overflow-hidden">{product.description || 'Explore premium quality apparel crafted for global buyers.'}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-primary-600 font-semibold">
                      {product.price ? `${product.price} ${product.currency || 'USD'}` : 'Contact for price'}
                    </span>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-1 text-sm text-primary-600 font-medium"
                    >
                      View
                      <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card p-10 text-center">
            <FaShoppingBag className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500">Products will appear here once catalogue is ready.</p>
            <Link to="/products" className="btn-primary mt-4 inline-block">
              Browse Catalogue
            </Link>
          </div>
        )}
      </section>

      {/* Orders + Actions */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link to="/buyer/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading orders...</p>
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50 dark:bg-dark-bg p-4 rounded-xl"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <FaBox className="text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <Link to={`/buyer/orders/${order.id}`} className="font-semibold text-primary-600 truncate">
                        Order #{order.id}
                      </Link>
                      <p className="text-sm text-gray-500 truncate">{order.product_name || 'Assorted styles'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold block">{order.quantity || 0} pcs</span>
                      <span className="text-xs text-gray-400">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-700'
                          : order.status === 'production'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {order.status || 'pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaBox className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">You have not placed any orders yet.</p>
              <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                Start Shopping
                <FaArrowRight />
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <Link to="/buyer/documents" className="btn-secondary w-full flex items-center justify-center gap-2">
                Invoices &amp; POs
              </Link>
              <Link to="/buyer/shipments" className="btn-secondary w-full flex items-center justify-center gap-2">
                Track Shipments
              </Link>
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                Request Custom Order
              </button>
              <Link to="/buyer/wishlist" className="btn-secondary w-full flex items-center justify-center gap-2">
                View Wishlist
              </Link>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 dark:from-primary-900/20 dark:via-primary-900/10 dark:to-primary-800/20">
            <h3 className="font-semibold mb-2">Need Assistance?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Speak with our account specialists for curated product recommendations.
            </p>
            <button className="btn-primary w-full text-sm">
              Talk to Support
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BuyerDashboard
