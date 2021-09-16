import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Parcel } from "../models/Parcel";

interface ParcelsState {
  parcels: Parcel[];
  highlightedParcel?: Parcel;
  activeParcel?: Parcel;
}

const initialState: ParcelsState = {
  parcels: [],
  highlightedParcel: undefined,
  activeParcel: undefined,
};

export const parcelsState = createSlice({
  name: "parcels",
  initialState,
  reducers: {
    setParcels: (state, action: PayloadAction<Parcel[]>) => {
      state.parcels = action.payload;
    },
    setHighlightedParcel: (state, action: PayloadAction<Parcel | undefined>) => {
      if (!state.activeParcel) {
        state.highlightedParcel = action.payload;
      }
    },
    setActiveParcel: (state, action: PayloadAction<Parcel | undefined>) => {
      state.activeParcel = action.payload;
      state.highlightedParcel = action.payload;
    },
  },
});

export const { setParcels, setHighlightedParcel, setActiveParcel } = parcelsState.actions;

export default parcelsState.reducer;
