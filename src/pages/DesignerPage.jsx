import { Routes, Route, Navigate } from 'react-router-dom'
import DesignerDashboard from '../components/designer/DesignerDashboard'
import AssignedOrders from '../components/designer/AssignedOrders'
import UploadDesign from '../components/designer/UploadDesign'
import ProductionTimeline from '../components/designer/ProductionTimeline'

const DesignerPage = () => {
  return (
    <Routes>
      <Route index element={<DesignerDashboard />} />
      <Route path="orders" element={<AssignedOrders />} />
      <Route path="upload" element={<UploadDesign />} />
      <Route path="upload/:orderId" element={<UploadDesign />} />
      <Route path="timeline" element={<ProductionTimeline />} />
      <Route path="timeline/:orderId" element={<ProductionTimeline />} />
      <Route path="*" element={<Navigate to="/designer" replace />} />
    </Routes>
  )
}

export default DesignerPage
