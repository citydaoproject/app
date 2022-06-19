import { Tooltip } from "antd";
import React from "react";
import { useAppSelector } from "../hooks";
import { RootState } from "../store";

interface Props {
  onClick: () => void;
}
export default function ConnectWalletButton({ onClick }: Props) {
  const userAddress = useAppSelector((state: RootState) => state.user.address);
  return (
    <Tooltip title={userAddress}>
      <button
        onClick={onClick}
        className={`connect-wallet-button ${
          userAddress ? "connected" : "connect-wallet"
        } secondary-font px-4 h-9 rounded`}
      >
        {userAddress ? userAddress?.slice(0, 6) + "..." + userAddress?.slice(-5, -1) : "Connect Wallet"}
      </button>
    </Tooltip>
  );
}
