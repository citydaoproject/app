import WalletConnectProvider from "@walletconnect/web3-provider";
import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Web3Modal from "web3modal";
import { useSelector, useDispatch } from "react-redux";

import { setExchangePrice, setGasPrice } from "./actions";
import { logoutOfWeb3Modal } from "./helpers";
import { Wallet } from "./components";
import { INFURA_ID, NETWORKS } from "./constants";
import { useExchangePrice, useGasPrice } from "./hooks";
import { BrowseParcels } from "./views";

const { ethers } = require("ethers");

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet, mumbai)
const scaffoldEthProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544")
  : null;
const mainnetInfura = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
  : null;

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;

// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

function Web3Wrapper() {
  // injecedProvider will be used when metamask connection is implemented
  const [injectedProvider, setInjectedProvider] = useState();

  const userAddress = useSelector(state => state.user.address);
  const price = useSelector(state => state.network.exchangePrice);
  const DEBUG = useSelector(state => state.debug.debug);
  const dispatch = useDispatch();

  const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;

  dispatch(setExchangePrice(useExchangePrice(targetNetwork, mainnetProvider)));
  dispatch(setGasPrice(useGasPrice(targetNetwork, "fast")));

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();

    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      DEBUG && console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      DEBUG && console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      DEBUG && console.log(code, reason);
      logoutOfWeb3Modal(web3Modal);
    });
  }, [setInjectedProvider, DEBUG]);

  useEffect(() => {
    loadWeb3Modal();
  }, [loadWeb3Modal]);

  return (
    <div className="Web3Wrapper flex flex-col flex-grow">
      <BrowserRouter>
        {/* <Wallet price={price} toAddress={userAddress} provider={localProvider} /> */}
        <Switch>
          <Route exact path="/">
            <BrowseParcels injectedProvider={injectedProvider} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Web3Wrapper;
