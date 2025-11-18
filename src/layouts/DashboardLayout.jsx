 import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/common/Sidebar'
import { useState } from 'react'
import { FaBars, FaTimes, FaBell, FaUser } from 'react-icons/fa'
import ThemeToggle from '@/components/common/ThemeToggle'
import { useAuth } from '@/hooks/useAuth'
import { useDispatch } from 'react-redux'
import { logout } from '@/features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left: Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg lg:hidden"
            >
              {sidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4 ml-auto">
              <ThemeToggle />
              
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg">
                <FaBell className="text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg"
                >
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                    <FaUser className="text-primary-600" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user?.username || 'User'}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role || 'Role'}</p>
                  </div>
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-lg shadow-lg border border-gray-200 dark:border-dark-border py-2">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-bg text-sm">
                      Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-bg text-sm">
                      Settings
                    </button>
                    <hr className="my-2 border-gray-200 dark:border-dark-border" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-bg text-sm text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
