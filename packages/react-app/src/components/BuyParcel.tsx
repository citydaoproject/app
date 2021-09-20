import React from "react";
import { setParcels } from "../actions";
import { Transactor } from "../helpers";
import { useAppDispatch, useAppSelector, useContractLoader, useUpdateParcels, useUserSigner } from "../hooks";
import { Parcel } from "../models/Parcel";

interface Props {
  parcel?: Parcel;
  injectedProvider: any;
}

export default function BuyParcel({ parcel, injectedProvider }: Props) {
  const dispatch = useAppDispatch();

  const userAddress = useAppSelector(state => state.user.address);
  const DEBUG = useAppSelector(state => state.debug.debug);
  const gasPrice = useAppSelector(state => state.network.gasPrice);
  const userSigner = useUserSigner(injectedProvider);
  const contracts: any = useContractLoader(injectedProvider);

  const tx = Transactor(userSigner, gasPrice);
  const useBuyParcel = async () => {
    tx && parcel && (await tx(contracts.CityDaoParcel.mintParcel(userAddress, parcel.id)));
    useUpdateParcels(contracts, DEBUG).then(newParcels => {
      dispatch(setParcels(newParcels));
    });
  };

  return (
    <button onClick={useBuyParcel} className="btn highlight">
      Buy Now
    </button>
  );
}
