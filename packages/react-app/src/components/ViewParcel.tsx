import React from "react";
import { Parcel } from "../models/Parcel";

interface Props {
  parcel?: Parcel;
}

export default function ViewParcel({ parcel }: Props) {
  return <button className="btn">View on OpenSea</button>;
}
