import React from "react";
import Logo from "../assets/images/logo.png";

export default function LogoDisplay() {
  return (
    <div className="primary-font text-lg sm:text-xl flex h-16 px-4 items-center">
      <img className="mr-4 h-8 bg-transparent" src={Logo} alt="CityDAO" />
      PARCEL 0
    </div>
  );
}
