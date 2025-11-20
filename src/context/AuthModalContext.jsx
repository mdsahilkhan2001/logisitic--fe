import { createContext, useContext, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const AuthModalContext = createContext({
  openLogin: () => {},
  openRegister: () => {},
  closeModals: () => {},
  requireAuth: () => {},
})

export const AuthModalProvider = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const closeModals = useCallback(() => {}, [])
  const openLogin = useCallback(() => {
    navigate('/login', { state: { from: location.pathname + location.search } })
  }, [navigate, location])
  const openRegister = useCallback(() => {
    navigate('/register', { state: { from: location.pathname + location.search } })
  }, [navigate, location])
  const requireAuth = useCallback(() => {
    navigate('/login', { state: { from: location.pathname + location.search } })
  }, [navigate, location])

  return (
    <AuthModalContext.Provider value={{ openLogin, openRegister, closeModals, requireAuth }}>
      {children}
    </AuthModalContext.Provider>
  )
}

export const useAuthModal = () => useContext(AuthModalContext)
