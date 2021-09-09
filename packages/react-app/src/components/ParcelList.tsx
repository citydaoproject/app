import React from "react";
import { useAppSelector } from "../hooks";

export default function ParcelList() {
  const parcels = useAppSelector(state => state.parcels.parcels);

  return (
    <div className="w-full">
      {parcels.map(parcel => {
        return <div key={parcel.id}>{parcel.id}</div>;
      })}
    </div>
  );
}
