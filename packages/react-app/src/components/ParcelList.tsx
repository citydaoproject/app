import React from "react";
import { List } from "antd";

import { Parcel } from "../models/Parcel";
import ParcelButton from "./ParcelButton";
import { useAppSelector } from "../hooks";

interface Props {
  parcels: Parcel[];
}

export default function ParcelList({ parcels }: Props) {
  const highlightedParcel = useAppSelector(state => state.parcels.highlightedParcel);
  return (
    <List
      dataSource={parcels}
      renderItem={parcel => (
        <List.Item>
          <ParcelButton highlight={highlightedParcel === parcel} parcel={parcel} />
        </List.Item>
      )}
    />
  );
}
