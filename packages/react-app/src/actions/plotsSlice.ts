import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Plot } from "../models/Plot";

interface PlotsState {
  plots: Plot[];
  communal: any[];
  highlightedPlot?: Plot;
  activePlot?: Plot;
  idFilter?: string;
  fetching: boolean;
  numDisplay: any;
  activePlotNftData?: any;
}

const initialState: PlotsState = {
  plots: [],
  communal: [],
  highlightedPlot: undefined,
  activePlot: undefined,
  fetching: true,
  numDisplay: 10,
  activePlotNftData: undefined,
};

export const plotsState = createSlice({
  name: "plots",
  initialState,
  reducers: {
    setPlots: (state, action: PayloadAction<Plot[]>) => {
      state.plots = action.payload;
    },
    setHighlightedPlot: (state, action: PayloadAction<Plot | undefined>) => {
        state.highlightedPlot = action.payload;
    },
    setActivePlot: (state, action: PayloadAction<Plot | undefined>) => {
      state.activePlot = action.payload;
    },
    setIdFilter: (state, action: PayloadAction<string | undefined>) => {
      state.idFilter = action.payload;
    },
    fetchedPlots: state => {
      state.fetching = false;
    },
    setCommunalLand: (state, action: PayloadAction<any[]>) => {
      state.communal = action.payload;
    },
    setNumDisplayPlots: (state, action: PayloadAction<number | undefined>) => {
      state.numDisplay = action.payload;
    },
    setActivePlotNftData: (state, action: PayloadAction<Plot | undefined>) => {
      state.activePlotNftData = action.payload;
    },
  },
});

export const {
  setPlots,
  setHighlightedPlot,
  setActivePlot,
  setIdFilter,
  fetchedPlots,
  setCommunalLand,
  setNumDisplayPlots,
  setActivePlotNftData,
} = plotsState.actions;

export default plotsState.reducer;
