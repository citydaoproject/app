import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Transactor } from "../helpers";
import { useUpdateParcels } from "../hooks";
import { ParcelMap } from "../components";

export default function BrowseParcels({ readContracts, writeContracts, userSigner }) {
  const [parcels, setParcels] = useState([]);
  const userAddress = useSelector(state => state.user.address);
  const gasPrice = useSelector(state => state.network.gasPrice);

  const tx = Transactor(userSigner, gasPrice);
  useUpdateParcels(parcels, setParcels, readContracts);

  const useBuyParcel = async id => {
    await tx(writeContracts.CityDaoParcel.mintParcel(userAddress, id));
    useUpdateParcels(parcels, setParcels, readContracts, true);
  };

  return (
    <div key={parcels.length} style={{ width: "100%", margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <ParcelMap parcels={parcels} startingCoordinates={[-106.331, 43.172]} startingZoom={9} buyParcel={useBuyParcel} />
    </div>
  );
}
