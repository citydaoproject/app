import WalletConnectProvider from "@walletconnect/web3-provider";
import "antd/dist/antd.css";
import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Web3Modal from "web3modal";
import "./App.css";
import { Faucet } from "./components";
import { INFURA_ID, NETWORKS } from "./constants";
import { useContractLoader, useUserSigner, useExchangePrice, useGasPrice } from "./hooks";
import { Transactor } from "./helpers";
import { BrowseParcels } from "./views";

const { BufferList } = require("bl");
// https://www.npmjs.com/package/ipfs-http-client
const ipfsAPI = require("ipfs-http-client");
const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

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

function App(props) {
  const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;
  // injecedProvider will be used when metamask connection is implemented
  const [injectedProvider, setInjectedProvider] = useState();
  const [userAddress, setUserAddress] = useState();
  const [cityDaoAddress, setCityDaoAddress] = useState("0xb40A70Aa5C30215c44F27BF990cBf4D3E5Acb384"); // this will be the temporary address to hold the parcels on testnets, in practice will be owned by CityDAO

  const price = useExchangePrice(targetNetwork, mainnetProvider);

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

  const gasPrice = useGasPrice(targetNetwork, "fast");

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userSigner = useUserSigner(injectedProvider, localProvider);

  const tx = Transactor(userSigner, gasPrice);

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setUserAddress(newAddress);
        console.log("Your address: " + newAddress);
        console.log("CityDAO's address: " + cityDaoAddress);
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

  const [parcels, setParcels] = useState([]);

  // helper function to "Get" from IPFS
  // you usually go content.toString() after this...
  const getFromIPFS = async hashToGet => {
    for await (const file of ipfs.get(hashToGet)) {
      if (!file.content) continue;
      const content = new BufferList();
      for await (const chunk of file.content) {
        content.append(chunk);
      }
      return content;
    }
  };

  const updateParcels = async (forceUpdate = false) => {
    var newParcels = [];
    if (parcels.length > 0 && !forceUpdate) return; // prevent excessive calls to IPFS
    if (readContracts) {
      const parcelIds = await readContracts.CityDaoParcel.getParcelIds();
      const parcelURIs = await readContracts.CityDaoParcel.getListedParcels();
      for (var index = 0; index < parcelIds.length; index++) {
        const parcelId = parcelIds[index];
        const ipfsHash = parcelURIs[parcelId];
        const price = await readContracts.CityDaoParcel.getPrice(parcelId);
        if (ipfsHash !== "") {
          // skip sold parcels
          try {
            const jsonManifestBuffer = await getFromIPFS(ipfsHash);
            try {
              const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
              newParcels.push({ id: parcelId, uri: ipfsHash, price: price, ...jsonManifest });
            } catch (e) {
              console.log(e);
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
      console.log(newParcels);
      if (newParcels.length !== parcels.length) {
        console.log("📦 Parcels:", newParcels);
        setParcels(newParcels);
      }
    }
  };

  useEffect(() => {
    updateParcels();
  });

  const buyParcel = id => {
    tx(writeContracts.CityDaoParcel.mintParcel(userAddress, id)).then(() => {
      updateParcels(true);
    });
  };

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  return (
    <div className="App">
      <BrowserRouter>
        <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
        <Switch>
          <Route exact path="/">
            <BrowseParcels parcels={parcels} buyParcel={buyParcel} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
