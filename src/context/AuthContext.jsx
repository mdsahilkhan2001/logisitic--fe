import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [authTokens, setAuthTokens] = useState(() => 
    localStorage.getItem('authTokens') 
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authTokens) {
      const decoded = jwtDecode(authTokens.access)
      setUser({
        id: decoded.user_id,
        username: decoded.username,
        role: decoded.role,
      })
    }
    setLoading(false)
  }, [authTokens])

  const loginUser = async (username, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/token/`,
        { username, password }
      )
      
      const tokens = {
        access: response.data.access,
        refresh: response.data.refresh,
      }
      
      const decoded = jwtDecode(tokens.access)
      
      setAuthTokens(tokens)
      setUser({
        id: decoded.user_id,
        username: decoded.username,
        role: decoded.role,
      })
      
      localStorage.setItem('authTokens', JSON.stringify(tokens))
      toast.success('Login successful!')
      
      return decoded.role
    } catch (error) {
      toast.error('Invalid credentials')
      throw error
    }
  }

  const logoutUser = () => {
    setAuthTokens(null)
    setUser(null)
    localStorage.removeItem('authTokens')
    toast.success('Logged out successfully')
  }

  const updateToken = async () => {
    if (!authTokens?.refresh) return

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/token/refresh/`,
        { refresh: authTokens.refresh }
      )
      
      const newTokens = {
        ...authTokens,
        access: response.data.access,
      }
      
      setAuthTokens(newTokens)
      localStorage.setItem('authTokens', JSON.stringify(newTokens))
    } catch (error) {
      logoutUser()
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (authTokens) {
        updateToken()
      }
    }, 1000 * 60 * 9) // Refresh every 9 minutes

    return () => clearInterval(interval)
  }, [authTokens])

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    loading,
  }

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  )
}
