 import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

// Auth Reducer
import authReducer from '../features/auth/authSlice'

// API Services
import { baseApi } from '../services/baseApi'

// Additional Reducers (if needed)
import uiReducer from '../features/ui/uiSlice'

// Configure Store
export const store = configureStore({
  reducer: {
    // Auth State
    auth: authReducer,
    
    // UI State (theme, sidebar, notifications, etc.)
    ui: uiReducer,
    
    // RTK Query API
    [baseApi.reducerPath]: baseApi.reducer,
  },
  
  // Middleware Configuration
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }).concat(baseApi.middleware),
  
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
})

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch)

// Export types for TypeScript (optional)
export const getState = store.getState
export const dispatch = store.dispatch

export default store
