import { ecommerceApi } from "../../services/ecommerceApi";

export const couponApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: (page) => `/coupons${page ? `?page=${page}` : ""}`,
      providesTags: ["Coupon"],
    }),

    getCoupon: builder.query({
      query: (couponId) => `/coupons/${couponId}`,
      providesTags: ["Coupon"],
    }),

    getValidCoupon: builder.query({
      query: () => `/coupons/single`,
      providesTags: ["Coupon"],
    }),

    createCoupon: builder.mutation({
      query: (couponInfo) => ({
        url: `/coupons`,
        method: "POST",
        body: couponInfo,
      }),
      invalidatesTags: ["Coupon"],
    }),

    validateCoupon: builder.mutation({
      query: (couponCode) => ({
        url: `/coupons/validate`,
        method: "POST",
        body: couponCode,
      }),
    }),

    updateCoupon: builder.mutation({
      query: ({ couponId, couponInfo }) => ({
        url: `/coupons/${couponId}`,
        method: "PUT",
        body: couponInfo,
      }),
      invalidatesTags: ["Coupon"],
    }),

    deleteCoupon: builder.mutation({
      query: (couponId) => ({
        url: `/coupons/${couponId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCouponsQuery,
  useGetCouponQuery,
  useGetValidCouponQuery,
  useCreateCouponMutation,
  useValidateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = ecommerceApi;
