import { ecommerceApi } from "../../services/ecommerceApi";

export const orderApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (page) => `/orders${page ? `?page=${page}` : ""}`,
      providesTags: ["Order"],
    }),

    getOrder: builder.query({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: ["Order"],
    }),

    getMyOrders: builder.query({
      query: (page) => `/orders/my-orders${page ? `?page=${page}` : ""}`,
      providesTags: ["Order"],
    }),

    validateOrder: builder.mutation({
      query: (orderInfo) => ({
        url: `/orders/validate-order`,
        method: "POST",
        body: orderInfo,
      }),
    }),

    createOrder: builder.mutation({
      query: (orderInfo) => ({
        url: `/orders`,
        method: "POST",
        body: orderInfo,
      }),
      invalidatesTags: ["Order", "Stats"],
    }),

    updateOrder: builder.mutation({
      query: (orderInfo) => ({
        url: `/orders/${orderInfo.id}`,
        method: "PUT",
        body: {
          deliveryStatus: orderInfo.deliveryStatus,
        },
      }),
      invalidatesTags: ["Order", "Stats"],
    }),

    updatePaymentStatus: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Order", "Stats"],
    }),

    // deleteOrder: builder.mutation({
    //   query: (orderId) => ({
    //     url: `/orders/${orderId}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Order", "Stats"],
    // }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllOrdersQuery,
  useGetOrderQuery,
  useGetMyOrdersQuery,
  useValidateOrderMutation,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useUpdatePaymentStatusMutation,
  useDeleteOrderMutation,
} = orderApiSlice;
