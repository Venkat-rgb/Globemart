import { ecommerceApi } from "../../services/ecommerceApi";

export const statsApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => `/stats`,
      providesTags: ["Stats"],
    }),
  }),
});

export const { useGetStatsQuery } = statsApiSlice;
