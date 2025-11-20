import { useMemo } from 'react'
import Loader from '@/components/common/Loader'
import { useGetAllOrdersQuery } from '@/features/orders/ordersApiSlice'
import { useGetAllLeadsQuery } from '@/features/leads/leadsApiSlice'

const normaliseBuyerKey = (value) => {
  if (!value) return undefined
  if (typeof value === 'object') {
    return value.id || value.email || value.username || undefined
  }
  return value
}

const SellerBuyers = () => {
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

  const buyerInsights = useMemo(() => {
    const buyers = new Map()

    orders.forEach((order) => {
      const key =
        normaliseBuyerKey(order.buyer) || order.buyer_email || order.buyer_name || `order-${order.id}`
      const entry = buyers.get(key) || {
        key,
        name:
          order.buyer_name ||
          order.buyer_username ||
          (typeof order.buyer === 'object' ? order.buyer?.username : undefined) ||
          'Unnamed buyer',
        email:
          order.buyer_email ||
          (typeof order.buyer === 'object' ? order.buyer?.email : undefined) ||
          '',
        company: order.company_name || '',
        orderCount: 0,
        totalRevenue: 0,
        lastOrder: null,
        leads: 0,
        convertedLeads: 0,
      }

      entry.orderCount += 1
      entry.totalRevenue += Number(order.total_amount || 0)
      entry.lastOrder = order.updated_at || order.created_at || entry.lastOrder

      buyers.set(key, entry)
    })

    leads.forEach((lead) => {
      const key = lead.email || lead.buyer_name || `lead-${lead.id}`
      const entry = buyers.get(key) || {
        key,
        name: lead.buyer_name,
        email: lead.email,
        company: lead.company_name,
        orderCount: 0,
        totalRevenue: 0,
        lastOrder: null,
        leads: 0,
        convertedLeads: 0,
      }

      entry.leads += 1
      if (lead.status === 'converted') {
        entry.convertedLeads += 1
      }

      buyers.set(key, entry)
    })

    const list = Array.from(buyers.values())

    const ranked = list.sort((a, b) => b.totalRevenue - a.totalRevenue)

    return {
      buyers: ranked,
      topFive: ranked.slice(0, 5),
      totalCompanies: new Set(list.map((buyer) => buyer.company)).size,
    }
  }, [orders, leads])

  if (isLoadingOrders || isLoadingLeads) {
    return <Loader />
  }

  if (isOrdersError || isLeadsError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Buyer Insights</h1>
        <p className="text-sm text-red-600">Unable to load buyer information at this time.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Buyer Relationships</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Spot your most valuable accounts and follow up on warm leads.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Tracked Buyers</p>
          <p className="mt-2 text-3xl font-semibold">{buyerInsights.buyers.length}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Accounts</p>
          <p className="mt-2 text-3xl font-semibold">{buyerInsights.totalCompanies}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Open Leads</p>
          <p className="mt-2 text-3xl font-semibold">
            {
              buyerInsights.buyers.reduce(
                (total, buyer) => total + Math.max(buyer.leads - buyer.convertedLeads, 0),
                0,
              )
            }
          </p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Repeat Buyers</p>
          <p className="mt-2 text-3xl font-semibold">
            {buyerInsights.buyers.filter((buyer) => buyer.orderCount > 1).length}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Buyers</h2>
        <ul className="mt-4 space-y-3">
          {buyerInsights.topFive.length === 0 && (
            <li className="text-sm text-gray-500 dark:text-gray-400">No buyer data available yet.</li>
          )}
          {buyerInsights.topFive.map((buyer) => (
            <li key={buyer.key} className="flex flex-col gap-1 border-b last:border-0 border-gray-100 dark:border-gray-800 pb-3 last:pb-0">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900 dark:text-gray-100">{buyer.name}</span>
                <span className="text-gray-600 dark:text-gray-300">
                  ${buyer.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {buyer.orderCount} orders · {buyer.leads} leads · {buyer.convertedLeads} converted
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Buyer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Company</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Orders</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Leads</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Converted</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {buyerInsights.buyers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  Connect leads or orders to start building buyer insights.
                </td>
              </tr>
            )}
            {buyerInsights.buyers.map((buyer) => (
              <tr key={buyer.key}>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{buyer.name}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{buyer.email || '—'}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{buyer.company || '—'}</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{buyer.orderCount}</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{buyer.leads}</td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{buyer.convertedLeads}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                  ${buyer.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SellerBuyers
