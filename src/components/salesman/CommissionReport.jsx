 import { FaDollarSign, FaChartLine, FaTrophy, FaCalendar } from 'react-icons/fa'

const CommissionReport = () => {
  const monthlyData = [
    { month: 'January', orders: 8, revenue: 45000, commission: 2250 },
    { month: 'February', orders: 12, revenue: 68000, commission: 3400 },
    { month: 'March', orders: 15, revenue: 82000, commission: 4100 },
  ]

  const totalCommission = monthlyData.reduce((sum, item) => sum + item.commission, 0)
  const totalOrders = monthlyData.reduce((sum, item) => sum + item.orders, 0)
  const avgCommission = totalCommission / monthlyData.length

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Commission Report</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Commission</p>
              <p className="text-3xl font-bold mt-2">${totalCommission}</p>
            </div>
            <FaDollarSign className="text-5xl text-green-200" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Orders</p>
              <p className="text-3xl font-bold mt-2">{totalOrders}</p>
            </div>
            <FaTrophy className="text-4xl text-yellow-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Avg/Month</p>
              <p className="text-3xl font-bold mt-2">${avgCommission.toFixed(0)}</p>
            </div>
            <FaChartLine className="text-4xl text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">This Month</p>
              <p className="text-3xl font-bold mt-2">${monthlyData[monthlyData.length - 1].commission}</p>
            </div>
            <FaCalendar className="text-4xl text-purple-500" />
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Monthly Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-dark-border">
                <th className="text-left py-3 px-4">Month</th>
                <th className="text-left py-3 px-4">Orders</th>
                <th className="text-left py-3 px-4">Revenue</th>
                <th className="text-left py-3 px-4">Commission (5%)</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data, index) => (
                <tr key={index} className="border-b dark:border-dark-border">
                  <td className="py-3 px-4 font-medium">{data.month}</td>
                  <td className="py-3 px-4">{data.orders}</td>
                  <td className="py-3 px-4">${data.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">
                    ${data.commission.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 dark:bg-dark-bg font-bold">
                <td className="py-3 px-4">Total</td>
                <td className="py-3 px-4">{totalOrders}</td>
                <td className="py-3 px-4">
                  ${monthlyData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-green-600">
                  ${totalCommission.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CommissionReport
