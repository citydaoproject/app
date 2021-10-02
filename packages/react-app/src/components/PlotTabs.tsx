import React from "react";
import { Tabs } from "antd";

import { RootState } from "../store";
import { useAppSelector } from "../hooks";
import PlotList from "./PlotList";
import { stringifyPlotId } from "../helpers/stringifyPlotId";

const { TabPane } = Tabs;

export default function PlotTabs() {
  const userAddress = useAppSelector((state: RootState) => state.user.address);
  const fetchingPlots = useAppSelector((state: RootState) => state.plots.fetching);
  const idFilter = useAppSelector((state: RootState) => state.plots.idFilter);
  const plots = useAppSelector((state: RootState) => state.plots.plots).filter(plot => {
    return stringifyPlotId(plot.id).includes(idFilter ?? "");
  });
  console.log(fetchingPlots);

  return (
    <Tabs defaultActiveKey="1" className="px-4 w-full overflow-visible">
      <TabPane tab="Remaining" key="1">
        <PlotList
          plots={plots.filter(plot => !plot.sold)}
          emptyMessage={fetchingPlots ? "Loading..." : "We're sold out! Be on the lookout for the next drop."}
        />
      </TabPane>
      <TabPane tab="Sold" key="2">
        <PlotList
          plots={plots.filter(plot => plot.sold)}
          emptyMessage={fetchingPlots ? "Loading..." : "No plots have been purchased. You could be the first!"}
        />
      </TabPane>
      <TabPane tab="Your Land" key="3">
        <PlotList
          plots={plots.filter(plot => plot.owner === userAddress && userAddress)}
          emptyMessage={fetchingPlots ? "Loading..." : "You don't have any plots yet."}
        />
        {!userAddress && <span className="text-gray-7 third-font">Connect your wallet to see your owned plots</span>}
      </TabPane>
    </Tabs>
  );
}
