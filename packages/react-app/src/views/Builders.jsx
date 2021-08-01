import React, { useCallback, useEffect, useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { useEventListener } from "../hooks";
import { Address, AddressInput, Balance, Contract } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";

export default function Builders({ projectList, projectEvents, address, userProvider, blockExplorer, mainnetProvider, localProvider, setPurposeEvents, purpose, yourLocalBalance, price, tx, readContracts, writeContracts }) {

  const builderEvents = useEventListener(readContracts, "Builders", "Builder")
  const [builders, setBuilders] = useState({})
  const [builderList, setBuilderList] = useState([])

  useEffect(()=>{
    let newBuilders = Object.assign(builders)
    let newBuilderList = []
    for(let e in builderEvents){
      if(!newBuilders[builderEvents[e][0]])
      {
        newBuilders[builderEvents[e][0]] = builderEvents[e]
      }else if(builderEvents[e].blockNumber>builders[builderEvents[e][0]].blockNumber) {
        newBuilders[builderEvents[e][0]] = builderEvents[e]
      }
    }
    for(let b in newBuilders){
      if(newBuilders[b][1]){
        newBuilderList.push(newBuilders[b])
      }
    }
    setBuilders(newBuilders)
    setBuilderList(newBuilderList)
  },[builderEvents])

  return (
    <div>
      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <List
          bordered
          dataSource={builderList}
          renderItem={item => (
            <List.Item>
              <Address
                  value={item[0]}
                  ensProvider={mainnetProvider}
                  fontSize={16}
                />
            </List.Item>
          )}
        />
      </div>
      <Contract
        name="Builders"
        signer={userProvider.getSigner()}
        provider={localProvider}
        address={address}
        blockExplorer={blockExplorer}
      />
      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <List
          bordered
          dataSource={builderEvents}
          renderItem={item => (
            <List.Item>
              <Address
                  value={item[0]}
                  ensProvider={mainnetProvider}
                  fontSize={16}
                /> =>
              {item.isBuilder?"👍":"👎"}
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
