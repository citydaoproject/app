import React from "react";
import { Parcel } from "../models/Parcel";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setHighlightedParcel } from "../actions";
import { setActiveParcel } from "../actions/parcelsSlice";

interface Props {
  parcel: Parcel;
}

export default function ParcelButton({ parcel }: Props) {
  const dispatch = useAppDispatch();
  const highlightedParcel = useAppSelector(state => state.parcels.highlightedParcel);

  return (
    // Don't use the antd Button class here as that adds subcomponents that mess with styling
    // Instead, we use a standard button tag with the ant-btn class name, giving the same style attributes
    <button
      onMouseEnter={() => dispatch(setHighlightedParcel(parcel))}
      onMouseLeave={() => dispatch(setHighlightedParcel(undefined))}
      onClick={() => dispatch(setActiveParcel(parcel))}
      className={`ant-btn w-full ${highlightedParcel === parcel ? "highlight" : ""}`}
    >
      Parcel #000{parcel.id}
    </button>
  );
}
