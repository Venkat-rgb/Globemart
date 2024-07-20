import { ecommerceApi } from "../../services/ecommerceApi";

export const usersApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (page) => `/admin/users${page ? `?page=${page}` : ""}`,
      // here below in providesTags also add Reviews
      providesTags: ["Users", "Profile"],
    }),

    getUser: builder.query({
      query: (userId) => `/admin/users/${userId}`,
      providesTags: ["Users"],
    }),

    updateUser: builder.mutation({
      query: (userInfo) => ({
        url: `/admin/users/${userInfo?.userId}`,
        method: "PUT",
        body: {
          role: userInfo?.role,
        },
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;
