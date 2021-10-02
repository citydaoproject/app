import React from "react";
import { ConnectWalletButton, SearchPlots } from ".";

interface Props {
  connectWallet: () => void;
}
export default function Header({ connectWallet }: Props) {
  return (
    <div className="header primary-font text-xl bg-gray-1 flex h-16 px-4 border-l-2 border-b-2 items-center justify-end">
      <SearchPlots />
      <ConnectWalletButton onClick={connectWallet} />
    </div>
  );
}
