import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Plot } from "../models/Plot";

interface PlotsState {
  plots: Plot[];
  highlightedPlot?: Plot;
  activePlot?: Plot;
  idFilter?: string;
}

const initialState: PlotsState = {
  plots: [],
  highlightedPlot: undefined,
  activePlot: undefined,
};

export const plotsState = createSlice({
  name: "plots",
  initialState,
  reducers: {
    setPlots: (state, action: PayloadAction<Plot[]>) => {
      state.plots = action.payload;
    },
    setHighlightedPlot: (state, action: PayloadAction<Plot | undefined>) => {
      if (!state.activePlot) {
        state.highlightedPlot = action.payload;
      }
    },
    setActivePlot: (state, action: PayloadAction<Plot | undefined>) => {
      state.activePlot = action.payload;
      state.highlightedPlot = action.payload;
    },
    setIdFilter: (state, action: PayloadAction<string | undefined>) => {
      state.idFilter = action.payload;
    },
  },
});

export const { setPlots, setHighlightedPlot, setActivePlot, setIdFilter } = plotsState.actions;

export default plotsState.reducer;
