import { createSlice } from "@reduxjs/toolkit";

export const networkSlice = createSlice({
  name: "network",
  initialState: {
    exchangePrice: null,
    gasPrice: null,
  },
  reducers: {
    setExchangePrice: (state, price) => {
      state.exchangePrice = price.payload;
    },
    setGasPrice: (state, price) => {
      state.price = price.payload;
    },
  },
});

export const { setExchangePrice, setGasPrice } = networkSlice.actions;

export default networkSlice.reducer;
