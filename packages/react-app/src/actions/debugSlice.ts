import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DebugState {
  debug: boolean;
}

const initialState: DebugState = {
  debug: false,
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
