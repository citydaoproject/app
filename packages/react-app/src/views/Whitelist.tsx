import React, { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";

import { useContractLoader, useAppSelector, useUserSigner } from "../hooks";
import { ConnectWalletButton } from "../components";
import { logoutOfWeb3Modal, Transactor } from "../helpers";
import EnterRaffle from "../components/EnterRaffle";

interface Props {
  networkProvider: any;
  web3Modal: any;
}

export default function Whitelist({ networkProvider, web3Modal }: Props) {
  const DEBUG = useAppSelector(state => state.debug.debug);
  const userAddress = useAppSelector(state => state.user.address);
  const [injectedProvider, setInjectedProvider] = useState<ethers.providers.Web3Provider>();
  const [whitelistingEnabled, setWhitelistingEnabled] = useState(false);
  const [enteredRaffle, setEnteredRaffle] = useState(false);

  const contracts: any = useContractLoader(networkProvider);

  const updateStatus = () => {
    if (contracts) {
      contracts.CityDaoParcel.isWhitelisting().then(setWhitelistingEnabled);
      userAddress && contracts.CityDaoParcel.enteredRaffle(userAddress).then(setEnteredRaffle);
    }
  };

  useEffect(() => {
    updateStatus();
  }, [contracts, networkProvider, userAddress]);

  const loadWeb3Modal = useCallback(async () => {
    try {
      const provider = await web3Modal.connect();

      setInjectedProvider(new ethers.providers.Web3Provider(provider));

      provider.on("chainChanged", (chainId: string) => {
        DEBUG && console.log(`chain changed to ${chainId}! updating providers`);
        setInjectedProvider(new ethers.providers.Web3Provider(provider));
      });

      provider.on("accountsChanged", () => {
        DEBUG && console.log(`account changed!`);
        setInjectedProvider(new ethers.providers.Web3Provider(provider));
      });

      // Subscribe to session disconnection
      provider.on("disconnect", (code: string, reason: string) => {
        DEBUG && console.log(code, reason);
        logoutOfWeb3Modal(web3Modal);
      });
    } catch (error) {
      toast.error("Error connecting to a wallet");
    }
  }, [setInjectedProvider, DEBUG]);

  return (
    <div className="flex flex-col flex-grow min-w-0 items-center justify-center gap-8">
      <img src="/logo512.png" alt="logo" className="w-64" />
      {whitelistingEnabled ? (
        <>
          <div className="primary-font text-xl">CityDAO Parcel 0 Drop</div>
          <div className="flex flex-row gap-8">
            <ConnectWalletButton onClick={loadWeb3Modal} />
            <EnterRaffle injectedProvider={injectedProvider} inRaffle={enteredRaffle} resetStatus={updateStatus} />
          </div>
        </>
      ) : (
        <div className="primary-font text-xl">Whitelisting has ended.</div>
      )}
    </div>
  );
}
