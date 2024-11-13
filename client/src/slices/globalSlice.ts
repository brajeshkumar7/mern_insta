import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "global",
  initialState: {
    hamburger: false,
  },
  reducers: {
    toggleSidebar: (state, action) => {
      state.hamburger = action.payload;
    },
  },
});

export const { toggleSidebar } = globalSlice.actions;
export default globalSlice.reducer;
