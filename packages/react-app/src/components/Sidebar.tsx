import React from "react";
import { Col } from "antd";
import { useAppSelector } from "../hooks";

import ParcelTabs from "./ParcelTabs";
import ParcelDetail from "./ParcelDetail";

export default function Sidebar() {
  const activeParcel = useAppSelector(state => state.parcels.activeParcel);
  return (
    <Col className="w-96">{activeParcel !== undefined ? <ParcelDetail parcel={activeParcel} /> : <ParcelTabs />}</Col>
  );
}
