import { ecommerceApi } from "../../services/ecommerceApi";

export const reviewsApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: ({ id, page, pageLimit }) =>
        `/reviews/${id}?page=${page}&pageLimit=${pageLimit}`,
      providesTags: ["Review"],
    }),

    getSingleReview: builder.query({
      query: (id) => `/reviews/single/${id}`,
      providesTags: ["Review"],
    }),

    createOrUpdateReview: builder.mutation({
      query: (reviewInfo) => ({
        url: `/reviews`,
        method: "POST",
        body: reviewInfo,
      }),
      invalidatesTags: ["Review"],
    }),

    deleteReview: builder.mutation({
      query: (reviewInfo) => ({
        url: `/reviews`,
        method: "DELETE",
        body: reviewInfo,
      }),
      invalidatesTags: ["Review"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReviewsQuery,
  useLazyGetReviewsQuery,
  useGetSingleReviewQuery,
  useCreateOrUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApiSlice;
