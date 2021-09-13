import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NetworkState {
  exchangePrice?: number;
  gasPrice?: number;
}

const initialState: NetworkState = {
  exchangePrice: undefined,
  gasPrice: undefined,
};

export const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setExchangePrice: (state, action: PayloadAction<number>) => {
      state.exchangePrice = action.payload;
    },
    setGasPrice: (state, action: PayloadAction<number>) => {
      state.gasPrice = action.payload;
    },
  },
});

export const { setExchangePrice, setGasPrice } = networkSlice.actions;

export default networkSlice.reducer;
