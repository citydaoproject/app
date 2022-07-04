import { Skeleton } from "antd";
import React from "react";
import Blockies from "react-blockies";
import { useLookupAddress } from "../hooks";

export default function Address(props) {
  const address = props.value || props.address;
  const ens = useLookupAddress(props.ensProvider, address);

  if (!address) {
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    );
  }

  let displayAddress = address.substr(0, 6);

  if (ens && ens.indexOf("0x") < 0) {
    displayAddress = ens;
  } else if (props.size === "short") {
    displayAddress += "..." + address.substr(-4);
  } else if (props.size === "long") {
    displayAddress = address;
  }

  return (
    <span style={{ display: "flex", alignItems: "center" }}>
      <span style={{ verticalAlign: "middle", display: "flex", alignItems: "center" }}>
        <Blockies seed={address.toLowerCase()} size={8} scale={3} />
      </span>
      <span style={{ verticalAlign: "middle", paddingLeft: 5, fontSize: props.fontSize ? props.fontSize : 16 }}>
        {displayAddress}
      </span>
    </span>
  );
}
