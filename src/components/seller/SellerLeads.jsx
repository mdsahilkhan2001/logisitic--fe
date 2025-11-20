import { useMemo } from 'react'
import { useGetAllLeadsQuery } from '@/features/leads/leadsApiSlice'
import Loader from '@/components/common/Loader'

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  qualified: 'bg-green-100 text-green-700',
  converted: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-rose-100 text-rose-700',
}

const SellerLeads = () => {
  const { data: leads = [], isLoading, isError } = useGetAllLeadsQuery()

  const summary = useMemo(() => {
    const initial = { total: 0, new: 0, contacted: 0, qualified: 0, converted: 0 }
    return leads.reduce((acc, lead) => {
      acc.total += 1
      if (lead?.status && acc[lead.status] !== undefined) {
        acc[lead.status] += 1
      }
      return acc
    }, initial)
  }, [leads])

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Leads</h1>
        <p className="text-sm text-red-600">Unable to load leads right now. Please try again shortly.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Lead Pipeline</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Track the status of buyer enquiries and nurture them through to conversion.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total Leads</p>
          <p className="mt-2 text-3xl font-semibold">{summary.total}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">New</p>
          <p className="mt-2 text-3xl font-semibold">{summary.new}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Contacted</p>
          <p className="mt-2 text-3xl font-semibold">{summary.contacted}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Qualified</p>
          <p className="mt-2 text-3xl font-semibold">{summary.qualified}</p>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Buyer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Company</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Product Interest</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{lead.buyer_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{lead.email || 'No email'}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{lead.company_name || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[lead.status] || 'bg-gray-100 text-gray-700'}`}>
                    {lead.status?.replace(/_/g, ' ') || 'unknown'}
                  </span>
                </td>
                <td className="px-4 py-3 capitalize text-sm text-gray-700 dark:text-gray-300">{lead.priority}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{lead.product_interest || '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                  {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  You have not captured any leads yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SellerLeads
