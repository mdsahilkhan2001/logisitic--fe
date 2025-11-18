 import { Routes, Route } from 'react-router-dom'
import { FaUsers, FaDollarSign, FaCheckCircle, FaClock } from 'react-icons/fa'
import { useGetAllLeadsQuery } from '@/features/leads/leadsApiSlice'
import { Link } from 'react-router-dom'

const SalesmanDashboard = () => {
  const { data: leads, isLoading } = useGetAllLeadsQuery()

  const stats = [
    { 
      icon: FaUsers, 
      label: 'Total Leads', 
      value: leads?.length || 0, 
      color: 'bg-blue-500' 
    },
    { 
      icon: FaClock, 
      label: 'Active Leads', 
      value: leads?.filter(l => l.status === 'active' || l.status === 'new').length || 0, 
      color: 'bg-yellow-500' 
    },
    { 
      icon: FaCheckCircle, 
      label: 'Converted', 
      value: leads?.filter(l => l.status === 'converted').length || 0, 
      color: 'bg-green-500' 
    },
    { 
      icon: FaDollarSign, 
      label: 'Commission', 
      value: '$5,240', 
      color: 'bg-purple-500' 
    },
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Salesman Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Leads</h2>
            <Link to="/salesman/leads" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : leads && leads.length > 0 ? (
            <div className="space-y-3">
              {leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                  <div>
                    <p className="font-medium">{lead.buyer_name || 'New Lead'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {lead.product_interest || 'Product inquiry'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                    lead.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.status || 'new'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No leads yet</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/salesman/leads" className="w-full btn-primary text-left block">
              + Add New Lead
            </Link>
            <Link to="/salesman/costing" className="w-full btn-secondary text-left block">
              Create Costing Sheet
            </Link>
            <Link to="/salesman/generate-pi" className="w-full btn-secondary text-left block">
              Generate Proforma Invoice
            </Link>
            <Link to="/salesman/reports" className="w-full btn-secondary text-left block">
              View Commission Report
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
            <div>
              <p className="text-sm">New lead created: T-Shirt Export Inquiry</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
            <div>
              <p className="text-sm">Costing approved for Lead #123</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
            <div>
              <p className="text-sm">PI generated and sent to buyer</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesmanDashboard
