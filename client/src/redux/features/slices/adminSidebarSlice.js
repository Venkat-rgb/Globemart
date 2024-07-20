import { createSlice } from "@reduxjs/toolkit";

const adminSidebarSlice = createSlice({
  name: "adminSidebarSlice",
  initialState: {
    // isSidebarOpen: false,
    isSidebarOpen: true,
  },
  reducers: {
    setSideBar(state, action) {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setSideBar } = adminSidebarSlice.actions;

export default adminSidebarSlice.reducer;
