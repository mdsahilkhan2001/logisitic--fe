import { baseApi } from '../../services/baseApi'
import { setCredentials } from './authSlice'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Direct /login/ without auth prefix
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login/',  // ✅ Changed from /auth/login/
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        return {
          user: response.user || {
            id: response.user_id,
            username: response.username,
            email: response.email,
            role: response.role,
          },
          access: response.access,
          refresh: response.refresh,
        }
      },
      invalidatesTags: ['Auth'],
    }),
    
    register: builder.mutation({
      query: (userData) => ({
        url: '/register/',  // ✅ Changed from /auth/register/
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: '/token/refresh/',  // ✅ Changed from /auth/token/refresh/
        method: 'POST',
        body: { refresh: refreshToken },
      }),
    }),
    
    getMe: builder.query({
      query: () => '/users/me/',  // ✅ Changed from /auth/users/me/
      providesTags: ['Auth'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials({ user: data }))
        } catch (error) {
          // noop: handled by consumers
        }
      },
    }),

    changePassword: builder.mutation({
      query: (payload) => ({
        url: '/users/change-password/',
        method: 'POST',
        body: payload,
      }),
    }),
    
    updateMe: builder.mutation({
      query: (data) => ({
        url: '/users/me/',  // ✅ Changed from /auth/users/me/
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials({ user: data }))
          try {
            dispatch(
              baseApi.util.updateQueryData('getMe', undefined, (draft) => {
                if (draft) {
                  Object.assign(draft, data)
                }
              }),
            )
          } catch (cacheError) {
            // No cached /users/me request to update; safe to ignore
          }
        } catch (error) {
          // noop: handled elsewhere
        }
      },
    }),

    updateProfilePicture: builder.mutation({
      async queryFn(file, { getState }) {
        const token = getState().auth.token
        const formData = new FormData()
        formData.append('profile_picture', file)

        try {
          const response = await fetch(`${API_BASE_URL}/users/me/`, {
            method: 'PATCH',
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: formData,
          })

          const data = await response.json()

          if (!response.ok) {
            return { error: { status: response.status, data } }
          }

          return { data }
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', data: error } }
        }
      },
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials({ user: data }))
          try {
            dispatch(
              baseApi.util.updateQueryData('getMe', undefined, (draft) => {
                if (draft) {
                  Object.assign(draft, data)
                }
              }),
            )
          } catch (cacheError) {
            // No cached /users/me request to update; ignore
          }
        } catch (error) {
          // ignored; component will surface errors
        }
      },
    }),
    
    getAllUsers: builder.query({
      query: () => '/users/',  // ✅ Changed from /auth/users/
      providesTags: ['Users'],
    }),
    
    logout: builder.mutation({
      queryFn: async () => {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        return { data: { success: true } }
      },
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateProfilePictureMutation,
  useGetAllUsersQuery,
  useLogoutMutation,
  useChangePasswordMutation,
} = authApiSlice
