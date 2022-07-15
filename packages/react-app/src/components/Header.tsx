import React from "react";
import { ConnectWalletButton } from ".";
interface Props {
  connectWallet: () => void;
  userNft: number;
  isParcelCountRead: boolean;
  userAddress?: string;
  setShowingOwnedPlot: any;
}
export default function Header({ connectWallet, userNft, isParcelCountRead, userAddress, setShowingOwnedPlot }: Props) {
  const handleShowPlotList = () => {
    if (userNft > 0) {
      setShowingOwnedPlot(true)
    }
  }
  return (
    <div className="connect-wallet-section header border-b primary-font text-xl flex h-16 lg:px-4 items-center">
      {!isParcelCountRead && userAddress ? (
        <span className={`bg-gray-1 opacity-75 text-lg secondary-font mr-5`}>
          Loading your plots...
        </span>
      ) : isParcelCountRead && userAddress && (
        <span className={`bg-gray-1 opacity-75 text-lg secondary-font mr-5 ${userNft > 0 ? "cursor-pointer" : ""}`} onClick={() => handleShowPlotList()}>
          {userNft > 0 ? `YOUR PLOTS (${userNft})` : `No plots`}
        </span>
      )}
      <ConnectWalletButton onClick={connectWallet} />
    </div>
  );
}
