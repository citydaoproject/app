import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css';
import { ethers } from "ethers";
import "./App.css";
import { Row, Col, Typography, Button, Modal, Spin } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useExchangePrice, useGasPrice } from "./hooks"
import { Transactor } from "./helpers"
import { Header, Account, Provider, AddressInput, EtherInput, Blockie, Balance, Address } from "./components"
import QR from 'qrcode.react';
const { Text } = Typography;

const FORCE_XDAI = false

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet","ec6a8acd1d354717acec099ad46a0bab")
let localProvider = new ethers.providers.InfuraProvider("rinkeby","ec6a8acd1d354717acec099ad46a0bab")
/*if ( !FORCE_XDAI && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")){
  localProvider = new ethers.providers.JsonRpcProvider("http://localhost:8545")
}else{
  localProvider = new ethers.providers.JsonRpcProvider("https://dai.poa.network")
  if ( !FORCE_XDAI && window.location.protocol !== 'https:') {
    window.location.replace(`https:${window.location.href.substring(window.location.protocol.length)}`);
  }
}*/

function App() {

  const size = useWindowSize();
  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = 0 // testnet
  const gasPrice = useGasPrice("fast")

  const [open, setOpen] = useState()
  const [amount, setAmount] = useState()
  const [toAddress, setToAddress] = useState()

  const inputStyle = {
    padding:10
  }

  const qrWidth = 600

  let scale = Math.min(size.width,1024)/(qrWidth*1.3)

  let offset =  0.42

  const url  = window.location.href+"" //"https://instantwallet.surge.sh/

  return (
    <div className="App">
      <Header />
      <div style={{position:'fixed',textAlign:'right',right:0,top:0,padding:10}}>
        <Account
          minimized={true}
          address={address}
          setAddress={setAddress}
          localProvider={localProvider}
          injectedProvider={injectedProvider}
          setInjectedProvider={setInjectedProvider}
          mainnetProvider={mainnetProvider}
          price={price}
        />
      </div>


      <div style={{cursor:"pointer",position:'fixed',width:"calc( 40px + 10vw )",height:"calc( 40px + 10vw )",textAlign:'center',right:-4,bottom:"2vw",padding:10}} className={"button"}
        onClick={()=>{setOpen(!open)}}
      >
        <Row type="flex" align="middle" >
          <Col span={24} style={{zIndex:2}}>
            <SendOutlined style={{color:"#EDEDED",fontSize:"6vw",marginTop:"calc( 12px + 2vw )"}} rotate={0} />
          </Col>
        </Row>
      </div>


      <div style={{marginLeft:"11.5vw",width:qrWidth,transform:"scale("+scale+")",transformOrigin:"0 0"}}>
        <div style={{position:"absolute",bottom:-72,left:0}}>
          <Text style={{fontSize:56}} copyable={{text:address}}>{address?address.substr(0,8):"..."}</Text>
        </div>
        <div style={{position:"absolute",bottom:-72,right:0}}>
          <Balance size={56} address={address} provider={localProvider} dollarMultiplier={price}/>
        </div>

        <QR value={address?url+address:""} size={qrWidth} imageSettings={{width:qrWidth/5,height:qrWidth/5,excavate:true}}/>
        <div style={{position:"absolute",left:qrWidth*offset,top:qrWidth*offset}}>
          <Blockie address={address} scale={12}/>
        </div>
      </div>


      <Modal
        visible={open}
        title={
          <div>
            {address?(
              <Address value={address} ensProvider={mainnetProvider}/>
            ):<Spin />}
            <div style={{float:"right",paddingRight:25}}>
              <Balance address={address} provider={localProvider} dollarMultiplier={price}/>
            </div>
          </div>
        }
        onOk={()=>{setOpen(!open)}}
        onCancel={()=>{
          setOpen(!open)
        }}
        footer={[
          <Button key="hide" type="default"  onClick={()=>{
            setOpen(!open)
          }}>
            Hide
          </Button>,
          <Button key="submit" type="primary" disabled={!amount || !toAddress} loading={false} onClick={()=>{
            const tx = Transactor(injectedProvider)
            const txObject = {
              to: toAddress,
              value: ethers.utils.parseEther(""+amount),
            }
            console.log("TX",txObject)
            tx(txObject)
            setOpen(!open)
          }}>
            <SendOutlined /> Send
          </Button>,
        ]}
      >
        <div>




        <div style={inputStyle}>
          <AddressInput
             autoFocus={true}
            ensProvider={mainnetProvider}
            placeholder="to address"
            value={toAddress}
            onChange={setToAddress}
          />
        </div>
        <div style={inputStyle}>
          <EtherInput
            price={price}
            value={amount}
            onChange={(value)=>{
              setAmount(value)
            }}
          />
        </div>


        </div>
      </Modal>

    </div>
  );
}

export default App;

function useWindowSize() {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}
