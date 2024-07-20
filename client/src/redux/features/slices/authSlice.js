import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    token: null,
    userInfo: null,
  },
  reducers: {
    setCredentials(state, action) {
      const { token, userInfo } = action.payload;
      state.token = token;
      state.userInfo = userInfo;
    },
    logOut(state) {
      state.token = null;
      state.userInfo = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
