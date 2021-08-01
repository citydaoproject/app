import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, Skeleton } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { useEventListener } from "../hooks";
import { Address, AddressInput, Balance, Contract } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
const { utils } = require("ethers");

export default function Projects({ setQuestFilter, projects, projectList, projectEvents, address, userProvider, blockExplorer, mainnetProvider, localProvider, setPurposeEvents, purpose, yourLocalBalance, price, tx, readContracts, writeContracts }) {



  let history = useHistory();

  return (
    <div>
      <div style={{ width:780, margin: "auto", textAlign:"left", marginTop:32, paddingBottom:32 }}>

      <List
        loading={!projectEvents}
        itemLayout="horizontal"
        dataSource={projectList}
        renderItem={item => {
          let firstSpace = item.title.indexOf(" ")
          let title = item.title.substr(firstSpace).trim()
          let emoji = item.title.substr(0,firstSpace).trim()
          return (
            <List.Item
              actions={[
                <a style={{color:"#000000"}} key="list-quests" onClick={()=>{
                  history.push("/quests")
                  setQuestFilter(item.title)
                }}>🚩 quest</a>,
                <a style={{color:"#000000"}} key="list-support" href={"/support/"+item.id} target="_blank">⚡️ support</a>,
                <a style={{color:"#000000"}} key="list-code" href={item.repo} target="_blank">🍴 fork</a>
              ]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={
                    emoji
                  }
                  title={<a href={"https://"+title} target="_blank">{title}</a>}
                  description={item.desc}
                />
              </Skeleton>
              <Address
                  value={item.owner}
                  ensProvider={mainnetProvider}
                  fontSize={16}
                />
            </List.Item>
          )
        }}
      />
      </div>
     { /*

       <Contract
        name="Projects"
        signer={userProvider.getSigner()}
        provider={localProvider}
        address={address}
        blockExplorer={blockExplorer}
      />
      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <List
          bordered
          dataSource={projectEvents}
          renderItem={item => (
            <List.Item>
              <div>title:{item.title}</div>
              <div>desc:{item.desc}</div>
              <div>repo:{item.repo}</div>
              <div>owner:{item.owner}</div>
            </List.Item>
          )}
        />
      </div>

       */ }
    </div>
  );
}
