import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check if user's role is in the allowed roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default RoleRoute
