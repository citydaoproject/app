import { Modal, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Transactor } from "../helpers";
import { useAppSelector, useContractLoader, useUserSigner } from "../hooks";
import { RootState } from "../store";

interface Props {
  injectedProvider: any;
  inRaffle: boolean;
  resetStatus: () => void;
}
export default function EnterRaffle({ injectedProvider, inRaffle, resetStatus }: Props) {
  const userAddress = useAppSelector((state: RootState) => state.user.address);
  const gasPrice = useAppSelector(state => state.network.gasPrice);
  const [tooltip, setTooltip] = useState("");
  const contracts: any = useContractLoader(injectedProvider);
  const userSigner = useUserSigner(injectedProvider);
  const tx = Transactor(userSigner, gasPrice);

  const enterRaffle = async () => {
    tx && contracts && (await tx(contracts.CityDaoParcel.enterRaffle()));
    resetStatus();
    return true;
  };

  useEffect(() => {
    if (inRaffle) {
      setTooltip("You have already entered the raffle");
    } else {
      setTooltip("Connect your wallet to enter the raffle.");
    }
  }, [inRaffle]);

  const raffleRules = () => {
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
      onOk: enterRaffle,
    });
  };

  return (
    <Tooltip title={userAddress && !inRaffle ? null : tooltip}>
      <button
        onClick={() => userAddress && !inRaffle && raffleRules()}
        className={`connect-wallet-button connect-wallet secondary-font px-4 h-9 rounded ${
          !userAddress || inRaffle ? "opacity-50" : ""
        } flex items-center justify-center`}
      >
        Enter Raffle
      </button>
    </Tooltip>
  );
}
