import { Tooltip } from "antd";
import React from "react";
import { useAppSelector } from "../hooks";
import { RootState } from "../store";
import { sliceUserAddress } from "../helpers/sliceUserAddress";

interface Props {
  onClick: () => void;
}
export default function ConnectWalletButton({ onClick }: Props) {
  const userAddress = useAppSelector((state: RootState) => state.user.address);
  return (
    <Tooltip title={userAddress}>
      <button
        onClick={onClick}
        className={`connect-wallet-button primary-font ${userAddress ? "lowercase" : ""} px-4 h-9 rounded`}
      >
        {userAddress ? sliceUserAddress(userAddress) : "Connect"}
      </button>
    </Tooltip>
  );
}
