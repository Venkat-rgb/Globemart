import { createSlice } from "@reduxjs/toolkit";

const couponSlice = createSlice({
  name: "couponSlice",
  initialState: {
    couponId: null,
    couponText: null,
    couponCode: null,
    discount: null,
    isCouponModalOpen: false,
  },
  reducers: {
    setCoupon(state, action) {
      const { couponId, couponText, couponCode, discount } = action.payload;
      state.couponId = couponId;
      state.couponText = couponText;
      state.couponCode = couponCode;
      state.discount = discount;
    },

    deleteCoupon(state) {
      state.couponId = null;
      state.couponText = null;
      state.couponCode = null;
      state.discount = null;
    },

    setCouponModal(state, action) {
      state.isCouponModalOpen = action.payload;
    },
  },
});

export const { setCoupon, deleteCoupon, setCouponModal } = couponSlice.actions;

export default couponSlice.reducer;
