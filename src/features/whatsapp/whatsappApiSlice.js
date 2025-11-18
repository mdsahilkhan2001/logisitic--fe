 import { baseApi } from '../../services/baseApi'

export const whatsappApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: ({ phoneNumber, message }) => ({
        url: '/whatsapp/send/',
        method: 'POST',
        body: { phone_number: phoneNumber, message },
      }),
    }),
    
    sendDocument: builder.mutation({
      query: ({ phoneNumber, documentUrl, filename }) => ({
        url: '/whatsapp/send-document/',
        method: 'POST',
        body: {
          phone_number: phoneNumber,
          document_url: documentUrl,
          filename,
        },
      }),
    }),
    
    getMessageHistory: builder.query({
      query: (orderId) => `/whatsapp/history/${orderId}/`,
    }),
  }),
})

export const {
  useSendMessageMutation,
  useSendDocumentMutation,
  useGetMessageHistoryQuery,
} = whatsappApiSlice
