import React, { useEffect, useState } from "react";

import { RootState } from "../store";
import { useAppSelector } from "../hooks";
import PlotList from "./PlotList";
import { stringifyPlotId } from "../helpers/stringifyPlotId";
import FilterNote from "./FilterNote";
import { plotsList } from "../data";
import { Plot } from "../models/Plot";

export default function PlotTabs() {
  const fetchingPlots = useAppSelector((state: RootState) => state.plots.fetching);
  const idFilter = useAppSelector((state: RootState) => state.plots.idFilter);
  const currentNumDisplay = useAppSelector((state: RootState) => state.plots.numDisplay);
  const [newPlots, setNewPlots] = useState<Plot[]>([]);
  const [newPlotsNum, setNewPlotsNum] = useState(0);

  useEffect(() => {
    const plotData = plotsList.features as Plot[];
    plotData.map((plot: Plot, index: number) => {
      if (plot["id"]) {
        return;
      }
      plot["id"] = plot.properties.PLOT_ID;
      return;
    });
    setNewPlots(plotData);
  }, []);

  useEffect(() => {
    const plotData = plotsList.features as Plot[];
    let filteredPlot = [];
    filteredPlot = plotData.filter(plot => {
      return stringifyPlotId(plot.id).includes(idFilter ?? "");
    });
    setNewPlots(filteredPlot);
    setNewPlotsNum(filteredPlot.length);
  }, [idFilter]);

  return (
    <div className="plot-tabs">
      {idFilter && <FilterNote filterText={idFilter} />}
      <PlotList plots={newPlots?.slice(0, currentNumDisplay)} totalNum={newPlotsNum} isLoading={fetchingPlots} />
    </div>
  );
}
