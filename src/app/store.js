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
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredActionPaths: [
          'meta.arg',
          'meta.baseQueryMeta',
          'payload.timestamp',
        ],
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
