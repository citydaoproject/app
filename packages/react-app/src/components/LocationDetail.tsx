import React from "react";
import Location from "../assets/images/location.png";

export default function LocationDetail() {
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col items-baseline w-full">
        <span className="uppercase primary-font text-lg mb-5">Location</span>
        <div className="flex flex-row items-center address mb-16">
          <img className="bg-transparent mr-8" src={Location} alt="Location" />
          <span className="primary-font text-lg text-left text-white text-opacity-75">
            50 Hail Basin Rd. Powell, Wyoming
          </span>
        </div>
        <span className="uppercase text-lg mb-4">DESCRIPTION</span>
        <span className="primary-font text-lg text-left mb-8 description text-white text-opacity-75">
          Located an hour north of Cody, Wyoming, Parcel 0 is{" "}
          <a href="https://citydao.io/" target="_blank" rel="noreferrer">
            CityDAO
          </a>
          's first experiment.
        </span>
      </div>
    </div>
  );
}
