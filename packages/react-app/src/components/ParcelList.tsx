import React from "react";
import { List } from "antd";

import { Parcel } from "../models/Parcel";
import ParcelButton from "./ParcelButton";

interface Props {
  parcels: Parcel[];
}

export default function ParcelList({ parcels }: Props) {
  return (
    <List
      dataSource={parcels}
      renderItem={parcel => (
        <List.Item>
          <ParcelButton parcel={parcel} />
        </List.Item>
      )}
    />
  );
}
