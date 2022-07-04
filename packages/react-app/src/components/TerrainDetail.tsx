import React from "react";
import { Link } from "react-router-dom";
import Rock from "../assets/images/rock.png";
import Road from "../assets/images/road.png";
import Peak from "../assets/images/peak.png";
import Trail from "../assets/images/trail.png";
import Landing from "../assets/images/landing.png";
import Gravel from "../assets/images/gravel.png";
import Sage from "../assets/images/sage.png";
import Pine from "../assets/images/pine.png";
import Wind from "../assets/images/wind.png";
import Steep from "../assets/images/steep.png";
import Wildlife from "../assets/images/wildlife.png";
import Arrow from "../assets/images/arrow.png";

export default function TerrainDeail() {
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col items-baseline w-full">
        <span className="uppercase primary-font text-lg mb-5">POINTS OF INTEREST</span>
        <div className="flex flex-col w-full mb-8 gap-y-5">
          <div className="flex flex-row">
            <div className="flex flex-row items-center w-3/6 ">
              <div className="mr-6 w-5">
                <img className="bg-transparent w-auto" src={Road} alt="Road" />
              </div>
              <span className="secondary-font text-xl">Road</span>
            </div>
            <div className="flex flex-row items-center w-3/6 ">
              <div className="mr-6 w-5">
                <img className="bg-transparent" src={Peak} alt="Peak" />
              </div>
              <span className="secondary-font text-xl">Peak</span>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-row items-center w-3/6 ">
              <div className="mr-6 w-5">
                <img className="bg-transparent" src={Trail} alt="Trail" />
              </div>
              <span className="secondary-font text-xl">Trail</span>
            </div>
            <div className="flex flex-row items-center w-3/6 ">
              <div className="mr-6 w-5">
                <img className="bg-transparent" src={Landing} alt="Landing" />
              </div>
              <span className="secondary-font text-xl">Landing</span>
            </div>
          </div>
        </div>
        <span className="uppercase primary-font text-lg mb-5">TERRAIN</span>
        <div className="flex flex-col w-full mb-8 gap-y-5">
          <div className="flex flex-row items-center w-full justify-between">
            <div className="flex flex-row items-center">
              <div className="mr-6 w-5">
                <img className="bg-transparent" src={Gravel} alt="Gravel" />
              </div>
              <span className="secondary-font text-xl">Gravel</span>
            </div>
            <span className="primary-font text-lg">63%</span>
          </div>
          <div className="flex flex-row items-center w-full justify-between">
            <div className="flex flex-row items-center">
              <div className="mr-6 w-5">
                <img className="bg-transparent" src={Rock} alt="Rock" />
              </div>
              <span className="secondary-font text-xl">Rock</span>
            </div>
            <span className="primary-font text-lg">18%</span>
          </div>
          <div className="flex flex-row items-center w-full justify-between">
            <div className="flex flex-row items-center">
              <div className="mr-6 w-5">
                <img className="bg-transparent" src={Sage} alt="Vegetation" />
              </div>
              <span className="secondary-font text-xl">Vegetation</span>
            </div>
            <span className="primary-font text-lg">13%</span>
          </div>
        </div>
        <span className="uppercase primary-font text-lg mb-5">HAZARDS</span>
        <div className="flex flex-col w-full mb-8 gap-y-5">
          <div className="flex flex-row">
            <div className="flex flex-row items-center w-3/6">
              <div className="mr-6 w-5">
                <img className="bg-transparent" src={Wind} alt="Wind" />
              </div>
              <span className="secondary-font text-xl">Wind</span>
            </div>
            <div className="flex flex-row items-center w-3/6">
              <div className="mr-6 w-5">
                <img className="bg-transparent" src={Wind} alt="Avalanch" />
              </div>
              <span className="secondary-font text-xl">Avalanch</span>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-row items-center w-3/6">
              <div className="mr-6 w-5">
                <img className="bg-transparent" src={Steep} alt="Cliffs" />
              </div>
              <span className="secondary-font text-xl">Cliffs</span>
            </div>
            <div className="flex flex-row items-center w-3/6">
              <div className="mr-6 w-5">
                <img className="bg-transparent" src={Wildlife} alt="Wildlife" />
              </div>
              <span className="secondary-font text-xl">Wildlife</span>
            </div>
          </div>
        </div>
        <span className="uppercase primary-font text-lg mb-5">LINKS</span>
        <Link
          to={{ pathname: "https://ipfs.io/ipfs/QmVorF3YxN6KT4RSqBUHDNM3ti1bSPrdZdQHLaEvQfmNNs" }}
          target={"_blank"}
          className="logo-link w-full mb-2.5"
        >
          <div className="flex items-center justify-between secondary-font text-xl">
            License Agreement <img className="ml-4 h-auto bg-transparent " src={Arrow} alt="arrow" />
          </div>
        </Link>
        <Link to="#" className="logo-link w-full my-2.5">
          <div className="flex items-center justify-between secondary-font text-xl">
            View Snapshot <img className="ml-4 h-auto bg-transparent " src={Arrow} alt="arrow" />
          </div>
        </Link>
        <Link to="#" className="logo-link w-full my-2.5">
          <div className="flex items-center justify-between secondary-font text-xl">
            Active Proposals <img className="ml-4 h-auto bg-transparent " src={Arrow} alt="arrow" />
          </div>
        </Link>
        <Link to="#" className="logo-link w-full my-2.5">
          <div className="flex items-center justify-between secondary-font text-xl">
            Parcel Treasury <img className="ml-4 h-auto bg-transparent " src={Arrow} alt="arrow" />
          </div>
        </Link>
      </div>
    </div>
  );
}
