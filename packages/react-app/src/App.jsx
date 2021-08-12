import WalletConnectProvider from "@walletconnect/web3-provider";
import { Menu } from "antd";
import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import Web3Modal from "web3modal";
import "./App.css";
import { Header, ThemeSwitch, ParcelMap } from "./components";
import { INFURA_ID, NETWORK, NETWORKS } from "./constants";
import { useContractLoader, useContractReader, useUserSigner } from "./hooks";

const { BufferList } = require("bl");
// https://www.npmjs.com/package/ipfs-http-client
const ipfsAPI = require("ipfs-http-client");
const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

const { ethers } = require("ethers");

const DEBUG = true;

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

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
  cacheProvider: true, // optional
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
  // injecedProvider will be used when metamask connection is implemented
  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userSigner = useUserSigner(injectedProvider, localProvider);

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
        console.log(`Set address on line 14 of mint.js to ${newAddress}`);
      }
    }
    getAddress();
  }, [userSigner]);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider);

  // keep track of a variable from the contract in the local React state:
  const balance = useContractReader(readContracts, "Parcel", "balanceOf", [address]);

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

  useEffect(() => {
    const updateParcels = async () => {
      var newParcels = [];
      for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
        try {
          const tokenId = await readContracts.Parcel.tokenOfOwnerByIndex(address, tokenIndex);
          const tokenURI = await readContracts.Parcel.tokenURI(tokenId);
          const ipfsHash = tokenURI.replace("https://ipfs.io/ipfs/", "");
          const jsonManifestBuffer = await getFromIPFS(ipfsHash);
          try {
            const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
            newParcels.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      if (newParcels.length !== parcels.length) {
        console.log("📦 Parcels:", newParcels);
        console.log("Number of parcels:", newParcels.length);
        setParcels(newParcels);
      }
    };
    updateParcels();
  });

  // |||||||||||||||||||||||||||||||||||||||||||||||||||||
  //  To be used when implementing metamask connection!
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  // const loadWeb3Modal = useCallback(async () => {
  //   const provider = await web3Modal.connect();
  //   setInjectedProvider(new ethers.providers.Web3Provider(provider));

  //   provider.on("chainChanged", chainId => {
  //     console.log(`chain changed to ${chainId}! updating providers`);
  //     setInjectedProvider(new ethers.providers.Web3Provider(provider));
  //   });

  //   provider.on("accountsChanged", () => {
  //     console.log(`account changed!`);
  //     setInjectedProvider(new ethers.providers.Web3Provider(provider));
  //   });

  //   // Subscribe to session disconnection
  //   provider.on("disconnect", (code, reason) => {
  //     console.log(code, reason);
  //     logoutOfWeb3Modal();
  //   });
  // }, [setInjectedProvider]);

  // useEffect(() => {
  //   if (web3Modal.cachedProvider) {
  //     loadWeb3Modal();
  //   }
  // }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Menu style={{ textAlign: "center" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link
              onClick={() => {
                setRoute("/");
              }}
              to="/"
            >
              Parcel Map
            </Link>
          </Menu.Item>
        </Menu>

        <Switch>
          <Route exact path="/">
            <div style={{ width: "100%", margin: "auto", marginTop: 32, paddingBottom: 32 }}>
              <ParcelMap parcels={parcels} startingCoordinates={[-106.331, 43.172]} startingZoom={9} />
            </div>
          </Route>
        </Switch>
      </BrowserRouter>

      <ThemeSwitch />
    </div>
  );
}

export default App;
