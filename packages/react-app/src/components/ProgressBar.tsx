import React from "react";
import { useAppSelector } from "../hooks";

export default function ProgressBar() {
  const plots = useAppSelector(state => state.plots.plots);
  const percent_sold = Math.floor((plots.filter(plot => plot.sold).length / plots.length) * 100);
  return (
    <div className="header w-full bg-gradient h-12 z-10 text-gray-1 flex items-center justify-center text-base primary-font font-semibold">
      {plots.length > 0 && (percent_sold < 100 ? "Parcel 0 sale is live!" : "Parcel 0 sale is sold out!")}
      {plots.length === 0 && "Fetching plots..."}
      {percent_sold < 100 ? (
        <div className="ml-12 bg-transparent flex text-gray-1 items-center text-sm font-normal secondary-font">
          <div className="progress-bar w-40 bg-gray-9 rounded-full h-2 mx-2">
            <div className="progress-bar-fill bg-primary-4 rounded-full h-full" style={{ width: `${percent_sold}%` }} />
          </div>
          {percent_sold > 0 ? `${percent_sold}% already sold!` : "Be the first owner!"}
        </div>
      ) : null}
    </div>
  );
}
