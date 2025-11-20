import { useMemo } from 'react'
import Loader from '@/components/common/Loader'
import { useGetAllOrdersQuery } from '@/features/orders/ordersApiSlice'
import { useGetAllLeadsQuery } from '@/features/leads/leadsApiSlice'

const SellerAnalytics = () => {
  const {
    data: orders = [],
    isLoading: isLoadingOrders,
    isError: isOrdersError,
  } = useGetAllOrdersQuery()
  const {
    data: leads = [],
    isLoading: isLoadingLeads,
    isError: isLeadsError,
  } = useGetAllLeadsQuery()

  const analytics = useMemo(() => {
    const revenueByProduct = new Map()
    const revenueByStatus = new Map()
    const monthBuckets = new Map()

    let totalRevenue = 0

    orders.forEach((order) => {
      const amount = Number(order.total_amount || 0)
      const status = order.status || 'pending'
      const product = order.product_name || 'Unnamed product'
      const createdAt = order.created_at ? new Date(order.created_at) : null

      totalRevenue += amount

      revenueByProduct.set(product, (revenueByProduct.get(product) || 0) + amount)
      revenueByStatus.set(status, (revenueByStatus.get(status) || 0) + 1)

      if (createdAt && !Number.isNaN(createdAt.valueOf())) {
        const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`
        monthBuckets.set(key, {
          revenue: (monthBuckets.get(key)?.revenue || 0) + amount,
          count: (monthBuckets.get(key)?.count || 0) + 1,
          label: createdAt.toLocaleString(undefined, { month: 'short', year: 'numeric' }),
        })
      }
    })

    const topProducts = Array.from(revenueByProduct.entries())
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    const statusBreakdown = Array.from(revenueByStatus.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count)

    const trend = Array.from(monthBuckets.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([, value]) => value)

    return {
      totalRevenue,
      orderCount: orders.length,
      averageOrderValue: orders.length ? totalRevenue / orders.length : 0,
      leadCount: leads.length,
      conversionRate: leads.length ? Math.round((orders.length / leads.length) * 100) : 0,
      topProducts,
      statusBreakdown,
      trend,
    }
  }, [orders, leads])

  if (isLoadingOrders || isLoadingLeads) {
    return <Loader />
  }

  if (isOrdersError || isLeadsError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Analytics</h1>
        <p className="text-sm text-red-600">We could not load your analytics right now. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Performance Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Understand how enquiries convert to revenue and where to focus your sales effort.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p className="mt-2 text-3xl font-semibold">
            ${analytics.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Orders</p>
          <p className="mt-2 text-3xl font-semibold">{analytics.orderCount}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Avg. Order Value</p>
          <p className="mt-2 text-3xl font-semibold">
            ${analytics.averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Lead → Order</p>
          <p className="mt-2 text-3xl font-semibold">{analytics.conversionRate}%</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Products</h2>
          <ul className="mt-4 space-y-3">
            {analytics.topProducts.length === 0 && (
              <li className="text-sm text-gray-500 dark:text-gray-400">No product performance data yet.</li>
            )}
            {analytics.topProducts.map((item) => (
              <li key={item.name} className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900 dark:text-gray-100">{item.name}</span>
                <span className="text-gray-600 dark:text-gray-300">
                  ${item.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Status Breakdown</h2>
          <div className="mt-4 space-y-3">
            {analytics.statusBreakdown.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No orders to report yet.</p>
            )}
            {analytics.statusBreakdown.map((row) => (
              <div key={row.status} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{row.status}</span>
                  <span className="text-gray-600 dark:text-gray-300">{row.count}</span>
                </div>
                <div className="h-2 rounded bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded bg-emerald-500"
                    style={{ width: `${Math.round((row.count / Math.max(analytics.orderCount, 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Revenue Trend</h2>
        <table className="mt-4 min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Month</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Orders</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {analytics.trend.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                  There is no historical data yet.
                </td>
              </tr>
            )}
            {analytics.trend.map((month) => (
              <tr key={month.label}>
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{month.label}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{month.count}</td>
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                  ${month.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SellerAnalytics
