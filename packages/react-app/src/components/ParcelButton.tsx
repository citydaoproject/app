import React from "react";
import { Button } from "antd";
import { Parcel } from "../models/Parcel";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setHighlightedParcel } from "../actions";

interface Props {
  parcel: Parcel;
}

export default function ParcelButton({ parcel }: Props) {
  const dispatch = useAppDispatch();
  const highlightedParcel = useAppSelector(state => state.parcels.highlightedParcel);

  return (
    <Button
      onMouseEnter={() => dispatch(setHighlightedParcel(parcel))}
      onMouseLeave={() => dispatch(setHighlightedParcel(undefined))}
      className={`w-full ${highlightedParcel === parcel ? "highlight" : ""}`}
    >
      Parcel #000{parcel.id}
    </Button>
  );
}
