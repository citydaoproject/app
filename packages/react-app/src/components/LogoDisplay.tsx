import React from "react";
import Logo from "../assets/images/logo.png";

export default function LogoDisplay() {
  return (
    <div className="logo-display primary-font text-xl bg-gray-1 flex h-16 px-4 border-b-2 items-center">
      <img className="mr-4 h-8 bg-transparent" src={Logo} alt="CityDAO" />
      CityDAO - Parcel Explorer
    </div>
  );
}
