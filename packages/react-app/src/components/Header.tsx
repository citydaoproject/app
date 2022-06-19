import React from "react";
import { ConnectWalletButton, SearchPlots, SensorHeaderInfo } from ".";
interface Props {
  connectWallet: () => void;
}
export default function Header({ connectWallet }: Props): JSX.Element {
  return (
    <div className="connect-wallet-section header primary-font text-xl bg-gray-1 flex h-16 lg:px-4 border-l-2 border-b-2 items-center">
      <SensorHeaderInfo />
      <div className="search-and-connect-wrapper bg-gray-1">
        <SearchPlots />
        <ConnectWalletButton onClick={connectWallet} />
      </div>
    </div>
  );
}
