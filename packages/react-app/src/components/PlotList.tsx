import React from "react";
import { List } from "antd";

import { Plot } from "../models/Plot";
import PlotButton from "./PlotButton";

interface Props {
  plots: Plot[];
}

export default function PlotList({ plots }: Props) {
  return (
    <List
      dataSource={plots}
      renderItem={plot => (
        <List.Item>
          <PlotButton plot={plot} />
        </List.Item>
      )}
    />
  );
}
