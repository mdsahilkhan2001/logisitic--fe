import { useMemo } from 'react'
import { useGetAllOrdersQuery } from '@/features/orders/ordersApiSlice'
import Loader from '@/components/common/Loader'

const statusBadges = {
  pending: 'bg-slate-100 text-slate-700',
  production: 'bg-indigo-100 text-indigo-700',
  qc: 'bg-amber-100 text-amber-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-emerald-100 text-emerald-700',
}

const SellerOrders = () => {
  const { data: orders = [], isLoading, isError } = useGetAllOrdersQuery()

  const metrics = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        acc.total += 1
        if (order.status && acc[order.status] !== undefined) {
          acc[order.status] += 1
        }
        acc.totalRevenue += Number(order.total_amount || 0)
        acc.avgProgress += Number(order.progress || 0)
        return acc
      },
      {
        total: 0,
        pending: 0,
        production: 0,
        qc: 0,
        shipped: 0,
        delivered: 0,
        totalRevenue: 0,
        avgProgress: 0,
      },
    )
  }, [orders])

  const averageProgress = metrics.total ? Math.round(metrics.avgProgress / metrics.total) : 0

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Orders</h1>
        <p className="text-sm text-red-600">Unable to load orders at the moment. Please retry later.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Order Operations</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Monitor live production status, fulfilment stages, and revenue generated.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total Orders</p>
          <p className="mt-2 text-3xl font-semibold">{metrics.total}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">In Production</p>
          <p className="mt-2 text-3xl font-semibold">{metrics.production}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Shipped</p>
          <p className="mt-2 text-3xl font-semibold">{metrics.shipped}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Avg. Progress</p>
          <p className="mt-2 text-3xl font-semibold">{averageProgress}%</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Pending</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.pending}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Awaiting QC</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.qc}</p>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Buyer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Progress</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Value</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.map((order) => {
              const buyerLabel =
                order.buyer_name ||
                order.buyer_username ||
                order.buyer_email ||
                (typeof order.buyer === 'object' && order.buyer
                  ? order.buyer.username || order.buyer.email
                  : undefined) ||
                (typeof order.buyer === 'number' ? `Buyer #${order.buyer}` : undefined) ||
                (typeof order.buyer === 'string' && order.buyer.trim() ? order.buyer : undefined) ||
                'Unassigned'

              return (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                  #{order.id} — {order.product_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{buyerLabel}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadges[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status?.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.progress || 0}%</span>
                    <div className="h-2 flex-1 rounded bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2 rounded bg-blue-500"
                        style={{ width: `${Math.min(order.progress || 0, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                  {order.total_amount ? `${order.currency || 'USD'} ${Number(order.total_amount).toLocaleString()}` : '—'}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                  {order.updated_at ? new Date(order.updated_at).toLocaleDateString() : '—'}
                </td>
                </tr>
              )
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  There are no orders yet. Once buyers confirm orders, they will show up here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SellerOrders
