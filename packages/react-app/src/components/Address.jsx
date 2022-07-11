import { Skeleton } from "antd";
import React from "react";
import Blockies from "react-blockies";
import { useLookupAddress } from "../hooks";
import { sliceUserAddress } from "../helpers/sliceUserAddress";

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

  const displayAddress = ens && ens.indexOf("0x") < 0 ? ens : sliceUserAddress(address);
  return (
    <span style={{ display: "flex", alignItems: "center" }}>
      <span style={{ verticalAlign: "middle", display: "flex", alignItems: "center" }}>
        <Blockies seed={address.toLowerCase()} size={8} scale={3} />
      </span>
      <span
        style={{ verticalAlign: "middle", paddingLeft: 5, fontSize: props.fontSize ? props.fontSize : 16 }}
        title={address}
      >
        {displayAddress}
      </span>
    </span>
  );
}
