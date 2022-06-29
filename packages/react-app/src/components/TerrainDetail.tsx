import React from "react";
import { Link } from "react-router-dom";
import Rock from "../assets/images/rock.png"
import Road from "../assets/images/road.png"
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
                <span className="uppercase primary-font text-lg mb-5">FEATURES</span>
                <div className="flex flex-col w-full mb-8 gap-y-5">
                    <div className="flex flex-row items-center w-full justify-between">
                        <div className="flex flex-row items-center">
                            <img className="bg-transparent mr-6 w-5" src={Road} alt="Road" />
                            <span className="secondary-font text-xl">Road/Trails</span>
                        </div>
                        <span className="primary-font text-lg text-primary-3">8%</span>
                    </div>
                    <div className="flex flex-row items-center w-full justify-between">
                        <div className="flex flex-row items-center">
                            <img className="bg-transparent mr-6 w-5" src={Gravel} alt="Gravel" />
                            <span className="secondary-font text-xl">Gravel</span>
                        </div>
                        <span className="primary-font text-lg text-primary-3">63%</span>
                    </div>
                    <div className="flex flex-row items-center w-full justify-between">
                        <div className="flex flex-row items-center">
                            <img className="bg-transparent mr-6 w-5" src={Rock} alt="Rock" />
                            <span className="secondary-font text-xl">Rock</span>
                        </div>
                        <span className="primary-font text-lg text-primary-3">18%</span>
                    </div>
                    <div className="flex flex-row items-center w-full justify-between">
                        <div className="flex flex-row items-center">
                            <img className="bg-transparent mr-6 w-5" src={Sage} alt="Sage" />
                            <span className="secondary-font text-xl">Sage Brush</span>
                        </div>
                        <span className="primary-font text-lg text-primary-3">13%</span>
                    </div>
                    <div className="flex flex-row items-center w-full justify-between">
                        <div className="flex flex-row items-center">
                            <img className="bg-transparent mr-6 w-5" src={Pine} alt="Pine" />
                            <span className="secondary-font text-xl">Pine Trees</span>
                        </div>
                        <span className="primary-font text-lg text-primary-3">63%</span>
                    </div>
                </div>
                <span className="uppercase primary-font text-lg mb-5">HAZARDS</span>
                <div className="flex flex-col w-full mb-8 gap-y-5">
                    <div className="flex flex-row items-center w-full justify-between">
                        <div className="flex flex-row items-center">
                            <img className="bg-transparent mr-6 w-5" src={Wind} alt="Wind" />
                            <span className="secondary-font text-xl">High Wind</span>
                        </div>
                        <span className="primary-font text-lg text-primary-3">99%</span>
                    </div>
                    <div className="flex flex-row items-center w-full justify-between">
                        <div className="flex flex-row items-center">
                            <img className="bg-transparent mr-6 w-5" src={Steep} alt="Steep" />
                            <span className="secondary-font text-xl">Steep Terrain</span>
                        </div>
                        <span className="primary-font text-lg text-primary-3">30%</span>
                    </div>
                    <div className="flex flex-row items-center w-full justify-between">
                        <div className="flex flex-row items-center">
                            <img className="bg-transparent mr-6 w-5" src={Wildlife} alt="Wildlife" />
                            <span className="secondary-font text-xl">Wildlife</span>
                        </div>
                        <span className="primary-font text-lg text-primary-3">0.1%</span>
                    </div>
                </div>
                <span className="uppercase primary-font text-lg mb-4">GOVERNANCE</span>
                <span className="primary-font text-lg text-left mb-8 description text-white text-opacity-75">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
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
