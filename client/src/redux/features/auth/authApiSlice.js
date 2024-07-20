import { ecommerceApi } from "../../services/ecommerceApi";

export const authApiSlice = ecommerceApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/register",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["Profile", "Address", "Order"],
    }),

    loginUser: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["Profile", "Address", "Order"],
    }),

    logoutUser: builder.mutation({
      query: (token) => ({
        url: "/auth/logout",
        method: "POST",
        body: token,
      }),
      invalidatesTags: ["Profile"],
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "GET",
      }),
    }),

    forgotPassword: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/password/forgot",
        method: "POST",
        body: userInfo,
      }),
    }),

    resetPassword: builder.mutation({
      query: (userInfo) => ({
        url: `/auth/password/reset/${userInfo.token}`,
        method: "PUT",
        body: {
          password: userInfo.password,
          confirmPassword: userInfo.confirmPassword,
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApiSlice;
