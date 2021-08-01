import React from "react";
import { PageHeader } from "antd";

export default function Header() {
  return (
    <a href="/" rel="noopener noreferrer">
      <PageHeader
        title="🧙‍♂️ Instant Wallet"
        subTitle=""
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
