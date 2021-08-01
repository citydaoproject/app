import React, { useCallback, useEffect, useState } from "react";
import "antd/dist/antd.css";
import { getDefaultProvider, JsonRpcProvider, Web3Provider, InfuraProvider } from "@ethersproject/providers";
import "./App.css";
import { Row, Col, Button } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress, useBalance } from "eth-hooks";
import { useExchangePrice, useGasPrice, useUserProvider } from "./hooks";
import { Header, Account, Faucet, Ramp, Contract } from "./components";
import Hints from "./Hints";
import { INFURA_ID } from "./constants";

const { ethers } = require("ethers");
const BurnerProvider = require("burner-provider");

const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: false, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

// 🛰 providers
const mainnetProvider = new InfuraProvider("mainnet", { infura: INFURA_ID });
const localChainProvider = mainnetProvider

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  // console.log("Cleared cache provider!?!",clear)
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

function App() {
  //const [injectedProvider, setInjectedProvider] = useState();
  //const price = useExchangePrice(mainnetProvider);
  // const gasPrice = useGasPrice("fast");

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  //const userProvider = useUserProvider(injectedProvider, localChainProvider);
  //const address = useUserAddress(userProvider);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  //const yourLocalBalance = useBalance(localChainProvider, address);
  // just plug in different 🛰 providers to get your balance on different chains:
  // const yourMainnetBalance = useBalance(mainnetProvider, address);

  // Load in your local 📝 contract and read a value from it:
  // const readContracts = useContractLoader(localProvider)
  // console.log("readContracts",readContracts)
  // const owner = useCustomContractReader(readContracts?readContracts['YourContract']:"", "owner")

  /*const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);*/

  return (
    <div className="App">
      <Header />

      <Button onClick={async ()=>{
        console.log("🚀 TESTING with https://mainnet.infura.io:")
        let burner = new BurnerProvider("https://mainnet.infura.io/v3/9ba908922edc44d1b5e1f0ba4506948d")
        console.log("🔥📡 burner",burner)
        let ethersProvider = new ethers.providers.Web3Provider(burner)
        console.log("💩 provider:",ethersProvider)//.connect()
        let accounts = await ethersProvider.listAccounts()
        console.log("😅 accounts:",accounts)
        setTimeout(async ()=>{
          let bal = await ethersProvider.getBalance(accounts[0])
          console.log("💵 balance", bal)
        },3000)
      }}>Mainnet Test</Button>

      <Button onClick={async ()=>{
        console.log("🚀 TESTING with https://dai.poa.network:")
        let burner = new BurnerProvider("https://dai.poa.network")
        console.log("🔥📡 burner",burner)
        console.log("🔬🦠 blocktracker",burner._blockTracker)
        let ethersProvider = new ethers.providers.Web3Provider(burner)
        console.log("💩 provider:",ethersProvider)//.connect()
        let accounts = await ethersProvider.listAccounts()
        console.log("😅 accounts:",accounts)
        setTimeout(async ()=>{
          let bal = await ethersProvider.getBalance(accounts[0])
          console.log("💵 balance", bal)
        },3000)
      }}>xDAI Test</Button>

      <Button onClick={async ()=>{
        console.log("🚀 TESTING with http://localhost:8545")   ////// RUN: yarn run chain 
        let burner = new BurnerProvider("http://localhost:8545")
        console.log("🔥📡 burner",burner)
        console.log("🔬🦠 blocktracker",burner._blockTracker)
        let ethersProvider = new ethers.providers.Web3Provider(burner)
        console.log("💩 provider:",ethersProvider)//.connect()
        let accounts = await ethersProvider.listAccounts()
        console.log("😅 accounts:",accounts)
        setTimeout(async ()=>{
          let bal = await ethersProvider.getBalance(accounts[0])
          console.log("💵 balance", bal)
        },3000)
      }}>Localhost Test</Button>

      {/*<div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          localProvider={localChainProvider}
          userProvider={userProvider}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
        />
      </div>
*/}



    </div>
  );
}

export default App;
