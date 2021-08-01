import React from "react";
import { PageHeader } from "antd";

export default function Header() {
  return (
    <a href="/" rel="noopener noreferrer">
      <PageHeader
        title="🏰 Buidl Guidl"
        subTitle=""
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
