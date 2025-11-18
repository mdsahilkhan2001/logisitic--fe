import { FaTrendingUp, FaTrendingDown, FaChartBar, FaDownload } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Analytics = () => {
  const metrics = [
    { 
      label: 'Total Revenue', 
      value: '$245,670', 
      change: '+23.5%', 
      trend: 'up',
      color: 'text-green-600'
    },
    { 
      label: 'Orders', 
      value: '1,248', 
      change: '+12.3%', 
      trend: 'up',
      color: 'text-blue-600'
    },
    { 
      label: 'Avg Order Value', 
      value: '$196.85', 
      change: '+5.2%', 
      trend: 'up',
      color: 'text-purple-600'
    },
    { 
      label: 'Conversion Rate', 
      value: '3.24%', 
      change: '-0.5%', 
      trend: 'down',
      color: 'text-orange-600'
    },
  ]

  const topProducts = [
    { name: 'Cotton T-Shirts', sales: 456, revenue: '$27,360', growth: '+18%' },
    { name: 'Formal Shirts', sales: 342, revenue: '$23,940', growth: '+12%' },
    { name: 'Denim Jeans', sales: 298, revenue: '$29,800', growth: '+25%' },
    { name: 'Summer Dresses', sales: 234, revenue: '$28,080', growth: '+32%' },
    { name: 'Leather Jackets', sales: 187, revenue: '$42,735', growth: '+15%' },
  ]

  const topBuyers = [
    { name: 'Fashion Retail Inc.', orders: 45, spent: '$89,450', country: 'USA' },
    { name: 'Style Boutique', orders: 38, spent: '$67,230', country: 'UK' },
    { name: 'Global Apparel', orders: 32, spent: '$54,890', country: 'Canada' },
    { name: 'Trend Store', orders: 28, spent: '$48,670', country: 'Australia' },
    { name: 'Fashion Hub', orders: 24, spent: '$39,450', country: 'Germany' },
  ]

  const monthlyData = [
    { month: 'Jan', orders: 98, revenue: 18500 },
    { month: 'Feb', orders: 112, revenue: 21300 },
    { month: 'Mar', orders: 145, revenue: 27600 },
    { month: 'Apr', orders: 132, revenue: 24800 },
    { month: 'May', orders: 167, revenue: 31200 },
    { month: 'Jun', orders: 189, revenue: 35700 },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive business insights and metrics</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <FaDownload />
          <span>Export Report</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-gray-600 dark:text-gray-400 text-sm">{metric.label}</p>
              {metric.trend === 'up' ? (
                <FaTrendingUp className="text-green-500" />
              ) : (
                <FaTrendingDown className="text-red-500" />
              )}
            </div>
            <p className={`text-3xl font-bold mb-2 ${metric.color}`}>{metric.value}</p>
            <p className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change} from last month
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Revenue Trend (6 Months)</h2>
          <div className="h-80 flex items-end justify-between space-x-2">
            {monthlyData.map((data, index) => {
              const maxRevenue = Math.max(...monthlyData.map(d => d.revenue))
              const height = (data.revenue / maxRevenue) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-primary-100 dark:bg-primary-900/20 rounded-t relative group cursor-pointer hover:bg-primary-200 transition">
                    <div 
                      className="w-full bg-primary-600 rounded-t transition-all" 
                      style={{ height: `${height * 2.5}px` }}
                    ></div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      ${(data.revenue / 1000).toFixed(1)}k
                    </div>
                  </div>
                  <p className="text-xs mt-2 font-medium">{data.month}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Orders Trend */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Orders Trend (6 Months)</h2>
          <div className="h-80 flex items-end justify-between space-x-2">
            {monthlyData.map((data, index) => {
              const maxOrders = Math.max(...monthlyData.map(d => d.orders))
              const height = (data.orders / maxOrders) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-t relative group cursor-pointer hover:bg-green-200 transition">
                    <div 
                      className="w-full bg-green-600 rounded-t transition-all" 
                      style={{ height: `${height * 2.5}px` }}
                    ></div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">
                      {data.orders}
                    </div>
                  </div>
                  <p className="text-xs mt-2 font-medium">{data.month}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top Products & Buyers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center font-bold text-primary-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{product.revenue}</p>
                  <p className="text-sm text-green-600">{product.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Buyers */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Top Buyers</h2>
          <div className="space-y-4">
            {topBuyers.map((buyer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{buyer.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{buyer.orders} orders • {buyer.country}</p>
                  </div>
                </div>
                <p className="font-bold text-blue-600">{buyer.spent}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
