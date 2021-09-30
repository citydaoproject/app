import React from "react";
import { Tabs } from "antd";

import { RootState } from "../store";
import { useAppSelector } from "../hooks";
import PlotList from "./PlotList";
import { stringifyPlotId } from "../helpers/stringifyPlotId";

const { TabPane } = Tabs;

export default function PlotTabs() {
  const idFilter = useAppSelector((state: RootState) => state.plots.idFilter);
  const plots = useAppSelector((state: RootState) => state.plots.plots).filter(plot => {
    return stringifyPlotId(plot.id).includes(idFilter ?? "");
  });

  return (
    <Tabs defaultActiveKey="1" className="px-4 w-full overflow-visible">
      <TabPane tab="Remaining" key="1">
        <PlotList plots={plots.filter(plot => !plot.sold)} />
      </TabPane>
      <TabPane tab="Sold" key="2">
        <PlotList plots={plots.filter(plot => plot.sold)} />
      </TabPane>
      <TabPane tab="All" key="3">
        <PlotList plots={plots} />
      </TabPane>
    </Tabs>
  );
}
