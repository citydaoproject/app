import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plot } from "../models/Plot";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setHighlightedPlot } from "../actions";
import { setActivePlot } from "../actions/plotsSlice";

import LAND_IMG from "../assets/images/SampleLandImage.png";
import { stringifyPlotId } from "../helpers/stringifyPlotId";

interface Props {
  plot: Plot;
  delay: number;
}

export default function PlotButton({ plot, delay }: Props) {
  const dispatch = useAppDispatch();
  const highlightedPlot = useAppSelector(state => state.plots.highlightedPlot);

  return (
    // Don't use the antd Button class here as that adds subcomponents that mess with styling
    // Instead, we use a standard button tag with the ant-btn class name, giving the same style attributes
    <AnimatePresence>
      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ delay: 0.1 * delay }}
        onMouseEnter={() => dispatch(setHighlightedPlot(plot))}
        onMouseLeave={() => dispatch(setHighlightedPlot(undefined))}
        onClick={() => dispatch(setActivePlot(plot))}
        className={`btn w-full ${highlightedPlot === plot ? "highlight" : ""}`}
      >
        <div className="flex justify-between w-full p-1 items-center">
          <div className="flex justify-start items-center">
            <img src={LAND_IMG} alt={plot?.id.toString()} className="img-small" />
            <span className="plot-title primary-font text-lg font-medium leading-6 mx-2">
              Plot #{stringifyPlotId(plot.id)}
            </span>
            <span className="text-lg secondary-font text-gray-9 leading-6 third-font mb-1">Parcel {plot.parcel}</span>
          </div>
          <span className="plot-price primary-font text-lg font-light leading-6 float-right items-center">
            {plot?.price !== undefined && `${plot.price.toString()} ETH`}
          </span>
        </div>
      </motion.button>
    </AnimatePresence>
  );
}
