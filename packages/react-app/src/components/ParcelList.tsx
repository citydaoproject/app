import React from "react";
import { List } from "antd";
import { Parcel } from "../models/Parcel";

interface Props {
  parcels: Parcel[];
}

export default function ParcelList({ parcels }: Props) {
  return <List dataSource={parcels} renderItem={parcel => <List.Item>{parcel.id}</List.Item>} />;
}
