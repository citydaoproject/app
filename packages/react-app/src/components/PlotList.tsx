import React from "react";
import { List } from "antd";

import { Plot } from "../models/Plot";
import PlotButton from "./PlotButton";
import { motion } from "framer-motion";

interface Props {
  plots: Plot[];
}

export default function PlotList({ plots }: Props) {
  return (
    <div className="list">
      {plots.map((plot: Plot, idx: number) => (
        <motion.div className="list-item" key={idx} layout>
          <PlotButton plot={plot} delay={idx} />
        </motion.div>
      ))}
    </div>
  );
}
