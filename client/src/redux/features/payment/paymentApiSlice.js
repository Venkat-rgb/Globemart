import { ecommerceApi } from "../../services/ecommerceApi";

export const paymentApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    getStripeKey: builder.query({
      query: () => `/payment/stripe-key`,
    }),

    paymentIntent: builder.mutation({
      query: (orderInfo) => ({
        url: `/payment/payment-checkout`,
        method: "POST",
        body: orderInfo,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const { useGetStripeKeyQuery, usePaymentIntentMutation } =
  paymentApiSlice;
