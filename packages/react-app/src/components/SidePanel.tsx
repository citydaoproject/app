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
}

export default function SidePanel({ contracts, injectedProvider, mainnetProvider, userNft }: Props) {
  const userAddress = useAppSelector((state: RootState) => state.user.address);
  const idFilter = useAppSelector((state: RootState) => state.plots.idFilter);
  const activePlot = useAppSelector(state => state.plots.activePlot);
  const [newPlots, setNewPlots] = useState<Plot[]>([]);
  const [newPlotsNum, setNewPlotsNum] = useState(0);

  useEffect(() => {
    const plotData = plotsList.features as Plot[];
    plotData.map((plot: Plot, index: number) => {
      if (plot["id"]) {
        return;
      }
      plot["id"] = index + 1;
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

  useEffect(() => {
    const filteredArray = newPlots.filter(item => userNft.includes(item.id));
  }, [userNft, newPlots]);

  return (
    <div className="plot-tabs overflow-auto">
      {activePlot !== undefined ? (
        <PlotDetail
          plot={activePlot}
          contracts={contracts}
          injectedProvider={injectedProvider}
          mainnetProvider={mainnetProvider}
        />
      ) : !userAddress ? (
        <div className="px-10 py-11">
          <LocationDetail />
          <TerrainDetail />
        </div>
      ) : activePlot !== undefined ? (
        <PlotDetail
          plot={activePlot}
          contracts={contracts}
          injectedProvider={injectedProvider}
          mainnetProvider={mainnetProvider}
        />
      ) : (
        <div className="py-6">
          <PlotList plots={newPlots.filter(item => userNft.includes(item.id))} totalNum={userNft.length} />
        </div>
      )}
    </div>
  );
}
