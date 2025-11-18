import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, access, refresh } = action.payload
      
      if (user) state.user = user
      if (access) {
        state.token = access
        localStorage.setItem('token', access)
      }
      if (refresh) {
        state.refreshToken = refresh
        localStorage.setItem('refreshToken', refresh)
      }
      
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
