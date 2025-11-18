import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: true,
  theme: localStorage.getItem('theme') || 'light',
  notifications: [],
  loading: false,
  error: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', state.theme)
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  toggleTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  setError,
  clearError,
} = uiSlice.actions

export default uiSlice.reducer

// Selectors
export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export const selectTheme = (state) => state.ui.theme
export const selectNotifications = (state) => state.ui.notifications
export const selectLoading = (state) => state.ui.loading
export const selectError = (state) => state.ui.error
