import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const ProtectedActionButton = ({ children, onAction, ...props }) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = useCallback(
    (event) => {
      if (!isAuthenticated) {
        event?.preventDefault?.()
        const redirectTo = location.pathname + location.search
        navigate('/login', { state: { from: redirectTo } })
        return
      }

      onAction?.(event)
    },
    [isAuthenticated, navigate, location, onAction],
  )

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  )
}

export default ProtectedActionButton
