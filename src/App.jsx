import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'

// Layouts (Non-lazy loaded for instant rendering)
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'

// Auth Components (Non-lazy for login speed)
import Login from './components/auth/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RoleRoute from './components/auth/RoleRoute'

// Common Components
import Loader from './components/common/Loader'
import ErrorBoundary from './components/common/ErrorBoundary'

// Lazy-loaded Public Pages
const Home = lazy(() => import('./components/public/Home'))
const About = lazy(() => import('./components/public/About'))
const Products = lazy(() => import('./components/public/Products'))
const Services = lazy(() => import('./components/public/Services'))
const Contact = lazy(() => import('./components/public/Contact'))

// Lazy-loaded Role Dashboards
const BuyerDashboard = lazy(() => import('./components/buyer/BuyerDashboard'))
const MyOrders = lazy(() => import('./components/buyer/MyOrders'))
const DocumentsView = lazy(() => import('./components/buyer/DocumentsView'))
const TrackShipment = lazy(() => import('./components/buyer/TrackShipment'))

const SalesmanDashboard = lazy(() => import('./components/salesman/SalesmanDashboard'))
const LeadsBoard = lazy(() => import('./components/salesman/LeadsBoard'))
const CreateCosting = lazy(() => import('./components/salesman/CreateCosting'))
const GeneratePI = lazy(() => import('./components/salesman/GeneratePI'))
const CommissionReport = lazy(() => import('./components/salesman/CommissionReport'))

const DesignerDashboard = lazy(() => import('./components/designer/DesignerDashboard'))
const AssignedOrders = lazy(() => import('./components/designer/AssignedOrders'))
const UploadDesign = lazy(() => import('./components/designer/UploadDesign'))
const ProductionTimeline = lazy(() => import('./components/designer/ProductionTimeline'))

const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))
const CRMBoard = lazy(() => import('./components/admin/CRMBoard'))
const UserManagement = lazy(() => import('./components/admin/UserManagement'))
const Analytics = lazy(() => import('./components/admin/Analytics'))
const DocumentTemplates = lazy(() => import('./components/admin/DocumentTemplates'))

// Error Pages
const NotFound = lazy(() => import('./components/error/NotFound'))
const Unauthorized = lazy(() => import('./components/error/Unauthorized'))

function App() {
  const { isAuthenticated, user } = useAuth()

  // Auto-redirect to role dashboard if already logged in
  const getDefaultRedirect = () => {
    if (!isAuthenticated || !user) return '/login'
    
    const roleRoutes = {
      buyer: '/buyer',
      salesman: '/salesman',
      designer: '/designer',
      admin: '/admin',
    }
    
    return roleRoutes[user.role] || '/'
  }

  return (
    <ErrorBoundary>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to={getDefaultRedirect()} replace />
                ) : (
                  <Login />
                )
              } 
            />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Buyer Routes */}
            <Route
              path="/buyer/*"
              element={
                <RoleRoute allowedRoles={['buyer']}>
                  <Routes>
                    <Route index element={<BuyerDashboard />} />
                    <Route path="orders" element={<MyOrders />} />
                    <Route path="documents" element={<DocumentsView />} />
                    <Route path="shipments" element={<TrackShipment />} />
                    <Route path="*" element={<Navigate to="/buyer" replace />} />
                  </Routes>
                </RoleRoute>
              }
            />

            {/* Salesman Routes */}
            <Route
              path="/salesman/*"
              element={
                <RoleRoute allowedRoles={['salesman', 'admin']}>
                  <Routes>
                    <Route index element={<SalesmanDashboard />} />
                    <Route path="leads" element={<LeadsBoard />} />
                    <Route path="costing" element={<CreateCosting />} />
                    <Route path="costing/:leadId" element={<CreateCosting />} />
                    <Route path="generate-pi" element={<GeneratePI />} />
                    <Route path="generate-pi/:leadId" element={<GeneratePI />} />
                    <Route path="reports" element={<CommissionReport />} />
                    <Route path="*" element={<Navigate to="/salesman" replace />} />
                  </Routes>
                </RoleRoute>
              }
            />

            {/* Designer Routes */}
            <Route
              path="/designer/*"
              element={
                <RoleRoute allowedRoles={['designer', 'admin']}>
                  <Routes>
                    <Route index element={<DesignerDashboard />} />
                    <Route path="orders" element={<AssignedOrders />} />
                    <Route path="upload" element={<UploadDesign />} />
                    <Route path="upload/:orderId" element={<UploadDesign />} />
                    <Route path="timeline" element={<ProductionTimeline />} />
                    <Route path="timeline/:orderId" element={<ProductionTimeline />} />
                    <Route path="*" element={<Navigate to="/designer" replace />} />
                  </Routes>
                </RoleRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="crm" element={<CRMBoard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="documents" element={<DocumentTemplates />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Routes>
                </RoleRoute>
              }
            />
          </Route>

          {/* Error Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/404" element={<NotFound />} />
          
          {/* Catch all - redirect to 404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
