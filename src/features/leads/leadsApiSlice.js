 import { baseApi } from '../../services/baseApi'

export const leadsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeads: builder.query({
      query: () => '/leads/',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Lead', id })),
              { type: 'Lead', id: 'LIST' },
            ]
          : [{ type: 'Lead', id: 'LIST' }],
    }),
    
    getLeadById: builder.query({
      query: (id) => `/leads/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Lead', id }],
    }),
    
    createLead: builder.mutation({
      query: (leadData) => ({
        url: '/leads/',
        method: 'POST',
        body: leadData,
      }),
      invalidatesTags: [{ type: 'Lead', id: 'LIST' }],
    }),
    
    updateLead: builder.mutation({
      query: ({ id, ...leadData }) => ({
        url: `/leads/${id}/`,
        method: 'PATCH',
        body: leadData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Lead', id },
        { type: 'Lead', id: 'LIST' },
      ],
    }),
    
    deleteLead: builder.mutation({
      query: (id) => ({
        url: `/leads/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Lead', id: 'LIST' }],
    }),
    
    createCosting: builder.mutation({
      query: ({ leadId, ...costingData }) => ({
        url: `/leads/${leadId}/costing/`,
        method: 'POST',
        body: costingData,
      }),
      invalidatesTags: (result, error, { leadId }) => [
        { type: 'Lead', id: leadId },
      ],
    }),
    
    generatePI: builder.mutation({
      query: ({ leadId, ...piData }) => ({
        url: `/leads/${leadId}/generate-pi/`,
        method: 'POST',
        body: piData,
      }),
      invalidatesTags: (result, error, { leadId }) => [
        { type: 'Lead', id: leadId },
        { type: 'Document', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetAllLeadsQuery,
  useGetLeadByIdQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useCreateCostingMutation,
  useGeneratePIMutation,
} = leadsApiSlice
