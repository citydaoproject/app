import React, { useEffect, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";

import { Transactor } from "../helpers";
import { useUpdateParcels, useUserSigner, useContractLoader, useAppSelector } from "../hooks";
import { ParcelMap } from "../components";
import { Parcel } from "../models/Parcel";

interface Props {
  injectedProvider: any;
}

export default function BrowseParcels({ injectedProvider }: Props) {
  const [parcels, setParcels] = useState([] as Parcel[]);
  const userAddress = useAppSelector(state => state.user.address);
  const DEBUG = useAppSelector(state => state.debug.debug);
  const gasPrice = useAppSelector(state => state.network.gasPrice);

  const userSigner = useUserSigner(injectedProvider);
  const contracts: any = useContractLoader(injectedProvider);

  const tx = Transactor(userSigner, gasPrice);
  useUpdateParcels(contracts, DEBUG).then(newParcels => {
    if (newParcels.length !== parcels.length) setParcels(newParcels);
  });

  const useBuyParcel = async (id: BigNumber) => {
    tx && (await tx(contracts.CityDaoParcel.mintParcel(userAddress, id)));
    useUpdateParcels(contracts, DEBUG).then(newParcels => {
      setParcels(newParcels);
    });
  };

  return (
    <div style={{ width: "100%", margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      {/* key prop is to cause rerendering whenever it changes */}
      <ParcelMap
        key={parcels.length}
        parcels={parcels}
        startingCoordinates={[-106.331, 43.172]}
        startingZoom={9}
        buyParcel={useBuyParcel}
      />
    </div>
  );
}
