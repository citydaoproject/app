import { createSlice } from "@reduxjs/toolkit";

export const networkSlice = createSlice({
  name: "network",
  initialState: {
    exchangePrice: null,
  },
  reducers: {
    setExchangePrice: (state, price) => {
      state.exchangePrice = price.payload;
    },
  },
});

export const { setExchangePrice } = networkSlice.actions;

export default networkSlice.reducer;
