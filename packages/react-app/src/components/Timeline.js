import React from 'react'
import Blockies from 'react-blockies';
import { Timeline, Typography } from 'antd';
import { SendOutlined, DownloadOutlined, EditOutlined, VerticalAlignTopOutlined, MehOutlined } from  '@ant-design/icons';
const { Text } = Typography;

export default function TimelineDisplay(props) {

  return (
    <Timeline mode="right">

      <Timeline.Item dot={"💾"}>
        <Text delete>
          Clone and Install from the <a target="_blank" rel="noopener noreferrer" href="https://github.com/austintgriffith/scaffold-eth">github repo</a>
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={"⚛️"}>
        <Text delete>
          Start your frontend app with: <Text strong>yarn start</Text>
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={"⛓"}>
        <Text delete={props.chainIsUp}>
          Start your local blockchain with: <Text strong>yarn run chain</Text> (and refresh)
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={"📝"}>
        <Text delete={props.hasOwner}>
          Compile and deploy your smart contract: <Text strong>yarn run deploy</Text>
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={"📓"}>
        <Text>
          Follow along with <a target="_blank" rel="noopener noreferrer" href="https://medium.com/@austin_48503/programming-autonomous-money-300bacec3a4f">this guide</a> for more information.
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={<SendOutlined style={{ fontSize: '16px' }} />} color={props.hasEther?"green":"blue"}>
        <Text delete={props.hasEther}>
          Send test ether to your <Blockies seed={(props.address?props.address:"").toLowerCase()} size={8} scale={2}/> address using (bottom left) faucet
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={<EditOutlined style={{ fontSize: '16px' }} />} color={props.amOwnerOfContract?"green":"blue"}>
        <Text delete={props.amOwnerOfContract}>
          Set <b>owner</b> of your <Blockies seed={(props.contractAddress?props.contractAddress:"").toLowerCase()} size={8} scale={2}/> smart contract wallet to your <Blockies seed={(props.address?props.address:"").toLowerCase()} size={8} scale={2}/> address
          <br/>
          Do this by editing the <Text code>SmartContractWallet.args</Text> file in <Text code>packages/buidler/contracts</Text>. Then redeploy your contract.
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={<DownloadOutlined style={{ fontSize: '16px' }} />} color={props.contractHasEther?"green":"blue"}>
        <Text delete={props.contractHasEther}>
          Deposit some funds into your <Blockies seed={(props.contractAddress?props.contractAddress:"").toLowerCase()} size={8} scale={2}/> smart contract wallet
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={<VerticalAlignTopOutlined style={{ fontSize: '16px' }} />} color={props.hasLimit?"green":"blue"}>
        <Text delete={props.hasLimit}>
          Create a deposit <Text code>limit</Text> in your <Blockies seed={(props.contractAddress?props.contractAddress:"").toLowerCase()} size={8} scale={2}/> smart contract wallet
          <br/>
          Try depositing enough times to make sure you get the error.
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={<MehOutlined  style={{ fontSize: '16px' }} />} color={props.hasFriends?"green":"blue"}>
        <Text delete={props.hasFriends}>
          Create a <Text code>friends</Text> mapping in your <Blockies seed={(props.contractAddress?props.contractAddress:"").toLowerCase()} size={8} scale={2}/> smart contract wallet
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={<MehOutlined  style={{ fontSize: '16px' }} />} color={props.hasFriendEvents?"green":"blue"}>
        <Text delete={props.hasFriendEvents}>
          Create an <Text code>updateFriend()</Text> function that emits <Text code>UpdateFriend</Text> events in the frontend and then display the events in a <Text code>List</Text>
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={"🛠"} color={props.hasRecovery?"green":"blue"}>
        <Text delete={props.hasRecovery}>
          Create recovery functions that your friends can call and also the ability for you to cancel the recovery if you still have access to your account
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={"🚀"}>
        <Text>
          Build something awesome with 🏗 <a href="https://github.com/austintgriffith/scaffold-eth">scaffold-eth</a> and <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/austingriffith">@ me</a>!
        </Text>
      </Timeline.Item>

      <Timeline.Item dot={"📖"}>
        <Text>
          Read more about <a target="_blank" rel="noopener noreferrer"  href="https://ethereum.org/developers">Ethereum</a>, <a target="_blank" rel="noopener noreferrer" href="https://solidity.readthedocs.io/en/develop/contracts.html">Solidity</a>, and <a target="_blank" rel="noopener noreferrer" href="https://buidler.dev/tutorial">Buidler</a>
        </Text>
      </Timeline.Item>



    </Timeline>
  );
}
