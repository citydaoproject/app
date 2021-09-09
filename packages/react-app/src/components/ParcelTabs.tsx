import React from "react";
import { Tabs } from "antd";

import { useAppSelector } from "../hooks";
import ParcelList from "./ParcelList";

const { TabPane } = Tabs;

export default function ParcelTabs() {
  const parcels = useAppSelector(state => state.parcels.parcels);

  return (
    <Tabs defaultActiveKey="1" className="p-4">
      <TabPane tab="Remaining" key="1">
        <ParcelList parcels={parcels} />
      </TabPane>
      <TabPane tab="Sold" key="2">
        <ParcelList parcels={parcels} />
      </TabPane>
      <TabPane tab="All" key="3">
        <ParcelList parcels={parcels} />
      </TabPane>
    </Tabs>
  );
}
