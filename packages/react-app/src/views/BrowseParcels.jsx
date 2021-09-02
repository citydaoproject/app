import React from "react";
import { ParcelMap } from "../components";

export default function BrowseParcels({ parcels, buyParcel }) {
  return (
    <div key={parcels.length} style={{ width: "100%", margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <ParcelMap
        parcels={parcels}
        startingCoordinates={[-106.331, 43.172]}
        startingZoom={9}
        buyParcel={id => buyParcel(id)}
      />
    </div>
  );
}
