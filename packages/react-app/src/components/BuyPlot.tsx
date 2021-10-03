import React from "react";
import { toast } from "react-toastify";
import { setPlots } from "../actions";
import { setActivePlot } from "../actions/plotsSlice";
import { Transactor } from "../helpers";
import { useAppDispatch, useAppSelector, useContractLoader, useUpdatePlots, useUserSigner } from "../hooks";
import { Plot } from "../models/Plot";

interface Props {
  plot?: Plot;
  injectedProvider: any;
}

export default function BuyPlot({ plot, injectedProvider }: Props) {
  const dispatch = useAppDispatch();

  const userAddress = useAppSelector(state => state.user.address);
  const DEBUG = useAppSelector(state => state.debug.debug);
  const gasPrice = useAppSelector(state => state.network.gasPrice);
  const plots = useAppSelector(state => state.plots.plots);
  const userSigner = useUserSigner(injectedProvider);
  const contracts: any = useContractLoader(injectedProvider);

  const tx = Transactor(userSigner, gasPrice);
  const useBuyPlot = async () => {
    tx && plot && (await tx(contracts.CityDaoParcel.mintPlot(userAddress, plot.id)));
    useUpdatePlots(contracts, plots, DEBUG).then(newPlots => {
      dispatch(setPlots(newPlots));
      dispatch(setActivePlot(undefined)); // reset active plot
    });
  };

  return (
    <button onClick={useBuyPlot} className="btn bg-primary w-full">
      Buy Now
    </button>
  );
}
