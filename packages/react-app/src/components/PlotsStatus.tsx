import React from "react";

interface Props {
    acres: number;
    plots: number;
  }
  

export default function PlotsStatus({acres, plots}: Props) {
  return (
    <div className="primary-font text-xl flex flex-row items-center z-10 absolute bottom-0 plot-status h-8">
        <div className="text-lg px-3.5 text-white text-opacity-75 secondary-font acres flex flex-row items-center">
            {acres} Acres
        </div>
        <div className="text-lg px-3.5 text-white text-opacity-75 secondary-font total-plots flex flex-row items-center">
            {plots} Plots
        </div>
        <div className="text-lg px-3.5 text-white text-opacity-75 secondary-font common flex flex-row items-center">
            Common Area
        </div>
    </div>
  );
}
