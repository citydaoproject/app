import { BigNumber, ethers } from "ethers";
import React from "react";
import { toast } from "react-toastify";
import { setPlots } from "../actions";
import { setActivePlot } from "../actions/plotsSlice";
import { Transactor } from "../helpers";
import { useAppDispatch, useAppSelector, useContractLoader, useUpdatePlots, useUserSigner } from "../hooks";
import { Plot } from "../models/Plot";

interface Props {
  plot: Plot;
  injectedProvider: any;
}

export default function BuyPlot({ plot, injectedProvider }: Props) {
  const dispatch = useAppDispatch();

  const DEBUG = useAppSelector(state => state.debug.debug);
  const gasPrice = useAppSelector(state => state.network.gasPrice);
  const plots = useAppSelector(state => state.plots.plots);
  const userSigner = useUserSigner(injectedProvider);
  const contracts: any = useContractLoader(injectedProvider);

  const tx = Transactor(userSigner, gasPrice);
  const useBuyPlot = async () => {
    if (!plot.sold && userSigner) {
      const price = BigNumber.from(ethers.utils.parseEther(plot.price ?? "0"));
      tx && plot && (await tx(contracts.CityDaoParcel.buyPlot(plot.id, { value: price })));
    } else if (plot.sold) {
      throw new Error("Plot is already sold");
    } else if (!userSigner) {
      toast.error("Please connect your wallet to buy this plot.", {
        className: "error",
        toastId: "no-connected-wallet",
      });
    }
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
