import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  address?: string;
}

const initialState: UserState = {
  address: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
  },
});

export const { setUserAddress } = userSlice.actions;

export default userSlice.reducer;
