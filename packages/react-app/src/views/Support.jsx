import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, Skeleton } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { useEventListener } from "../hooks";
import { Address, AddressInput, Balance, Contract } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
const { utils } = require("ethers");

export default function Support({ setQuestFilter, projects, projectList, projectEvents, address, userProvider, blockExplorer, mainnetProvider, localProvider, setPurposeEvents, purpose, yourLocalBalance, price, tx, readContracts, writeContracts }) {




  return (
    <div>
      <div style={{ width:780, margin: "auto", textAlign:"center", marginTop:32, paddingBottom:32 }}>

        <div style={{fontSize:32,padding:32}}>Next quadratic round in 00:00:00</div>
        <div style={{fontSize:16,padding:32}}>contact <a href="https://twitter.com/austingriffith" target="_blank">@austingriffith</a> to participate </div>

        <Divider>OR</Divider>

        <div>Support Buidl Guidl matching pool and get an NFT that gives you access to BG telegram chat. </div>

      </div>
    </div>
  );
}
