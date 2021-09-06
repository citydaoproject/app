import React, { useState } from "react";

import { Transactor } from "../helpers";
import { useUpdateParcels, useUserSigner, useContractLoader, useAppSelector } from "../hooks";
import { ParcelMap } from "../components";

interface Props {
  injectedProvider: any;
}

export default function BrowseParcels({ injectedProvider }: Props) {
  const [parcels, setParcels] = useState([]);
  const userAddress = useAppSelector(state => state.user.address);
  const gasPrice = useAppSelector(state => state.network.gasPrice);

  const userSigner = useUserSigner(injectedProvider);
  const contracts: any = useContractLoader(injectedProvider);

  const tx = Transactor(userSigner, gasPrice);
  useUpdateParcels(parcels, setParcels, contracts);

  const useBuyParcel = async (id: string) => {
    tx && (await tx(contracts.CityDaoParcel.mintParcel(userAddress, id)));
    useUpdateParcels(parcels, setParcels, contracts, true);
  };

  return (
    <div key={parcels.length} style={{ width: "100%", margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <ParcelMap parcels={parcels} startingCoordinates={[-106.331, 43.172]} startingZoom={9} buyParcel={useBuyParcel} />
    </div>
  );
}
