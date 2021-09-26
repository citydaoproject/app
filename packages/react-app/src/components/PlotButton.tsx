import React from "react";
import { Plot } from "../models/Plot";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setHighlightedPlot } from "../actions";
import { setActivePlot } from "../actions/plotsSlice";

import LAND_IMG from "../assets/images/SampleLandImage.png";

interface Props {
  plot: Plot;
}

export default function PlotButton({ plot }: Props) {
  const dispatch = useAppDispatch();
  const highlightedPlot = useAppSelector(state => state.plots.highlightedPlot);

  return (
    // Don't use the antd Button class here as that adds subcomponents that mess with styling
    // Instead, we use a standard button tag with the ant-btn class name, giving the same style attributes
    <button
      onMouseEnter={() => dispatch(setHighlightedPlot(plot))}
      onMouseLeave={() => dispatch(setHighlightedPlot(undefined))}
      onClick={() => dispatch(setActivePlot(plot))}
      className={`btn w-full ${highlightedPlot === plot ? "highlight" : ""}`}
    >
      <div className="flex justify-between w-full p-1 items-center">
        <div className="flex justify-start items-center">
          <img src={LAND_IMG} alt={plot?.id.toString()} className="img-small" />
          <span className="plot-title primary-font text-xl font-medium leading-6 mx-2">
            Plot #{"0".repeat(4 - (plot.id.toString().length ?? 0))}
            {plot.id}
          </span>
          <span className="text-lg secondary-font text-gray-9 leading-6 third-font">Parcel{plot.parcel}</span>
        </div>
        <span className="plot-price primary-font text-lg font-light leading-6 float-right items-center">
          {plot?.price && `${plot.price.toString()} ETH`}
        </span>
      </div>
    </button>
  );
}
