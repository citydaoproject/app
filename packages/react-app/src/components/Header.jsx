import React from "react";
import { PageHeader } from "antd";

export default function Header() {
  return (
    <a href="/" /*target="_blank" rel="noopener noreferrer"*/>
      <PageHeader
        title="🥩 Steak Demo"
        subTitle="Stake 0.01 Kovan!"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
