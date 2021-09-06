import { createSlice } from "@reduxjs/toolkit";

export const debugSlice = createSlice({
  name: "network",
  initialState: {
    debug: false,
  },
  reducers: {
    setDebugMode: (state, isDebugMode) => {
      state.debug = isDebugMode;
    },
  },
});

export const { setDebugMode } = debugSlice.actions;

export default debugSlice.reducer;
