import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoiZ3JlZ3JvbHdlcyIsImEiOiJja3J1cnhvbWEwMGQxMnZ0NjJ4OW80emZ6In0.XPrRJMSMXwdIC6k83O4lew";

/*
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
*/

export default function ParcelMap({ parcels, startingCoordinates, startingZoom }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [activeParcel, setActiveParcel] = useState(null);

  const addParcelToMap = (geojson, parcel_id) => {
    map.current.addSource(parcel_id, {
      type: "geojson",
      data: geojson,
    });
    map.current.addLayer({
      id: parcel_id,
      source: parcel_id,
      type: "fill",
      paint: {
        "fill-color": "#eff551",
        "fill-opacity": 0.2,
        "fill-outline-color": "#eff551",
      },
    });
    // add parcel outline
    map.current.addLayer({
      id: `${parcel_id}_outline`,
      source: parcel_id,
      type: "line",
      paint: {
        "line-color": "#eff551",
        "line-width": 2,
      },
    });

    // set click functionality
    map.current.on("click", parcel_id, function (e) {
      clickParcel(parcel_id);
    });
  };

  const clickParcel = parcel_id => {
    setActiveParcel(parcel_id);
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/gregrolwes/ckruwxiwk20cf18o0x218571b",
      center: startingCoordinates,
      zoom: startingZoom,
    });
  });

  useEffect(() => {
    parcels.forEach(parcel => {
      try {
        if (map.current.getSource(parcel.id)) return; // skip if already added
        addParcelToMap(parcel.geojson, parcel.id);
      } catch (e) {
        console.log(e);
      }
    });
  });

  return (
    <div>
      <div style={{ display: parcels.length > 0 ? "none" : "block", margin: "20px", textAlign: "center" }}>
        Retrieving parcels...
      </div>
      <div style={{ display: parcels.length > 0 ? "block" : "none", margin: "20px", textAlign: "center" }}>
        Selected parcel: {activeParcel}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
