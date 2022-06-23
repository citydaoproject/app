import React, { useCallback, useEffect, useState } from "react";
import { Plot } from "../models/Plot";
import Mountain from "../assets/images/mountain.png"
import Flat from "../assets/images/flat.png"
import Vegetation from "../assets/images/vegetation.png"
import Rock from "../assets/images/rock.png"
import { Link } from "react-router-dom";

interface Props {
    plot: Plot;
    contracts: any;
    injectedProvider: any;
}

export default function TerrainDeail() {

    return (
        <div className="flex justify-center w-full">
            <div className="flex flex-col items-baseline w-full">
                <span className="uppercase primary-font text-lg mb-5">TERRAIN</span>
                <div className="flex flex-col w-full mb-8 gap-y-5">
                    <div className="flex flex-row items-center w-full">
                        <img className="bg-transparent mr-8" src={Mountain} alt="Mountain" />
                        <div className="flex flex-col items-baseline">
                            <span className="primary-font text-lg">MOUNTAINOUS</span>
                            <span className="primary-font text-lg text-primary-3">93.3%</span>
                        </div>
                    </div>
                    <div className="flex flex-row items-center w-full">
                        <img className="bg-transparent mr-8" src={Flat} alt="Flat" />
                        <div className="flex flex-col items-baseline">
                            <span className="primary-font text-lg">FLAT</span>
                            <span className="primary-font text-lg text-primary-3">7.7%</span>
                        </div>
                    </div>
                    <div className="flex flex-row items-center w-full">
                        <img className="bg-transparent mr-8" src={Rock} alt="Rock" />
                        <div className="flex flex-col items-baseline">
                            <span className="primary-font text-lg">ROCK</span>
                            <span className="primary-font text-lg text-primary-3">97.7%</span>
                        </div>
                    </div>
                    <div className="flex flex-row items-center w-full">
                        <img className="bg-transparent mr-8" src={Vegetation} alt="Vegetation" />
                        <div className="flex flex-col items-baseline">
                            <span className="primary-font text-lg">VEGETATION</span>
                            <span className="primary-font text-lg text-primary-3">3.3%</span>
                        </div>
                    </div>
                </div>
                <span className="uppercase text-lg mb-4">CLIMATE</span>
                <div className="flex flex-col w-full mb-16">
                    <div className="flex flex-row w-full mb-8 gap-y-5 w-full">
                        <div className="flex flex-col items-baseline w-6/12">
                            <span className="primary-font text-lg text-primary-3">0</span>
                            <span className="primary-font text-lg text-white text-opacity-75">CLEAR</span>
                        </div>
                        <div className="flex flex-col items-baseline w-6/12">
                            <span className="primary-font text-lg text-primary-3">22</span>
                            <span className="primary-font text-lg text-white text-opacity-75">TEMP C</span>
                        </div>
                    </div>
                    <div className="flex flex-row w-full gap-y-5 w-full">
                        <div className="flex flex-col items-baseline w-6/12">
                            <span className="primary-font text-lg text-primary-3">20</span>
                            <span className="primary-font text-lg text-white text-opacity-75">WIND</span>
                        </div>
                        <div className="flex flex-col items-baseline w-6/12">
                            <span className="primary-font text-lg text-primary-3">25%</span>
                            <span className="primary-font text-lg text-white text-opacity-75">HUMIDITY</span>
                        </div>
                    </div>
                </div>
                <span className="uppercase text-lg mb-4">DESCRIPTION</span>
                <span className="primary-font text-lg text-left mb-8 description text-white text-opacity-75">No active proposals </span>
            </div>
        </div>
    );
}
