import React from "react";
import { Divider } from "antd";
import { AnimatePresence, motion } from "framer-motion";
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
    <AnimatePresence>
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
          <motion.img
            src={LAND_IMG}
            alt={plot?.id.toString()}
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
          />
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ delay: 0.1 }}
          >
            {plot?.sold ? <ViewPlot plot={plot} /> : <BuyPlot plot={plot} injectedProvider={injectedProvider} />}
          </motion.div>

          <motion.div
            className="border-gray-4 text-left"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-4 text-white">Properties</div>
            <Divider />
            <div className="flex flex-col justify-between p-4">
              {plot.metadata.sqft && plot.metadata.acres && (
                <div className="py-2 secondary-font text-base font-light text-gray-9">
                  Size: {plot.metadata.sqft && `${plot.metadata.sqft} Sqft`}{" "}
                  {plot.metadata.acres && `${plot.metadata.acres} Acres`}
                </div>
              )}
              {plot.metadata.location && (
                <div className="py-2 secondary-font text-base font-light text-gray-9">
                  Location: {plot.metadata.location}
                </div>
              )}
              {plot.metadata.coordinates && (
                <div className="py-2 secondary-font text-base font-light text-gray-9">
                  Coordinates:
                  <br />
                  {plot.metadata.coordinates}
                </div>
              )}
              {/* Fallback text */}
              {!plot.metadata.sqft && !plot.metadata.acres && !plot.metadata.location && !plot.metadata.coordinates && (
                <div className="py-2 secondary-font text-base font-light text-gray-9">
                  No plot properties available.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
