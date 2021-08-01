import React, { useState } from 'react'
import { ethers } from "ethers";
import { Card, Row, Col, List, Input, Button } from 'antd';
import { DownloadOutlined, UploadOutlined, CloseCircleOutlined, CheckCircleOutlined, RocketOutlined, SafetyOutlined } from '@ant-design/icons';
import { useContractLoader, useContractReader, useEventListener, useBlockNumber, useBalance, useTimestamp } from "./hooks"
import { Transactor } from "./helpers"
import { Address, Balance, Timeline, AddressInput } from "./components"
const { Meta } = Card;
const contractName = "SmartContractWallet"

export default function SmartContractWallet(props) {

  const tx = Transactor(props.injectedProvider,props.gasPrice)

  const localBlockNumber = useBlockNumber(props.localProvider)
  const localBalance = useBalance(props.address,props.localProvider)

  const readContracts = useContractLoader(props.localProvider);
  const writeContracts = useContractLoader(props.injectedProvider);

  const limit = useContractReader(readContracts,contractName,"limit",1777);
  const friends = useContractReader(readContracts,contractName,"friends",[props.address],1777);
  const friendUpdates = useEventListener(readContracts,contractName,"UpdateFriend",props.localProvider,1);
  const owner = useContractReader(readContracts,contractName,"owner",1777);

  const contractAddress = readContracts?readContracts[contractName].address:""
  const contractBalance = useBalance(contractAddress,props.localProvider)


  let cardActions = []
  if(props.address==owner){
    cardActions = [
      <div onClick={()=>{
        tx(writeContracts['SmartContractWallet'].withdraw())
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
    ]
  }

  let display
  if(readContracts && readContracts[contractName]){
    display = (
      <div>
        <Row align="middle" gutter={4}>
          <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>
            Deployed to:
          </Col>
          <Col span={16}>
            <Address value={contractAddress} />
          </Col>
        </Row>
        <Row align="middle" gutter={4}>
          <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>
            Owner:
          </Col>
          <Col span={16}>
            <Address value={owner} onChange={(newOwner)=>{
              tx(writeContracts['SmartContractWallet'].updateOwner(newOwner))
            }}/>
          </Col>
        </Row>
        
      </div>
    )
  }

  return (
    <div>
      <Card
        title={(
          <div>
            📄 Smart Contract Wallet with Recovery
            <div style={{float:'right',opacity:owner?0.77:0.33}}>
              <Balance
                address={contractAddress}
                provider={props.localProvider}
                dollarMultiplier={props.price}
              />
            </div>
          </div>
        )}
        size="large"
        style={{ width: 550, marginTop: 25 }}
        loading={!owner}
        actions={cardActions}>
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
          hasOwner={typeof owner != "undefined"}
          hasEther={parseFloat(localBalance)>0}
          contractAddress={contractAddress}
          contractHasEther={parseFloat(contractBalance)>0}
          amOwnerOfContract={owner===props.address}
          hasLimit={limit&&limit.toNumber()>0}
          hasFriends={typeof friends != "undefined"}
          hasFriendEvents={typeof friendUpdates != "undefined" && friendUpdates.length > 0}
          hasRecovery={typeof recoveryAddress != "undefined" && typeof currentRecoveryAddress != "undefined" }
        />
      </div>
    </div>
  );

}
