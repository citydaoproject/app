import React, { useCallback, useEffect, useState } from "react";
import "antd/dist/antd.css";
import { getDefaultProvider, InfuraProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { Row, Col, Button, List, Spin, InputNumber, Card, Divider, Select } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useBalance, useEventListener } from "./hooks";
import { Header, Account, Faucet, Ramp, Contract, GasGauge, Address, Balance, EtherInput } from "./components";
import { Transactor } from "./helpers";
import { parseEther, formatEther, hexlify } from "@ethersproject/units";
import { ethers } from "ethers";
import Hints from "./Hints";
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)
*/
import { INFURA_ID, ETHERSCAN_KEY } from "./constants";
const { Option } = Select;

// 🔭 block explorer URL
const blockExplorer = "https://etherscan.io/" // for xdai: "https://blockscout.com/poa/xdai/"

// 🛰 providers
console.log("📡 Connecting to Mainnet Ethereum");
const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
// const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/5ce0898319eb4f5c9d4c982c8f78392a")
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)




// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = "http://localhost:8545"; // for xdai: https://dai.poa.network
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);

function App() {
  const [ rerender, setRerender ] = useState(1)
  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 this hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(mainnetProvider); //1 for xdai

  /* 🔥 this hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice("fast"); //1000000000 for xdai

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);
  //console.log("💵 yourLocalBalance",yourLocalBalance)

  // just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);
  //console.log("💵 yourMainnetBalance",yourMainnetBalance)

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  //console.log("📝 readContracts",readContracts)

  // keep track of a variable from the contract in the local React state:
  const owner = useContractReader(readContracts,"CLR", "owner")
  console.log("🗝 owner:",owner)


  // keep track of a variable from the contract in the local React state:
  const matchingPool = useContractReader(readContracts,"CLR", "matchingPool")
  console.log("💰 matchingPool:",matchingPool)


  // keep track of a variable from the contract in the local React state:
  const roundStart = useContractReader(readContracts,"CLR", "roundStart")
  console.log("⏱ roundStart:",roundStart)

  const roundDuration = useContractReader(readContracts,"CLR", "roundDuration")
  console.log("⏱ roundDuration:",roundDuration)

  const getBlockTimestamp = useContractReader(readContracts,"CLR", "getBlockTimestamp")
  console.log("⏱ getBlockTimestamp:",getBlockTimestamp)

  const totalMatchingWeight = useContractReader(readContracts,"CLR", "totalMatchingWeight")
  console.log("👜 totalMatchingWeight:",totalMatchingWeight)



  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)
  //console.log("🔐 writeContracts",writeContracts)

  //📟 Listen for broadcast events

  const donorAllowedEvents = useEventListener(readContracts, "DonorManager", "DonorAllowed", localProvider, 1);
  //console.log("📟 donorAllowedEvents:",donorAllowedEvents)


  const roundStartedEvents = useEventListener(readContracts, "CLR", "RoundStarted", localProvider, 1);
  //console.log("📟 roundStartedEvents:",roundStartedEvents)

  const recipientAddedEvents = useEventListener(readContracts, "CLR", "RecipientAdded", localProvider, 1);
  //console.log("📟 recipientAddedEvents:",recipientAddedEvents)

  const donationEvents = useEventListener(readContracts, "CLR", "Donate", localProvider, 1);
  //console.log("📟 donationEvents:", donationEvents)

  const matchingPoolDonationEvents = useEventListener(readContracts, "CLR", "MatchingPoolDonation", localProvider, 1);
  //console.log("📟 matchingPoolDonationEvents:",matchingPoolDonationEvents)

  const withdrawEvents = useEventListener(readContracts, "CLR", "Withdraw", localProvider, 1);
  //console.log("📟 withdrawEvents:",withdrawEvents)





  const [ recipients, setRecipients ] = useState([])
  const [ recipientOptions, setRecipientOptions ] = useState([])

  const [ currentTotalWeight, setCurrentTotalWeight ] = useState([])
  console.log("currentTotalWeight",currentTotalWeight)

  useEffect(()=>{
    const getRecipients = async ()=>{
      console.log("Loading up recipient list...")
      let newRecipients = []
      let newRecipientOptions = []

      let totalWeight
      for(let i=0;i<recipientAddedEvents.length;i++){
        const thisIndex = recipientAddedEvents[i].index.toNumber()
        const recipientObject = await readContracts.CLR.recipients(thisIndex)
        let recipient = {}
        Object.assign(recipient,recipientObject)
        recipient.index = thisIndex
        newRecipients.push( recipient );
        newRecipientOptions.push(
          <Option key={"ro_"+i} value={i}>{recipientAddedEvents[i].data}</Option>
        )

        newRecipients[i].totalDonations = await await readContracts.CLR.totalDonations(thisIndex)
        newRecipients[i].sumOfSqrtDonation = await await readContracts.CLR.sumOfSqrtDonation(thisIndex)
        newRecipients[i].currentWeight = newRecipients[i].sumOfSqrtDonation.mul(newRecipients[i].sumOfSqrtDonation)

        if(!totalWeight){
          totalWeight = newRecipients[i].currentWeight
        } else{
          totalWeight = totalWeight.add(newRecipients[i].currentWeight)
        }
      }

      setRecipients(newRecipients)
      setRecipientOptions(newRecipientOptions)
      setCurrentTotalWeight(totalWeight)
    }
    getRecipients()
  },[ recipientAddedEvents, setRecipients, donationEvents, rerender ])


  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);


  let mode = "loading..."
  if(roundStart && roundStart.toNumber()<=0){
    mode = "Waiting to begin..."
  }else if(roundStart && roundStart.toNumber()>0 && getBlockTimestamp && roundDuration){

    let timeLeft = roundStart.toNumber() + roundDuration.toNumber() - getBlockTimestamp.toNumber()

    if(timeLeft>=0){
      mode = "Round open! ("+timeLeft+"s left...)"
    }else{
      mode = "Round is over..."
    }

  }

  const [ donateAmount, setDonateAmount ] = useState()
  const [ donateIndex, setDonateIndex ] = useState()


  return (
    <div className="App">

      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />

      <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto",marginTop:64}}>

      <div>
        {readContracts && readContracts.CLR.address ? <Address value={readContracts?readContracts.CLR.address:readContracts} ensProvider={mainnetProvider} /> : <Spin />}
        <div style={{ float: "right", paddingRight: 25 }}>
          <Balance address={readContracts?readContracts.CLR.address:readContracts} provider={localProvider} dollarMultiplier={price} />
        </div>
      </div>
      < Divider / >
        owner: <Address
          value={owner}
          ensProvider={mainnetProvider}
          blockExplorer={blockExplorer}
        />
      < Divider / >

        <h3>roundDuration:{roundDuration?roundDuration.toNumber():<Spin/>}</h3>

        <h2>{mode}</h2>

        <div style={{margin:8}}>
          <Button onClick={()=>{
            /* look how you call setPurpose on your contract: */
            tx( writeContracts.CLR.startRound() )
            setRerender(rerender+1)
          }}>startRound</Button>
        </div>

        <div style={{margin:8}}>
          <Button onClick={()=>{
            /* look how you call setPurpose on your contract: */
            tx( writeContracts.CLR.calculateMatching(99999999) )
            setRerender(rerender+1)
            setTimeout(()=>{
              setRerender(rerender+2)
            },1000)
            setTimeout(()=>{
              setRerender(rerender+3)
            },3000)
          }}>calculateMatching</Button>
        </div>

        <div style={{margin:8}}>
          <Button onClick={()=>{
            /* look how you call setPurpose on your contract: */
            tx( writeContracts.CLR.distributeWithdrawal() )
            setRerender(rerender+1)
          }}>distributeWithdrawal</Button>
        </div>


      </div>


      <div style={{ width:600, margin: "auto", marginTop:32 }}>
        <List
          bordered
          header={(
            <h1>Recipients</h1>
          )}
          dataSource={recipients}
          renderItem={item => {
            //console.log("RECIPIENTS:",item)
              ////utils . parseEther (
            //console.log("totalMatchingWeight",totalMatchingWeight)
            //console.log("item.matchingWeight",item.matchingWeight)
            //if(totalMatchingWeight>0){

            //}
            let percent = 0
            let matchingAmount = 0
            let opacity = 0.1
            if(totalMatchingWeight>0){
              percent = parseFloat(item.matchingWeight.mul(10000).div(totalMatchingWeight).toNumber())/100
              matchingAmount = item.matchingWeight.mul(matchingPool).div(totalMatchingWeight)
              opacity = 1
            }else if(currentTotalWeight&&currentTotalWeight.gt(0)){
              //it is trying to keep a current guess at weight
              //console.log("&&CALC",currentTotalWeight,item.currentWeight)
              percent = parseFloat(item.currentWeight.mul(10000).div(currentTotalWeight).toNumber())/100
              matchingAmount = item.currentWeight.mul(matchingPool).div(currentTotalWeight)
              opacity = 0.5
            }

            let matchDisplay = ""
            if(percent){
              matchDisplay = (
                <div style={{opacity}}>
                  <div style={{opacity:0.7}}>
                     <Balance
                        balance={item.totalDonations}
                        provider={localProvider}
                        dollarMultiplier={price}
                     />+
                     <Balance
                       balance={matchingAmount}
                       dollarMultiplier={price}
                     />
                  </div>
                  <div>
                    <Balance
                      balance={item.totalDonations.add(matchingAmount)}
                      provider={localProvider}
                      dollarMultiplier={price}
                      size={32}
                    />
                  </div>
                  ({percent}%)
                </div>
              )
            }

            console.log("item.total",item.total)

            return (
              <List.Item>
                <span style={{fontSize:24,padding:16}}>{item.index}</span>
                <Address
                  value={item.addr}
                  ensProvider={mainnetProvider}
                  blockExplorer={blockExplorer}
                />
                : {item.data}
                {matchDisplay}
              </List.Item>
            )
          }}
        />
      </div>


            <div style={{width:500, margin:'auto', marginTop:32}}>
              <Card title={"Donate"} extra={""}>
                <Row gutter={4}>
                  <Col span={11}>
                    <EtherInput
                      price={price}
                      value={donateAmount}
                      onChange={value => {
                        setDonateAmount(value);
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Select
                      placeholder = "recipient..."
                      onChange={value => {
                        setDonateIndex(value);
                      }}
                    >
                      {recipientOptions}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Button onClick={()=>{
                      /* you can also just craft a transaction and send it to the tx() transactor */

                        const finalTx = {
                          to: writeContracts.CLR.address,
                          value: parseEther(""+parseFloat(donateAmount).toFixed(6)),
                          data: writeContracts.CLR.interface.encodeFunctionData("donate(uint256)",[ donateIndex ])
                        }

                        console.log("finalTx",finalTx)

                      tx(finalTx);
                      /* this should throw an error about "no fallback nor receive function" until you add it */
                    }}>Donate</Button>
                  </Col>
                </Row>
              </Card>
            </div>





            <div style={{ width:600, margin: "auto", marginTop:32 }}>
              <List
                bordered
                header={(
                  <h1>Donations</h1>
                )}
                dataSource={donationEvents}
                renderItem={item => {
                  //console.log("donationEvents",item)
                  return (
                    <List.Item>
                      <Address
                        value={item.sender}
                        ensProvider={mainnetProvider}
                        blockExplorer={blockExplorer}
                      />
                      {item.index.toNumber()}
                      <Balance
                        balance={item.value}
                        dollarMultiplier={price}
                      />
                    </List.Item>
                  )
                }}
              />
            </div>






            <div style={{ width:600, margin: "auto", marginTop:32 }}>
              <List
                bordered
                header={(
                  <h1>Donors</h1>
                )}
                dataSource={donorAllowedEvents}
                renderItem={item => {
                  //console.log("donorAllowedEvents",item)
                  return (
                    <List.Item>
                    <Address
                      value={item.donor}
                      ensProvider={mainnetProvider}
                      blockExplorer={blockExplorer}
                    />
                    {item.allowed}

                    <Balance
                      address={item.donor}
                      provider={localProvider}
                      dollarMultiplier={price}
                    />

                    </List.Item>
                  )
                }}
              />
            </div>













      <div style={{ width:600, margin: "auto", marginTop:32 }}>
        <List
          bordered
          header={(
            <h1>Pool Donations</h1>
          )}
          dataSource={matchingPoolDonationEvents}
          renderItem={item => {
            //console.log("matchingPoolDonationEvents",item)
            return (
              <List.Item>
                <Address
                  value={item.sender}
                  ensProvider={mainnetProvider}
                  blockExplorer={blockExplorer}
                />
                 (+<Balance
                  balance={item.value}
                  dollarMultiplier={price}
                />)
                <Balance
                  balance={item.total}
                  dollarMultiplier={price}
                />
              </List.Item>
            )
          }}
        />
      </div>

      <div style={{ width:600, margin: "auto", marginTop:32 }}>
        <List
          bordered
          header={(
            <h1>Withdrawls</h1>
          )}
          dataSource={withdrawEvents}
          renderItem={item => {
            //console.log("withdrawEvents",item)
            return (
              <List.Item>
                <h2>{item.index.toNumber()}</h2>
                <Address
                  value={item.to}
                  ensProvider={mainnetProvider}
                  blockExplorer={blockExplorer}
                />
                <Balance
                  balance={item.total}
                  dollarMultiplier={price}
                />
                <div style={{opacity:0.5}}>
                  <Balance
                    balance={item.matched}
                    dollarMultiplier={price}
                  /> matched
                </div>
              </List.Item>
            )
          }}
        />
      </div>




      {/*
          🎛 this scaffolding is full of commonly used components
          this <Contract/> component will automatically parse your ABI
          and give you a form to interact with it locally
      */}
      <Contract
        name="CLR"
        signer={userProvider.getSigner()}
        provider={localProvider}
        address={address}
        blockExplorer={blockExplorer}
      />

      <Contract
        name="DonorManager"
        show={"allowDonor, blockDonor, canDonate"}
        signer={userProvider.getSigner()}
        provider={localProvider}
        address={address}
        blockExplorer={blockExplorer}
      />



      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto",marginTop:64}}>

        <div style={{margin:8}}>
          <Button onClick={()=>{
            /*
              you can also just craft a transaction and send it to the tx() transactor
              here we are sending value straight to the contract's address:
            */
            tx({
              to: writeContracts.YourContract.address,
              value: parseEther("0.001")
            });
            /* this should throw an error about "no fallback nor receive function" until you add it */
          }}>Send Value</Button>
        </div>

        <div style={{margin:8}}>
          <Button onClick={()=>{
            /* look how we call setPurpose AND send some value along */
            tx( writeContracts.YourContract.setPurpose("💵 Paying for this one!",{
              value: parseEther("0.001")
            }))
            /* this will fail until you make the setPurpose function payable */
          }}>Set Purpose With Value</Button>
        </div>


        <div style={{margin:8}}>
          <Button onClick={()=>{
            /* you can also just craft a transaction and send it to the tx() transactor */
            tx({
              to: writeContracts.YourContract.address,
              value: parseEther("0.001"),
              data: writeContracts.YourContract.interface.encodeFunctionData("setPurpose(string)",["🤓 Whoa so 1337!"])
            });
            /* this should throw an error about "no fallback nor receive function" until you add it */
          }}>Another Example</Button>
        </div>

      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      <div style={{ width:600, margin: "auto", marginTop:32 }}>
        <List
          bordered
          dataSource={roundStartedEvents}
          renderItem={item => {
            console.log("Render",item)
            return (
              <List.Item>
                ROUND STARTED:
              </List.Item>
            )
          }}
        />
      </div>

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
         <Account
           address={address}
           localProvider={localProvider}
           userProvider={userProvider}
           mainnetProvider={mainnetProvider}
           price={price}
           web3Modal={web3Modal}
           loadWeb3Modal={loadWeb3Modal}
           logoutOfWeb3Modal={logoutOfWeb3Modal}
           blockExplorer={blockExplorer}
         />
      </div>

      {/* 🗑 Throw these away once you have 🏗 scaffold-eth figured out: */}
      <Hints address={address} yourLocalBalance={yourLocalBalance} price={price} mainnetProvider={mainnetProvider} />

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
       <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
         <Row align="middle" gutter={[4, 4]}>
           <Col span={8}>
             <Ramp price={price} address={address} />
           </Col>

           <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
             <GasGauge gasPrice={gasPrice} />
           </Col>
           <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
             <Button
               onClick={() => {
                 window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
               }}
               size="large"
               shape="round"
             >
               <span style={{ marginRight: 8 }} role="img" aria-label="support">
                 💬
               </span>
               Support
             </Button>
           </Col>
         </Row>

         <Row align="middle" gutter={[4, 4]}>
           <Col span={24}>
             {

               /*  if the local provider has a signer, let's show the faucet:  */
               localProvider && localProvider.connection && localProvider.connection.url && localProvider.connection.url.indexOf("localhost")>=0 && !process.env.REACT_APP_PROVIDER && price > 1 ? (
                 <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider}/>
               ) : (
                 ""
               )
             }
           </Col>
         </Row>
       </div>

    </div>
  );
}


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

export default App;
