import React, { useState } from 'react'
import { ethers } from "ethers";
import Blockies from 'react-blockies';
import { Card, Row, Col, List, Typography, Slider, Divider, Button } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useContractLoader, useCustomContractLoader, useContractReader, useCustomContractReader, useEventListener, useBlockNumber, useBalance } from "./hooks"
import { Transactor } from "./helpers"
import { Address, Balance, Timeline, Dollars } from "./components"

const { Title, Text } = Typography;
const { Meta } = Card;
const contractName = "SmartContractWallet"

export default function SmartContractWallet(props) {

  const tx = Transactor(props.injectedProvider,props.gasPrice)

  const localBlockNumber = useBlockNumber(props.localProvider)
  const localBalance = useBalance(props.address,props.localProvider)

  const readContracts = useContractLoader(props.localProvider);
  const writeContracts = useContractLoader(props.injectedProvider);

  const tokenAddress = useContractReader(readContracts,contractName,"tokenAddress",1777);
  const priceOracle = useContractReader(readContracts,contractName,"priceOracle",1777);
  const priceOracleContract = useCustomContractLoader(props.localProvider, "ExamplePriceOracle", priceOracle)
  const price = useCustomContractReader(priceOracleContract,"getTokenPrice",1777)
  const stability = useContractReader(readContracts,contractName,"stability",null,1777)

  const contractAddress = readContracts?readContracts[contractName].address:""
  const contractBalance = useBalance(contractAddress,props.localProvider)

  const mode = useContractReader(readContracts,contractName,"mode",null,1777,(unformatted)=>{
    return unformatted?ethers.utils.parseBytes32String(unformatted):unformatted
  })

  const myBalance = useContractReader(readContracts,contractName,"balances",[props.address],1777)
  const myInfluence = useContractReader(readContracts,contractName,"influence",[props.address],1777)

  const [ stabilityPreference, setStabilityPreference ] = useState()
  const myPreference = useContractReader(readContracts,contractName,"preferences",[props.address],1777,null,(newPreference)=>{
    setStabilityPreference(newPreference)
  })

  const isOverThreshold = useContractReader(readContracts,contractName,"isOverThreshold",2777)
  const stabilityTarget = useContractReader(readContracts,contractName,"stabilityTarget",3777)

  let display = []

  function formatter(value) {
    return `${value}%`;
  }

  let stabilityPreferenceDisplay = (
    <span>
      {stabilityPreference}%
    </span>
  )

  const stabilityUpdated = typeof stabilityPreference != "undefined"

  if( myPreference && myPreference != stabilityPreference){
    stabilityPreferenceDisplay = (
      <span>
        {myPreference}% => {stabilityPreference}%
      </span>
    )
  }

  if(readContracts && readContracts[contractName]){
    display.push(
      <Row key="tokenRow">
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Token Address:</Col>
        <Col span={16}>
          <Address value={tokenAddress}/>
        </Col>
      </Row>
    )
    display.push(
      <Row key="priceRow">
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Price Oracle:</Col>
        <Col span={16}>
        <Address value={priceOracle}/> (${price?parseFloat(ethers.utils.formatEther(price)).toFixed(2):0})
        </Col>
      </Row>
    )
    display.push(
      <Row key="modeRow">
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Mode:</Col>
        <Col span={8}>
          <Title level={3} code>{mode}</Title>
        </Col>
        <Col span={8}>
          <Button shape="round" type={isOverThreshold?"primary":"dashed"} disabled={!isOverThreshold} onClick={()=>{
            tx(
              writeContracts['SmartContractWallet'].updateMode(
                { gasLimit: ethers.utils.hexlify(80000) }
              )
            )
          }}>
            ✅
          </Button>
        </Col>
      </Row>
    )

    display.push(
      <Row key="stabilityRow">
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>Stability:</Col>
        <Col span={8}>
          <Title level={3} code>{stability?stability:0}%</Title>
        </Col>
        <Col span={8}>
          <Title level={3} code>🎯 {stabilityTarget?stabilityTarget:0}%</Title>
        </Col>

      </Row>
    )

    display.push(
      <Row key="dividerThing1">
        <Col span={24}>
          <Divider orientation="left" plain>
            Your Contribution ({myInfluence?myInfluence.toNumber():0}%)
          </Divider>
        </Col>
      </Row>
    )

    display.push(
      <Row key="myBalance">
        <Col span={8} style={{textAlign:"right",paddingRight:6,fontSize:24}}>
          <Address minimized={true} value={props.address}/>
        </Col>
        <Col span={16}>
          <Balance
            balance={myBalance}
            dollarMultiplier={props.price}
          />
        </Col>
      </Row>
    )
    display.push(
      <Row key="dividerThing2">
        <Col span={24}>
          <Divider orientation="left" plain>
            Your Stability Preference ({stabilityPreferenceDisplay})
          </Divider>
        </Col>
      </Row>
    )
    display.push(
      <Row key="myStability">
        <Col span={24}>
          <Slider value={stabilityUpdated?stabilityPreference:"0"} tipFormatter={formatter}
            onAfterChange={async (value)=>{
              console.log("MAKE TRANSACTION TO SET stabilityPreference to ",stabilityPreference)
              let txResult = await tx(
                writeContracts['SmartContractWallet'].setPreference(
                  stabilityPreference,
                  { gasLimit: ethers.utils.hexlify(80000) }
                )
              )
            }}
            onChange={(value)=>{
              setStabilityPreference(value)
            }}
          />
        </Col>
      </Row>
    )
  }

  return (
    <div>
      <Card
        title={(
          <div>
            <Balance
              address={contractAddress}
              provider={props.localProvider}
              dollarMultiplier={props.price}
            />
            <div style={{float:'right',opacity:0.77}}>
              <Address value={contractAddress} />
            </div>
          </div>
        )}
        size="large"
        style={{ width: 550, marginTop: 25 }}
        loading={!tokenAddress}
        actions={[
            <div onClick={()=>{
              tx(
                writeContracts['SmartContractWallet'].withdraw(
                  { gasLimit: ethers.utils.hexlify(40000) }
                )
              )
            }}>
              <UploadOutlined /> Withdraw
            </div>,
            <div onClick={()=>{
              tx({
                to: contractAddress,
                value: ethers.utils.parseEther('0.001'),
              })
            }}>
              <DownloadOutlined /> Deposit
            </div>,
        ]}>
          <Meta
            description={(
              <div>
                {display}
              </div>
            )}
          />
      </Card>
      <div style={{position:'fixed',textAlign:'right',right:25,top:90,padding:10,width:"50%"}}>
        <h1><span role="img" aria-label="checkmark">✅</span> TODO LIST</h1>
        <Timeline
          localProvider={props.localProvider}
          address={props.address}
          chainIsUp={typeof localBlockNumber != "undefined"}
          hasOwner={false}

          hasEther={parseFloat(localBalance)>0}
          contractAddress={contractAddress}
          contractHasEther={contractBalance>0}
          amOwnerOfContract={false}
        />

      </div>
    </div>
  );

}


/*
<Button shape="round" onClick={async ()=>{
  console.log("CALLING updateStabilityTarget")
  let result = await tx(
    writeContracts['SmartContractWallet'].updateStabilityTarget(
      { gasLimit: ethers.utils.hexlify(120000) }
    )
  )
  console.log("RESULT OF UPDATE",result)
}}>
  🛑
</Button>
*/
