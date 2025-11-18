 import { baseApi } from '../../services/baseApi'

export const ordersApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => '/orders/',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order', id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    
    getOrderById: builder.query({
      query: (id) => `/orders/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    
    getDesignerOrders: builder.query({
      query: () => '/orders/designer/',
      providesTags: [{ type: 'Order', id: 'DESIGNER_LIST' }],
    }),
    
    uploadDesign: builder.mutation({
      query: ({ orderId, data }) => ({
        url: `/orders/${orderId}/upload-design/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'DESIGNER_LIST' },
      ],
    }),
    
    updateProduction: builder.mutation({
      query: ({ orderId, ...productionData }) => ({
        url: `/orders/${orderId}/production/`,
        method: 'PATCH',
        body: productionData,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Production', id: 'LIST' },
      ],
    }),
    
    createQC: builder.mutation({
      query: ({ orderId, ...qcData }) => ({
        url: `/orders/${orderId}/qc/`,
        method: 'POST',
        body: qcData,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'QC', id: 'LIST' },
      ],
    }),
    
    createShipment: builder.mutation({
      query: ({ orderId, ...shipmentData }) => ({
        url: `/orders/${orderId}/shipment/`,
        method: 'POST',
        body: shipmentData,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Shipment', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetDesignerOrdersQuery,
  useUploadDesignMutation,
  useUpdateProductionMutation,
  useCreateQCMutation,
  useCreateShipmentMutation,
} = ordersApiSlice
