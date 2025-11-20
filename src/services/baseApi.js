  import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logout } from '../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
  // ✅ Make sure /api is in base URL
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    
    headers.set('Content-Type', 'application/json')
    headers.set('Accept', 'application/json')
    
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 401) {
    console.log('Token expired, attempting refresh...')
    
    const refreshToken = api.getState().auth.refreshToken
    
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/token/refresh/',
          method: 'POST',
          body: { refresh: refreshToken },
        },
        api,
        extraOptions
      )

      if (refreshResult?.data) {
        api.dispatch(
          setCredentials({
            access: refreshResult.data.access,
            refresh: refreshToken,
          })
        )
        
        result = await baseQuery(args, api, extraOptions)
      } else {
        api.dispatch(logout())
        window.location.href = '/login'
      }
    } else {
      api.dispatch(logout())
      window.location.href = '/login'
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'User',
    'Users',
    'Lead',
    'Order',
    'Document',
    'Production',
    'QC',
    'Shipment',
    'Design',
    'Costing',
    'PI',
    'Product',
    'Wishlist',
  ],
  endpoints: () => ({}),
})

export default baseApi
