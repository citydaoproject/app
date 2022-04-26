import React from "react";
import { ConnectWalletButton, SearchPlots } from ".";
import { ParcelInfoContainer } from "../containers";
interface Props {
  connectWallet: () => void;
}
export default function Header({ connectWallet }: Props): JSX.Element {
  return (
    <div className="header primary-font text-xl bg-gray-1 pl-50px pt-50px pr-4 border-l-2 border-b-2 bg-transparent justify-between text-green-1">
      <div className="flex justify-between">
        <div className="text-xxl text-green-1 bg-transparent mb-6">PARCEL 0</div>
        <div className="flex">
          <SearchPlots />
          <ConnectWalletButton onClick={connectWallet} />
        </div>
      </div>
      <ParcelInfoContainer />
    </div>
  );
}
