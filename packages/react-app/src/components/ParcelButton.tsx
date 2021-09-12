import React from "react";
import { Button } from "antd";
import { Parcel } from "../models/Parcel";
import { useAppDispatch } from "../hooks";
import { setHighlightedParcel } from "../actions";

interface Props {
  parcel: Parcel;
  highlight?: boolean;
}

export default function ParcelButton({ parcel, highlight }: Props) {
  const dispatch = useAppDispatch();

  return (
    <Button
      onMouseEnter={() => dispatch(setHighlightedParcel(parcel))}
      onMouseLeave={() => dispatch(setHighlightedParcel(undefined))}
      className={`w-full ${highlight ? "highlight" : ""}`}
    >
      {parcel.id}
    </Button>
  );
}
