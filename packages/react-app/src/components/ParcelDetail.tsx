import { Divider } from "antd";
import React from "react";
import { Parcel } from "../models/Parcel";

interface Props {
  parcel?: Parcel;
}

export default function ParcelDetail({ parcel }: Props) {
  return (
    <div className="parcel-detail">
      <div className="flex justify-start">
        <span className="parcel-title primary-font text-lg font-medium leading-6 mr-4">
          Parcel #{"0".repeat(4 - (parcel?.id.toString().length ?? 0))}
          {parcel?.id}
        </span>
        <span className="parcel-price secondary-font text-base font-light text-gray-9 leading-6">
          ({parcel?.price?.toString() ?? "--"} ETH)
        </span>
      </div>
      <Divider />
    </div>
  );
}
