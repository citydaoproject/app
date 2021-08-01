import React, { useState } from "react";
import { Input } from "antd";

export default function AddressInput(props) {
  const [mode, setMode] = useState(props.price ? "USD" : (props.name?props.name:"ETH"));
  const [display, setDisplay] = useState();
  const [value, setValue] = useState();

  const currentValue = typeof props.value !== "undefined" ? props.value : value;

  const option = title => {
    if (!props.price) return "";
    return (
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (mode === "USD") {
            setMode(props.name?props.name:"ETH");
            setDisplay(currentValue);
          } else {
            setMode("USD");
            if (currentValue) {
              const usdValue = "" + (parseFloat(currentValue) * props.price).toFixed(2);
              setDisplay(usdValue);
            } else {
              setDisplay(currentValue);
            }
          }
        }}
      >
        {title}
      </div>
    );
  };

  let prefix;
  let addonAfter;
  if (mode === "USD") {
    prefix = "$";
    addonAfter = option("USD 🔀");
  } else {
    prefix = "Ξ";
    addonAfter = option(props.name?props.name+" 🔀":"ETH 🔀");
  }

  let extra = ""
  if(mode=="USD" && props.name){
    extra = " of "+props.name
  }

  return (
    <Input
      placeholder={props.placeholder ? props.placeholder : "amount in " + mode + extra}
      autoFocus={props.autoFocus}
      prefix={prefix}
      value={display}
      addonAfter={addonAfter}
      onChange={async e => {
        const newValue = e.target.value;
        if (mode === "USD") {
          const ethValue = parseFloat(newValue) / props.price;
          setValue(ethValue);
          if (typeof props.onChange === "function") {
            props.onChange(ethValue);
          }
          setDisplay(newValue);
        } else {
          setValue(newValue);
          if (typeof props.onChange === "function") {
            props.onChange(newValue);
          }
          setDisplay(newValue);
        }
      }}
    />
  );
}
