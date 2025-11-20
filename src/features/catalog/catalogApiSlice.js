import { baseApi } from '../../services/baseApi';

export const catalogApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/products/',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product', id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    addProduct: builder.mutation({
      query: (data) => ({
        url: '/products/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: '/products/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
    getWishlist: builder.query({
      query: () => '/wishlist/',
      providesTags: ['Wishlist'],
    }),
    addWishlistItem: builder.mutation({
      query: (product_id) => ({
        url: '/wishlist/',
        method: 'POST',
        body: { product_id },
      }),
      invalidatesTags: ['Wishlist'],
    }),
    removeWishlistItem: builder.mutation({
      query: (product_id) => ({
        url: '/wishlist/remove/',
        method: 'DELETE',
        body: { product_id },
      }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetWishlistQuery,
  useAddWishlistItemMutation,
  useRemoveWishlistItemMutation,
} = catalogApiSlice;
