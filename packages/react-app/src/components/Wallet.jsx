import React, { useState } from "react";
import { WalletOutlined, QrcodeOutlined, SendOutlined } from "@ant-design/icons";
import { Tooltip, Spin, Modal, Button, Row, Col } from "antd";
import QR from "qrcode.react";
import { parseEther } from "@ethersproject/units";
import { useUserAddress } from "eth-hooks";
import { useUserProvider } from "../hooks";
import { Transactor } from "../helpers";
import { QRBlockie } from ".";
import Address from "./Address";
import Balance from "./Balance";
import AddressInput from "./AddressInput";
import EtherInput from "./EtherInput";


export default function Wallet(props) {
  const signerAddress = useUserAddress(props.userProvider);

  //const signerAddress = useUserAddress(props.provider);
  const selectedAddress = signerAddress;

  const [open, setOpen] = useState();
  const [amount, setAmount] = useState();
  const [toAddress, setToAddress] = useState();

  const providerSend = props.provider ? (
    <Tooltip title="point camera phone at qr code">

      <QRBlockie address={signerAddress} tokenContract={props.asset.tokenContract} provider={props.asset.provider} price={props.asset.price} />

      <div style={{
        cursor:"pointer",
        position:'fixed',
        width:"calc( 40px + 10vw )",
        height:"calc( 40px + 10vw )",
        textAlign:'center',
        right:-4,
        bottom:"2vw",
        padding:10,
        zIndex: 257,
        backgroundImage: "linear-gradient("+props.asset.color1+", "+props.asset.color2+")",
        backgroundColor: props.color1,
        boxShadow: "rgb(0, 0, 0) 0.3px 0.3px 3px"
      }}
        onClick={()=>{setOpen(!open)}}
      >
        <Row type="flex" align="middle" >
          <Col span={24} style={{zIndex:2}}>
            <SendOutlined style={{color:"#EDEDED",fontSize:"6vw",marginTop:"calc( 12px + 2vw )"}} rotate={0} />
          </Col>
        </Row>
      </div>

    </Tooltip>
  ) : (
    ""
  );

  let display;
  let receiveButton;

  const inputStyle = {
    padding: 10,
  };

  display = (
    <div>
      <div style={inputStyle}>
        <AddressInput
          autoFocus
          ensProvider={props.ensProvider}
          placeholder="to address"
          value={toAddress}
          onChange={setToAddress}
        />
      </div>
      <div style={inputStyle}>
        <EtherInput
          price={props.asset.price}
          value={amount}
          name={props.asset.name}
          onChange={value => {
            setAmount(value);
          }}
        />
      </div>
    </div>
  );


  //console.log("props.asset.price",props.asset.price)
  //console.log("props.asset.tokenContract",props.asset.tokenContract)
  return (
    <span>
      {providerSend}
      <Modal
        style={{marginTop:-90}}
        visible={open}
        title={
          <div>
            {selectedAddress && selectedAddress != "" ? (<span><Address value={selectedAddress} ensProvider={props.ensProvider} /><span style={{paddingLeft:8,color:props.asset.color1}}>{props.asset.name}</span></span>) : <Spin />}
            <div style={{ float: "right", paddingRight: 25 }}>
              <Balance address={selectedAddress} provider={props.provider} dollarMultiplier={props.asset.price} />
            </div>
          </div>
        }
        onOk={() => {
          setOpen(!open);
        }}
        onCancel={() => {
          setOpen(!open);
        }}
        footer={[
          <Button
            key="submit"
            type="primary"
            disabled={!amount || !toAddress}
            loading={false}
            onClick={() => {
              const tx = Transactor(props.userProvider);



              let value;
              try {
                value = parseEther("" + amount);
              } catch (e) {
                // failed to parseEther, try something else
                value = parseEther("" + parseFloat(amount).toFixed(8));
              }

              if(props.asset.tokenContract){
                tx({
                  to: props.asset.tokenContract.address,
                  data: props.asset.tokenContract.interface.encodeFunctionData("transfer(address,uint256)",[toAddress,value]),
                });
              }else{
                tx({
                  to: toAddress,
                  value,
                });
              }


              setOpen(!open);
            }}
          >
            <SendOutlined /> Send
          </Button>,
        ]}
      >
        {display}
      </Modal>
    </span>
  );
}
