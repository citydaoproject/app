import React from "react";
import { Tabs } from "antd";

import { useAppSelector } from "../hooks";
import PlotList from "./PlotList";

const { TabPane } = Tabs;

export default function PlotTabs() {
  const plots = useAppSelector(state => state.plots.plots);

  return (
    <Tabs defaultActiveKey="1" className="p-4 w-96">
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
