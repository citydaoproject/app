import { BigNumber, ethers } from "ethers";
import React, { useCallback } from "react";
import { toast } from "react-toastify";
import { setPlots } from "../actions";
import { setActivePlot } from "../actions/plotsSlice";
import { Transactor } from "../helpers";
import { useAppDispatch, useAppSelector, useContractLoader, updatePlots, useUserSigner } from "../hooks";
import { Plot } from "../models/Plot";
import { Modal } from 'antd';

interface Props {
  plot: Plot;
  injectedProvider: any;
  networkProvider: any;
}

export default function BuyPlot({ plot, injectedProvider, networkProvider }: Props) {
  const dispatch = useAppDispatch();

  const DEBUG = useAppSelector(state => state.debug.debug);
  const userAddress = useAppSelector(state => state.user.address);
  const gasPrice = useAppSelector(state => state.network.gasPrice);
  const plots = useAppSelector(state => state.plots.plots);
  const userSigner = useUserSigner(injectedProvider);
  const contracts: any = useContractLoader(networkProvider);

  const tx = Transactor(userSigner, gasPrice);
  const buyPlot = useCallback(async () => {
    if (!plot.sold && userAddress && contracts?.CityDaoParcel) {
      const price = BigNumber.from(ethers.utils.parseEther(plot.price ?? "0"));
      tx && plot && (await tx(contracts.CityDaoParcel.buyPlot(plot.id, { value: price })));
    } else if (plot.sold) {
      throw new Error("Plot is already sold");
    } else if (!userAddress) {
      toast.error("Please connect your wallet to buy this plot.", {
        className: "error",
        toastId: "no-connected-wallet",
      });
    }

    updatePlots(contracts, plots, DEBUG).then(newPlots => {
      dispatch(setPlots(newPlots));
      dispatch(setActivePlot(undefined)); // reset active plot
    });
  }, []);

  const handleClick = () => {
    
    Modal.confirm({
      title: 'Legal disclaimer!',
      content: 'By confirming, you hereby agree to the following conditions..',
      okText: 'Yes',
      cancelText: 'No',
      okType: 'primary',
      centered: true,
      onOk: buyPlot,
    });
  }

  return (
    <button onClick={handleClick} className="btn bg-primary w-full">
      Buy Now
    </button>
  );
}
