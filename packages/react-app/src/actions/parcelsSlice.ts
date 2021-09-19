import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Parcel } from "../models/Parcel";

interface ParcelsState {
  parcels: Parcel[];
  highlightedParcel?: Parcel;
}

const initialState: ParcelsState = {
  parcels: [],
  highlightedParcel: undefined,
};

export const parcelsState = createSlice({
  name: "parcels",
  initialState,
  reducers: {
    setParcels: (state, action: PayloadAction<Parcel[]>) => {
      state.parcels = action.payload;
    },
    setHighlightedParcel: (state, action: PayloadAction<Parcel | undefined>) => {
      state.highlightedParcel = action.payload;
    },
  },
});

export const { setParcels, setHighlightedParcel } = parcelsState.actions;

export default parcelsState.reducer;
