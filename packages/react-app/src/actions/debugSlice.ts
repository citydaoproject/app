import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DebugState {
  debug: boolean;
}

const initialState: DebugState = {
  debug: process.env.REACT_APP_DEBUG === "1",
};

export const debugSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setDebugMode: (state, action: PayloadAction<boolean>) => {
      state.debug = action.payload;
    },
  },
});

export const { setDebugMode } = debugSlice.actions;

export default debugSlice.reducer;
