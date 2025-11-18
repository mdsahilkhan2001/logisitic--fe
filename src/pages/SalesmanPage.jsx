import { Routes, Route, Navigate } from 'react-router-dom'
import SalesmanDashboard from '../components/salesman/SalesmanDashboard'
import LeadsBoard from '../components/salesman/LeadsBoard'
import CreateCosting from '../components/salesman/CreateCosting'
import GeneratePI from '../components/salesman/GeneratePI'
import CommissionReport from '../components/salesman/CommissionReport'

const SalesmanPage = () => {
  return (
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
  )
}

export default SalesmanPage
