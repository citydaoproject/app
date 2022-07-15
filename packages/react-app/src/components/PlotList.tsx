import React, { useEffect } from "react";

import { Plot } from "../models/Plot";
import PlotButton from "./PlotButton";
import { motion } from "framer-motion";
import { RootState } from "../store";
import { useAppSelector } from "../hooks";
import { useAppDispatch } from "../hooks";
import { setNumDisplayPlots } from "../actions/plotsSlice";

interface Props {
  plots: Plot[];
  totalNum: number;
  isLoading?: boolean;
  setShowingOwnedPlot: any;
}

export default function PlotList({ plots, totalNum, isLoading, setShowingOwnedPlot }: Props) {
  const dispatch = useAppDispatch();
  const idFilter = useAppSelector((state: RootState) => state.plots.idFilter);
  const currentNumDisplay = useAppSelector((state: RootState) => state.plots.numDisplay);

  useEffect(() => {
    dispatch(setNumDisplayPlots(10));
  }, [idFilter]);

  const increaseNumDisplayedPlots = () => {
    dispatch(setNumDisplayPlots(currentNumDisplay + 10));
  };

  return (
    <div className="list block">
      {plots?.map((plot: Plot, idx: number) => (
        <motion.div className="list-item" key={plot.id} layout>
          {/* modulo delay by 10 because plot buttons are added in batches of 10 */}
          <PlotButton
            plot={plot}
            delay={idx % 10}
            setShowingOwnedPlot={setShowingOwnedPlot}
          />
        </motion.div>
      ))}
      {totalNum > plots?.length && (
        <span onClick={increaseNumDisplayedPlots} className="text-gray-7 third-font cursor-pointer my-4 pb-4">
          Show more
        </span>
      )}
      {plots?.length === 0 && isLoading && <span className="text-gray-7 third-font">Loading...</span>}
    </div>
  );
}
