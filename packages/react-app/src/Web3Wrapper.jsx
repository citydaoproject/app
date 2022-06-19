import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Torus from "@toruslabs/torus-embed";

import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Web3Modal from "web3modal";
import { useSelector, useDispatch } from "react-redux";

import { setExchangePrice, setGasPrice } from "./actions";
import { Wallet } from "./components";
import { INFURA_ID, NETWORKS } from "./constants";
import { useExchangePrice, useGasPrice } from "./hooks";
import { BrowsePlots, Whitelist } from "./views";

const { ethers } = require("ethers");

const network = "rinkeby"; //process.env.REACT_APP_NETWORK;
const targetNetwork = NETWORKS[network]; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet, mumbai)
const mainnetInfura = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
  : null;

// 🏠 Your local provider is usually pointed at your local blockchain
const providerUrl = targetNetwork.rpcUrl;
const networkProvider =
  network === "localhost"
    ? new ethers.providers.StaticJsonRpcProvider(providerUrl)
    : new ethers.providers.InfuraProvider(network, INFURA_ID);

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: INFURA_ID,
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "CityDAO - Parcel Explorer",
      infuraId: INFURA_ID,
      chainId: targetNetwork.chainId,
      darkMode: true,
    },
  },
  torus: {
    package: Torus,
    options: {
      networkParams: {
        host: targetNetwork.rpcUrl,
        chainId: targetNetwork.chainId,
        networkId: targetNetwork.chainId,
      },
    },
  },
  binancechainwallet: {
    package: true,
  },
};
const web3Modal = new Web3Modal({
  // network: network,
  // cacheProvider: true,
  theme: "dark",
  providerOptions,
});

function Web3Wrapper() {
  const userAddress = useSelector(state => state.user.address);
  const price = useSelector(state => state.network.exchangePrice);

  const dispatch = useDispatch();

  const mainnetProvider = mainnetInfura;
  dispatch(setExchangePrice(useExchangePrice(targetNetwork, mainnetProvider)));
  dispatch(setGasPrice(useGasPrice(targetNetwork, "fast")));

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <BrowsePlots web3Modal={web3Modal} networkProvider={networkProvider} />
          </Route>
          <Route exact path="/whitelist">
            <Whitelist web3Modal={web3Modal} networkProvider={networkProvider} />
          </Route>
        </Switch>
      </BrowserRouter>
      {process.env.NODE_ENV === "development" ? (
        <Wallet price={price} toAddress={userAddress} provider={networkProvider} />
      ) : null}
    </>
  );
}

export default Web3Wrapper;
