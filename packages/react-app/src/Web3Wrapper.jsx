import WalletConnectProvider from "@walletconnect/web3-provider";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Web3Modal from "web3modal";
import { useSelector, useDispatch } from "react-redux";

import { setExchangePrice, setGasPrice } from "./actions";
import { Wallet } from "./components";
import { INFURA_ID, NETWORKS } from "./constants";
import { useExchangePrice, useGasPrice } from "./hooks";
import { BrowsePlots } from "./views";

const { ethers } = require("ethers");

const network = process.env.REACT_APP_NETWORK;
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
  const userAddress = useSelector(state => state.user.address);
  const price = useSelector(state => state.network.exchangePrice);

  const dispatch = useDispatch();

  const mainnetProvider = mainnetInfura;
  dispatch(setExchangePrice(useExchangePrice(targetNetwork, mainnetProvider)));
  dispatch(setGasPrice(useGasPrice(targetNetwork, "fast")));

  return (
    <div className="Web3Wrapper flex flex-col flex-grow">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <BrowsePlots web3Modal={web3Modal} networkProvider={networkProvider} />
          </Route>
        </Switch>
      </BrowserRouter>
      {process.env.NODE_ENV === "development" ? (
        <Wallet price={price} toAddress={userAddress} provider={networkProvider} />
      ) : null}
    </div>
  );
}

export default Web3Wrapper;
