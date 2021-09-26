import React from "react";
import { Divider } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Plot } from "../models/Plot";
import { useAppDispatch } from "../hooks";
import { setActivePlot } from "../actions/plotsSlice";

import LAND_IMG from "../assets/images/SampleLandImage.png";
import { BuyPlot, ViewPlot } from ".";

interface Props {
  plot: Plot;
  injectedProvider: any;
}

export default function PlotDetail({ plot, injectedProvider }: Props) {
  const dispatch = useAppDispatch();
  return (
    <div className="plot-detail">
      {/* HEADER */}
      <div className="plot-detail-header flex justify-between items-center">
        <div className="flex justify-start">
          <span className="plot-title primary-font text-lg font-medium leading-6 mr-4">
            Plot #{"0".repeat(4 - (plot.id.toString().length ?? 0))}
            {plot.id}
          </span>
          <span className="plot-price secondary-font text-base font-light text-gray-9 leading-6">
            {plot?.price && `(${plot.price.toString()} ETH)`}
          </span>
        </div>
        <a onClick={() => dispatch(setActivePlot(undefined))}>
          <CloseOutlined style={{ fontSize: 20 }} />
        </a>
      </div>
      <Divider />

      <div className="flex flex-col space-y-4 primary-font text-lg">
        <img src={LAND_IMG} alt={plot?.id.toString()} />
        {plot?.sold ? <ViewPlot plot={plot} /> : <BuyPlot plot={plot} injectedProvider={injectedProvider} />}

        <div className="border-gray-4 text-left">
          <div className="p-4 text-white">Properties</div>
          <Divider />
          <div className="flex flex-col justify-between p-4">
            {plot.sqft && plot.acres && (
              <div className="py-2 secondary-font text-base font-light text-gray-9">
                Size: {plot.sqft && `${plot.sqft} Sqft`} {plot.acres && `${plot.acres} Acres`}
              </div>
            )}
            {plot.location && (
              <div className="py-2 secondary-font text-base font-light text-gray-9">Location: {plot.location}</div>
            )}
            {plot.coordinates && (
              <div className="py-2 secondary-font text-base font-light text-gray-9">
                Coordinates:
                <br />
                {plot.coordinates}
              </div>
            )}
            {/* Fallback text */}
            {!plot.sqft && !plot.acres && !plot.location && !plot.coordinates && (
              <div className="py-2 secondary-font text-base font-light text-gray-9">No plot properties available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
