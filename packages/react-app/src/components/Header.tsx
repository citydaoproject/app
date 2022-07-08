import React from "react";
import { ConnectWalletButton } from ".";
import { useAppSelector } from "../hooks";
import { RootState } from "../store";

interface Props {
  connectWallet: () => void;
  userNft: number;
}
export default function Header({ connectWallet, userNft }: Props) {
  const userAddress = useAppSelector((state: RootState) => state.user.address);
  return (
    <div className="connect-wallet-section header border-b primary-font text-xl flex h-16 lg:px-4 items-center">
      {userAddress && (
        <span className="bg-gray-1 opacity-75 text-lg secondary-font mr-5">YOUR PLOTS ({userNft})</span>
      )}
      <ConnectWalletButton onClick={connectWallet} />
    </div>
  );
}
