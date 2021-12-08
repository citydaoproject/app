import { BigNumber, ethers } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { setPlots } from "../actions";
import { setActivePlot } from "../actions/plotsSlice";
import { Transactor } from "../helpers";
import { useAppDispatch, useAppSelector, useContractLoader, useUserSigner } from "../hooks";
import { Plot } from "../models/Plot";
import { Modal, Tooltip } from "antd";
import updatePlots from "../helpers/UpdatePlots";
import "./../App.less";

interface Props {
  plot: Plot;
  injectedProvider: any;
}

export default function BuyPlot({ plot, injectedProvider }: Props) {
  const dispatch = useAppDispatch();

  const DEBUG = useAppSelector(state => state.debug.debug);
  const userAddress = useAppSelector(state => state.user.address);
  const whitelistedAmount = useAppSelector(state => state.user.whitelistedAmount);
  const gasPrice = useAppSelector(state => state.network.gasPrice);
  const plots = useAppSelector(state => state.plots.plots);
  const userSigner = useUserSigner(injectedProvider);
  const contracts: any = useContractLoader(injectedProvider);
  const [numOwnedPlots, setNumOwnedPlots] = useState(0);

  useEffect(() => {
    setNumOwnedPlots(plots.filter(plot => plot.owner === userAddress).length);
  }, [plots]);

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

    return true;
  }, [contracts, dispatch, plots, plot, userAddress, userSigner, tx]);

  const handleClick = () => {
    Modal.confirm({
      title: "Legal disclaimer!",
      content: `By confirming, you hereby agree to the following conditions.. 
      lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum`,
      okText: "Yes",
      cancelText: "No",
      okType: "primary",
      okButtonProps: {
        className: "confirm",
      },
      centered: true,
      onOk: buyPlot,
    });
  };

  const getButton = () => {
    const isWhitelisted = whitelistedAmount ? whitelistedAmount > 1 : false;
    return (
      <button
        onClick={handleClick}
        className={`btn bg-primary w-full ${!userAddress || !isWhitelisted || numOwnedPlots >= 2 ? "opacity-50" : ""}`}
        disabled={!userAddress || !isWhitelisted}
      >
        Buy Now
      </button>
    );
  };

  const getTooltip = (button: JSX.Element) => {
    const isWhitelisted = whitelistedAmount ? whitelistedAmount > 1 : false;
    let text = "Unable to purchase plot.";
    if (!userAddress) {
      text = "Connect your wallet to buy this plot.";
    } else if (!isWhitelisted) {
      text = "You do not have any whitelisted spots remaining. Check back tomorrow.";
    } else {
      return button;
    }
    return <Tooltip title={text}>{button}</Tooltip>;
  };

  return getTooltip(getButton());
}
