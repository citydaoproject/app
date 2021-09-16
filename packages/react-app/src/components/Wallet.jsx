import { SendOutlined, WalletOutlined } from "@ant-design/icons";
import { Button, Modal, Tooltip } from "antd";
import { ethers } from "ethers";
import React, { useState } from "react";
import { Transactor } from "../helpers";
import EtherInput from "./EtherInput";

export default function Wallet(props) {
  const [open, setOpen] = useState();
  const [amount, setAmount] = useState();

  const useOpenWallet = () => {
    setOpen(!open);
  };

  const providerSend = (
    <Tooltip title="Wallet">
      <WalletOutlined
        onClick={useOpenWallet}
        rotate={-90}
        style={{
          padding: 7,
          cursor: "pointer",
          fontSize: 28,
          verticalAlign: "middle",
        }}
      />
    </Tooltip>
  );

  const display = (
    <div>
      <div>
        <EtherInput
          price={props.price ?? 1}
          value={amount}
          onChange={value => {
            setAmount(value);
          }}
        />
      </div>
    </div>
  );

  const useSend = async () => {
    const tx = Transactor(props.provider);
    let value;
    try {
      value = ethers.utils.parseEther("" + amount);
    } catch (e) {
      // failed to parseEther, try something else
      value = ethers.utils.parseEther("" + parseFloat(amount).toFixed(8));
    }

    tx({
      to: props.toAddress,
      value,
    });
    setOpen(!open);
  };

  return (
    <span className="absolute bottom-0 left-0 z-10">
      {providerSend}
      <Modal
        visible={open}
        onOk={() => {
          setOpen(!open);
        }}
        onCancel={() => {
          setOpen(!open);
        }}
        footer={[
          <Button key="submit" type="primary" disabled={!amount} loading={false} onClick={useSend}>
            <SendOutlined /> Send
          </Button>,
        ]}
      >
        {display}
      </Modal>
    </span>
  );
}
