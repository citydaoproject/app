import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Parcel } from "../models/Parcel";

interface ParcelsState {
  parcels: Parcel[];
}

const initialState: ParcelsState = {
  parcels: [],
};

export const parcelsState = createSlice({
  name: "parcels",
  initialState,
  reducers: {
    setParcels: (state, action: PayloadAction<Parcel[]>) => {
      state.parcels = action.payload;
    },
  },
});

export const { setParcels } = parcelsState.actions;

export default parcelsState.reducer;
