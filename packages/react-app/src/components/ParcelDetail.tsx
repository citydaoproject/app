import React from "react";
import { Parcel } from "../models/Parcel";

interface Props {
  parcel?: Parcel;
}

export default function ParcelDetail({ parcel }: Props) {
  return <div>{parcel?.id}</div>;
}
