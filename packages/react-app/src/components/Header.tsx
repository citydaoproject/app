import React from "react";
import { ConnectWalletButton, SearchPlots } from ".";

export default function Header() {
  return (
    <div className="header primary-font text-xl bg-gray-1 flex h-16 px-4 border-l-2 border-b-2 items-center justify-end">
      <SearchPlots />
      <ConnectWalletButton />
    </div>
  );
}
