import React, { useEffect, useState } from "react";
import { List } from "antd";

import { Plot } from "../models/Plot";
import PlotButton from "./PlotButton";
import { motion } from "framer-motion";

interface Props {
  plots: Plot[];
  emptyMessage: string;
}

export default function PlotList({ plots, emptyMessage }: Props) {
  const [displayedPlots, setDisplayedPlots] = useState(plots);
  const [numDisplayedPlots, setNumDisplayedPlots] = useState(10);
  useEffect(() => {
    setDisplayedPlots(plots.slice(0, numDisplayedPlots));
  }, [plots, numDisplayedPlots]);

  const increaseNumDisplayedPlots = () => {
    setNumDisplayedPlots(numDisplayedPlots + 10);
  };

  return (
    <div className="list block overflow-y-scroll" style={{ maxHeight: "80vh" }}>
      {displayedPlots.map((plot: Plot, idx: number) => (
        <motion.div className="list-item" key={plot.id} layout>
          {/* modulo delay by 10 because plot buttons are added in batches of 10 */}
          <PlotButton plot={plot} delay={idx % 10} />
        </motion.div>
      ))}
      {plots.length > displayedPlots.length && (
        <span onClick={increaseNumDisplayedPlots} className="text-gray-7 third-font cursor-pointer my-4 pb-4">
          Show more
        </span>
      )}
      {plots.length === 0 && <span className="text-gray-7 third-font">{emptyMessage}</span>}
    </div>
  );
}
