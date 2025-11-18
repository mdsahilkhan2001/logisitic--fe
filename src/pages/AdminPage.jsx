import { Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from '../components/admin/AdminDashboard'
import CRMBoard from '../components/admin/CRMBoard'
import UserManagement from '../components/admin/UserManagement'
import Analytics from '../components/admin/Analytics'
import DocumentTemplates from '../components/admin/DocumentTemplates'

const AdminPage = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="crm" element={<CRMBoard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="documents" element={<DocumentTemplates />} />
      <Route path="settings" element={<DocumentTemplates />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

export default AdminPage
