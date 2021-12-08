import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  address?: string;
  whitelistedAmount?: number;
}

const initialState: UserState = {
  address: undefined,
  whitelistedAmount: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setWhitelistedAmount: (state, action: PayloadAction<number>) => {
      state.whitelistedAmount = action.payload;
    },
  },
});

export const { setUserAddress, setWhitelistedAmount } = userSlice.actions;

export default userSlice.reducer;
