import React from "react";
import { ConnectWalletButton } from ".";

interface Props {
  connectWallet: () => void;
}
export default function Header({ connectWallet }: Props) {
  return (
    <div className="connect-wallet-section header border-b primary-font text-xl flex h-16 lg:px-4 items-center">
      <span className="bg-gray-1 opacity-75 text-lg secondary-font mr-5 ml-11">YOUR PLOTS (0)</span>
      <ConnectWalletButton onClick={connectWallet} />
    </div>
  );
}
