import { ecommerceApi } from "../../services/ecommerceApi";

export const profileApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/users/me",
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: (userInfo) => ({
        url: "/users/me/update",
        method: "PUT",
        body: userInfo,
      }),
      invalidatesTags: ["Profile"],
    }),

    changePassword: builder.mutation({
      query: (userInfo) => ({
        url: "/users/me/password/update",
        method: "PUT",
        body: userInfo,
      }),
    }),

    deleteUserAccount: builder.mutation({
      query: () => ({
        url: `/users/me/delete-account`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteUserAccountMutation,
} = profileApiSlice;
