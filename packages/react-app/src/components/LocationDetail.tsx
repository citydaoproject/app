import React, { useCallback, useEffect, useState } from "react";
import { Plot } from "../models/Plot";
import Location from "../assets/images/location.png"
import Arrow from "../assets/images/arrow.png"
import { Link } from "react-router-dom";

interface Props {
    plot: Plot;
    contracts: any;
    injectedProvider: any;
}

export default function LocationDetail() {

    return (
        <div className="flex flex-row location-detail border-r tracking-wider">
            <div className="flex flex-col items-baseline">
                <span className="uppercase primary-font text-lg mb-5">Location</span>
                <div className="flex flex-row items-center address mb-16">
                    <img className="bg-transparent mr-8" src={Location} alt="Location" />
                    <span className="primary-font text-lg">50 Hail Basin Rd. Powell, Wyoming</span>
                </div>
                <span className="uppercase text-lg mb-4">GOVERNANCE</span>
                <span className="primary-font text-lg text-left mb-8 description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </span>
                <Link to="/whitelist" className="logo-link ">
                    <div className="flex items-center primary-font text-lg">
                        View Snapshot <img className="ml-4 h-auto bg-transparent " src={Arrow} alt="arrow" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
