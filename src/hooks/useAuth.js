 import { useSelector } from 'react-redux'

export const useAuth = () => {
  const user = useSelector((state) => state.auth?.user)
  const token = useSelector((state) => state.auth?.token)
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated)

  return {
    user,
    token,
    isAuthenticated,
    role: user?.role,
    isLoading: false,
  }
}

export default useAuth
