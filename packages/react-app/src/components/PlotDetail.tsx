import React, { useCallback, useEffect, useState } from "react";
import { Divider } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { CloseOutlined } from "@ant-design/icons";
import { Plot } from "../models/Plot";
import { useAppDispatch } from "../hooks";
import { setActivePlot } from "../actions/plotsSlice";

import LAND_IMG from "../assets/images/SampleLandImage.png";
import { BuyPlot, ViewPlot } from ".";
import { fetchMetadata } from "../data";

interface Props {
  plot: Plot;
  contracts: any;
  injectedProvider: any;
}

export default function PlotDetail({ plot, contracts, injectedProvider }: Props) {
  const [plotMetadata, setPlotMetadata] = useState<any>({} as any);
  const dispatch = useAppDispatch();

  // const fetchPlotMetadata = useCallback(async () => {
  //   const plotUri = await contracts.CityDaoParcel.getTokenMetadataUri(0);
  //   const plotManifestBuffer = await fetchMetadata(plotUri);
  //   return JSON.parse(plotManifestBuffer.toString()) as any;
  // }, [contracts]);

  // useEffect(() => {
  //   fetchPlotMetadata().then(setPlotMetadata);
  // }, [contracts, plot]);

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
          </div>
          <a onClick={() => dispatch(setActivePlot(undefined))}>
            <CloseOutlined style={{ fontSize: 20 }} />
          </a>
        </div>
        <Divider />
        <div className="plot-detail-content block p-4">
          <div className="flex flex-col space-y-4 primary-font text-lg">
            <motion.img
              src={plotMetadata?.image ?? LAND_IMG}
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
              <div className="plot-detail-buttons-wrapper">
                <ViewPlot plot={plot} />
                <a
                  href="https://ipfs.io/ipfs/QmVorF3YxN6KT4RSqBUHDNM3ti1bSPrdZdQHLaEvQfmNNs"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="read-agreement-btn btn w-full"
                >
                  Read Agreement
                </a>
              </div>
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
                <div className="py-2 secondary-font text-base font-light text-gray-9">
                  Location: Clark, WY
                </div>
                <div className="py-2 secondary-font text-base font-light text-gray-9">
                  Terrain: Mountainous
                </div>
                <div className="py-2 secondary-font text-base font-light text-gray-9">
                  Size: ~1750 sqft
                </div>
                {plot.geometry.coordinates && (
                  <div className="py-2 secondary-font text-base font-light text-gray-9">
                    Coordinates:
                    <br />
                    {plot.geometry.coordinates[0][0][0][1]}°N
                    <br />
                    {plot.geometry.coordinates[0][0][0][0]}°W
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div
              className="border-gray-4 text-left"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="p-4 text-white">Owner Rights</div>
              <Divider />
              <div className="flex flex-col justify-between p-4 secondary-font text-base font-light text-gray-9">
                This NFT denotes a lifetime lease of the plot specified in its geojson metadata. The plot is meant for conservation purposes and must be kept in its current state unless otherwise specified by a CityDAO contract. The owner of this NFT will also obtain one governance vote in proposals involving the communal land designated in the parcel contract.
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
