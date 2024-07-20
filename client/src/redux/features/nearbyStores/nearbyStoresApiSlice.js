import { ecommerceApi } from "../../services/ecommerceApi";

export const nearbyStoresApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    getNearbyStores: builder.mutation({
      query: (locationInfo) => ({
        url: `/stores/get-nearby-stores`,
        method: "POST",
        body: locationInfo,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetNearbyStoresMutation } = nearbyStoresApiSlice;
