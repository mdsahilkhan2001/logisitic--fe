import { Routes, Route, Navigate } from 'react-router-dom'
import BuyerDashboard from '../components/buyer/BuyerDashboard'
import MyOrders from '../components/buyer/MyOrders'
import DocumentsView from '../components/buyer/DocumentsView'
import TrackShipment from '../components/buyer/TrackShipment'

const BuyerPage = () => {
  return (
    <Routes>
      <Route index element={<BuyerDashboard />} />
      <Route path="orders" element={<MyOrders />} />
      <Route path="orders/:id" element={<MyOrders />} />
      <Route path="documents" element={<DocumentsView />} />
      <Route path="shipments" element={<TrackShipment />} />
      <Route path="*" element={<Navigate to="/buyer" replace />} />
    </Routes>
  )
}

export default BuyerPage
