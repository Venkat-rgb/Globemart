import { ecommerceApi } from "../../services/ecommerceApi";

export const customerAddressApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerAddress: builder.query({
      query: () => `/address`,
      providesTags: ["Address"],
    }),

    createOrUpdateAddress: builder.mutation({
      query: (addressInfo) => ({
        url: `/address`,
        method: "POST",
        body: addressInfo,
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const { useGetCustomerAddressQuery, useCreateOrUpdateAddressMutation } =
  customerAddressApiSlice;
