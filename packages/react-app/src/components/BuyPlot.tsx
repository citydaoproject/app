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
  const userSigner = useUserSigner(injectedProvider);
  const contracts: any = useContractLoader(injectedProvider);

  const tx = Transactor(userSigner, gasPrice);
  const useBuyPlot = async () => {
    const mintPromise = tx && plot && (await tx(contracts.CityDaoParcel.mintPlot(userAddress, plot.id)));
    // await toast.promise(mintPromise, {
    //   pending: { render: () => "Purchasing plot", className: "toast" },
    //   success: { render: () => "Purchase complete", className: "toast" },
    //   error: { render: () => "Oops! Something went wrong.", className: "toast" },
    // });
    useUpdatePlots(contracts, DEBUG).then(newPlots => {
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
