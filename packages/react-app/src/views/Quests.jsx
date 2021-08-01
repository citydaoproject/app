import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, Row, Col } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { useEventListener, useFilteredEventListener } from "../hooks";
import { Address, AddressInput, Balance, Contract } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { utils } from "ethers";
import { format } from 'timeago.js';

export default function Quests({questId, questFilter, setQuestFilter, questList, quests, questUpdateEvents, address, userProvider, blockExplorer, mainnetProvider, localProvider, setPurposeEvents, purpose, yourLocalBalance, price, tx, readContracts, writeContracts }) {

  console.log("questId",questId)

  let history = useHistory();
  let [ newWork, setNewWork ] = useState()
  let [ toAddress, setToAddress ] = useState()

  const filter = readContracts?readContracts.Quests.filters.QuestLook(questId):{}
  const lookEvents = useFilteredEventListener(readContracts, "Quests", filter, localProvider, 1)

  const filterQuestWork = readContracts?readContracts.Quests.filters.QuestWork(questId):{}
  const workEvents = useFilteredEventListener(readContracts, "Quests", filterQuestWork, localProvider, 1)

  const filterQuestFinished = readContracts?readContracts.Quests.filters.QuestFinished(questId):{}
  const finishEvents = useFilteredEventListener(readContracts, "Quests", filterQuestFinished, localProvider, 1)


  let greatestLookTimestamp = 0
  if( questId && quests && quests[questId] ){
    const item = quests[questId]
    let parseProjectName = utils.parseBytes32String(item.project)

    const looks = []
    for(let l in lookEvents){
      if(lookEvents[l].timestamp > greatestLookTimestamp){
        greatestLookTimestamp = lookEvents[l].timestamp
      }
      looks.push(
        <span key={"look"+l} style={{marginRight:8}}>
          <Address
            value={lookEvents[l].builder}
            minimized={true}
            blockExplorer={blockExplorer}
          />
        </span>
      )
    }

    const works = []
    let latestWorkAddress
    for(let w in workEvents){

      let shorter = workEvents[w].link
      if(shorter.length>67){
        shorter = shorter.substr(0,64)+"..."
      }

      if(!latestWorkAddress) latestWorkAddress=workEvents[w].builder

      works.push(
        <Card key={"work"+w}
          style={{ marginTop: 16 }}
          type="inner"
          title={(
            <Address
              value={workEvents[w].builder}
              ensProvider={mainnetProvider}
              blockExplorer={blockExplorer}
              fontSize={16}
            />
          )}
          extra={format(workEvents[w].timestamp*1000)}
        >
          <a href={workEvents[w].link} target="_blank">{shorter}</a>
        </Card>
      )
    }

    const workLog = (
      <div>
        <Divider orientation="left">Work Log:</Divider>

        <Row style={{marginBottom:32,marginTop:16}} gutter={8}>
          <Col span={17}>
            <Input
              size="large"
              placeholder="url to work, commit, or PR"
              value={newWork}
              onChange={(e)=>{setNewWork(e.target.value)  }}
            />
          </Col>
          <Col span={7}>
            <Button size={"large"} onClick={()=>{
              //submit work
              writeContracts.Quests.submitWork(questId,newWork)
              setNewWork()
            }}>
              <span style={{marginRight:8}}>📥</span> Submit Work
            </Button>
          </Col>
        </Row>

        {works}

        <Divider></Divider>

        <Row style={{marginBottom:32,marginTop:16}} gutter={8}>
          <Col span={17}>
            <AddressInput
              size={"large"}
              ensProvider={mainnetProvider}
              placeholder="to address"
              value={toAddress}
              onChange={setToAddress}
            />
          </Col>
          <Col span={7}>
            <Button size={"large"} onClick={()=>{
              console.log("item",item)
              //finishQuest( bytes32 project, string memory title, address payable recipient )
              writeContracts.Quests.finishQuest(questId,item.title,toAddress)
              setToAddress()
            }}>
              <span style={{marginRight:8}}>🏁</span> Finish Quest
            </Button>
          </Col>
        </Row>


      </div>
    )

    let lookTime
    if(format(greatestLookTimestamp*1000)){
      lookTime = (
        <span style={{marginRight:8,opacity:0.33,fontSize:12}}>
          {format(greatestLookTimestamp*1000)}
        </span>
      )
    }

    let lookButton = (
      <div style={{float:"right",marginTop:32,marginBottom:16}}>

        {lookTime} {looks}

        <Button style={{margin:8}} onClick={()=>{
          writeContracts.Quests.lookingAt(questId)
        }}>
         <span style={{marginRight:8}}>👀</span> I'm taking a look!
        </Button>

      </div>
    )

    return (
      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <Card style={{marginTop:32,textAlign:'left'}} key={"quest"+item.id} title={item.title} extra={parseProjectName.substr(0,parseProjectName.indexOf(" "))}>

          <div style={{marginBottom:8}}>
            {item.desc}
          </div>

          {lookButton}

          {workLog}

        </Card>
      </div>
    )
    //console.log("IN DEPTH VIEW OF QUEST",questId)
  }


  let questCards = []
  for(let q in quests){
    const item = quests[q]
    let parseProjectName = utils.parseBytes32String(item.project)
    if(
      item.id.indexOf(questFilter)>=0 ||
      item.title.indexOf(questFilter)>=0 ||
      parseProjectName.indexOf(questFilter)>=0 ||
      item.desc.indexOf(questFilter)>=0
    )
    questCards.push(
      <Card style={{marginTop:32,textAlign:'left'}} key={"quest"+item.id} title={item.title} extra={parseProjectName.substr(0,parseProjectName.indexOf(" "))}>

        <div>
          {item.desc}
        </div>

          <div style={{float:"right",marginTop:32}}>
            <Button onClick={()=>{
              history.push("/quests/"+item.id)
            }}>
              <span style={{marginRight:8}}>⚔️</span>quest
            </Button>
          </div>

      </Card>
    )
  }




  return (
    <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:64 }}>

      <Input size={"large"} placeholder={"search"} style={{marginTop:32,width:538}} value={questFilter} onChange={(e)=>{setQuestFilter(e.target.value)}} />

      {questCards}
    </div>
  );
}
