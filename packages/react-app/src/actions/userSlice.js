import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    address: null,
  },
  reducers: {
    setUserAddress: (state, address) => {
      state.address = address.payload;
      console.log(address);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserAddress } = userSlice.actions;

export default userSlice.reducer;
