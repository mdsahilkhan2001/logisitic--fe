import { baseApi } from '../../services/baseApi'

export const documentsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocumentsByOrder: builder.query({
      query: (orderId) => `/documents/order/${orderId}/`,
      providesTags: (result, error, orderId) => [
        { type: 'Document', id: orderId },
      ],
    }),
    
    downloadPI: builder.mutation({
      query: (piId) => ({
        url: `/documents/pi/${piId}/download/`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
    
    downloadInvoice: builder.mutation({
      query: (invoiceId) => ({
        url: `/documents/invoice/${invoiceId}/download/`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
    
    downloadPackingList: builder.mutation({
      query: (plId) => ({
        url: `/documents/packing-list/${plId}/download/`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
    
    downloadQCSheet: builder.mutation({
      query: (qcId) => ({
        url: `/documents/qc/${qcId}/download/`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
    
    getAllDocuments: builder.query({
      query: () => '/documents/',
      providesTags: [{ type: 'Document', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetDocumentsByOrderQuery,
  useDownloadPIMutation,
  useDownloadInvoiceMutation,
  useDownloadPackingListMutation,
  useDownloadQCSheetMutation,
  useGetAllDocumentsQuery,
} = documentsApiSlice
