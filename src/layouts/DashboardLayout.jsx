import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '@/components/common/Sidebar'
import { useEffect, useState } from 'react'
import { FaBars, FaTimes, FaBell, FaUserCircle, FaHome } from 'react-icons/fa'
import ThemeToggle from '@/components/common/ThemeToggle'
import { useAuth } from '@/hooks/useAuth'

const DashboardLayout = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isBuyer = user?.role === 'buyer'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (user?.role) {
      setSidebarOpen(!isBuyer)
    }
  }, [isBuyer, user?.role])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-200 ease-in-out lg:static lg:w-64 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              {isBuyer && (
                <button
                  onClick={() => navigate({ pathname: '/buyer', search: '?view=dashboard' })}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition"
                >
                  <FaHome className="text-lg" />
                  <span className="hidden sm:inline text-sm font-medium">Home</span>
                </button>
              )}
              <button
                onClick={() => {
                  const profilePath = user?.role === 'buyer' ? '/buyer/profile' : '/profile'
                  navigate(profilePath)
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  {user?.profile_picture ? (
                    <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.username ? (
                      <span className="text-sm font-semibold text-primary-600">
                        {user.username.slice(0, 2).toUpperCase()}
                      </span>
                    ) : (
                      <FaUserCircle className="text-xl text-primary-600" />
                    )
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold leading-tight">{user?.first_name || user?.username || 'Buyer'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </button>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg"
              >
                {sidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4 ml-auto">
              <ThemeToggle />
              
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg">
                <FaBell className="text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
