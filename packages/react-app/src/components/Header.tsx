import React from "react";
import { ConnectWalletButton } from ".";
interface Props {
  connectWallet: () => void;
  userNft: number;
  isParcelCountRead: boolean;
  userAddress?: string;
}
export default function Header({ connectWallet, userNft, isParcelCountRead, userAddress }: Props) {
  return (
    <div className="connect-wallet-section header border-b primary-font text-xl flex h-16 lg:px-4 items-center">
      {isParcelCountRead && userAddress && (
        <span className="bg-gray-1 opacity-75 text-lg secondary-font mr-5">
          {userNft > 0 ? `YOUR PLOTS (${userNft})` : `No plots`}
        </span>
      )}
      <ConnectWalletButton onClick={connectWallet} />
    </div>
  );
}
