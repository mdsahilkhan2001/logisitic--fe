import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { useGetMeQuery } from './features/auth/authApiSlice'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'

// Auth
import Login from './components/auth/Login'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RoleRoute from './components/auth/RoleRoute'

// Common
import Loader from './components/common/Loader'
import ErrorBoundary from './components/common/ErrorBoundary'

// Lazy Public
const Home = lazy(() => import('./components/public/Home'))
const About = lazy(() => import('./components/public/About'))
const Products = lazy(() => import('./pages/ProductsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SellerPage = lazy(() => import('./pages/SellerPage'))
const Services = lazy(() => import('./components/public/Services'))
const Contact = lazy(() => import('./components/public/Contact'))

// Lazy Buyer
import BuyerRoutes from './routes/BuyerRoutes'   // <-- IMPORTANT

// Salesman
const SalesmanDashboard = lazy(() => import('./components/salesman/SalesmanDashboard'))
const LeadsBoard = lazy(() => import('./components/salesman/LeadsBoard'))
const CreateCosting = lazy(() => import('./components/salesman/CreateCosting'))
const GeneratePI = lazy(() => import('./components/salesman/GeneratePI'))
const CommissionReport = lazy(() => import('./components/salesman/CommissionReport'))

// Designer
const DesignerDashboard = lazy(() => import('./components/designer/DesignerDashboard'))
const AssignedOrders = lazy(() => import('./components/designer/AssignedOrders'))
const UploadDesign = lazy(() => import('./components/designer/UploadDesign'))
const ProductionTimeline = lazy(() => import('./components/designer/ProductionTimeline'))

// Admin
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))
const CRMBoard = lazy(() => import('./components/admin/CRMBoard'))
const UserManagement = lazy(() => import('./components/admin/UserManagement'))
const Analytics = lazy(() => import('./components/admin/Analytics'))
const DocumentTemplates = lazy(() => import('./components/admin/DocumentTemplates'))

// Errors
const NotFound = lazy(() => import('./components/error/NotFound'))
const Unauthorized = lazy(() => import('./components/error/Unauthorized'))

function App() {
  const { isAuthenticated, user, token } = useAuth()
  useGetMeQuery(undefined, { skip: !token, refetchOnMountOrArgChange: false })

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
      <Toaster position="bottom-right" />

      <Suspense fallback={<Loader />}>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            {/* <Route path="/buyer" element={<Home />} /> */}
            {/* <Route path="/buyer/*" element={<BuyerRoutes />} /> */}
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* AUTH ROUTES */}
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

          {/* PROTECTED DASHBOARD LAYOUT (FOR ADMIN/SELLER/SALESMAN/DESIGNER) */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >

            {/* SALESMAN */}
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

            {/* DESIGNER */}
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

            {/* ADMIN */}
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

            {/* SELLER */}
            <Route
              path="/seller/*"
              element={
                <RoleRoute allowedRoles={['seller', 'admin']}>
                  <SellerPage />
                </RoleRoute>
              }
            />

          </Route>

          {/* BUYER OUTSIDE DASHBOARDLAYOUT */}
          <Route path="/buyer/*" element={<BuyerRoutes />} />

          {/* ERRORS */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />

        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
