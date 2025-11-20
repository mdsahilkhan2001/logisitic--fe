import { Navigate, Route, Routes } from 'react-router-dom'
import SellerDashboard from '@/components/seller/SellerDashboard'
import SellerLeads from '@/components/seller/SellerLeads'
import SellerOrders from '@/components/seller/SellerOrders'
import SellerAnalytics from '@/components/seller/SellerAnalytics'
import SellerBuyers from '@/components/seller/SellerBuyers'
import ManageProducts from '@/components/seller/ManageProducts'

const SellerPage = () => {
  return (
    <Routes>
      <Route index element={<SellerDashboard />} />
      <Route path="leads" element={<SellerLeads />} />
      <Route path="orders" element={<SellerOrders />} />
      <Route path="analytics" element={<SellerAnalytics />} />
      <Route path="buyers" element={<SellerBuyers />} />
      <Route path="products" element={<ManageProducts />} />
      <Route path="*" element={<Navigate to="/seller" replace />} />
    </Routes>
  )
}

export default SellerPage
