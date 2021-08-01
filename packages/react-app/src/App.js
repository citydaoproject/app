import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css';
import { ethers } from "ethers";
import "./App.css";
import { Row, Col, Button, Alert, Spin, Tooltip } from 'antd';
import { useExchangePrice, useGasPrice, useContractLoader, useEventListener, useCustomContractLoader, useNonce, useContractReader, useCustomContractReader } from "./hooks"
import { Header, Account, Provider, Faucet, Ramp, AddressInput, Contract, TokenBalance, Address } from "./components"
import { Transactor } from "./helpers"

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet", "c954231486fa42ccb6d132b406483d14")
const localProvider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/c954231486fa42ccb6d132b406483d14")
//const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : "http://localhost:8545")

function App() {

  const DEPLOYBLOCK = 1

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(mainnetProvider)
  const gasPrice = useGasPrice("fast")

  const readContracts = useContractLoader(localProvider);
  const writeContracts = useContractLoader(injectedProvider);

  const earlyAccessEvents = useEventListener(readContracts, "xMoonLanding", "EarlyAccess", localProvider, DEPLOYBLOCK);
  const moonPrice = useContractReader(readContracts, "xMoonLanding", "price")

  const tx = Transactor(injectedProvider)
  const nonce = useNonce(injectedProvider, address, 3555)
  const [hasEarlyAccess, setHasEarlyAccess] = useState()
  const [sendingTx, setSendingTx] = useState()

  useEffect(() => {
    for (let e in earlyAccessEvents) {
      if (earlyAccessEvents[e].sender == address) {
        setHasEarlyAccess(true);
      }
    }
  }, [earlyAccessEvents, address, injectedProvider])

  const [injectedNetwork, setInjectedNetwork] = useState();
  useEffect(() => {
    const getNetwork = async () => {
      if (injectedProvider) {
        let injectedNetwork = await injectedProvider.getNetwork()
        setInjectedNetwork(injectedNetwork)
      }
    }
    getNetwork()
  }, [injectedProvider, address])


  const MOONSADDRESS = "0xDF82c9014F127243CE1305DFE54151647d74B27A" //readContracts ? readContracts["Moons"].address : ""
  const MOONSContract = useCustomContractLoader(injectedProvider, "Moons", MOONSADDRESS)
  const MOONSBalance = useCustomContractReader(MOONSContract, "balanceOf", [address], 777)
  const DepositedBalance = useCustomContractReader(MOONSContract, "balanceOf", [readContracts ? readContracts["xMoonLanding"].address : ""], 3777)

  const incorrectNetwork = (!injectedNetwork || (injectedNetwork.name == "rinkeby" && typeof MOONSBalance == "undefined") || (injectedNetwork.name != "rinkeby" && injectedNetwork.chainId != "31337"))

  let display

  if (hasEarlyAccess) {
    display = (
      <div>
        <h1>Thank you for your support!</h1>
        <h2><Address value={address} ensProvider={mainnetProvider} /> will have early access to 🌒xMOON!</h2>
        <h2>Check back here soon for updates and <a href="https://t.me/joinchat/KByvmRsUzUmPw8prHwATNw" target="_blank">join this Telegram</a> for more info.</h2>
      </div>
    )
  } else if (incorrectNetwork) {
    display = (
      <div>
        <Alert message={(
          <div>
            <b>Warning!</b> You must be on 'Rinkeby' testnet.
            <div style={{ padding: 16 }}>
              <img src="/rinkeby.png" />
            </div>
          </div>

        )} type="error" />
      </div>
    )
  } else if (!moonPrice) {
    display = (
      <div>
        <div style={{ width: 320, margin: "auto", padding: 16 }}>
          <Spin />
        </div>
      </div>
    )
  } else if (!MOONSBalance || MOONSBalance.lt(moonPrice)) {

    display = (
      <div>
        <div style={{ width: 320, margin: "auto", padding: 16 }}>
          <Tooltip title={"You must obtain " + ethers.utils.formatEther(moonPrice) + " Reddit MOONs to request early access."}>
            <Button disabled={true} size="large" shape="round" type="primary">Request Early Access for {ethers.utils.formatEther(moonPrice)} 🌘</Button>
          </Tooltip>

        </div>
      </div>
    )

  } else {

    display = (
      <div>


        <div style={{ width: 320, margin: "auto", padding: 16 }}>
          <Button loading={sendingTx} size="large" shape="round" type="primary" onClick={async () => {
            setSendingTx(true)

            let allowance = await MOONSContract.allowance(address, readContracts['xMoonLanding'].address)
            console.log("allowance", allowance)
            if (allowance.lt(moonPrice)) {
              tx(MOONSContract.approve(readContracts['xMoonLanding'].address, moonPrice, { nonce: nonce }))
              setTimeout(
                async () => {
                  let result = await tx(writeContracts["xMoonLanding"].earlyAccess({ gasLimit: 120000, nonce: nonce + 1 }))
                  console.log("result")
                  setTimeout(
                    () => {
                      setSendingTx(false)
                    }, 15000
                  )
                }, 1500 // you know why I have to do this @danfinlay! 😂😅🤣
              )
            } else {
              let result = await tx(writeContracts["xMoonLanding"].earlyAccess({ gasLimit: 120000 }))
              console.log("result")
              setTimeout(
                () => {
                  setSendingTx(false)
                }, 15000
              )
            }


          }}>Request Early Access for {ethers.utils.formatEther(moonPrice)}<img src="moonsmall.png" /></Button>
        </div>
      </div>
    )
  }

  let adminDisplay = ""
  if (address == "0x34aA3F359A9D614239015126635CE7732c18fDF3" && !incorrectNetwork) {
    adminDisplay = (
      <div>

        <TokenBalance name={"Moons"} img={<img src="moonsmall.png" />} balance={DepositedBalance} />
        <Contract
          name={"xMoonLanding"}
          provider={injectedProvider}
          address={address}
        />
      </div>

    )
  }

  return (
    <div className="App">
      <Row>
        <Col xs={24} lg={12}>
          <Header />
        </Col>
        <Col xs={24} lg={12} style={{ textAlign: "right" }}>
          <Account
            address={address}
            setAddress={setAddress}
            localProvider={localProvider}
            injectedProvider={injectedProvider}
            setInjectedProvider={setInjectedProvider}
            mainnetProvider={mainnetProvider}
            price={price}
          />
          <TokenBalance name={"Moons"} img={<img src="moonsmall.png" />} address={address} balance={MOONSBalance} />
        </Col>
      </Row>






      <div style={{ width: "77vw", margin: "auto", fontSize: 24 }}>


        <div style={{ fontSize: 16, padding: 16, border: "2px solid #d6d6d6", backgroundColor: "#f5f5f5", margin: 16 }}>
          <div>
            Redditors! I need your help. You know those <img src="moonsmall.png" /> MOONs you are collecting?
        </div>

          <div>
            I'm raising <img src="moonsmall.png" /> MOONs for liquidity and in return you'll get early access to 🌘 xMOON, a game I'm building!
        </div>

          <div>
            🌘 xMOON is a massive multiplayer blockchain game powered by the 🐶 DAOG game engine.
        </div>

          <div>
            Players use Reddit's <img src="moonsmall.png" /> MOON token to wager and play! <i>Coming Summer 2020</i>!!!
        </div>

          <div style={{ padding: 16 }}>
            <b>The price of <img src="moonsmall.png" /> MOONs required for early access will increase as others buy in. Get it while it's hot!</b>
          </div>




          <div style={{ padding: 32 }}>
            <img src="moonsmall.png" /> MOONs are just a testnet token on Rinkeby <a target="_blank" href="https://www.forbes.com/sites/colinharper/2020/05/14/reddit-launches-ethereum-tokens-for-subbredits-in-new-community-points-campaign/#706974b8533c">deployed by Reddit</a>.

          <div>They won't have any value until we give them <i>utility</i>!</div>
          </div>


          <div>
            Created by <a href="https://twitter.com/austingriffith" target="_blank">Austin Griffith</a> for bow tie Friday - June 19th 2020
        </div>

        </div>


        {display}


        <div style={{ marginTop: 32, position: "relative", width: "100%", height: 0, paddingBottom: "56.25%" }}>
          <iframe style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} src="https://www.youtube.com/embed/9L3H8J_PbVQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>




      {adminDisplay}

      <div style={{ position: 'fixed', textAlign: 'right', right: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={4}>
          <Col span={8}>
            <Provider name={"injected"} provider={injectedProvider} />
          </Col>
        </Row>
      </div>

      {/* <div style={{ position: 'fixed', textAlign: 'left', left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={4}>
          <Col span={9}>
            <Ramp
              price={price}
              address={address}
            />
          </Col>
          <Col span={15}>
            <Faucet
              localProvider={localProvider}
              price={price}
            />
          </Col>
        </Row>
      </div> */}

      <div style={{ fontSize: 16, padding: 16, border: "1px solid #d6d6d6", backgroundColor: "#fff9f9", margin: 16 }}>
        <div>
          <b>🧐 HOW DO I DO THIS?!? 😳</b>
        </div>
        <div>
          Most likely you have <img src="moonsmall.png" /> MOONs in your <a href="https://medium.com/@adamscochran/how-do-i-create-my-reddit-wallet-reddit-vault-2376d3a88cea" target="_blank">Reddit Vault</a>.
        </div>
        <div>
          Open that up and send some to a <a href="https://metamask.io/" target="_blank">MetaMask wallet</a> (and make sure it is on Rinkeby).
        </div>
        <div>
          Reddit made it really hard to send around (no ens, no qr scanner) AND they set their decimals to 0 while still using 10**18 decimals in practice.
        </div>
        <div>
          You will need to send yourself {parseInt(ethers.utils.formatEther(moonPrice?moonPrice:0))}000000000000000000 MOONs ({parseInt(ethers.utils.formatEther(moonPrice?moonPrice:0))} plus <i>eighteen</i> 0's).
        </div>
        <div>
          Then click the "Request Early Access" button above and two dialogs will pop up to approve() and transfer() your <img src="moonsmall.png" /> MOONs!
        </div>
        <div>
          <b>Thanks!</b>
        </div>
      </div>

      <a href="https://twitter.com/austingriffith" target="_blank">
        <div style={{ marginTop: 100 }}>

          💙💙💙 🛠 💙💙💙

        </div>
      </a>

    </div>
  );
}

export default App;
