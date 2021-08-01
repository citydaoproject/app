import React from "react";
import { PageHeader } from "antd";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <PageHeader
        title="Meebits Viewer"
        subTitle="forkable NFT gallery"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
