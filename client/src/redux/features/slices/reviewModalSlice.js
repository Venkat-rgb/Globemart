import { createSlice } from "@reduxjs/toolkit";

const reviewModalSlice = createSlice({
  name: "reviewModalSlice",
  initialState: {
    isReviewModalOpen: false,
  },
  reducers: {
    setReviewModal(state, action) {
      state.isReviewModalOpen = action.payload;
    },
  },
});

export const { setReviewModal } = reviewModalSlice.actions;

export default reviewModalSlice.reducer;
