import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "../features/slices/authSlice";
import { deleteTotalCart } from "../features/slices/cartSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_BACKEND_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().auth;

    // if are calling protected endpoint then we add the token to headers. eg: /profile, /cart
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    // if we are not calling protected endpoint then we just return headers without adding any token. eg: /login, /register
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  /*
    -> calling the api with credentials and headers. it returns the response from server
    -> here when access token is not expired then we just return the result at end of this function.
    -> but if access token is expired then we do the below procedure and then return the result at end of this function. 
  */
  let result = await baseQuery(args, api, extraOptions);

  // console.log("baseQuery result: ", result);

  try {
    if (result?.error && result.error?.status === 401) {
      // try to get the new access token by calling refresh-token.
      // console.log("sending refresh token!");
      const newToken = await baseQuery(
        "/auth/refresh-token",
        api,
        extraOptions
      );
      // console.log("newToken result: ", newToken);

      if (newToken?.data) {
        // store the new access token in redux store.
        const userInfo = api.getState().auth.userInfo;
        const token = newToken?.data?.accessToken;

        // localStorage.getItem("token") &&
        api.dispatch(setCredentials({ token, userInfo }));

        // now retry the request again with new setted access token.
        result = await baseQuery(args, api, extraOptions);
      } else {
        // if we came into this block it means that refresh token is also expired so we need to logout the user.
        // const logout = await baseQuery("/auth/logout", api, extraOptions);
        // console.log("refresh token expired, so logout the user!");
        api.dispatch(logOut());
        api.dispatch(deleteTotalCart());
        // localStorage.removeItem("token");
        localStorage.removeItem("cart");
        sessionStorage.removeItem("orderInfo");
        throw new Error(newToken?.error?.data?.message);
      }
    }

    return result;
  } catch (err) {
    console.log("ecommerceApi error: ", err);
    throw err;
  }
};

export const ecommerceApi = createApi({
  reducerPath: "ecommerceApi",

  baseQuery: baseQueryWithReauth,

  tagTypes: [
    "Profile",
    "Products",
    "Review",
    "Users",
    "Wishlist",
    "Order",
    "Address",
    "Stats",
    "Coupon",
  ],

  // here we are creating new files according to their purpose and injecting endpoints so that code is organized.
  endpoints: () => ({}),
});
