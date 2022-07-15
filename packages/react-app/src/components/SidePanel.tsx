import React, { useEffect, useState } from "react";

import { RootState } from "../store";
import { useAppSelector } from "../hooks";
import PlotList from "./PlotList";
import { stringifyPlotId } from "../helpers/stringifyPlotId";
import { plotsList } from "../data";
import { Plot } from "../models/Plot";
import { LocationDetail, TerrainDetail, PlotDetail } from "./";

interface Props {
  contracts: any;
  injectedProvider: any;
  mainnetProvider: any;
  userNft: Array<number>;
  isShowingOwnedPlot: boolean;
  setShowingOwnedPlot: any;
}

export default function SidePanel({ contracts, injectedProvider, mainnetProvider, userNft, isShowingOwnedPlot, setShowingOwnedPlot }: Props) {
  const idFilter = useAppSelector((state: RootState) => state.plots.idFilter);
  const activePlot = useAppSelector(state => state.plots.activePlot);
  const [newPlots, setNewPlots] = useState<Plot[]>([]);

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
  }, [idFilter]);

  return (
    <div className="plot-tabs overflow-auto">
      {isShowingOwnedPlot ? (
        <div className="py-6">
          <PlotList
            plots={newPlots.filter(item => userNft.includes(item.id))}
            totalNum={userNft.length}
            setShowingOwnedPlot={setShowingOwnedPlot}
          />
        </div>
      ) : activePlot !== undefined ? (
        <PlotDetail
          plot={activePlot}
          contracts={contracts}
          injectedProvider={injectedProvider}
          mainnetProvider={mainnetProvider}
          setShowingOwnedPlot={setShowingOwnedPlot}
        />
      ) : (
        <div className="px-10 py-11">
          <LocationDetail />
          <TerrainDetail />
        </div>
      )}
    </div>
  );
}
