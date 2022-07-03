import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useResolveEnsName } from "eth-hooks";
import { AnimatePresence, motion } from "framer-motion";
import { Plot } from "../models/Plot";
import { useAppSelector, useAppDispatch } from "../hooks";
import { sliceUserAddress } from "../helpers/sliceUserAddress";
import LAND_IMG from "../assets/images/SampleLandImage.png";
import { ViewPlot } from ".";
import { stringifyPlotId } from "../helpers/stringifyPlotId";
import { useGetNftMetadata } from "../hooks/useGetNftMetadata";
import { setActivePlot, setIdFilter } from "../actions/plotsSlice";
import Icon1 from "../assets/images/icon1.png";
import Gravel from "../assets/images/gravel.png";
import Sage from "../assets/images/sage.png";
import Rock from "../assets/images/rock.png";
import Arrow from "../assets/images/arrow.png";
import { useEffect } from "react";
import { ethers } from "ethers";

interface Props {
  plot: Plot;
  contracts: any;
  injectedProvider: any;
  mainnetProvider: ethers.providers.StaticJsonRpcProvider | null;
}

export default function PlotDetail({ plot, contracts, injectedProvider, mainnetProvider }: Props) {
  const dispatch = useAppDispatch();
  const [plotMetadata, setPlotMetadata] = useState<any>({} as any);
  const activePlot = useAppSelector(state => state.plots.activePlot);
  const nftMetaData = useGetNftMetadata(activePlot && activePlot.id);
  const ownerAddress = nftMetaData?.owner?.address ?? "";
  const ownerEnsName = useResolveEnsName(mainnetProvider, ownerAddress);
  const [ownerDisplay, setOwnerDisplay] = useState("Loading...");

  useEffect(() => {
    if (ownerEnsName) {
      setOwnerDisplay(ownerEnsName);
    }
  }, [ownerEnsName, ownerAddress]);

  const handleClosePopup = () => {
    dispatch(setActivePlot(undefined));
    dispatch(setIdFilter(""));
    closePopup();
  };

  const closePopup = () => {
    const popups = document.getElementsByClassName("mapboxgl-popup");
    if (popups.length) {
      popups[0].remove();
    }
  };

  return (
    <AnimatePresence>
      <div className="plot-detail">
        <div className="plot-detail-content block p-4 px-10">
          <div className="flex flex-col space-y-4 primary-font text-lg">
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              style={{ marginTop: "0" }}
              transition={{ delay: 0.0 }}
            >
              <div className="flex flex-row justify-between items-center mb-2.5">
                <p className="text-primary-3 primary-font text-lg tracking-wider">PLOT #{stringifyPlotId(plot?.id)}</p>
                <span className="primary-font text-base cursor-pointer" onClick={() => handleClosePopup()}>
                  X
                </span>
              </div>
            </motion.div>
            <motion.img
              src={plotMetadata?.image ?? LAND_IMG}
              alt={plot?.id.toString()}
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              style={{ height: "240px" }}
              transition={{ delay: 0.1 }}
              className="object-cover"
            />
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              style={{ marginTop: "0" }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col justify-between py-3.5 mt-3">
                <span className="text-left primary-font mb-4 tracking-wider">SUBDIVISION</span>
                <div className="flex flex-row items-center">
                  <img src={Icon1} className="mr-4" />
                  <span className="text-right secondary-font text-lg text-white text-opacity-75 tracking-wider">
                    Degen Valley
                  </span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              style={{ marginTop: "0" }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col py-3.5 mt-3">
                <span className="uppercase primary-font text-left text-lg mb-5 tracking-wider">TERRAIN</span>
                <div className="flex flex-col w-full gap-y-5">
                  <div className="flex flex-row items-center w-full justify-between">
                    <div className="flex flex-row items-center">
                      <div className="mr-6 w-5">
                        <img className="bg-transparent" src={Gravel} alt="Gravel" />
                      </div>
                      <span className="secondary-font text-xl text-white text-opacity-75 tracking-wider">Gravel</span>
                    </div>
                    <span className="primary-font text-lg tracking-wider">63%</span>
                  </div>
                  <div className="flex flex-row items-center w-full justify-between">
                    <div className="flex flex-row items-center">
                      <div className="mr-6 w-5">
                        <img className="bg-transparent" src={Rock} alt="Rock" />
                      </div>
                      <span className="secondary-font text-xl text-white text-opacity-75 tracking-wider">Rock</span>
                    </div>
                    <span className="primary-font text-lg tracking-wider">18%</span>
                  </div>
                  <div className="flex flex-row items-center w-full justify-between">
                    <div className="flex flex-row items-center">
                      <div className="mr-6 w-5">
                        <img className="bg-transparent" src={Sage} alt="Vegetation" />
                      </div>
                      <span className="secondary-font text-xl text-white text-opacity-75 tracking-wider">
                        Vegetation
                      </span>
                    </div>
                    <span className="primary-font text-lg tracking-wider">13%</span>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              style={{ marginTop: "0" }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex flex-col justify-between py-3.5 mt-3">
                <span className="text-left primary-font tracking-wider mb-2">POINTS OF INTEREST</span>
                <span className="text-left secondary-font text-white text-opacity-75 tracking-wider">N/A</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              style={{ marginTop: "0" }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex flex-col justify-between py-3.5 mt-3">
                <span className="text-left primary-font tracking-wider mb-2">NFT Owner</span>
                <Link
                  to={{
                    pathname: `https://etherscan.io/address/${ownerAddress}`,
                  }}
                  target={"_blank"}
                  className="logo-link w-full mb-2.5"
                >
                  <div className="flex items-center justify-between secondary-font text-xl text-white text-opacity-75">
                    {ownerAddress && ownerEnsName ? sliceUserAddress(ownerDisplay) : "Not found"}
                    <img className="ml-4 h-auto bg-transparent " src={Arrow} alt="arrow" />
                  </div>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              style={{ marginTop: "0" }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex flex-col justify-between py-3.5 mt-2">
                <span className="uppercase primary-font text-lg mb-5 text-left tracking-wider">LINKS</span>
                <Link
                  to={{ pathname: "https://ipfs.io/ipfs/QmVorF3YxN6KT4RSqBUHDNM3ti1bSPrdZdQHLaEvQfmNNs" }}
                  target={"_blank"}
                  className="logo-link w-full mb-2.5"
                >
                  <div className="flex items-center justify-between secondary-font text-xl text-white text-opacity-75 tracking-wider">
                    License Agreement <img className="ml-4 h-auto bg-transparent " src={Arrow} alt="arrow" />
                  </div>
                </Link>
                <Link
                  to={{
                    pathname: `https://opensea.io/assets/ethereum/0x90384e76b6b3ddb47396ff85144819ded148900d/${plot?.id}`,
                  }}
                  target={"_blank"}
                  className="logo-link w-full my-2.5"
                >
                  <div className="flex items-center justify-between secondary-font text-xl text-white text-opacity-75 tracking-wider">
                    View Opensea <img className="ml-4 h-auto bg-transparent " src={Arrow} alt="arrow" />
                  </div>
                </Link>
                <Link to="#" className="logo-link w-full my-2.5">
                  <div className="flex items-center justify-between secondary-font text-xl text-white text-opacity-75 tracking-wider">
                    Etherscan <img className="ml-4 h-auto bg-transparent " src={Arrow} alt="arrow" />
                  </div>
                </Link>
                <Link to="#" className="logo-link w-full my-2.5">
                  <div className="flex items-center justify-between secondary-font text-xl text-white text-opacity-75 tracking-wider">
                    IPFS <img className="ml-4 h-auto bg-transparent " src={Arrow} alt="arrow" />
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
