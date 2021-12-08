import { Tooltip } from "antd";
import React from "react";
import { useAppSelector } from "../hooks";
import { RootState } from "../store";

interface Props {
  onClick: () => void;
}
export default function EnterRaffle({ onClick }: Props) {
  const userAddress = useAppSelector((state: RootState) => state.user.address);
  return (
    <Tooltip title={userAddress ? null : "Connect your wallet to enter the raffle."}>
      <button
        onClick={() => userAddress && onClick()}
        className={`connect-wallet-button connect-wallet secondary-font text-lg px-4 h-9 rounded ${
          !userAddress ? "opacity-50" : ""
        } flex items-center justify-center`}
      >
        Enter Raffle
      </button>
    </Tooltip>
  );
}
