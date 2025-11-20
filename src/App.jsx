import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { useGetMeQuery } from './features/auth/authApiSlice'

// Layouts (Non-lazy loaded for instant rendering)
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'

// Auth Components (Non-lazy for login speed)
import Login from './components/auth/Login'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RoleRoute from './components/auth/RoleRoute'

// Common Components
import Loader from './components/common/Loader'
import ErrorBoundary from './components/common/ErrorBoundary'

// Lazy-loaded Public Pages
const Home = lazy(() => import('./components/public/Home'))
const About = lazy(() => import('./components/public/About'))
// Replace legacy Products component with new ProductsPage
const Products = lazy(() => import('./pages/ProductsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SellerPage = lazy(() => import('./pages/SellerPage'))
const Services = lazy(() => import('./components/public/Services'))
const Contact = lazy(() => import('./components/public/Contact'))

// Lazy-loaded Role Dashboards
const BuyerDashboard = lazy(() => import('./components/buyer/BuyerDashboard'))
const MyOrders = lazy(() => import('./components/buyer/MyOrders'))
const DocumentsView = lazy(() => import('./components/buyer/DocumentsView'))
const TrackShipment = lazy(() => import('./components/buyer/TrackShipment'))
const Wishlist = lazy(() => import('./components/buyer/Wishlist'))

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
  const { isAuthenticated, user, token } = useAuth()
  useGetMeQuery(undefined, { skip: !token, refetchOnMountOrArgChange: false })

  // Auto-redirect to role dashboard if already logged in
  const getDefaultRedirect = () => {
    if (!isAuthenticated || !user) return '/login'
    
    const roleRoutes = {
      buyer: '/buyer',
      seller: '/seller',
      salesman: '/salesman',
      designer: '/designer',
      admin: '/admin',
    }
    
    return roleRoutes[user.role] || '/'
  }

  return (
    <ErrorBoundary>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 2800,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            borderRadius: '16px',
            padding: '12px 16px',
            border: '1px solid #374151',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 3500,
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
            <Route path="/buyer" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
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
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to={getDefaultRedirect()} replace />
                ) : (
                  <RegisterPage />
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
                    <Route index element={<Navigate to="/buyer?view=dashboard" replace />} />
                    <Route path="orders" element={<Navigate to="/buyer?view=orders" replace />} />
                    <Route path="wishlist" element={<Navigate to="/buyer?view=wishlist" replace />} />
                    <Route path="documents" element={<Navigate to="/buyer?view=documents" replace />} />
                    <Route path="shipments" element={<Navigate to="/buyer?view=trackorder" replace />} />
                    <Route path="profile" element={<Navigate to="/buyer?view=profile" replace />} />
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

            {/* Seller Routes */}
            <Route
              path="/seller/*"
              element={
                <RoleRoute allowedRoles={['seller','admin']}>
                  <SellerPage />
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
