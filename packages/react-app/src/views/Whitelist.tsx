import React, { useCallback, useState } from "react";
import { ethers } from "ethers";

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
  const gasPrice = useAppSelector(state => state.network.gasPrice);
  const [injectedProvider, setInjectedProvider] = useState<ethers.providers.Web3Provider>();

  const contracts: any = useContractLoader(injectedProvider);
  const userSigner = useUserSigner(injectedProvider);
  const tx = Transactor(userSigner, gasPrice);

  const loadWeb3Modal = useCallback(async () => {
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
  }, [setInjectedProvider, DEBUG]);

  const enterRaffle = async () => {
    tx && contracts && (await tx(contracts.CityDaoParcel.enterRaffle()));
  };

  return (
    <div className="flex flex-col flex-grow min-w-0 items-center justify-center gap-8">
      <img src="/logo512.png" alt="logo" className="w-64" />
      <div className="primary-font text-xl">CityDAO Parcel 0 Drop</div>
      <div className="flex flex-row gap-8">
        <ConnectWalletButton onClick={loadWeb3Modal} />
        <EnterRaffle onClick={enterRaffle} />
      </div>
    </div>
  );
}
