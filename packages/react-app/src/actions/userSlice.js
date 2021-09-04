import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    address: null,
  },
  reducers: {
    setUserAddress: (state, address) => {
      state.address = address.payload;
    },
  },
});

export const { setUserAddress } = userSlice.actions;

export default userSlice.reducer;
