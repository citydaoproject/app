import React, { useEffect, useState } from "react";
import { Tabs } from "antd";

import { RootState } from "../store";
import { useAppSelector } from "../hooks";
import PlotList from "./PlotList";
import { stringifyPlotId } from "../helpers/stringifyPlotId";
import FilterNote from "./FilterNote";
import { plotsList } from "../data";
import { NewPlot } from "../models/Plot";

const { TabPane } = Tabs;

export default function PlotTabs() {
  const userAddress = useAppSelector((state: RootState) => state.user.address);
  const fetchingPlots = useAppSelector((state: RootState) => state.plots.fetching);
  const idFilter = useAppSelector((state: RootState) => state.plots.idFilter);
  const currentNumDisplay = useAppSelector((state: RootState) => state.plots.numDisplay);
  // const plots = useAppSelector((state: RootState) => state.plots.plots).filter(plot => {
  //   return stringifyPlotId(plot.id).includes(idFilter ?? "");
  // });
  const [newPlots, setNewPlots] = useState<NewPlot[]>([])
  const [newPlotsNum, setNewPlotsNum] = useState(0);

  useEffect(() => {
    let plotData = plotsList.features as NewPlot[];
    plotData.map((plot: NewPlot, index: number) => {
      if (plot["id"]) {
        return;
      }
      plot["id"] = index + 1;
      return;
    })
    setNewPlots(plotData)
  }, [])

  useEffect(() => {
    let plotData = plotsList.features as NewPlot[];
    let filteredPlot = [];
    filteredPlot = plotData.filter(plot => {
      return stringifyPlotId(plot.id).includes(idFilter ?? "");
    })
    setNewPlots(filteredPlot)
    setNewPlotsNum(filteredPlot.length);
  }, [idFilter])

  return (
    <Tabs defaultActiveKey="1" className="plot-tabs px-4">
      <TabPane tab="All parcels" key="1">
        {idFilter && (
          <FilterNote filterText={idFilter} />
        )}
        <PlotList
          plots={newPlots?.slice(0, currentNumDisplay)}
          totalNum={newPlotsNum}
          emptyMessage={fetchingPlots ? "Loading..." : "We're sold out! Be on the lookout for the next drop."}
        />
      </TabPane>
      {/* <TabPane tab="Sold" key="2">
        {idFilter && (
          <FilterNote filterText={idFilter} />
        )}
        <PlotList
          plots={plots.filter(plot => plot.sold)}
          emptyMessage={fetchingPlots ? "Loading..." : "No plots have been purchased. You could be the first!"}
        />
      </TabPane> */}
      <TabPane tab="Your Land" key="3">
        {idFilter && (
          <FilterNote filterText={idFilter} />
        )}
        {/* {userAddress && (
          <PlotList
            plots={plots.filter(plot => plot.owner === userAddress)}
            emptyMessage={fetchingPlots ? "Loading..." : "You don't own any plots yet."}
          />
        )} */}
        {!userAddress && <span className="text-gray-7 third-font">Connect your wallet to see your owned plots</span>}
      </TabPane>
    </Tabs>
  );
}
