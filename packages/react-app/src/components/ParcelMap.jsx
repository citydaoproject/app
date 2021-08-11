import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Parcel0 from "../temp_data/Parcel0.json";

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

export default function ParcelMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-106.331);
  const [lat, setLat] = useState(43.172);
  const [zoom, setZoom] = useState(5);
  const [parcels, setParcels] = useState([Parcel0]);

  const addParcelToMap = (geojson, parcel_id) => {
    console.log(parcel_id);
    map.current.addSource(parcel_id, {
      type: "geojson",
      data: geojson,
    });
    map.current.addLayer({
      id: `${parcel_id}_fill`,
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
        "line-width": 5,
      },
    });
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/gregrolwes/ckruwxiwk20cf18o0x218571b",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.on("load", function () {
      parcels.forEach((parcel, parcel_idx) => {
        addParcelToMap(parcel, `parcel${parcel_idx}`);
      });
    });
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
