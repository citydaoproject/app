import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  address?: string;
  isWhitelisted?: boolean;
}

const initialState: UserState = {
  address: undefined,
  isWhitelisted: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setIsWhitelisted: (state, action: PayloadAction<boolean>) => {
      state.isWhitelisted = action.payload;
    },
  },
});

export const { setUserAddress, setIsWhitelisted } = userSlice.actions;

export default userSlice.reducer;
