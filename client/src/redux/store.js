import { configureStore } from "@reduxjs/toolkit";
import adminSidebarSliceReducer from "./features/slices/adminSidebarSlice";
import customerSidebarSliceReducer from "./features/slices/customerSidebarSlice";
import reviewModalSlice from "./features/slices/reviewModalSlice";
import authSlice from "./features/slices/authSlice";
import cartSlice from "./features/slices/cartSlice";
import couponSlice from "./features/slices/couponSlice";
import { ecommerceApi } from "./services/ecommerceApi";

export const store = configureStore({
  reducer: {
    [ecommerceApi.reducerPath]: ecommerceApi.reducer,
    sidebar: adminSidebarSliceReducer,
    customerSidebar: customerSidebarSliceReducer,
    reviewModal: reviewModalSlice,
    auth: authSlice,
    cart: cartSlice,
    coupon: couponSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ecommerceApi.middleware),
});
