 import { baseApi } from '../../services/baseApi'

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
    }),
    
    updateMe: builder.mutation({
      query: (data) => ({
        url: '/users/me/',  // ✅ Changed from /auth/users/me/
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Auth'],
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
  useGetAllUsersQuery,
  useLogoutMutation,
} = authApiSlice
