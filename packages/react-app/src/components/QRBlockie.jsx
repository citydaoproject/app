import React, { useState, useEffect } from "react";
import QR from 'qrcode.react';
import { Blockie, Balance } from "."
import { Typography } from 'antd';
const { Text } = Typography;


export default function QRBlockie(props) {

  const size = useWindowSize();

  const qrWidth = 600

  let scale = Math.min(size.height-130,size.width,1024)/(qrWidth*1)

  let offset =  0.42

  const url  = window.location.href+""

  return (
    <div style={{marginLeft:"0vw",width:qrWidth,transform:"scale("+scale+")",transformOrigin:"0 0"}}>

    <div style={{position:"absolute",top:0,right:"64px"}}>
      <Balance size={"calc(26px + 0.5vw)"} tokenContract={props.tokenContract} address={props.address} provider={props.provider} dollarMultiplier={props.price}/>
    </div>


      <div style={{position:"absolute",bottom:0,right:"64px"}}>
        <Text style={{fontSize:36}} copyable={{text:props.address}}>{props.address?props.address.substr(0,8)+"..."+props.address.substr(-6):" ... "}</Text>
      </div>

      <QR level={"M"} includeMargin={true} value={props.address?url+props.address:""} size={qrWidth} imageSettings={{width:qrWidth/5,height:qrWidth/5,excavate:true}}/>
      <div style={{margin:"auto",width:qrWidth,position:"absolute",top:qrWidth/2-48}}>
        <Blockie address={props.address} scale={12}/>
      </div>
    </div>
  );
}


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
