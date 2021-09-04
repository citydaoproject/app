import WalletConnectProvider from "@walletconnect/web3-provider";
import "antd/dist/antd.css";
import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Web3Modal from "web3modal";
import { useSelector, useDispatch } from "react-redux";
import { setUserAddress, setExchangePrice, setGasPrice } from "./actions";
import "./App.css";
import { Wallet } from "./components";
import { INFURA_ID, NETWORKS } from "./constants";
import { useContractLoader, useUserSigner, useExchangePrice, useGasPrice, useUpdateParcels } from "./hooks";
import { BrowseParcels } from "./views";

const { ethers } = require("ethers");

const DEBUG = true;

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
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
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

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

function App() {
  // injecedProvider will be used when metamask connection is implemented
  const [injectedProvider, setInjectedProvider] = useState();

  const userAddress = useSelector(state => state.user.address);
  const price = useSelector(state => state.network.exchangePrice);
  const dispatch = useDispatch();

  const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;

  dispatch(setExchangePrice(useExchangePrice(targetNetwork, mainnetProvider)));

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();

    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    loadWeb3Modal();
  }, [loadWeb3Modal]);

  dispatch(setGasPrice(useGasPrice(targetNetwork, "fast")));

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userSigner = useUserSigner(injectedProvider, localProvider);

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        dispatch(setUserAddress(newAddress));
        console.log("Your address: " + userAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, { chainId: localChainId });

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  return (
    <div className="App">
      <BrowserRouter>
        <Wallet price={price} toAddress={userAddress} provider={localProvider} />
        <Switch>
          <Route exact path="/">
            <BrowseParcels readContracts={readContracts} writeContracts={writeContracts} userSigner={userSigner} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
