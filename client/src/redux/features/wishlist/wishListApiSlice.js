import { ecommerceApi } from "../../services/ecommerceApi";

export const wishListApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: (page) => (page ? `/wishlist?page=${Number(page)}` : `/wishlist`),
      providesTags: ["Wishlist", "Profile"],
    }),

    addProductToWishlist: builder.mutation({
      query: (productId) => ({
        url: "/wishlist",
        method: "POST",
        body: productId,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    deleteProductFromWishlist: builder.mutation({
      query: (productId) => ({
        url: "/wishlist",
        method: "PUT",
        body: productId,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    deleteTotalWishlist: builder.mutation({
      query: () => ({
        url: "/wishlist",
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useLazyGetWishlistQuery,
  useAddProductToWishlistMutation,
  useDeleteProductFromWishlistMutation,
  useDeleteTotalWishlistMutation,
} = ecommerceApi;
