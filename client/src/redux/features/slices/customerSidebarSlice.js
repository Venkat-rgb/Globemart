import { createSlice } from "@reduxjs/toolkit";

const customerSidebarSlice = createSlice({
  name: "customerSidebarSlice",
  initialState: {
    isCustomerSidebarOpen: false,
  },
  reducers: {
    setCustomerSidebar(state, action) {
      state.isCustomerSidebarOpen = action.payload;
    },
  },
});

export const { setCustomerSidebar } = customerSidebarSlice.actions;

export default customerSidebarSlice.reducer;
